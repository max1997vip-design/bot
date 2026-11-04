// api/_lib/handlers/admin.ts
import { db } from '../db.js';
import { users, userItems, featureFlags, equippedItems, ownedCars, clanMembers, clans, transactions } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function adminHandler(req: any, res: any) {
  try {
    const { initData, action, payload } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [admin] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!admin || !admin.isAdmin) return res.status(403).json({ error: 'Доступ запрещен' });

    // 1. Получить все данные для панели
    if (action === 'getData') {
      const flags = await db.select().from(featureFlags);
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        photoUrl: users.photoUrl,
        balance: users.balance,
        starsBalance: users.starsBalance,
        leaguePoints: users.leaguePoints,
        rating: users.rating,
        isAdmin: users.isAdmin,
        isBanned: users.isBanned,
      }).from(users).limit(200);

      return res.json({ success: true, flags, users: allUsers });
    }

    // 2. Переключить фичу
    if (action === 'toggleFeature') {
      const { name, isEnabled } = payload;
      const existing = await db.select().from(featureFlags).where(eq(featureFlags.name, name));
      if (existing.length === 0) {
        await db.insert(featureFlags).values({ name, isEnabled });
      } else {
        await db.update(featureFlags).set({ isEnabled }).where(eq(featureFlags.name, name));
      }
      return res.json({ success: true });
    }

    // 3. Выдать награду (баланс, звёзды, очки лиги или предмет)
    if (action === 'giveReward') {
      const { targetId, type, amount, itemId } = payload;
      const [targetUser] = await db.select().from(users).where(eq(users.id, Number(targetId)));
      if (!targetUser) return res.status(404).json({ error: 'Игрок не найден' });

      if (type === 'balance') {
        const newBalance = targetUser.balance + Number(amount);
        await db.update(users).set({ balance: newBalance }).where(eq(users.id, targetUser.id));
      } 
      else if (type === 'stars') {
        const newStars = (targetUser.starsBalance || 0) + Number(amount);
        await db.update(users).set({ starsBalance: newStars }).where(eq(users.id, targetUser.id));
      }
      else if (type === 'league') {
        const newLeague = (targetUser.leaguePoints || 0) + Number(amount);
        await db.update(users).set({ leaguePoints: newLeague }).where(eq(users.id, targetUser.id));
      }
      else if (type === 'item') {
        await db.insert(userItems).values({ userId: targetUser.id, itemId: String(itemId) });
      }
      return res.json({ success: true });
    }

    // 4. Бан / разбан
    if (action === 'banUser' || action === 'unbanUser') {
      const { userId } = payload;
      const isBanned = action === 'banUser';
      await db.update(users).set({ isBanned }).where(eq(users.id, Number(userId)));
      return res.json({ success: true });
    }

    // 5. Выдать / снять права админа
    if (action === 'giveAdmin' || action === 'removeAdmin') {
      const { userId } = payload;
      const isAdmin = action === 'giveAdmin';
      await db.update(users).set({ isAdmin }).where(eq(users.id, Number(userId)));
      return res.json({ success: true });
    }

    // 6. ГЛОБАЛЬНЫЙ СБРОС ВСЕХ ИГРОКОВ
    if (action === 'globalReset') {
      await db.update(users).set({
        balance: 0,
        totalEarned: 0,
        starsBalance: 0,
        activeCarId: 'vaz-2107',
        ownedCars: ['vaz-2107'],
        carColor: 'original',
        level: 1,
        xp: 0,
        rating: 100,
        leaguePoints: 0,
        clickLevel: 1,
        offlineLevel: 1,
        dailyStreak: 0,
        lastDailyClaim: null,
        dailyQuests: {},
        partUpgrades: {},
        businesses: {},
        weeklyPass: { weekId: 0, xp: 0, claimed: [] }
      });

      await db.delete(userItems);
      await db.delete(equippedItems);
      await db.delete(ownedCars);
      await db.delete(clanMembers);
      await db.delete(clans);
      await db.delete(transactions);

      return res.json({ success: true, message: 'All players reset successfully' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}