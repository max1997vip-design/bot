// api/_lib/handlers/pvpArena.ts
import { db } from '../db.js';
import { users, pvpBattles, equippedItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { calcRaceTime, PvpStats } from '../pvpEngine.js';
import { getFinalCarStats } from '../pvpStats.js';
import { getLeagueByPoints } from '../../../src/config/leagues.js';
import { eq, and, or, sql, desc, lt, gte, ne } from 'drizzle-orm';

const MIN_BET = 1_000;
const MAX_BET = 10_000_000;
const MATCH_TIMEOUT_MS = 60_000;

// 🎯 Рейтинг за онлайн
const ONLINE_WIN_RATING = 15;
const ONLINE_LOSE_RATING = -10;

// 🎯 Рейтинг за офлайн (мягче)
const OFFLINE_WIN_RATING = 3;
const OFFLINE_LOSE_RATING = -1;

// 🎯 Комиссия
const COMMISSION = 0.05;

// ============================================================
// 🎮 Онлайн-поиск игры
// ============================================================
export async function matchmakeHandler(req: any, res: any) {
  try {
    const { initData, bet, stats } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = valid.user.id;
    const betNum = Math.floor(bet);
    if (!betNum || betNum < MIN_BET || betNum > MAX_BET) {
      return res.status(400).json({
        error: `Ставка от ${MIN_BET.toLocaleString('ru-RU')} до ${MAX_BET.toLocaleString('ru-RU')} ₽`,
      });
    }
    if (!stats) return res.status(400).json({ error: 'Нет статистики' });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.balance < betNum) return res.status(400).json({ error: 'Недостаточно ₽' });

    // Проверяем, нет ли уже активного матча
    const [existing] = await db
      .select()
      .from(pvpBattles)
      .where(
        and(
          or(eq(pvpBattles.player1Id, userId), eq(pvpBattles.player2Id, userId)),
          or(eq(pvpBattles.status, 'waiting'), eq(pvpBattles.status, 'playing'))
        )
      );

    if (existing) return res.json({ success: true, battle: existing });

    // 🎯 Ищем реального соперника
    const now = new Date();
    const [opponentBattle] = await db
      .select()
      .from(pvpBattles)
      .where(
        and(
          eq(pvpBattles.status, 'waiting'),
          eq(pvpBattles.mode, 'online'),
          eq(pvpBattles.bet, betNum),
          ne(pvpBattles.player1Id, userId),
          lt(pvpBattles.createdAt, now),
          gte(pvpBattles.createdAt, new Date(now.getTime() - MATCH_TIMEOUT_MS))
        )
      )
      .orderBy(pvpBattles.createdAt)
      .limit(1);

    if (opponentBattle) {
      return await playOnlineMatch(res, opponentBattle, userId, stats, betNum);
    }

    // Создаём waiting
    const [newBattle] = await db
      .insert(pvpBattles)
      .values({
        player1Id: userId,
        bet: betNum,
        status: 'waiting',
        mode: 'online',
        player1Stats: stats,
      })
      .returning();

    // Списываем ставку
    await db
      .update(users)
      .set({ balance: sql`${users.balance} - ${betNum}` })
      .where(eq(users.id, userId));

    return res.json({ success: true, battle: newBattle });
  } catch (e) {
    console.error('[matchmake]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 🎯 Онлайн-матч
// ============================================================
async function playOnlineMatch(
  res: any,
  waitingBattle: any,
  secondPlayerId: number,
  secondPlayerStats: PvpStats,
  bet: number
) {
  const p1Id = waitingBattle.player1Id;
  const p1Stats = waitingBattle.player1Stats as PvpStats;

  // Списываем у второго
  await db
    .update(users)
    .set({ balance: sql`${users.balance} - ${bet}` })
    .where(eq(users.id, secondPlayerId));

  const p1Time = calcRaceTime(p1Stats, false);
  const p2Time = calcRaceTime(secondPlayerStats, false);

  const player1Win = p1Time < p2Time;
  const winnerId = player1Win ? p1Id : secondPlayerId;
  const loserId = player1Win ? secondPlayerId : p1Id;

  const pot = bet * 2;
  const commission = Math.floor(pot * COMMISSION);
  const prize = pot - commission;

  // Начисляем победителю
  await db
    .update(users)
    .set({
      balance: sql`${users.balance} + ${prize}`,
      totalEarned: sql`${users.totalEarned} + ${prize}`,
      rating: sql`${users.rating} + ${ONLINE_WIN_RATING}`,
      totalWins: sql`${users.totalWins} + 1`,
    })
    .where(eq(users.id, winnerId));

  await logTransaction(winnerId, prize, 'pvp_win', `PvP online: победа +${prize.toLocaleString('ru-RU')} ₽`);
  await logTransaction(loserId, -bet, 'pvp_lose', `PvP online: поражение -${bet.toLocaleString('ru-RU')} ₽`);

  // Проигравшему − рейтинг
  await db
    .update(users)
    .set({ rating: sql`GREATEST(0, ${users.rating} + ${ONLINE_LOSE_RATING})` })
    .where(eq(users.id, loserId));

  const [finished] = await db
    .update(pvpBattles)
    .set({
      player2Id: secondPlayerId,
      player2Stats: secondPlayerStats,
      status: 'finished',
      mode: 'online',
      winnerId,
      player1Time: p1Time.toFixed(3),
      player2Time: p2Time.toFixed(3),
      player1RatingChange: player1Win ? ONLINE_WIN_RATING : ONLINE_LOSE_RATING,
      player2RatingChange: player1Win ? ONLINE_LOSE_RATING : ONLINE_WIN_RATING,
      player1CoinsChange: player1Win ? prize : -bet,
      player2CoinsChange: player1Win ? -bet : prize,
      startedAt: new Date(),
      finishedAt: new Date(),
    })
    .where(eq(pvpBattles.id, waitingBattle.id))
    .returning();

  return res.json({ success: true, battle: finished });
}

// ============================================================
// 🤖 Офлайн-матч — реальный игрок из лиги с полной прокачкой
// ============================================================
export async function offlineMatchHandler(req: any, res: any) {
  try {
    const { initData, bet, stats } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = valid.user.id;
    const betNum = Math.floor(bet);
    if (!betNum || betNum < MIN_BET || betNum > MAX_BET) {
      return res.status(400).json({ error: 'Неверная ставка' });
    }
    if (!stats) return res.status(400).json({ error: 'Нет статистики' });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.balance < betNum) return res.status(400).json({ error: 'Недостаточно ₽' });

    // 🎯 Ищем соперника из ТОЙ ЖЕ лиги (топ-100)
    const league = getLeagueByPoints(user.leaguePoints || 0);

    const opponents = await db
      .select()
      .from(users)
      .where(
        and(
          ne(users.id, userId),
          eq(users.isBanned, false),
          gte(users.leaguePoints, league.minPoints),
          lt(
            users.leaguePoints,
            league.maxPoints === Infinity ? 999999999 : league.maxPoints
          )
        )
      )
      .limit(100);

    if (opponents.length === 0) {
      return res.status(404).json({ error: 'Нет соперников в твоей лиге' });
    }

    const rival = opponents[Math.floor(Math.random() * opponents.length)];

    // 🎯 Берём ЕГО экипировку
    const rivalEquipped = await db
      .select()
      .from(equippedItems)
      .where(eq(equippedItems.userId, rival.id));

    const rivalEquippedMap: Record<string, string | null> = {
      engine: null, tires: null, ecu: null, suspension: null,
    };
    rivalEquipped.forEach((e) => {
      rivalEquippedMap[e.slot] = e.itemId;
    });

    // 🎯 Считаем ЕГО полные статы
    const rivalStats = getFinalCarStats(
      rival.activeCarId || 'vaz-2107',
      rivalEquippedMap,
      rival.partUpgrades || {}
    );

    // 🎯 Списываем ставку
    await db
      .update(users)
      .set({ balance: sql`${users.balance} - ${betNum}` })
      .where(eq(users.id, userId));

    // 🎯 Симулируем
    const pTime = calcRaceTime(stats, false);
    const oTime = calcRaceTime(rivalStats as PvpStats, true);

    const playerWin = pTime < oTime;

    const pot = betNum * 2;
    const commission = Math.floor(pot * COMMISSION);
    const prize = pot - commission;

    if (playerWin) {
      await db
        .update(users)
        .set({
          balance: sql`${users.balance} + ${prize}`,
          totalEarned: sql`${users.totalEarned} + ${prize}`,
          rating: sql`${users.rating} + ${OFFLINE_WIN_RATING}`,
          totalWins: sql`${users.totalWins} + 1`,
          totalRaces: sql`${users.totalRaces} + 1`,
        })
        .where(eq(users.id, userId));

      await logTransaction(
        userId,
        prize,
        'pvp_offline_win',
        `PvP offline: победа над ${rival.firstName} +${prize.toLocaleString('ru-RU')} ₽`
      );
    } else {
      await db
        .update(users)
        .set({
          rating: sql`GREATEST(0, ${users.rating} + ${OFFLINE_LOSE_RATING})`,
          totalLosses: sql`${users.totalLosses} + 1`,
          totalRaces: sql`${users.totalRaces} + 1`,
        })
        .where(eq(users.id, userId));

      await logTransaction(
        userId,
        -betNum,
        'pvp_offline_lose',
        `PvP offline: поражение от ${rival.firstName} -${betNum.toLocaleString('ru-RU')} ₽`
      );
    }

    const [battle] = await db
      .insert(pvpBattles)
      .values({
        player1Id: userId,
        player2Id: rival.id,
        bet: betNum,
        status: 'finished',
        mode: 'offline',
        player1Stats: stats,
        player2Stats: rivalStats,
        winnerId: playerWin ? userId : rival.id,
        player1Time: pTime.toFixed(3),
        player2Time: oTime.toFixed(3),
        player1RatingChange: playerWin ? OFFLINE_WIN_RATING : OFFLINE_LOSE_RATING,
        player2RatingChange: 0,
        player1CoinsChange: playerWin ? prize : -betNum,
        player2CoinsChange: 0,
        startedAt: new Date(),
        finishedAt: new Date(),
      })
      .returning();

    return res.json({
      success: true,
      battle,
      rival: {
        id: rival.id,
        firstName: rival.firstName,
        lastName: rival.lastName,
        photoUrl: rival.photoUrl,
        carId: rival.activeCarId,
        rating: rival.rating,
      },
    });
  } catch (e) {
    console.error('[offlineMatch]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 📊 Получить мой активный матч
// ============================================================
export async function getMyBattleHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = valid.user.id;

    const [battle] = await db
      .select()
      .from(pvpBattles)
      .where(
        and(
          or(eq(pvpBattles.player1Id, userId), eq(pvpBattles.player2Id, userId)),
          or(
            eq(pvpBattles.status, 'waiting'),
            eq(pvpBattles.status, 'playing'),
            eq(pvpBattles.status, 'finished')
          )
        )
      )
      .orderBy(desc(pvpBattles.createdAt))
      .limit(1);

    if (!battle) return res.json({ success: true, battle: null });

    if (battle.status === 'waiting') {
      const age = Date.now() - new Date(battle.createdAt).getTime();
      if (age > MATCH_TIMEOUT_MS) {
        await db
          .update(users)
          .set({ balance: sql`${users.balance} + ${battle.bet}` })
          .where(eq(users.id, userId));
        await db
          .update(pvpBattles)
          .set({ status: 'cancelled' })
          .where(eq(pvpBattles.id, battle.id));
        return res.json({ success: true, battle: null, refunded: battle.bet });
      }
    }

    return res.json({ success: true, battle });
  } catch (e) {
    console.error('[getMyBattle]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// ❌ Отменить поиск
// ============================================================
export async function cancelMatchHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = valid.user.id;

    const [battle] = await db
      .select()
      .from(pvpBattles)
      .where(and(eq(pvpBattles.player1Id, userId), eq(pvpBattles.status, 'waiting')));

    if (!battle) return res.json({ success: true });

    await db
      .update(users)
      .set({ balance: sql`${users.balance} + ${battle.bet}` })
      .where(eq(users.id, userId));
    await db
      .update(pvpBattles)
      .set({ status: 'cancelled' })
      .where(eq(pvpBattles.id, battle.id));

    return res.json({ success: true });
  } catch (e) {
    console.error('[cancelMatch]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}