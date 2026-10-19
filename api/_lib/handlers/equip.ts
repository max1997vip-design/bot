import { db } from '../db.js';
import { equippedItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { and, eq } from 'drizzle-orm';

export async function equipHandler(req: any, res: any) {
  const { initData, itemId, slot } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const existing = await db.query.equippedItems.findFirst({
      where: and(eq(equippedItems.userId, validatedData.user.id), eq(equippedItems.slot, slot))
    });

    if (existing) {
      await db.update(equippedItems).set({ itemId }).where(and(eq(equippedItems.userId, validatedData.user.id), eq(equippedItems.slot, slot)));
    } else {
      await db.insert(equippedItems).values({ userId: validatedData.user.id, slot, itemId });
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}