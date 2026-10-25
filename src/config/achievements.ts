// src/config/achievements.ts

export interface AchievementConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  check: (user: any) => boolean;
}

export const ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: 'first_steps',
    name: 'Первые шаги',
    description: 'Заработать 10,000 монет',
    icon: '👶',
    reward: 5000,
    check: (user) => (user.totalEarned || 0) >= 10000,
  },
  {
    id: 'millionaire',
    name: 'Миллионер',
    description: 'Заработать 1,000,000 монет',
    icon: '💰',
    reward: 100000,
    check: (user) => (user.totalEarned || 0) >= 1000000,
  },
  {
    id: 'billionaire',
    name: 'Миллиардер',
    description: 'Заработать 1,000,000,000 монет',
    icon: '💎',
    reward: 10000000,
    check: (user) => (user.totalEarned || 0) >= 1000000000,
  },
  {
    id: 'collector',
    name: 'Коллекционер',
    description: 'Купить 5 машин',
    icon: '🚗',
    reward: 50000,
    check: (user) => (user.ownedCars || []).length >= 5,
  },
  {
    id: 'tycoon',
    name: 'Автомагнат',
    description: 'Купить 15 машин',
    icon: '🏎️',
    reward: 500000,
    check: (user) => (user.ownedCars || []).length >= 15,
  },
  {
    id: 'racer',
    name: 'Опытный гонщик',
    description: 'Достичь 500 рейтинга',
    icon: '🏁',
    reward: 25000,
    check: (user) => (user.rating || 0) >= 500,
  },
  {
    id: 'tuner',
    name: 'Тюнер',
    description: 'Прокачать любую деталь до 10 уровня',
    icon: '🔧',
    reward: 20000,
    check: (user) => Object.values(user.partUpgrades || {}).some((u: any) => u.level >= 10),
  },
  {
    id: 'clicker',
    name: 'Мастер клика',
    description: 'Прокачать силу клика до 25 уровня',
    icon: '👆',
    reward: 15000,
    check: (user) => (user.clickLevel || 1) >= 25,
  },
];