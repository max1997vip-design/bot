// src/config/badges.ts
export interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  iconName:
    | 'Trophy' | 'Medal' | 'Award' | 'Crown' | 'Gem'
    | 'Zap' | 'Car' | 'Flame' | 'Star' | 'Sparkles';
  color: string;
  seasonOnly?: boolean;
}

export const BADGES: Record<string, BadgeConfig> = {
  season_top_1: {
    id: 'season_top_1', name: 'Топ-1 сезона',
    description: 'Занять 1 место в топе по кликам, балансу или победам',
    iconName: 'Trophy', color: '#ffd700', seasonOnly: true,
  },
  season_top_2: {
    id: 'season_top_2', name: 'Топ-2 сезона',
    description: 'Занять 2 место в топе',
    iconName: 'Medal', color: '#c0c0c0', seasonOnly: true,
  },
  season_top_3: {
    id: 'season_top_3', name: 'Топ-3 сезона',
    description: 'Занять 3 место в топе',
    iconName: 'Award', color: '#cd7f32', seasonOnly: true,
  },
  champion: {
    id: 'champion', name: 'Чемпион',
    description: 'Одержать 100 побед в гонках',
    iconName: 'Trophy', color: '#ffd700',
  },
  billionaire: {
    id: 'billionaire', name: 'Миллиардер',
    description: 'Заработать 1 000 000 000 ₽',
    iconName: 'Gem', color: '#ffd700',
  },
  click_master: {
    id: 'click_master', name: 'Кликер-маньяк',
    description: 'Сделать 100 000 кликов',
    iconName: 'Zap', color: '#00e5ff',
  },
  collector: {
    id: 'collector', name: 'Коллекционер',
    description: 'Собрать 10 машин',
    iconName: 'Car', color: '#b000ff',
  },
  clan_leader: {
    id: 'clan_leader', name: 'Клан-лидер',
    description: 'Быть лидером клана',
    iconName: 'Crown', color: '#ffd700',
  },
  streak_30: {
    id: 'streak_30', name: 'Стрик 30',
    description: 'Заходить 30 дней подряд',
    iconName: 'Flame', color: '#ff4444',
  },
  legend: {
    id: 'legend', name: 'Легенда',
    description: 'Собрать 5 других бейджей',
    iconName: 'Star', color: '#ff00ff',
  },
};

export const BADGE_KEYS = Object.keys(BADGES);