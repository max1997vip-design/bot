// src/utils/carStats.ts
import { CarConfig, CARS, RACE_BASE_REWARD, RACE_BASE_LOSE } from '../config/cars';
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

  let totalPower = perf.power;
  let totalTopSpeed = perf.topSpeed;
  let totalAccel = perf.accel;
  let totalGrip = perf.grip;

  Object.values(equipped).forEach((itemId) => {
    if (!itemId || !ITEMS[itemId]) return;

    const item: ItemConfig = ITEMS[itemId];
    const upg = partUpgrades[itemId] || { level: 0, goldStars: 0, redStars: 0 };

    const levelMult = 1 + upg.level * 0.02;
    const goldMult = 1 + upg.goldStars * 0.10;
    const redMult = 1 + upg.redStars * 0.25;
    const totalMult = levelMult * goldMult * redMult;

    totalPower *= 1 + (item.stats.power / 100) * totalMult;
    totalTopSpeed *= 1 + (item.stats.topSpeed / 100) * totalMult;
    totalGrip += (item.stats.grip / 100) * totalMult * 50;

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

/**
 * 🎯 Множитель к силе клика от текущей машины.
 */
export function getClickMultiplier(carId: string): number {
  const car = CARS[carId] || CARS['vaz-2107'];
  return car.clickMultiplier || 1.0;
}

/**
 * 🎯 Награда за победу в гонке = 500 × raceMultiplier.
 */
export function getRaceReward(carId: string): number {
  const car = CARS[carId] || CARS['vaz-2107'];
  return Math.floor(RACE_BASE_REWARD * (car.raceMultiplier || 1.0));
}

/**
 * 🎯 Награда за поражение в гонке = 50 × raceMultiplier.
 */
export function getRaceLoseReward(carId: string): number {
  const car = CARS[carId] || CARS['vaz-2107'];
  return Math.floor(RACE_BASE_LOSE * (car.raceMultiplier || 1.0));
}