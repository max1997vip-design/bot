import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

export async function pvpResultHandler(req: any, res: any) {
  try {
    const { initData, won, ratingDelta, coinsDelta } = req.body;

    // Твоя авторизация
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });
    const userId = validatedData.user.id;

    const safeRating = Math.max(-100, Math.min(100, Math.round(ratingDelta ?? 0)));
    const safeCoins = Math.max(-10000, Math.min(10000, Math.round(coinsDelta ?? 0)));

    const [updated] = await db
      .update(users)
      .set({
        rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
        balance: sql`GREATEST(0, ${users.balance} + ${safeCoins})`,
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      won: !!won,
      balance: updated.balance,
      rating: updated.rating,
      // Алиасы на случай, если фронт ждет их (как было в RacesScreen)
      newBalance: updated.balance,
      newRating: updated.rating,
    });
  } catch (error) {
    console.error('[pvpResult]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}