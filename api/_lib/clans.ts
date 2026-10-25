export const CLAN_CREATE_COST = 100000;

export const CLAN_LEVELS = [
  { level: 1, upgradeCost: 0, maxMembers: 5, clickBonus: 0 },
  { level: 2, upgradeCost: 500000, maxMembers: 7, clickBonus: 1 },
  { level: 3, upgradeCost: 1500000, maxMembers: 10, clickBonus: 2 },
  { level: 4, upgradeCost: 4000000, maxMembers: 15, clickBonus: 3 },
  { level: 5, upgradeCost: 10000000, maxMembers: 20, clickBonus: 5 },
  { level: 6, upgradeCost: 25000000, maxMembers: 30, clickBonus: 7 },
  { level: 7, upgradeCost: 50000000, maxMembers: 40, clickBonus: 10 },
  { level: 8, upgradeCost: 100000000, maxMembers: 50, clickBonus: 15 },
];

export function getClanStats(level: number) {
  // 👇 ИСПРАВЛЕНИЕ: Убрали || CLAN_LEVELS[0], чтобы не сбрасывало на 1 уровень
  return CLAN_LEVELS.find(l => l.level === level); 
}