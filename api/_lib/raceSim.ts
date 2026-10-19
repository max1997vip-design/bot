// api/lib/raceSim.ts
export interface RacingStats {
  power: number; topSpeed: number; accel: number; grip: number; handling: number; rating: number;
}

export function getServerRacingStats(levels: any): RacingStats {
  const engine = levels.engine || 0;
  const tires = levels.tires || 0;
  const suspension = levels.suspension || 0;
  const diagnostics = levels.diagnostics || 0;

  const power = 200 + engine * 35;
  const topSpeed = 220 + engine * 12 + tires * 2;
  const accel = Math.max(2.0, 6.5 - engine * 0.15 - tires * 0.08 - suspension * 0.02);
  const grip = Math.min(100, tires * 4 + suspension * 2);
  const handling = Math.min(100, suspension * 4 + diagnostics * 1.5);
  const rating = Math.round(engine * 10 + tires * 8 + suspension * 8 + diagnostics * 6);

  return { power, topSpeed, accel, grip, handling, rating };
}

export function simulateRaceServer(p: RacingStats, o: RacingStats, oName: string) {
  const calcTime = (stats: RacingStats) => {
    const baseTime = (400 / stats.topSpeed) * 3600;
    const accelBonus = stats.accel * 0.5;
    const gripBonus = stats.grip * 0.05;
    const handlingBonus = stats.handling * 0.05;
    return Math.max(5, baseTime - accelBonus - gripBonus - handlingBonus + (Math.random() * 1.5));
  };

  const pTime = calcTime(p);
  const oTime = calcTime(o);
  const winner = pTime < oTime ? 'player' : 'opponent';

  return {
    winner,
    playerTime: pTime,
    opponentTime: oTime,
    log: [
      `🏁 Старт! Соперник: ${oName}`,
      `Вы проехали 400м за ${pTime.toFixed(2)} сек.`,
      `${oName} проехал за ${oTime.toFixed(2)} сек.`,
      winner === 'player' ? `🏆 Победа! Вы были быстрее.` : `💨 Поражение... Соперник был быстрее.`
    ]
  };
}