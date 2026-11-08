// api/_lib/handlers/pvpResult.ts
import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql, and } from 'drizzle-orm';
import { getOrCreateQuests } from '../quests.js';
import { getOrCreatePass } from '../pass.js';
import { checkAndAwardBadges } from './badges.js';
import { CARS, RACE_BASE_REWARD, RACE_BASE_LOSE } from '../../../src/config/cars.js';

export async function pvpResultHandler(req: any, res: any) {
  const { initData, won, ratingDelta } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const safeRating = Math.max(-100, Math.min(100, Math.round(ratingDelta ?? 0)));

    // 🎯 Доход от гонок — 500 ₽ × raceMultiplier
    const carId = user.activeCarId || 'vaz-2107';
    const car = CARS[carId] || CARS['vaz-2107'];
    const raceMult = car.raceMultiplier || 1.0;

    const raceReward = won ? Math.floor(RACE_BASE_REWARD * raceMult) : 0;
    const raceLose = !won ? Math.floor(RACE_BASE_LOSE * raceMult) : 0;
    const safeCoins = raceReward - raceLose;

    const quests = getOrCreateQuests(user.dailyQuests);
    if (won) {
      quests.progress.win_3 = Math.min(3, (quests.progress.win_3 || 0) + 1);
    }

    const pass = getOrCreatePass(user.weeklyPass);
    const baseRaceXp = won ? 10 : 2;
    const xpMultiplier = pass.isPremium ? 5 : 1;
    pass.xp += baseRaceXp * xpMultiplier;

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

    const levelXpReward = won ? 50 : 10;

    const statsUpdate = won
      ? {
          rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
          balance: sql`GREATEST(0, ${users.balance} + ${safeCoins})`,
          totalEarned: sql`${users.totalEarned} + ${safeCoins}`,
          earnedFromRaces: sql`${users.earnedFromRaces} + ${safeCoins}`,
          totalRaces: sql`${users.totalRaces} + 1`,
          totalWins: sql`${users.totalWins} + 1`,
          xp: sql`${users.xp} + ${levelXpReward}`,
          dailyQuests: quests,
          weeklyPass: pass,
        }
      : {
          rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
          balance: sql`${users.balance} + ${safeCoins}`,
          totalEarned: sql`${users.totalEarned} + ${safeCoins}`,
          earnedFromRaces: sql`${users.earnedFromRaces} + ${safeCoins}`,
          totalRaces: sql`${users.totalRaces} + 1`,
          totalLosses: sql`${users.totalLosses} + 1`,
          xp: sql`${users.xp} + ${levelXpReward}`,
          dailyQuests: quests,
          weeklyPass: pass,
        };

    const [updated] = await db
      .update(users)
      .set(statsUpdate)
      .where(eq(users.id, userId))
      .returning();

    checkAndAwardBadges(userId).catch(console.error);

    return res.json({
      won: !!won,
      balance: updated.balance,
      rating: updated.rating,
      newBalance: updated.balance,
      newRating: updated.rating,
      totalRaces: updated.totalRaces,
      totalWins: updated.totalWins,
      totalLosses: updated.totalLosses,
      earnedFromRaces: updated.earnedFromRaces,
      xp: updated.xp,
      quests,
      pass: updated.weeklyPass,
      clanTax,
      // 🎯 Возвращаем награду, чтобы клиент мог показать
      raceReward,
      raceLose,
    });
  } catch (error) {
    console.error('[pvpResult]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}