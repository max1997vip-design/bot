// src/config/achievements.ts

export type AchievementCategory = 'wealth' | 'racer' | 'clicker' | 'collector' | 'legend';
export type AchievementTier = 1 | 2 | 3 | 4 | 5;

export interface AchievementConfig {
  id: string;
  category: AchievementCategory;
  tier: AchievementTier;
  name: string;
  description: string;
  icon: string; // 👈 имя lucide-иконки (например, 'Coins', 'Trophy', 'Car')
  reward: number;
  check: (user: any) => boolean;
}

// ============= МЕТА-ИНФО КАТЕГОРИЙ =============
export const CATEGORY_META: Record<AchievementCategory, { name: string; icon: string; color: string }> = {
  wealth:    { name: 'Богатство',    icon: 'Coins',            color: '#ffd700' },
  racer:     { name: 'Гонщик',       icon: 'Flag',             color: '#00e5ff' },
  clicker:   { name: 'Кликер',       icon: 'MousePointerClick', color: '#00FF41' },
  collector: { name: 'Коллекционер', icon: 'Car',              color: '#ff8800' },
  legend:    { name: 'Легенда',      icon: 'Star',             color: '#ff00ff' },
};

// ============= TIER META =============
export const TIER_META: Record<AchievementTier, { name: string; color: string }> = {
  1: { name: 'Бронза',  color: '#cd7f32' },
  2: { name: 'Серебро', color: '#c0c0c0' },
  3: { name: 'Золото',  color: '#ffd700' },
  4: { name: 'Платина', color: '#00e5ff' },
  5: { name: 'Легенда', color: '#ff00ff' },
};

