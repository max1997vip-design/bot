import { db } from '../db.js';
import { users, userItems, equippedItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, sql } from 'drizzle-orm';
import { ITEMS } from '../items.js';
import { getOrCreateQuests } from '../quests.js'; // <-- ДОБАВЛЕНО

const SELL_PRICES: Record<string, number> = {
  common: 100, uncommon: 500, rare: 2500, epic: 15000, legendary: 75000,
};

export async function sellItemHandler(req: any, res: any) {
  const { initData, itemId } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const itemConfig = ITEMS[itemId];
    if (!itemConfig) return res.status(400).json({ error: 'Предмет не найден' });

    const equipped = await db.query.equippedItems.findFirst({
      where: and(eq(equippedItems.userId, userId), eq(equippedItems.itemId, itemId))
    });
    if (equipped) return res.status(400).json({ error: 'Нельзя продать надетый предмет' });

    const inventoryItem = await db.query.userItems.findFirst({
      where: and(eq(userItems.userId, userId), eq(userItems.itemId, itemId))
    });
    if (!inventoryItem) return res.status(400).json({ error: 'Предмет не найден в инвентаре' });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // ОБНОВЛЯЕМ КВЕСТЫ
    const quests = getOrCreateQuests(user.dailyQuests);
    quests.progress.sell_5 = Math.min(5, (quests.progress.sell_5 || 0) + 1);

    const price = SELL_PRICES[itemConfig.rarity] || 100;

    await db.delete(userItems).where(eq(userItems.id, inventoryItem.id));

    const [updatedUser] = await db.update(users)
      .set({ 
        balance: sql`${users.balance} + ${price}`,
        dailyQuests: quests 
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({ success: true, newBalance: updatedUser.balance, price, quests });
  } catch (error) {
    console.error('Sell item error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}