// src/config/items.ts
import { CARS } from './cars';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemSlot = 'engine' | 'tires' | 'suspension' | 'ecu';

export interface ItemConfig {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: ItemRarity;
  stats: { power: number; topSpeed: number; grip: number; handling: number; };
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#aaaaaa',
  uncommon: '#00FF41',
  rare: '#00bfff',
  epic: '#b000ff',
  legendary: '#ffcc00',
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
export const RARITY_DROP_CHANCE: Record<string, number> = {
  common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1,
};

// Константы капов и множителей (легко менять под баланс)
const MAX_POWER = 1800;      // потолок мощности, л.с.
const MAX_TOP_SPEED = 500;   // потолок скорости, км/ч
const MAX_POWER_BONUS = 1.5; // макс. +150% к мощности от прокачки
const MAX_SPEED_BONUS = 1.0; // макс. +100% к скорости от прокачки
const MIN_ACCEL = 1.2;       // минимальное время разгона 0-100, сек

/**
 * Убывающая отдача:
 *  raw=1 → 0.5   (прибавка 50%)
 *  raw=2 → 0.75  (прибавка 75%)
 *  raw=3 → 0.875 (прибавка 87.5%)
 *  raw=5 → 0.969 (прибавка 96.9%)
 *  Никогда не превысит 1.0.
 */
const diminishing = (raw: number) => 1 - Math.pow(2, -raw);

export function calculateStats(
  equipped: Record<string, string | null>, 
  partUpgrades: Record<string, any> = {},
  activeCarId: string = 'vaz-2107'
) {
  const carConfig = CARS[activeCarId] || CARS['vaz-2107'];
  const perf = carConfig.performance;

  // 1. Собираем "сырые" проценты от надетых деталей
  let rawPowerPct = 0;
  let rawSpeedPct = 0;
  let rawGripFlat = 0;
  let rawAccelPct = 0;

  Object.values(equipped).forEach((itemId) => {
    if (!itemId || !ITEMS[itemId]) return;
    const item = ITEMS[itemId];
    const upg = partUpgrades[itemId] || { level: 0, goldStars: 0, redStars: 0 };

    const levelMulti = 1 + (upg.level || 0) * 0.02;
    const goldMulti = 1 + (upg.goldStars || 0) * 0.10;
    const redMulti = 1 + (upg.redStars || 0) * 0.25;
    const finalMulti = levelMulti * goldMulti * redMulti;

    rawPowerPct += (item.stats.power / 100) * finalMulti;
    rawSpeedPct += (item.stats.topSpeed / 100) * finalMulti;
    rawGripFlat += (item.stats.grip / 100) * finalMulti * 50;
    rawAccelPct += ((item.stats.grip + item.stats.handling) / 100) * finalMulti;
  });

  // 2. Применяем убывающую отдачу
  const powerMultiplier = 1 + diminishing(rawPowerPct) * MAX_POWER_BONUS;
  const speedMultiplier = 1 + diminishing(rawSpeedPct) * MAX_SPEED_BONUS;

  let totalPower = perf.power * powerMultiplier;
  let totalTopSpeed = perf.topSpeed * speedMultiplier;
  let totalGrip = Math.min(100, perf.grip + rawGripFlat);

  // 3. Разгон: бонус от grip+handling, но не быстрее MIN_ACCEL
  const accelBonus = Math.min(0.6, diminishing(rawAccelPct) * 0.6);
  let totalAccel = Math.max(MIN_ACCEL, perf.accel * (1 - accelBonus));

  // 4. Жёсткие капы
  totalPower = Math.min(totalPower, MAX_POWER);
  totalTopSpeed = Math.min(totalTopSpeed, MAX_TOP_SPEED);

  // 5. Сводный рейтинг (для сортировки в гараже)
  const rating = Math.round(
    totalPower * 0.3 + totalTopSpeed * 2 + (10 - totalAccel) * 50 + totalGrip * 3
  );

  return {
    power: Math.round(totalPower),
    topSpeed: Math.round(totalTopSpeed),
    grip: Math.round(totalGrip),
    handling: Math.round(totalGrip * 1.05),
    accel: Math.round(totalAccel * 100) / 100,
    rating,
  };
}

export const SELL_PRICES: Record<ItemRarity, number> = {
  common: 100, uncommon: 500, rare: 2500, epic: 15000, legendary: 75000,
};