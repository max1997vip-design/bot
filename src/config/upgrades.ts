export type GarageUpgradeType = 'engine' | 'tires' | 'suspension' | 'diagnostics';

export interface UpgradeConfig {
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  title: string;
  icon: string;
}

export const UPGRADE_CONFIG: Record<GarageUpgradeType, UpgradeConfig> = {
  engine:      { maxLevel: 20, baseCost: 5_000, costMultiplier: 1.7,  title: 'Двигатель',   icon: '🏎️' },
  tires:       { maxLevel: 20, baseCost: 3_000, costMultiplier: 1.6,  title: 'Шины',        icon: '🛞' },
  suspension:  { maxLevel: 20, baseCost: 4_000, costMultiplier: 1.65, title: 'Подвеска',    icon: '🔧' },
  diagnostics: { maxLevel: 20, baseCost: 2_000, costMultiplier: 1.5,  title: 'Диагностика', icon: '📊' },
};

export function getUpgradeCost(type: GarageUpgradeType, level: number): number {
  const cfg = UPGRADE_CONFIG[type];
  return Math.floor(cfg.baseCost * Math.pow(cfg.costMultiplier, level));
}

export function getEngineLevelName(level: number): string {
  const names = [
    'Сток',
    'Stage 1 Чип',
    'Stage 2 Турбо',
    'Stage 3 Турбо',
    'Racing ECU',
    'Race Build',
    'Прототип',
    'Гиперкар',
    'Легенда',
    'Миф',
  ];
  if (level < names.length) return names[level];
  return `Race ${level - names.length + 1}`;
}