import { db } from '../db.js';
import { users, userItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { ALL_ITEM_IDS, ITEMS, RARITY_DROP_CHANCE } from '../items.js';
import { getOrCreateQuests } from '../quests.js'; // <-- ДОБАВЛЕНО

export async function tapHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { initData, amount } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const telegramId = validatedData.user.id;
  if (typeof amount !== 'number' || amount <= 0 || amount > 10000) return res.status(400).json({ error: 'Invalid amount' });

  try {
    // 1. Сначала достаем юзера, чтобы получить его текущие квесты
    const [user] = await db.select().from(users).where(eq(users.id, telegramId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 2. Обновляем прогресс квеста на клики
    const quests = getOrCreateQuests(user.dailyQuests);
    quests.progress.click_1000 = Math.min(1000, (quests.progress.click_1000 || 0) + amount);

    // 3. Обновляем баланс и сохраняем квесты
    const [updatedUser] = await db.update(users).set({
      balance: sql`${users.balance} + ${amount}`,
      totalEarned: sql`${users.totalEarned} + ${amount}`,
      lastOnlineAt: new Date(),
      dailyQuests: quests // <-- Сохраняем обновленные квесты
    }).where(eq(users.id, telegramId)).returning();

    let droppedItem = null;
    
    // 5% шанс выпадения предмета за пачку кликов (раз в секунду)
    if (Math.random() < 0.05) {
      const roll = Math.random() * 100;
      let selectedRarity = 'common';
      let cumulative = 0;
      for (const [rarity, chance] of Object.entries(RARITY_DROP_CHANCE)) {
        cumulative += chance;
        if (roll <= cumulative) { selectedRarity = rarity; break; }
      }

      const possibleItems = ALL_ITEM_IDS.filter(id => ITEMS[id].rarity === selectedRarity);
      if (possibleItems.length > 0) {
        const randomItemId = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        const [newItem] = await db.insert(userItems).values({ userId: telegramId, itemId: randomItemId }).returning();
        droppedItem = { ...ITEMS[randomItemId], dbId: newItem.id };
      }
    }

    return res.status(200).json({
      success: true,
      newBalance: updatedUser.balance,
      newTotalEarned: updatedUser.totalEarned,
      droppedItem,
      quests // <-- Отдаем на фронт
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}