export interface BusinessConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  baseIncomePerHour: number;
}

export const BUSINESSES: Record<string, BusinessConfig> = {
  coffee: { id: 'coffee', name: 'Кофейня', description: 'Быстрый кофе.', icon: '☕', baseCost: 10000, baseIncomePerHour: 500 },
  car_wash: { id: 'car_wash', name: 'Автомойка', description: 'Чистые машины.', icon: '🚿', baseCost: 50000, baseIncomePerHour: 3000 },
  parts_store: { id: 'parts_store', name: 'Магазин запчастей', description: 'Тюнинг.', icon: '🔧', baseCost: 250000, baseIncomePerHour: 15000 },
  gas_station: { id: 'gas_station', name: 'Заправка', description: 'Бензин.', icon: '⛽', baseCost: 1000000, baseIncomePerHour: 80000 },
  night_club: { id: 'night_club', name: 'Ночной клуб', description: 'Отдых.', icon: '🪩', baseCost: 10000000, baseIncomePerHour: 1000000 }
};

export const getBusinessUpgradeCost = (baseCost: number, currentLevel: number) => {
  return Math.floor(baseCost * Math.pow(1.6, currentLevel));
};

export const getBusinessIncome = (baseIncome: number, level: number) => {
  return Math.floor(baseIncome * level * (1 + (level - 1) * 0.2)); 
};