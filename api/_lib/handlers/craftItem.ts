import { db } from '../db.js';
import { users, userItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, sql } from 'drizzle-orm';
import { ITEMS } from '../items.js';

export async function craftItemHandler(req: any, res: any) {
  try {
    const { initData, itemId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const item = ITEMS[itemId];
    if (!item) return res.status(400).json({ error: 'Item not found' });

    // Ищем следующий ранг
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const nextRarityIndex = rarities.indexOf(item.rarity) + 1;
    if (nextRarityIndex >= rarities.length) return res.status(400).json({ error: 'Максимальный ранг' });
    
    // Формируем ID следующего предмета (например, engine_1 -> engine_2)
    const nextId = itemId.replace(/_\d$/, `_${nextRarityIndex + 1}`);
    if (!ITEMS[nextId]) return res.status(400).json({ error: 'Нет следующего предмета' });

    // Проверяем, есть ли 5 штук
    const owned = await db.select().from(userItems).where(and(eq(userItems.userId, valid.user.id), eq(userItems.itemId, itemId)));
    if (owned.length < 5) return res.status(400).json({ error: 'Нужно 5 деталей' });

    // Удаляем 5 штук
    const toDelete = owned.slice(0, 5).map(i => i.id);
    await db.delete(userItems).where(sql`${userItems.id} IN ${toDelete}`);

    // Добавляем 1 новую
    await db.insert(userItems).values({ userId: valid.user.id, itemId: nextId });

    return res.json({ success: true, newItemId: nextId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}