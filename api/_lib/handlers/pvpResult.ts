// api/_lib/handlers/pvpResult.ts
import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql, and } from 'drizzle-orm';
import { getOrCreateQuests } from '../quests.js';
import { getOrCreatePass } from '../pass.js';

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

    const quests = getOrCreateQuests(user.dailyQuests);
    if (won) {
      quests.progress.win_3 = Math.min(3, (quests.progress.win_3 || 0) + 1);
    }

    const pass = getOrCreatePass(user.weeklyPass);
    if (won) {
      pass.xp += 50;
    }

    let clanTax = 0;
    if (safeCoins > 0) {
      const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, userId));
      if (memberRecord.length > 0) {
        const clanId = memberRecord[0].clanId;
        clanTax = Math.floor(safeCoins * 0.10);

        if (clanTax > 0) {
          await db.update(clans)
            .set({ balance: sql`${clans.balance} + ${clanTax}` })
            .where(eq(clans.id, clanId));
          
          await db.update(clanMembers)
            .set({ contribution: sql`${clanMembers.contribution} + ${clanTax}` })
            .where(and(eq(clanMembers.userId, userId), eq(clanMembers.clanId, clanId)));
        }
      }
    }

    // 👇 Обновляем баланс, рейтинг, статистику гонок и доход с гонок
    const statsUpdate = won
      ? {
          rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
          balance: sql`GREATEST(0, ${users.balance} + ${safeCoins})`,
          totalEarned: sql`${users.totalEarned} + ${Math.max(0, safeCoins)}`,
          earnedFromRaces: sql`${users.earnedFromRaces} + ${Math.max(0, safeCoins)}`, // 👈 ДОБАВЛЕНО
          totalRaces: sql`${users.totalRaces} + 1`,
          totalWins: sql`${users.totalWins} + 1`,
          dailyQuests: quests,
          weeklyPass: pass,
        }
      : {
          rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
          balance: sql`GREATEST(0, ${users.balance} + ${safeCoins})`,
          totalEarned: sql`${users.totalEarned} + ${Math.max(0, safeCoins)}`,
          // При поражении safeCoins может быть 0 или отрицательным — не добавляем в доход
          earnedFromRaces: sql`${users.earnedFromRaces} + ${Math.max(0, safeCoins)}`, // 👈 ДОБАВЛЕНО
          totalRaces: sql`${users.totalRaces} + 1`,
          totalLosses: sql`${users.totalLosses} + 1`,
          dailyQuests: quests,
          weeklyPass: pass,
        };

    const [updated] = await db
      .update(users)
      .set(statsUpdate)
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      won: !!won,
      balance: updated.balance,
      rating: updated.rating,
      newBalance: updated.balance,
      newRating: updated.rating,
      totalRaces: updated.totalRaces,
      totalWins: updated.totalWins,
      totalLosses: updated.totalLosses,
      quests,
      pass: updated.weeklyPass,
      clanTax,
    });
  } catch (error) {
    console.error('[pvpResult]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}