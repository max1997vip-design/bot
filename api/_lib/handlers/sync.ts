import { db } from '../db.js';
import { users, userItems, equippedItems, featureFlags } from '../schema.js'; // <-- Добавлен featureFlags
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

const REFERRER_REWARD = 50000;
const REFEREE_REWARD = 10000;

export async function syncHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { initData, startParam } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const telegramUser = validatedData.user;

  try {
    let user = await db.query.users.findFirst({ where: eq(users.id, telegramUser.id) });
    const isNewUser = !user;
    let bonusCoins = 0;
    let offlineEarnings = 0;

    if (isNewUser) {
      let referredById: number | null = null;
      if (startParam && startParam.startsWith('ref_')) {
        const parsedId = parseInt(startParam.replace('ref_', ''), 10);
        if (parsedId && parsedId !== telegramUser.id) {
          const referrer = await db.query.users.findFirst({ where: eq(users.id, parsedId) });
          if (referrer) {
            referredById = referrer.id;
            bonusCoins = REFEREE_REWARD;
            await db.update(users).set({
              balance: sql`${users.balance} + ${REFERRER_REWARD}`,
              totalEarned: sql`${users.totalEarned} + ${REFERRER_REWARD}`,
              referralEarnings: sql`${users.referralEarnings} + ${REFERRER_REWARD}`
            }).where(eq(users.id, parsedId));
          }
        }
      }
      const [createdUser] = await db.insert(users).values({
        id: telegramUser.id,
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null,
        lastName: telegramUser.last_name || null,
        photoUrl: telegramUser.photo_url || null,
        balance: bonusCoins,
        totalEarned: bonusCoins,
        referredBy: referredById,
        activeCarId: 'audi-tt',
        ownedCars: ['audi-tt'],
      }).returning();
      user = createdUser;
    } else {
      // СЧИТАЕМ ОФФЛАЙН ДОХОД
      const now = new Date();
      if (user) {
        const lastSeen = user.lastSeenAt ? new Date(user.lastSeenAt) : now;
        const diffSeconds = Math.max(0, Math.floor((now.getTime() - lastSeen.getTime()) / 1000));
        const cappedSeconds = Math.min(diffSeconds, 12 * 3600); 
        
        if (cappedSeconds > 60 && (user.offlineLevel || 1) > 0) {
          const hourlyRate = (user.offlineLevel || 1) * 500;
          offlineEarnings = Math.floor((cappedSeconds / 3600) * hourlyRate);
        }

        await db.update(users).set({
          username: telegramUser.username || null,
          firstName: telegramUser.first_name || null,
          photoUrl: telegramUser.photo_url || null,
          lastSeenAt: now,
          balance: sql`${users.balance} + ${offlineEarnings}`,
          totalEarned: sql`${users.totalEarned} + ${offlineEarnings}`
        }).where(eq(users.id, telegramUser.id));
        
        user.balance += offlineEarnings;
      }
    }

    const inventory = await db.query.userItems.findMany({ where: eq(userItems.userId, telegramUser.id) });
    const equipped = await db.query.equippedItems.findMany({ where: eq(equippedItems.userId, telegramUser.id) });
    
    const equippedMap: Record<string, string | null> = { engine: null, tires: null, ecu: null, suspension: null };
    equipped.forEach(e => { equippedMap[e.slot] = e.itemId; });

    const flags = await db.select().from(featureFlags);
    const features: Record<string, boolean> = {};
    flags.forEach(f => { features[f.name] = f.isEnabled; });

    return res.status(200).json({
      success: true,
      user: { 
        ...user!, 
        balance: user!.balance ?? 0, 
        totalEarned: user!.totalEarned ?? 0, 
        referralEarnings: user!.referralEarnings ?? 0,
        ownedCars: user!.ownedCars ?? ['audi-tt'],
        activeCarId: user!.activeCarId ?? 'audi-tt',
        clickLevel: user!.clickLevel ?? 1,
        offlineLevel: user!.offlineLevel ?? 1,
        isAdmin: user!.isAdmin ?? false, // <-- Явно передаем статус админа
        features: features               // <-- Кладем флаги ВНУТРЬ user
      },
      offlineEarnings,
      inventory: inventory.map(i => i.itemId),
      equipped: equippedMap,
      isNewUser,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}