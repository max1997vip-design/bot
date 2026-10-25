import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getClanStats } from '../clans.js';

export async function clanActionHandler(req: any, res: any) {
  try {
    const { initData, action, amount } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));

    if (action === 'donate') {
      if (!amount || amount <= 0) return res.status(400).json({ error: 'Неверная сумма' });
      if (user.balance < amount) return res.status(400).json({ error: 'Недостаточно монет' });

      await db.update(users).set({ balance: user.balance - amount }).where(eq(users.id, user.id));
      await db.update(clans).set({ balance: clan.balance + amount }).where(eq(clans.id, clan.id));

      return res.json({ success: true, newBalance: user.balance - amount, newClanBalance: clan.balance + amount });
    }

    if (action === 'upgrade') {
      if (memberRecord[0].role !== 'leader') return res.status(403).json({ error: 'Только лидер может качать клан' });
      
      const nextStats = getClanStats(clan.level + 1);
      
      // 👇 ИСПРАВЛЕНИЕ: Проверяем, что уровень существует
      if (!nextStats) return res.status(400).json({ error: 'Достигнут максимальный уровень' });
      
      if (clan.balance < nextStats.upgradeCost) return res.status(400).json({ error: 'Недостаточно средств в казне' });

      await db.update(clans)
        .set({ balance: clan.balance - nextStats.upgradeCost, level: nextStats.level })
        .where(eq(clans.id, clan.id));

      return res.json({ success: true, newClanLevel: nextStats.level, newClanBalance: clan.balance - nextStats.upgradeCost });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    console.error('Clan Action error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}