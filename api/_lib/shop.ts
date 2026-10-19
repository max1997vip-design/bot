export type ShopItemType =
  | 'stars_balance'
  | 'coins'
  | 'battle_pass'
  | 'boost'
  | 'premium_car'
  | 'unlock_slots';

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  stars: number;
  type: ShopItemType;
  amount: number;
  bonus?: number;
}

export const SHOP_ITEMS: Record<string, ShopItem> = {
  stars_500: {
    id: 'stars_500',
    title: '500 звёзд',
    description: 'Премиум-валюта для редких покупок',
    stars: 20,
    type: 'stars_balance',
    amount: 500,
  },
  stars_3000: {
    id: 'stars_3000',
    title: '3000 звёзд (+10%)',
    description: 'Большой пакет с бонусом',
    stars: 100,
    type: 'stars_balance',
    amount: 3300,
    bonus: 10,
  },
  coins_100k: {
    id: 'coins_100k',
    title: '100 000 монет',
    description: 'Мгновенное ускорение прогресса',
    stars: 10,
    type: 'coins',
    amount: 100_000,
  },
  coins_1m: {
    id: 'coins_1m',
    title: '1 000 000 монет',
    description: 'Для серьёзных гонщиков',
    stars: 80,
    type: 'coins',
    amount: 1_000_000,
  },
  battle_pass_s1: {
    id: 'battle_pass_s1',
    title: 'Battle Pass — Сезон 1',
    description: 'Доступ к премиум-наградам сезона',
    stars: 150,
    type: 'battle_pass',
    amount: 1,
  },
  boost_x2_24h: {
    id: 'boost_x2_24h',
    title: 'Буст ×2 дохода',
    description: 'Удваивает весь доход на 24 часа',
    stars: 30,
    type: 'boost',
    amount: 2,
  },
};