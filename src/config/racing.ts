export interface UpgradeLevels {
  engine: number;
  tires: number;
  suspension: number;
  diagnostics: number;
}

export interface RacingStats {
  power: number;
  topSpeed: number;
  accel: number;
  grip: number;
  handling: number;
  rating: number;
}

/** Должно совпадать с api/lib/upgrades.ts:getRacingStats */
export function getRacingStats(levels: UpgradeLevels): RacingStats {
  const { engine, tires, suspension, diagnostics } = levels;

  const power = 200 + engine * 35;
  const topSpeed = 220 + engine * 12 + tires * 2;
  const accel = Math.max(
    2.0,
    6.5 - engine * 0.15 - tires * 0.08 - suspension * 0.02,
  );
  const grip = Math.min(100, tires * 4 + suspension * 2);
  const handling = Math.min(100, suspension * 4 + diagnostics * 1.5);

  const rating = Math.round(
    engine * 10 + tires * 8 + suspension * 8 + diagnostics * 6,
  );

  return {
    power,
    topSpeed,
    accel: Math.round(accel * 100) / 100,
    grip,
    handling,
    rating,
  };
}