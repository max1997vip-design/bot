// api/_lib/handlers/pvp.ts
import { db } from '../db.js';
import { users, equippedItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, ne, sql } from 'drizzle-orm';
import { calculateStats } from '../items.js'; // Используем новую систему предметов

export async function pvpHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { initData } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const telegramId = validatedData.user.id;

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, telegramId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 1. Получаем статы текущего игрока
    const myEquipped = await db.query.equippedItems.findMany({ where: eq(equippedItems.userId, telegramId) });
    const myEquippedMap: any = { engine: null, tires: null, ecu: null, suspension: null };
    myEquipped.forEach(e => myEquippedMap[e.slot] = e.itemId);
    const myStats = calculateStats(myEquippedMap);

    // 2. Ищем реального соперника (разница рейтинга до 150 очков)
    const possibleOpponents = await db.select()
      .from(users)
      .where(and(
        ne(users.id, telegramId),
        sql`ABS(${users.rating} - ${user.rating}) < 150`
      ))
      .limit(1);

    let opponentName = 'Призрак трассы';
    let opponentStats = { ...myStats }; // По умолчанию бот со статами как у тебя
    let opponentId: number | null = null;

    if (possibleOpponents.length > 0) {
      const opp = possibleOpponents[0];
      opponentId = opp.id;
      opponentName = opp.firstName || 'Гонщик';
      
      const oppEquipped = await db.query.equippedItems.findMany({ where: eq(equippedItems.userId, opp.id) });
      const oppEquippedMap: any = { engine: null, tires: null, ecu: null, suspension: null };
      oppEquipped.forEach(e => oppEquippedMap[e.slot] = e.itemId);
      opponentStats = calculateStats(oppEquippedMap);
    } else {
      // Если живых нет, добавляем рандом боту, чтобы он не был точной копией
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
      reward = (1000 + myStats.rating * 10) * 5; // Награда х5
      newBalance += reward;
      ratingChange = 5;
      newRating += ratingChange;
      
      // Если это был реальный игрок, отнимаем у него рейтинг
      if (opponentId) {
        await db.update(users)
          .set({ rating: sql`GREATEST(0, ${users.rating} - 2)` })
          .where(eq(users.id, opponentId));
      }
    } else {
      ratingChange = -2;
      newRating = Math.max(0, newRating + ratingChange);
      
      // Если это был реальный игрок, добавляем ему рейтинг
      if (opponentId) {
        await db.update(users)
          .set({ rating: sql`${users.rating} + 5` })
          .where(eq(users.id, opponentId));
      }
    }

    // Сохраняем результат текущего игрока
    await db.update(users).set({ balance: newBalance, rating: newRating }).where(eq(users.id, telegramId));

    return res.status(200).json({
      success: true,
      result: { winner, log, playerTime: pTime, opponentTime: oTime, ratingChange, reward },
      newBalance,
      newRating
    });
  } catch (error) {
    console.error('PvP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}