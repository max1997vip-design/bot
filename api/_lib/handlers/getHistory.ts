import { db } from '../db.js';
import { transactions } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, desc } from 'drizzle-orm';

export async function getHistoryHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const history = await db.select()
      .from(transactions)
      .where(eq(transactions.userId, valid.user.id))
      .orderBy(desc(transactions.createdAt))
      .limit(50); // Берем последние 50 записей

    return res.json({ success: true, history });
  } catch (e) {
    console.error('History error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}