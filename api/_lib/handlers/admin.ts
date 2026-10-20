import { db } from '../db.js';
import { users, userItems, featureFlags } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

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

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}