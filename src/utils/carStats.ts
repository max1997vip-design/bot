// src/utils/carStats.ts
import { CarConfig, CARS } from '../config/cars';
import { ITEMS, ItemConfig } from '../config/items';
import { CarPhysics } from './raceEngine';

interface PartUpgrade {
  level: number;
  goldStars: number;
  redStars: number;
}

/**
 * Считает финальные характеристики машины с учётом прокачки.
 * 
 * Логика:
 *  - baseStats.performance машины (реальные км/ч) — это база.
 *  - Каждая деталь из equipped даёт ПРОЦЕНТНЫЙ бонус.
 *  - Уровни детали (level) и звёзды (gold/red) усиливают этот бонус.
 *  - Возвращает CarPhysics для simulateRacePhysics.
 */
export function getFinalCarStats(
  car: CarConfig,
  equipped: Record<string, string | null>,
  partUpgrades: Record<string, PartUpgrade> = {}
): CarPhysics {
  const perf = car.performance;

  // Стартовые значения = реальные характеристики машины
  let totalPower = perf.power;
  let totalTopSpeed = perf.topSpeed;
  let totalAccel = perf.accel;
  let totalGrip = perf.grip;

  // Складываем процентные бонусы от всех надетых деталей
  Object.values(equipped).forEach((itemId) => {
    if (!itemId || !ITEMS[itemId]) return;

    const item: ItemConfig = ITEMS[itemId];
    const upg = partUpgrades[itemId] || { level: 0, goldStars: 0, redStars: 0 };

    // Множитель прокачки детали (1.0 + бонусы)
    const levelMult = 1 + upg.level * 0.02;      // +2% за уровень
    const goldMult = 1 + upg.goldStars * 0.10;   // +10% за золотую звезду
    const redMult = 1 + upg.redStars * 0.25;     // +25% за красную звезду
    const totalMult = levelMult * goldMult * redMult;

    // Статы детали — это проценты от базы машины
    // (engine_3: power=120 → +120% к power, topSpeed=25 → +25% к topSpeed)
    totalPower *= 1 + (item.stats.power / 100) * totalMult;
    totalTopSpeed *= 1 + (item.stats.topSpeed / 100) * totalMult;
    totalGrip += (item.stats.grip / 100) * totalMult * 50; // grip в 0-100

    // ACCEL: детали, которые дают grip/handling, уменьшают время разгона
    const accelBonus = ((item.stats.grip + item.stats.handling) / 100) * totalMult;
    totalAccel = Math.max(1.0, totalAccel * (1 - accelBonus * 0.15));
  });

  return {
    power: Math.round(totalPower),
    topSpeed: Math.round(totalTopSpeed),
    accel: Math.round(totalAccel * 100) / 100,
    grip: Math.min(100, Math.round(totalGrip)),
    handling: Math.min(100, Math.round(totalGrip * 1.05)),
  };
}

/**
 * Возвращает итоговый рейтинг машины для отображения в гараже.
 */
export function getCarRating(stats: CarPhysics): number {
  return Math.round(
    stats.power * 0.3 +
    stats.topSpeed * 2 +
    (10 - stats.accel) * 50 +
    stats.grip * 3
  );
}