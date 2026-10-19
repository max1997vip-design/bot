import { db } from '../db.js';
import { users, userItems, equippedItems } from '../schema.js';
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
        activeCarId: 'audi-tt',      // <-- Исправлено на audi-tt
        ownedCars: ['audi-tt'],      // <-- Добавлен массив купленных машин
      }).returning();
      user = createdUser;
    } else {
      await db.update(users).set({
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null,
        photoUrl: telegramUser.photo_url || null,
        lastSeenAt: new Date(),
      }).where(eq(users.id, telegramUser.id));
    }

    const inventory = await db.query.userItems.findMany({ where: eq(userItems.userId, telegramUser.id) });
    const equipped = await db.query.equippedItems.findMany({ where: eq(equippedItems.userId, telegramUser.id) });
    
    // <-- Добавлен suspension в дефолтный мап
    const equippedMap: Record<string, string | null> = { engine: null, tires: null, ecu: null, suspension: null };
    equipped.forEach(e => { equippedMap[e.slot] = e.itemId; });

    return res.status(200).json({
      success: true,
      user: { 
        ...user!, 
        balance: user!.balance ?? 0, 
        totalEarned: user!.totalEarned ?? 0, 
        referralEarnings: user!.referralEarnings ?? 0,
        ownedCars: user!.ownedCars ?? ['audi-tt'], // <-- Возвращаем на фронт
        activeCarId: user!.activeCarId ?? 'audi-tt' // <-- Возвращаем на фронт
      },
      inventory: inventory.map(i => i.itemId),
      equipped: equippedMap,
      isNewUser,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}