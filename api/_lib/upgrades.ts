export type GarageUpgradeType = 'engine' | 'tires' | 'suspension' | 'diagnostics';

export interface UpgradeDef {
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
}

export const UPGRADE_DEFS: Record<GarageUpgradeType, UpgradeDef> = {
  engine:      { maxLevel: 20, baseCost: 5_000, costMultiplier: 1.7 },
  tires:       { maxLevel: 20, baseCost: 3_000, costMultiplier: 1.6 },
  suspension:  { maxLevel: 20, baseCost: 4_000, costMultiplier: 1.65 },
  diagnostics: { maxLevel: 20, baseCost: 2_000, costMultiplier: 1.5 },
};

export function getUpgradeCost(type: GarageUpgradeType, level: number): number {
  const def = UPGRADE_DEFS[type];
  return Math.floor(def.baseCost * Math.pow(def.costMultiplier, level));
}

export function levelField(type: GarageUpgradeType):
  | 'engineLevel'
  | 'tiresLevel'
  | 'suspensionLevel'
  | 'diagnosticsLevel' {
  switch (type) {
    case 'engine':      return 'engineLevel';
    case 'tires':       return 'tiresLevel';
    case 'suspension':  return 'suspensionLevel';
    case 'diagnostics': return 'diagnosticsLevel';
  }
}

export interface UpgradeLevels {
  engine: number;
  tires: number;
  suspension: number;
  diagnostics: number;
}

export interface RacingStats {
  power: number;    // HP
  topSpeed: number; // km/h
  accel: number;    // сек до 100
  grip: number;     // 0..100
  handling: number; // 0..100
  rating: number;   // сводный рейтинг
}

/**
 * Считает характеристики машины на основе уровней гаражных апгрейдов.
 * Эта же формула продублирована на клиенте в src/config/racing.ts —
 * чтобы UI мог показывать предпросмотр без запроса на сервер.
 * Логика гонок (когда появится) будет использовать серверную версию.
 */
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