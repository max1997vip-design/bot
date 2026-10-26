import { db } from '../db.js';
import { clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

export async function getClansHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Получаем все открытые кланы + считаем участников
    const result = await db.select({
      id: clans.id,
      name: clans.name,
      level: clans.level,
      leaderId: clans.leaderId,
      extraSlots: clans.extraSlots,
      memberCount: sql<number>`count(${clanMembers.userId})::int`
    })
    .from(clans)
    .leftJoin(clanMembers, eq(clans.id, clanMembers.clanId))
    .where(eq(clans.isOpen, true))
    .groupBy(clans.id)
    .orderBy(clans.level); // Сортируем по уровню (топовые сверху)

    return res.json({ success: true, clans: result });
  } catch (e) {
    console.error('Get Clans error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}