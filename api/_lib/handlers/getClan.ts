import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getClanStats } from '../clans.js';

export async function getClanHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = valid.user.id;
    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, userId));
    
    if (memberRecord.length === 0) {
      return res.json({ success: true, clan: null, members: [] });
    }

    const clanId = memberRecord[0].clanId;
    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
    
    // Получаем всех участников
    const membersList = await db.select({
      userId: clanMembers.userId,
      role: clanMembers.role,
      firstName: users.firstName,
      username: users.username,
      balance: users.balance
    }).from(clanMembers)
      .innerJoin(users, eq(clanMembers.userId, users.id))
      .where(eq(clanMembers.clanId, clanId));

    const stats = getClanStats(clan.level);

    return res.json({ success: true, clan: { ...clan, ...stats }, members: membersList });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}