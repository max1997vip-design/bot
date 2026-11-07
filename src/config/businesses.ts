// src/config/businesses.ts
export interface BusinessConfig {
  id: string;
  name: string;
  description: string;
  iconName: 'Coffee' | 'Droplets' | 'Wrench' | 'Fuel' | 'Music';
  accentColor: string;
  baseCost: number;
  baseIncomePerHour: number;
}

export const BUSINESSES: Record<string, BusinessConfig> = {
  coffee: {
    id: 'coffee',
    name: 'Кофейня',
    description: 'Быстрый кофе для гонщиков.',
    iconName: 'Coffee',
    accentColor: '#c08457',
    baseCost: 10_000,
    baseIncomePerHour: 500,
  },
  car_wash: {
    id: 'car_wash',
    name: 'Автомойка',
    description: 'Чистые машины едут быстрее.',
    iconName: 'Droplets',
    accentColor: '#00e5ff',
    baseCost: 50_000,
    baseIncomePerHour: 3_000,
  },
  parts_store: {
    id: 'parts_store',
    name: 'Магазин запчастей',
    description: 'Продажа тюнинга.',
    iconName: 'Wrench',
    accentColor: '#ff8800',
    baseCost: 250_000,
    baseIncomePerHour: 15_000,
  },
  gas_station: {
    id: 'gas_station',
    name: 'Заправка',
    description: 'Бензин нужен всем.',
    iconName: 'Fuel',
    accentColor: '#00d97e',
    baseCost: 1_000_000,
    baseIncomePerHour: 80_000,
  },
  night_club: {
    id: 'night_club',
    name: 'Ночной клуб',
    description: 'Отдых после гонок.',
    iconName: 'Music',
    accentColor: '#b000ff',
    baseCost: 10_000_000,
    baseIncomePerHour: 1_000_000,
  },
};

export const getBusinessUpgradeCost = (baseCost: number, currentLevel: number) => {
  return Math.floor(baseCost * Math.pow(1.6, currentLevel));
};

export const getBusinessIncome = (baseIncome: number, level: number) => {
  return Math.floor(baseIncome * level * (1 + (level - 1) * 0.2));
};