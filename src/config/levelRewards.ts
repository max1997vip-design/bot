// src/config/levelRewards.ts

export interface LevelReward {
  level: number;
  rubles?: number;
  stars?: number;
  caseType?: string; // 'hourly' | 'rare' | 'legendary'
}

export const LEVEL_REWARDS: LevelReward[] = [
  // 1-5: стартовые
  { level: 2,  rubles: 1000 },
  { level: 3,  rubles: 2500 },
  { level: 4,  rubles: 5000 },
  { level: 5,  rubles: 10000 },

  // 6-10: звёзды начинаются
  { level: 6,  rubles: 25000,  stars: 1 },
  { level: 7,  rubles: 50000,  stars: 1 },
  { level: 8,  rubles: 100000, stars: 1 },
  { level: 9,  rubles: 200000, stars: 2 },
  { level: 10, rubles: 500000, stars: 2 },

  // 11-20: кейсы
  { level: 11, rubles: 1000000,  stars: 2 },
  { level: 12, rubles: 1500000,  stars: 2 },
  { level: 13, rubles: 2000000,  stars: 3 },
  { level: 14, rubles: 3000000,  stars: 3, caseType: 'hourly' },
  { level: 15, rubles: 5000000,  stars: 3, caseType: 'hourly' },
  { level: 16, rubles: 7500000,  stars: 4 },
  { level: 17, rubles: 10000000, stars: 4 },
  { level: 18, rubles: 15000000, stars: 4 },
  { level: 19, rubles: 20000000, stars: 5 },
  { level: 20, rubles: 30000000, stars: 5, caseType: 'rare' },

  // 21-30: крупняк
  { level: 21, rubles: 40000000,  stars: 5 },
  { level: 22, rubles: 50000000,  stars: 6 },
  { level: 23, rubles: 60000000,  stars: 6 },
  { level: 24, rubles: 70000000,  stars: 6 },
  { level: 25, rubles: 100000000, stars: 10, caseType: 'rare' },

  // 26-50: легендарные
  { level: 30, rubles: 250000000, stars: 15, caseType: 'legendary' },
  { level: 35, rubles: 500000000, stars: 20, caseType: 'legendary' },
  { level: 40, rubles: 1000000000, stars: 25, caseType: 'legendary' },
  { level: 45, rubles: 2000000000, stars: 30, caseType: 'legendary' },
  { level: 50, rubles: 5000000000, stars: 50, caseType: 'legendary' },
];

// Хелпер: получить награду по уровню
export function getLevelReward(level: number): LevelReward | null {
  return LEVEL_REWARDS.find(r => r.level === level) || null;
}

// Хелпер: получить максимальный уровень, до которого есть награды
export function getMaxRewardLevel(): number {
  return Math.max(...LEVEL_REWARDS.map(r => r.level));
}

// Хелпер: уровень по XP
export function calcLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}