// src/utils/raceSim.ts
import { RacingStats } from '../config/racing';

export interface RaceResult {
  winner: 'player' | 'opponent';
  playerTime: number;
  opponentTime: number;
  log: string[];
}

export function simulateRace(
  player: RacingStats,
  opponent: RacingStats,
  opponentName: string
): RaceResult {
  const log: string[] = [];

  // 🎯 НОВАЯ ФОРМУЛА — все характеристики влияют сбалансированно
  // Дистанция: 400 м (стандартный дрэг)
  const calcTime = (stats: RacingStats, isBot: boolean = false) => {
    // 1. Базовая скорость — уменьшили коэффициент ×2800 → ×1500
    //    чтобы topSpeed не доминировал так сильно
    const baseTime = (1000 / Math.max(1, stats.topSpeed)) * 1500;

    // 2. Разгон — теперь ВАЖЕН (×0.5 → ×4.0)
    const accelBonus = stats.accel * 4.0;

    // 3. Сцепление (×0.05 → ×0.25)
    const gripBonus = stats.grip * 0.25;

    // 4. Управление (×0.05 → ×0.25)
    const handlingBonus = stats.handling * 0.25;

    // 5. Случайность: у бота — шире (0..3.5), у игрока — уже (0..1.5)
    //    Это даёт боту шанс выиграть, даже если он чуть слабее
    const randomDelay = isBot ? Math.random() * 3.5 : Math.random() * 1.5;

    return Math.max(
      5,
      baseTime - accelBonus - gripBonus - handlingBonus + randomDelay
    );
  };

  const playerTime = calcTime(player, false);
  const opponentTime = calcTime(opponent, true);

  log.push(`🏁 Старт! Соперник: ${opponentName}`);
  log.push(`Вы проехали 400м за ${playerTime.toFixed(2)} сек.`);
  log.push(`${opponentName} проехал за ${opponentTime.toFixed(2)} сек.`);

  const winner = playerTime < opponentTime ? 'player' : 'opponent';

  if (winner === 'player') {
    log.push(
      `🏆 Победа! Вы обогнали соперника на ${(opponentTime - playerTime).toFixed(2)} сек.`
    );
  } else {
    log.push(
      `💨 Поражение... Соперник был быстрее на ${(playerTime - opponentTime).toFixed(2)} сек.`
    );
  }

  return { winner, playerTime, opponentTime, log };
}