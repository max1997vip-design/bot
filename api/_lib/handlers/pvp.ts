// api/_lib/handlers/pvp.ts
import { db } from '../db.js';
import { users, equippedItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, ne, sql } from 'drizzle-orm';

export async function pvpHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { initData, playerStats } = req.body;
  
  if (!playerStats) {
    return res.status(400).json({ error: 'playerStats is required' });
  }

  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const telegramId = validatedData.user.id;

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, telegramId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 1. Статы текущего игрока берем из запроса
    const myStats = playerStats;

    // 2. Ищем реального соперника (разница рейтинга до 150 очков)
    const possibleOpponents = await db.select()
      .from(users)
      .where(and(
        ne(users.id, telegramId),
        sql`ABS(${users.rating} - ${user.rating}) < 150`
      ))
      .limit(1);

    let opponentName = 'Призрак трассы';
    let opponentStats = { ...myStats };
    let opponentId: number | null = null;

    if (possibleOpponents.length > 0) {
      const opp = possibleOpponents[0];
      opponentId = opp.id;
      opponentName = opp.firstName || 'Гонщик';
      
      if (playerStats.opponentStats) {
        opponentStats = playerStats.opponentStats;
      } else {
        opponentStats = { ...myStats };
        opponentStats.rating += (Math.random() * 20 - 10);
      }
    } else {
      opponentStats.rating += (Math.random() * 20 - 10);
    }

    // 3. Симуляция гонки
    const calcTime = (stats: any) => {
      const baseTime = (1000 / stats.topSpeed) * 3600; 
      return baseTime - (stats.accel * 0.5) - (stats.grip * 0.05) - (stats.handling * 0.05) + (Math.random() * 1.5);
    };

    const pTime = calcTime(myStats);
    const oTime = calcTime(opponentStats);
    const winner = pTime < oTime ? 'player' : 'opponent';
    
    const log = [
      `🏁 Старт! Соперник: ${opponentName} (Рейтинг: ${opponentStats.rating.toFixed(0)})`,
      `Вы проехали 1000м за ${pTime.toFixed(2)} сек.`,
      `Соперник проехал за ${oTime.toFixed(2)} сек.`,
      winner === 'player' ? `🏆 Победа! +5 рейтинга.` : `💨 Поражение... -2 рейтинга.`
    ];

    let newBalance = user.balance;
    let newRating = user.rating;
    let ratingChange = 0;
    let reward = 0;

    // 4. Начисление наград
    if (winner === 'player') {
      reward = (1000 + myStats.rating * 10) * 5;
      newBalance += reward;
      ratingChange = 5;
      newRating += ratingChange;
      
      if (opponentId) {
        await db.update(users)
          .set({ rating: sql`GREATEST(0, ${users.rating} - 2)` })
          .where(eq(users.id, opponentId));
      }
    } else {
      ratingChange = -2;
      newRating = Math.max(0, newRating + ratingChange);
      
      if (opponentId) {
        await db.update(users)
          .set({ rating: sql`${users.rating} + 5` })
          .where(eq(users.id, opponentId));
      }
    }

    // 👇 СОХРАНЯЕМ РЕЗУЛЬТАТ И ОБНОВЛЯЕМ СТАТИСТИКУ ГОНОК
    const statsUpdate = winner === 'player'
      ? {
          balance: newBalance,
          rating: newRating,
          totalRaces: sql`${users.totalRaces} + 1`,
          totalWins: sql`${users.totalWins} + 1`,
        }
      : {
          balance: newBalance,
          rating: newRating,
          totalRaces: sql`${users.totalRaces} + 1`,
          totalLosses: sql`${users.totalLosses} + 1`,
        };

    const [updatedUser] = await db.update(users)
      .set(statsUpdate)
      .where(eq(users.id, telegramId))
      .returning();

    return res.status(200).json({
      success: true,
      result: { winner, log, playerTime: pTime, opponentTime: oTime, ratingChange, reward },
      newBalance: updatedUser.balance,
      newRating: updatedUser.rating,
      // 👇 Возвращаем статистику на клиент
      totalRaces: updatedUser.totalRaces,
      totalWins: updatedUser.totalWins,
      totalLosses: updatedUser.totalLosses,
    });
  } catch (error) {
    console.error('PvP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}