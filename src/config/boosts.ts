// src/config/boosts.ts
export interface BoostConfig {
  id: 'boss_damage' | 'income' | 'boss_crit';
  name: string;
  description: string;
  iconName: 'Swords' | 'Coins' | 'Sparkles';
  color: string;
}

export const BOOSTS: BoostConfig[] = [
  {
    id: 'boss_damage',
    name: 'Урон по боссу',
    description: '+50% к урону всех членов клана на 24 часа',
    iconName: 'Swords',
    color: '#ff4444',
  },
  {
    id: 'income',
    name: 'Доход клана',
    description: '+30% к доходу всех членов клана на 24 часа',
    iconName: 'Coins',
    color: '#ffd700',
  },
  {
    id: 'boss_crit',
    name: 'Крит по боссу',
    description: 'Шанс ×2 урона по боссу на 24 часа',
    iconName: 'Sparkles',
    color: '#b000ff',
  },
];