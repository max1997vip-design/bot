import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getClanStats } from '../clans.js';

export async function joinClanHandler(req: any, res: any) {
  try {
    const { initData, clanName } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [clan] = await db.select().from(clans).where(eq(clans.name, clanName));
    if (!clan) return res.status(404).json({ error: 'Клан не найден' });

    const alreadyIn = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (alreadyIn.length > 0) return res.status(400).json({ error: 'Вы уже в клане' });

    const membersCount = await db.select().from(clanMembers).where(eq(clanMembers.clanId, clan.id));
    const stats = getClanStats(clan.level);
    if (membersCount.length >= stats.maxMembers) return res.status(400).json({ error: 'Клан переполнен' });

    await db.insert(clanMembers).values({ userId: valid.user.id, clanId: clan.id, role: 'member' });

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}