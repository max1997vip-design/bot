// api/_lib/quests.ts

export interface QuestData {
  resetAt: number;
  progress: Record<string, number>;
  claimed: Record<string, boolean>;
}

// 👇 Расширяем конфиг: добавляем rewardXp
export const QUESTS_CONFIG = {
  click_1000: { target: 1000, reward: 5000, rewardXp: 25 },
  win_3:      { target: 3,    reward: 15000, rewardXp: 50 },
  sell_5:     { target: 5,    reward: 5000, rewardXp: 15 },
  // 👇 НОВЫЕ ЗАДАНИЯ
  click_5000: { target: 5000, reward: 25000, rewardXp: 100 },
  win_5:      { target: 5,    reward: 50000, rewardXp: 150 },
};

export function getOrCreateQuests(dbQuests: any): QuestData {
  const now = Date.now();
  
  // Если квестов нет или время сброса прошло — создаём новые
  if (!dbQuests || !dbQuests.resetAt || dbQuests.resetAt < now) {
    const emptyProgress: Record<string, number> = {};
    const emptyClaimed: Record<string, boolean> = {};
    
    Object.keys(QUESTS_CONFIG).forEach(key => {
      emptyProgress[key] = 0;
      emptyClaimed[key] = false;
    });

    return {
      resetAt: now + 24 * 60 * 60 * 1000, // Сброс через 24 часа
      progress: emptyProgress,
      claimed: emptyClaimed,
    };
  }
  
  return dbQuests as QuestData;
}