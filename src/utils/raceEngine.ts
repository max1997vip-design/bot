// src/utils/raceEngine.ts
export interface CarPhysics {
  power: number;
  topSpeed: number; // км/ч
  accel: number;    // сек до 100 км/ч
  grip: number;
  handling: number;
}

export interface RaceTick {
  time: number;
  playerDist: number;
  opponentDist: number;
  playerSpeed: number;
  opponentSpeed: number;
}

export interface RaceResult {
  winner: 'player' | 'opponent';
  playerTime: number;
  opponentTime: number;
  ticks: RaceTick[]; // История для анимации
  log: string[];
}

const TRACK_DISTANCE = 1000; // метров

export function simulateRacePhysics(
  player: CarPhysics,
  opponent: CarPhysics,
  opponentName: string
): RaceResult {
  const ticks: RaceTick[] = [];
  let pDist = 0, oDist = 0;
  let pSpeed = 0, oSpeed = 0; // м/с
  let time = 0;
  let pFinished = false, oFinished = false;

  const pTime100 = player.accel; // время до 100
  const pMaxSpeedMs = player.topSpeed / 3.6;
  const oMaxSpeedMs = opponent.topSpeed / 3.6;

  // Симуляция каждые 0.1 секунды
  while (time < 60 && (!pFinished || !oFinished)) {
    time += 0.1;

    // Разгон (плавно к максималке)
    if (!pFinished) {
      const pAccelRate = (pMaxSpeedMs / pTime100) * 0.1; 
      pSpeed += pAccelRate * (1 - pSpeed / pMaxSpeedMs); // Затухание разгона
      if (pSpeed > pMaxSpeedMs) pSpeed = pMaxSpeedMs;
      pDist += pSpeed * 0.1;
      if (pDist >= TRACK_DISTANCE) { pDist = TRACK_DISTANCE; pFinished = true; }
    }

    if (!oFinished) {
      // Бот немного ошибается на старте (рандом)
      const oTime100 = opponent.accel * (0.95 + Math.random() * 0.1);
      const oAccelRate = (oMaxSpeedMs / oTime100) * 0.1;
      oSpeed += oAccelRate * (1 - oSpeed / oMaxSpeedMs);
      if (oSpeed > oMaxSpeedMs) oSpeed = oMaxSpeedMs;
      oDist += oSpeed * 0.1;
      if (oDist >= TRACK_DISTANCE) { oDist = TRACK_DISTANCE; oFinished = true; }
    }

    ticks.push({ time, playerDist: pDist, opponentDist: oDist, playerSpeed: pSpeed, opponentSpeed: oSpeed });
  }

  const winner = pFinished && pDist >= oDist ? 'player' : 'opponent';
  const pTime = pFinished ? time : 99;
  const oTime = oFinished ? time : 99;

  return {
    winner,
    playerTime: pTime,
    opponentTime: oTime,
    ticks,
    log: [
      `🏁 Старт! Соперник: ${opponentName}`,
      `Вы проехали 1000м за ${pTime.toFixed(2)} сек.`,
      `${opponentName} проехал за ${oTime.toFixed(2)} сек.`,
      winner === 'player' ? `🏆 Победа! Вы были быстрее.` : `💨 Поражение... Соперник оказался сильнее.`
    ]
  };
}