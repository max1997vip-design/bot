// src/config/cases.ts
// ⚠️ ВАЖНО: этот файл импортируется и клиентом (CaseModal), и сервером (openCase.ts).
// Не добавляй сюда ничего, что зависит от браузера (window, document, localStorage).

export interface CaseItemEntry {
  id: string;
  weight: number;
}

export interface CaseConfig {
  name: string;
  price: number;
  currency: 'coins' | 'stars' | 'ad';
  cooldownMs?: number;
  iconName:
    | 'Clapperboard'
    | 'Gift'
    | 'Trophy'
    | 'Gem'
    | 'Diamond'
    | 'Star';
  accentColor: string; // для рамки/подсветки таба
  items: CaseItemEntry[];
}

export const CASES: Record<string, CaseConfig> = {
  hourly: {
    name: 'Рекламный',
    price: 0,
    currency: 'ad',
    cooldownMs: 60 * 60 * 1000,
    iconName: 'Clapperboard',
    accentColor: '#00e5ff',
    items: [
      { id: 'coins_5000', weight: 25 },
      { id: 'coins_10000', weight: 25 },
      { id: 'coins_20000', weight: 15 },
      { id: 'engine_2', weight: 12 },
      { id: 'tires_2', weight: 8 },
      { id: 'ecu_2', weight: 8 },
      { id: 'susp_2', weight: 7 },
    ],
  },
  silver: {
    name: 'Серебряный',
    price: 25000,
    currency: 'coins',
    iconName: 'Gift',
    accentColor: '#c0c0c0',
    items: [
      { id: 'coins_10000', weight: 25 },
      { id: 'coins_25000', weight: 25 },
      { id: 'coins_40000', weight: 15 },
      { id: 'engine_2', weight: 12 },
      { id: 'tires_2', weight: 8 },
      { id: 'ecu_1', weight: 8 },
      { id: 'susp_2', weight: 7 },
    ],
  },
  gold: {
    name: 'Золотой',
    price: 100000,
    currency: 'coins',
    iconName: 'Trophy',
    accentColor: '#ffd700',
    items: [
      { id: 'coins_50000', weight: 25 },
      { id: 'coins_100000', weight: 25 },
      { id: 'coins_150000', weight: 15 },
      { id: 'engine_3', weight: 12 },
      { id: 'tires_3', weight: 8 },
      { id: 'ecu_3', weight: 8 },
      { id: 'susp_3', weight: 7 },
    ],
  },
  platinum: {
    name: 'Платиновый',
    price: 500000,
    currency: 'coins',
    iconName: 'Diamond',
    accentColor: '#00e5ff',
    items: [
      { id: 'coins_250000', weight: 25 },
      { id: 'coins_500000', weight: 25 },
      { id: 'coins_750000', weight: 15 },
      { id: 'engine_4', weight: 12 },
      { id: 'tires_4', weight: 8 },
      { id: 'ecu_4', weight: 8 },
      { id: 'susp_4', weight: 7 },
    ],
  },
  diamond: {
    name: 'Алмазный',
    price: 2000000,
    currency: 'coins',
    iconName: 'Gem',
    accentColor: '#b000ff',
    items: [
      { id: 'coins_1000000', weight: 25 },
      { id: 'coins_2000000', weight: 25 },
      { id: 'coins_3000000', weight: 15 },
      { id: 'engine_5', weight: 10 },
      { id: 'tires_5', weight: 8 },
      { id: 'ecu_5', weight: 8 },
      { id: 'susp_5', weight: 9 },
    ],
  },
  star_premium: {
    name: 'Звёздный',
    price: 50,
    currency: 'stars',
    iconName: 'Star',
    accentColor: '#ffd700',
    items: [
      { id: 'coins_2000000', weight: 20 },
      { id: 'coins_5000000', weight: 20 },
      { id: 'coins_10000000', weight: 15 },
      { id: 'engine_5', weight: 12 },
      { id: 'tires_5', weight: 11 },
      { id: 'ecu_5', weight: 12 },
      { id: 'susp_5', weight: 10 },
    ],
  },
};

export const CASE_KEYS = Object.keys(CASES);