// ============= ВСЕ ДОСТИЖЕНИЯ =============
export const ACHIEVEMENTS: AchievementConfig[] = [
  // ========== 💰 БОГАТСТВО ==========
  {
    id: 'wealth_1', category: 'wealth', tier: 1,
    name: 'Первые шаги', description: 'Заработать 10,000 ₽',
    icon: 'Coins', reward: 5000,
    check: (user) => (user.totalEarned || 0) >= 10_000,
  },
  {
    id: 'wealth_2', category: 'wealth', tier: 2,
    name: 'Миллионер', description: 'Заработать 1,000,000 ₽',
    icon: 'Wallet', reward: 100_000,
    check: (user) => (user.totalEarned || 0) >= 1_000_000,
  },
  {
    id: 'wealth_3', category: 'wealth', tier: 3,
    name: 'Мультимиллионер', description: 'Заработать 100,000,000 ₽',
    icon: 'Gem', reward: 5_000_000,
    check: (user) => (user.totalEarned || 0) >= 100_000_000,
  },
  {
    id: 'wealth_4', category: 'wealth', tier: 4,
    name: 'Миллиардер', description: 'Заработать 1,000,000,000 ₽',
    icon: 'Crown', reward: 100_000_000,
    check: (user) => (user.totalEarned || 0) >= 1_000_000_000,
  },
  {
    id: 'wealth_5', category: 'wealth', tier: 5,
    name: 'Финансовая империя', description: 'Заработать 100,000,000,000 ₽',
    icon: 'Landmark', reward: 10_000_000_000,
    check: (user) => (user.totalEarned || 0) >= 100_000_000_000,
  },

  // ========== 👆 КЛИКЕР ==========
  {
    id: 'clicker_1', category: 'clicker', tier: 1,
    name: 'Новичок', description: 'Сделать 1,000 кликов',
    icon: 'Pointer', reward: 3_000,
    check: (user) => (user.totalClicks || 0) >= 1_000,
  },
  {
    id: 'clicker_2', category: 'clicker', tier: 2,
    name: 'Мастер клика', description: 'Прокачать силу клика до 25 уровня',
    icon: 'Zap', reward: 25_000,
    check: (user) => (user.clickLevel || 1) >= 25,
  },
  {
    id: 'clicker_3', category: 'clicker', tier: 3,
    name: 'Кликер-профи', description: 'Сделать 100,000 кликов',
    icon: 'Flame', reward: 250_000,
    check: (user) => (user.totalClicks || 0) >= 100_000,
  },
  {
    id: 'clicker_4', category: 'clicker', tier: 4,
    name: 'Кликер-маньяк', description: 'Прокачать силу клика до 100 уровня',
    icon: 'Rocket', reward: 5_000_000,
    check: (user) => (user.clickLevel || 1) >= 100,
  },
  {
    id: 'clicker_5', category: 'clicker', tier: 5,
    name: 'Бог кликов', description: 'Сделать 1,000,000 кликов',
    icon: 'Sparkles', reward: 50_000_000,
    check: (user) => (user.totalClicks || 0) >= 1_000_000,
  },

  // ========== 🏁 ГОНЩИК ==========
  {
    id: 'racer_1', category: 'racer', tier: 1,
    name: 'Первая победа', description: 'Выиграть 1 гонку',
    icon: 'Flag', reward: 2_000,
    check: (user) => (user.totalWins || 0) >= 1,
  },
  {
    id: 'racer_2', category: 'racer', tier: 2,
    name: 'Опытный гонщик', description: 'Достичь 500 рейтинга',
    icon: 'Gauge', reward: 25_000,
    check: (user) => (user.rating || 0) >= 500,
  },
  {
    id: 'racer_3', category: 'racer', tier: 3,
    name: 'Чемпион', description: 'Выиграть 100 гонок',
    icon: 'Trophy', reward: 500_000,
    check: (user) => (user.totalWins || 0) >= 100,
  },
  {
    id: 'racer_4', category: 'racer', tier: 4,
    name: 'Легенда трека', description: 'Достичь 5,000 рейтинга',
    icon: 'Medal', reward: 10_000_000,
    check: (user) => (user.rating || 0) >= 5_000,
  },
  {
    id: 'racer_5', category: 'racer', tier: 5,
    name: 'Король дорог', description: 'Выиграть 1,000 гонок',
    icon: 'Award', reward: 100_000_000,
    check: (user) => (user.totalWins || 0) >= 1_000,
  },

  // ========== 🚗 КОЛЛЕКЦИОНЕР ==========
  {
    id: 'collector_1', category: 'collector', tier: 1,
    name: 'Первый конь', description: 'Купить 2 машины',
    icon: 'Car', reward: 5_000,
    check: (user) => (user.ownedCars || []).length >= 2,
  },
  {
    id: 'collector_2', category: 'collector', tier: 2,
    name: 'Коллекционер', description: 'Купить 5 машин',
    icon: 'CarFront', reward: 50_000,
    check: (user) => (user.ownedCars || []).length >= 5,
  },
  {
    id: 'collector_3', category: 'collector', tier: 3,
    name: 'Автомагнат', description: 'Купить 15 машин',
    icon: 'CarTaxiFront', reward: 500_000,
    check: (user) => (user.ownedCars || []).length >= 15,
  },
  {
    id: 'collector_4', category: 'collector', tier: 4,
    name: 'Автомузей', description: 'Купить 30 машин',
    icon: 'Warehouse', reward: 10_000_000,
    check: (user) => (user.ownedCars || []).length >= 30,
  },
  {
    id: 'collector_5', category: 'collector', tier: 5,
    name: 'Император гаражей', description: 'Купить ВСЕ машины',
    icon: 'Crown', reward: 100_000_000,
    check: (user) => (user.ownedCars || []).length >= 50,
  },

  // ========== ⭐ ЛЕГЕНДА ==========
  {
    id: 'legend_1', category: 'legend', tier: 1,
    name: 'Тюнер', description: 'Прокачать любую деталь до 10 уровня',
    icon: 'Wrench', reward: 20_000,
    check: (user) => Object.values(user.partUpgrades || {}).some((u: any) => u.level >= 10),
  },
  {
    id: 'legend_2', category: 'legend', tier: 2,
    name: 'Механик', description: 'Прокачать 3 детали до 20 уровня',
    icon: 'Cog', reward: 250_000,
    check: (user) => Object.values(user.partUpgrades || {}).filter((u: any) => u.level >= 20).length >= 3,
  },
  {
    id: 'legend_3', category: 'legend', tier: 3,
    name: 'Инженер', description: 'Прокачать ВСЕ детали до 15 уровня',
    icon: 'Hammer', reward: 2_000_000,
    check: (user) => {
      const upgrades = Object.values(user.partUpgrades || {});
      return upgrades.length >= 4 && upgrades.every((u: any) => u.level >= 15);
    },
  },
  {
    id: 'legend_4', category: 'legend', tier: 4,
    name: 'Вице-президент', description: 'Внести 1,000,000 вклада в клан',
    icon: 'Shield', reward: 15_000_000,
    check: (user) => (user.clanContribution || 0) >= 1_000_000,
  },
  {
    id: 'legend_5', category: 'legend', tier: 5,
    name: 'Икона гонок', description: '1B ₽, 10k кликов, 100 побед, 10 машин',
    icon: 'Star', reward: 500_000_000,
    check: (user) => 
      (user.totalEarned || 0) >= 1_000_000_000 &&
      (user.totalClicks || 0) >= 10_000 &&
      (user.totalWins || 0) >= 100 &&
      (user.ownedCars || []).length >= 10,
  },
];