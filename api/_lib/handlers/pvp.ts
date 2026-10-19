// api/_lib/handlers/pvp.ts
import { db } from '../db.js';
import { users, upgrades } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, ne, sql } from 'drizzle-orm';
import { getServerRacingStats, simulateRaceServer } from '../raceSim.js';

export async function pvpHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { initData } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const telegramId = validatedData.user.id;

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, telegramId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const myUpgrades = await db.query.upgrades.findMany({ where: eq(upgrades.userId, telegramId) });
    const myLevels: any = {};
    myUpgrades.forEach(u => myLevels[u.upgradeId] = u.level);
    const myStats = getServerRacingStats(myLevels);

    // Ищем реального соперника по рейтингу (разница до 100 очков)
    let opponentName = 'Призрак трассы';
    let opponentStats = getServerRacingStats({
      engine: Math.max(0, myLevels.engine || 0),
      tires: Math.max(0, myLevels.tires || 0),
      suspension: Math.max(0, myLevels.suspension || 0),
      diagnostics: Math.max(0, myLevels.diagnostics || 0),
    });

    const possibleOpponents = await db.select()
      .from(users)
      .where(and(
        ne(users.id, telegramId),
        sql`ABS(${users.rating} - ${user.rating}) < 100`
      ))
      .limit(1);

    if (possibleOpponents.length > 0) {
      const opp = possibleOpponents[0];
      opponentName = opp.firstName || 'Гонщик';
      const oppUpgrades = await db.query.upgrades.findMany({ where: eq(upgrades.userId, opp.id) });
      const oppLevels: any = {};
      oppUpgrades.forEach(u => oppLevels[u.upgradeId] = u.level);
      opponentStats = getServerRacingStats(oppLevels);
    }

    const result = simulateRaceServer(myStats, opponentStats, opponentName);

    let newBalance = user.balance;
    let newRating = user.rating;
    let ratingChange = 0;

    if (result.winner === 'player') {
      // Награда х5 от обычной гонки
      const reward = (1000 + myStats.rating * 10) * 5; 
      newBalance += reward;
      ratingChange = 5;
      newRating += ratingChange;
    } else {
      ratingChange = -2;
      newRating = Math.max(0, newRating + ratingChange);
    }

    await db.update(users).set({ balance: newBalance, rating: newRating }).where(eq(users.id, telegramId));

    return res.status(200).json({
      success: true,
      result: { ...result, ratingChange, reward: result.winner === 'player' ? (1000 + myStats.rating * 10) * 5 : 0 },
      newBalance,
      newRating
    });
  } catch (error) {
    console.error('PvP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}