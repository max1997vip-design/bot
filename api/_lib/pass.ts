export interface PassLevel {
  level: number;
  xpReq: number;
  reward: number;
}

export const PASS_LEVELS: PassLevel[] = [
  { level: 1, xpReq: 1000, reward: 5000 },
  { level: 2, xpReq: 5000, reward: 15000 },
  { level: 3, xpReq: 15000, reward: 30000 },
  { level: 4, xpReq: 35000, reward: 50000 },
  { level: 5, xpReq: 70000, reward: 100000 },
  { level: 6, xpReq: 120000, reward: 150000 },
  { level: 7, xpReq: 200000, reward: 250000 },
  { level: 8, xpReq: 350000, reward: 400000 },
  { level: 9, xpReq: 500000, reward: 700000 },
  { level: 10, xpReq: 750000, reward: 1000000 },
];

export function getOrCreatePass(dbPass: any) {
  const currentWeek = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  if (!dbPass || dbPass.weekId !== currentWeek) {
    return { weekId: currentWeek, xp: 0, claimed: [] };
  }
  return dbPass;
}