// api/_lib/handlers/admin.ts
import { db } from '../db.js';
import { users, userItems, featureFlags, equippedItems, ownedCars, clanMembers, clans, transactions } from '../schema.js'; // 👈 Добавлены импорты таблиц
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
      const topUsers = await db.select({ id: users.id, firstName: users.firstName, balance: users.balance })
        .from(users).limit(10);
      return res.json({ success: true, flags, users: topUsers });
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

    // 3. Выдать награду (баланс или предмет)
    if (action === 'giveReward') {
      const { targetId, type, amount, itemId } = payload;
      const [targetUser] = await db.select().from(users).where(eq(users.id, Number(targetId)));
      if (!targetUser) return res.status(404).json({ error: 'Игрок не найден' });

      if (type === 'balance') {
        const newBalance = targetUser.balance + Number(amount);
        await db.update(users).set({ balance: newBalance }).where(eq(users.id, targetUser.id));
      } 
      else if (type === 'item') {
        await db.insert(userItems).values({ userId: targetUser.id, itemId: String(itemId) });
      }
      return res.json({ success: true });
    }

    // 👇 4. ГЛОБАЛЬНЫЙ СБРОС ВСЕХ ИГРОКОВ
    if (action === 'globalReset') {
      // Сбрасываем данные всех пользователей
      await db.update(users).set({
        balance: 0,
        totalEarned: 0,
        starsBalance: 0,
        activeCarId: 'vaz-2107', // Дефолтная машина
        ownedCars: ['vaz-2107'],
        carColor: 'original',
        level: 1,
        xp: 0,
        rating: 100,
        clickLevel: 1,
        offlineLevel: 1,
        dailyStreak: 0,
        lastDailyClaim: null,
        dailyQuests: {},
        partUpgrades: {},
        businesses: {},
        weeklyPass: { weekId: 0, xp: 0, claimed: [] }
      }); // Без .where() обновляет ВСЕ записи

      // Очищаем связанные таблицы
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