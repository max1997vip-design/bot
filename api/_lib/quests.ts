export interface QuestData {
  resetAt: number; // Время следующего сброса (timestamp)
  progress: Record<string, number>; // Прогресс по ID квеста
  claimed: Record<string, boolean>; // Забран ли приз
}

export const QUESTS_CONFIG = {
  click_1000: { target: 1000, reward: 5000 },
  win_3: { target: 3, reward: 15000 },
  sell_5: { target: 5, reward: 5000 },
};

export function getOrCreateQuests(dbQuests: any): QuestData {
  const now = Date.now();
  
  // Если квестов нет или время сброса прошло — создаем новые
  if (!dbQuests || !dbQuests.resetAt || dbQuests.resetAt < now) {
    return {
      resetAt: now + 24 * 60 * 60 * 1000, // Сброс через 24 часа
      progress: { click_1000: 0, win_3: 0, sell_5: 0 },
      claimed: { click_1000: false, win_3: false, sell_5: false },
    };
  }
  
  return dbQuests as QuestData;
}