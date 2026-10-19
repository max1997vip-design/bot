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

  // Формула: Время = (Дистанция / Максималка) - (Разгон / 10) - (Управляемость / 50) + Случайность
  // Дистанция: 400 метров (стандартный дрэг)
  const calcTime = (stats: RacingStats) => {
    const baseTime = (400 / stats.topSpeed) * 3600; // время в секундах
    const accelBonus = stats.accel * 0.5;
    const gripBonus = stats.grip * 0.05;
    const handlingBonus = stats.handling * 0.05;
    // Небольшой рандом (от 0 до 1.5 сек)
    const randomDelay = Math.random() * 1.5;
    
    return Math.max(5, baseTime - accelBonus - gripBonus - handlingBonus + randomDelay);
  };

  const playerTime = calcTime(player);
  const opponentTime = calcTime(opponent);

  log.push(`🏁 Старт! Соперник: ${opponentName}`);
  log.push(`Вы проехали 400м за ${playerTime.toFixed(2)} сек.`);
  log.push(`${opponentName} проехал за ${opponentTime.toFixed(2)} сек.`);

  const winner = playerTime < opponentTime ? 'player' : 'opponent';
  
  if (winner === 'player') {
    log.push(`🏆 Победа! Вы обогнали соперника на ${(opponentTime - playerTime).toFixed(2)} сек.`);
  } else {
    log.push(`💨 Поражение... Соперник был быстрее на ${(playerTime - opponentTime).toFixed(2)} сек.`);
  }

  return { winner, playerTime, opponentTime, log };
}