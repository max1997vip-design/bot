// api/_lib/handlers/leaderboard.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { desc, eq } from 'drizzle-orm';

export async function leaderboardHandler(req: any, res: any) {
  try {
    const { initData } = req.body || {};
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const rawType = req.query.type;
    const type = Array.isArray(rawType) ? rawType[0] : (rawType || 'balance');

    // 👇 выбираем сортировку
    let orderBy;
    if (type === 'xp') {
      orderBy = desc(users.xp);
    } else if (type === 'wins') {
      orderBy = desc(users.totalWins);
    } else {
      // balance (по умолчанию)
      orderBy = desc(users.balance);
    }

    const players = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        photoUrl: users.photoUrl,
        balance: users.balance,
        xp: users.xp,
        totalWins: users.totalWins,
        rating: users.rating,
      })
      .from(users)
      .where(eq(users.isBanned, false))
      .orderBy(orderBy)
      .limit(50);

    return res.json({ success: true, players, type });
  } catch (e) {
    console.error('[leaderboard]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}