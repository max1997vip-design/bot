import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { getOrCreateQuests } from '../quests.js'; // <-- ДОБАВЛЕНО

export async function pvpResultHandler(req: any, res: any) {
  const { initData, won, ratingDelta, coinsDelta } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const safeRating = Math.max(-100, Math.min(100, Math.round(ratingDelta ?? 0)));
    const safeCoins = Math.max(-10000, Math.min(10000, Math.round(coinsDelta ?? 0)));

    // ОБНОВЛЯЕМ КВЕСТЫ
    const quests = getOrCreateQuests(user.dailyQuests);
    if (won) {
      quests.progress.win_3 = Math.min(3, (quests.progress.win_3 || 0) + 1);
    }

    const [updated] = await db
      .update(users)
      .set({
        rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
        balance: sql`GREATEST(0, ${users.balance} + ${safeCoins})`,
        totalEarned: sql`${users.totalEarned} + ${Math.max(0, safeCoins)}`,
        dailyQuests: quests
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      won: !!won,
      balance: updated.balance,
      rating: updated.rating,
      newBalance: updated.balance,
      newRating: updated.rating,
      quests
    });
  } catch (error) {
    console.error('[pvpResult]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}