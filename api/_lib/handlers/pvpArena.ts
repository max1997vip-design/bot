// api/_lib/handlers/pvpArena.ts
import { db } from '../db.js';
import { users, pvpBattles } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { calcRaceTime, PvpStats } from '../pvpEngine.js';
import { eq, and, or, sql, desc, lt, gte } from 'drizzle-orm';

const MIN_BET = 1000;
const MAX_BET = 10_000_000;
const MATCH_TIMEOUT_MS = 60_000; // 1 минута на поиск

// ============================================================
// 🎮 Найти игру
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
    if (!stats) {
      return res.status(400).json({ error: 'Нет статистики' });
    }

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

    if (existing) {
      return res.json({ success: true, battle: existing });
    }

    // Ищем соперника с похожей ставкой и рейтингом
    const now = new Date();
    const [opponentBattle] = await db
      .select()
      .from(pvpBattles)
      .where(
        and(
          eq(pvpBattles.status, 'waiting'),
          eq(pvpBattles.bet, betNum),
          sql`${pvpBattles.player1Id} != ${userId}`,
          lt(pvpBattles.createdAt, now),
          gte(pvpBattles.createdAt, new Date(now.getTime() - MATCH_TIMEOUT_MS))
        )
      )
      .orderBy(pvpBattles.createdAt)
      .limit(1);

    if (opponentBattle) {
      // 🎯 Нашли соперника → сразу симулируем матч
      return await playMatch(res, opponentBattle, userId, stats, betNum);
    }

    // Иначе — создаём «waiting» и ждём
    const [newBattle] = await db
      .insert(pvpBattles)
      .values({
        player1Id: userId,
        bet: betNum,
        status: 'waiting',
        player1Stats: stats,
      })
      .returning();

    // Списываем ставку сразу
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
// 🎯 Общая функция «сыграть матч»
// ============================================================
async function playMatch(
  res: any,
  waitingBattle: any,
  secondPlayerId: number,
  secondPlayerStats: PvpStats,
  bet: number
) {
  const p1Id = waitingBattle.player1Id;
  const p1Stats = waitingBattle.player1Stats as PvpStats;

  // Списываем ставку у второго
  await db
    .update(users)
    .set({ balance: sql`${users.balance} - ${bet}` })
    .where(eq(users.id, secondPlayerId));

  // Симулируем гонку
  const p1Time = calcRaceTime(p1Stats);
  const p2Time = calcRaceTime(secondPlayerStats);

  const winnerId = p1Time < p2Time ? p1Id : secondPlayerId;
  const loserId = winnerId === p1Id ? secondPlayerId : p1Id;

  // Ставки идут в банк → победитель забирает всё (×2 минус 5% комиссия)
  const pot = bet * 2;
  const commission = Math.floor(pot * 0.05);
  const prize = pot - commission; // 95% победителю

  // Начисляем победителю
  await db
    .update(users)
    .set({
      balance: sql`${users.balance} + ${prize}`,
      totalEarned: sql`${users.totalEarned} + ${prize}`,
      rating: sql`${users.rating} + 15`,
      totalWins: sql`${users.totalWins} + 1`,
    })
    .where(eq(users.id, winnerId));

  // Логируем
  await logTransaction(winnerId, prize, 'pvp_win', `PvP: победа +${prize.toLocaleString('ru-RU')} ₽`);
  await logTransaction(loserId, -bet, 'pvp_lose', `PvP: проигрыш -${bet.toLocaleString('ru-RU')} ₽`);

  // У проигравшего rating -10
  await db
    .update(users)
    .set({ rating: sql`GREATEST(0, ${users.rating} - 10)` })
    .where(eq(users.id, loserId));

  // Обновляем battle
  const [finished] = await db
    .update(pvpBattles)
    .set({
      player2Id: secondPlayerId,
      player2Stats: secondPlayerStats,
      status: 'finished',
      winnerId,
      player1Time: p1Time.toFixed(3),
      player2Time: p2Time.toFixed(3),
      player1RatingChange: winnerId === p1Id ? 15 : -10,
      player2RatingChange: winnerId === secondPlayerId ? 15 : -10,
      player1CoinsChange: winnerId === p1Id ? prize : -bet,
      player2CoinsChange: winnerId === secondPlayerId ? prize : -bet,
      startedAt: new Date(),
      finishedAt: new Date(),
    })
    .where(eq(pvpBattles.id, waitingBattle.id))
    .returning();

  return res.json({ success: true, battle: finished });
}

// ============================================================
// 📊 Проверить статус моего матча (polling)
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
          or(eq(pvpBattles.status, 'waiting'), eq(pvpBattles.status, 'playing'), eq(pvpBattles.status, 'finished'))
        )
      )
      .orderBy(desc(pvpBattles.createdAt))
      .limit(1);

    if (!battle) return res.json({ success: true, battle: null });

    // Если waiting > 60 сек — отменяем и возвращаем ставку
    if (battle.status === 'waiting') {
      const age = Date.now() - new Date(battle.createdAt).getTime();
      if (age > MATCH_TIMEOUT_MS) {
        // Возврат ставки
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
      .where(
        and(
          eq(pvpBattles.player1Id, userId),
          eq(pvpBattles.status, 'waiting')
        )
      );

    if (!battle) return res.json({ success: true });

    // Возврат ставки
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