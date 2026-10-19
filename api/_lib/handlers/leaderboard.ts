// api/_lib/handlers/leaderboard.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { desc } from 'drizzle-orm';

export async function leaderboardHandler(req: any, res: any) {
  const { type } = req.query; // 'rating' или 'balance'

  try {
    const orderColumn = type === 'balance' ? users.balance : users.rating;

    const topPlayers = await db.select({
      id: users.id,
      firstName: users.firstName,
      username: users.username,
      photoUrl: users.photoUrl,
      rating: users.rating,
      balance: users.balance,
      activeCarId: users.activeCarId,
    })
    .from(users)
    .orderBy(desc(orderColumn))
    .limit(50);

    return res.status(200).json({ success: true, players: topPlayers });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}