// src/config/clans.ts
export const CLAN_CREATE_COST = 100_000;

export interface ClanLevelConfig {
  level: number;
  upgradeCost: number;
  maxMembers: number;
  clickBonus: number;
  /** 🎯 Урон по боссу (множитель к базовому clickLevel × 50) */
  bossDamageMultiplier: number;
  /** 🎯 Доход клана (% к доходу всех членов) */
  incomeBonus: number;
  /** 🎯 Сколько слотов под активные бусты */
  maxBoosters: number;
  /** 🎯 Максимальный уровень прокачки урона босса */
  maxBossDamageLevel: number;
}

export const CLAN_LEVELS: ClanLevelConfig[] = [
  { level: 1, upgradeCost: 0,          maxMembers: 5,  clickBonus: 0,  bossDamageMultiplier: 1.0, incomeBonus: 0,  maxBoosters: 0, maxBossDamageLevel: 0 },
  { level: 2, upgradeCost: 500_000,    maxMembers: 7,  clickBonus: 1,  bossDamageMultiplier: 1.0, incomeBonus: 0,  maxBoosters: 1, maxBossDamageLevel: 10 },
  { level: 3, upgradeCost: 1_500_000,  maxMembers: 10, clickBonus: 2,  bossDamageMultiplier: 1.2, incomeBonus: 2,  maxBoosters: 1, maxBossDamageLevel: 20 },
  { level: 4, upgradeCost: 4_000_000,  maxMembers: 15, clickBonus: 3,  bossDamageMultiplier: 1.4, incomeBonus: 4,  maxBoosters: 2, maxBossDamageLevel: 30 },
  { level: 5, upgradeCost: 10_000_000, maxMembers: 20, clickBonus: 5,  bossDamageMultiplier: 1.6, incomeBonus: 6,  maxBoosters: 2, maxBossDamageLevel: 40 },
  { level: 6, upgradeCost: 25_000_000, maxMembers: 30, clickBonus: 7,  bossDamageMultiplier: 1.8, incomeBonus: 8,  maxBoosters: 3, maxBossDamageLevel: 50 },
  { level: 7, upgradeCost: 50_000_000, maxMembers: 40, clickBonus: 10, bossDamageMultiplier: 2.0, incomeBonus: 10, maxBoosters: 3, maxBossDamageLevel: 60 },
  { level: 8, upgradeCost: 100_000_000, maxMembers: 50, clickBonus: 15, bossDamageMultiplier: 2.2, incomeBonus: 12, maxBoosters: 4, maxBossDamageLevel: 70 },
];

export function getClanStats(level: number): ClanLevelConfig | undefined {
  return CLAN_LEVELS.find(l => l.level === level);
}

/**
 * 🎯 Урон по боссу = clickLevel × 50 × clanMultiplier × (1 + bossDamageLevel × 0.05)
 * - clanMultiplier — от уровня клана;
 * - bossDamageLevel — прокачка урона (доступна с 2 уровня).
 */
export function calcBossDamage(
  clickLevel: number,
  clanLevel: number,
  bossDamageLevel: number
): number {
  const stats = getClanStats(clanLevel);
  const clanMult = stats?.bossDamageMultiplier || 1.0;
  const upgradeMult = 1 + bossDamageLevel * 0.05;
  return Math.floor(clickLevel * 50 * clanMult * upgradeMult);
}

/**
 * 🎯 Стоимость следующего уровня прокачки урона.
 */
export function getBossDamageUpgradeCost(currentLevel: number): number {
  return Math.floor(50_000 * Math.pow(1.4, currentLevel));
}

/**
 * 🎯 Стоимость активации буста (из казны клана).
 */
export function getBoosterCost(type: 'boss_damage' | 'income' | 'boss_crit'): number {
  const costs = { boss_damage: 100_000, income: 150_000, boss_crit: 200_000 };
  return costs[type];
}

/**
 * 🎯 Стоимость активации буста за звёзды.
 */
export function getBoosterStarCost(type: 'boss_damage' | 'income' | 'boss_crit'): number {
  const costs = { boss_damage: 10, income: 15, boss_crit: 20 };
  return costs[type];
}

/**
 * 🎯 Множитель буста.
 */
export function getBoosterMultiplier(type: 'boss_damage' | 'income' | 'boss_crit'): number {
  const mults = { boss_damage: 1.5, income: 1.3, boss_crit: 2.0 };
  return mults[type];
}