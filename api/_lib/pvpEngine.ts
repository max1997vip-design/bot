// api/_lib/pvpEngine.ts

export interface PvpStats {
  power: number;
  topSpeed: number;
  accel: number;
  grip: number;
  handling: number;
  rating: number;
}

/**
 * Симуляция гонки 400м (как в одиночной).
 * Возвращает время в секундах (меньше = лучше).
 *
 * 🎯 Использует ТУ ЖЕ формулу, что и `src/utils/raceEngine.ts`,
 *    чтобы PvP и одиночка были сбалансированы.
 */
export function calcRaceTime(stats: PvpStats, isBot: boolean = false): number {
  const maxSpeedKmh = Math.max(1, stats.topSpeed);
  const maxSpeedMs = maxSpeedKmh / 3.6;

  // 🎯 Учёт сцепления: grip=0 → −40% разгона, grip=100 → +0%
  const gripPenalty = (100 - Math.max(0, Math.min(100, stats.grip))) / 100 * 0.4;

  // 🎯 Эффективное время до 100 км/ч
  let effectiveAccel = Math.max(1, stats.accel) * (1 + gripPenalty);

  // 🎯 Бот «ошибается» на старте — рандом ±15%
  if (isBot) {
    effectiveAccel *= 0.85 + Math.random() * 0.3;
  }

  // 🎯 Симуляция разгона до 400м с шагом 50мс
  const TRACK_DISTANCE = 400;
  let dist = 0;
  let speed = 0; // м/с
  let time = 0;

  while (dist < TRACK_DISTANCE && time < 60) {
    const dt = 0.05;
    time += dt;

    const accelRate = (maxSpeedMs / effectiveAccel) * dt;
    speed += accelRate * (1 - speed / maxSpeedMs);
    if (speed > maxSpeedMs) speed = maxSpeedMs;

    dist += speed * dt;
  }

  return Math.min(time, 60);
}