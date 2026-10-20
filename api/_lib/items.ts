// api/_lib/items.ts

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemSlot = 'engine' | 'tires' | 'suspension' | 'ecu';

// Копия конфига машин для бэкенда
const CARS: Record<string, any> = {
  'audi-tt': { baseStats: { power: 100, topSpeed: 150, grip: 20, handling: 20 } },
  'bmw-m3': { baseStats: { power: 180, topSpeed: 220, grip: 40, handling: 35 } },
};

export interface ItemConfig {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: ItemRarity;
  stats: { power: number; topSpeed: number; grip: number; handling: number; };
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#aaaaaa', uncommon: '#00FF41', rare: '#00bfff', epic: '#b000ff', legendary: '#ffcc00'
};

export const ITEMS: Record<string, ItemConfig> = {
  'engine_1': { id: 'engine_1', name: 'Стоковый мотор', slot: 'engine', rarity: 'common', stats: { power: 20, topSpeed: 5, grip: 0, handling: 0 } },
  'engine_2': { id: 'engine_2', name: 'Турбо-кит Stage 1', slot: 'engine', rarity: 'uncommon', stats: { power: 50, topSpeed: 10, grip: 0, handling: 0 } },
  'engine_3': { id: 'engine_3', name: 'V8 Битурбо', slot: 'engine', rarity: 'rare', stats: { power: 120, topSpeed: 25, grip: 0, handling: 0 } },
  'engine_4': { id: 'engine_4', name: 'Двигатель от ГТР', slot: 'engine', rarity: 'epic', stats: { power: 250, topSpeed: 50, grip: 5, handling: 0 } },
  'engine_5': { id: 'engine_5', name: 'Прототип F1', slot: 'engine', rarity: 'legendary', stats: { power: 500, topSpeed: 100, grip: 10, handling: 10 } },
  'tires_1': { id: 'tires_1', name: 'Уличная резина', slot: 'tires', rarity: 'common', stats: { power: 0, topSpeed: 0, grip: 15, handling: 5 } },
  'tires_2': { id: 'tires_2', name: 'Полуслик', slot: 'tires', rarity: 'uncommon', stats: { power: 0, topSpeed: 2, grip: 35, handling: 10 } },
  'tires_3': { id: 'tires_3', name: 'Слик Michelin', slot: 'tires', rarity: 'rare', stats: { power: 0, topSpeed: 5, grip: 60, handling: 20 } },
  'tires_4': { id: 'tires_4', name: 'Дрифт-резина', slot: 'tires', rarity: 'epic', stats: { power: 0, topSpeed: 10, grip: 90, handling: 40 } },
  'tires_5': { id: 'tires_5', name: 'Нано-резина', slot: 'tires', rarity: 'legendary', stats: { power: 10, topSpeed: 20, grip: 150, handling: 80 } },
  'ecu_1': { id: 'ecu_1', name: 'Заводская прошивка', slot: 'ecu', rarity: 'common', stats: { power: 5, topSpeed: 5, grip: 0, handling: 10 } },
  'ecu_2': { id: 'ecu_2', name: 'Чип-тюнинг', slot: 'ecu', rarity: 'uncommon', stats: { power: 15, topSpeed: 10, grip: 0, handling: 20 } },
  'ecu_3': { id: 'ecu_3', name: 'Гоночный ECU', slot: 'ecu', rarity: 'rare', stats: { power: 30, topSpeed: 20, grip: 5, handling: 40 } },
  'ecu_4': { id: 'ecu_4', name: 'Хакерский блок', slot: 'ecu', rarity: 'epic', stats: { power: 60, topSpeed: 40, grip: 10, handling: 70 } },
  'ecu_5': { id: 'ecu_5', name: 'ИИ-Управление', slot: 'ecu', rarity: 'legendary', stats: { power: 100, topSpeed: 60, grip: 20, handling: 100 } },
  'susp_1': { id: 'susp_1', name: 'Стоковая подвеска', slot: 'suspension', rarity: 'common', stats: { power: 0, topSpeed: 0, grip: 5, handling: 15 } },
  'susp_2': { id: 'susp_2', name: 'Спорт-пружины', slot: 'suspension', rarity: 'uncommon', stats: { power: 0, topSpeed: 0, grip: 10, handling: 35 } },
  'susp_3': { id: 'susp_3', name: 'Винтовая подвеска', slot: 'suspension', rarity: 'rare', stats: { power: 0, topSpeed: 2, grip: 20, handling: 60 } },
  'susp_4': { id: 'susp_4', name: 'Пневмо-подвеска', slot: 'suspension', rarity: 'epic', stats: { power: 0, topSpeed: 5, grip: 40, handling: 90 } },
  'susp_5': { id: 'susp_5', name: 'Магнитная подвеска F1', slot: 'suspension', rarity: 'legendary', stats: { power: 10, topSpeed: 10, grip: 80, handling: 150 } },
};

export const ALL_ITEM_IDS = Object.keys(ITEMS);
export const RARITY_DROP_CHANCE: Record<string, number> = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };

export function calculateStats(
  equipped: Record<string, string | null>, 
  partUpgrades: Record<string, any> = {},
  activeCarId: string = 'audi-tt'
) {
  const carConfig = CARS[activeCarId] || CARS['audi-tt'];
  let base = { ...carConfig.baseStats };

  Object.values(equipped).forEach(itemId => {
    if (itemId && ITEMS[itemId]) {
      const item = ITEMS[itemId];
      const upg = partUpgrades[itemId] || { level: 0, goldStars: 0, redStars: 0 };
      
      const levelMulti = 1 + (upg.level * 0.02);
      const goldMulti = 1 + (upg.goldStars * 0.10);
      const redMulti = 1 + (upg.redStars * 0.25);
      const finalMulti = levelMulti * goldMulti * redMulti;

      base.power += Math.round(item.stats.power * finalMulti);
      base.topSpeed += Math.round(item.stats.topSpeed * finalMulti);
      base.grip += Math.round(item.stats.grip * finalMulti);
      base.handling += Math.round(item.stats.handling * finalMulti);
    }
  });

  const accel = Math.max(1.5, 7.0 - (base.power * 0.005) - (base.grip * 0.01));
  const rating = Math.round((base.power + base.topSpeed) / 2 + base.grip + base.handling);
  return { ...base, accel, rating };
}

export const SELL_PRICES: Record<ItemRarity, number> = {
  common: 100, uncommon: 500, rare: 2500, epic: 15000, legendary: 75000,
};