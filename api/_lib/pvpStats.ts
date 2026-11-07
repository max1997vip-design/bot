// api/_lib/pvpStats.ts
import { CARS } from '../../src/config/cars.js';
import { ITEMS } from '../../src/config/items.js';

export function getFinalCarStats(
  carId: string,
  equipped: Record<string, string | null>,
  partUpgrades: Record<string, any>
) {
  const car = CARS[carId] || CARS['vaz-2107'];
  const perf = car.performance;

  let totalPower = perf.power;
  let totalTopSpeed = perf.topSpeed;
  let totalAccel = perf.accel;
  let totalGrip = perf.grip;

  Object.values(equipped).forEach((itemId) => {
    if (!itemId) return;
    const item = ITEMS[itemId];
    if (!item) return;

    const upg = partUpgrades[itemId] || { level: 0, goldStars: 0, redStars: 0 };
    const mult =
      (1 + upg.level * 0.02) *
      (1 + upg.goldStars * 0.10) *
      (1 + upg.redStars * 0.25);

    totalPower *= 1 + (item.stats.power / 100) * mult;
    totalTopSpeed *= 1 + (item.stats.topSpeed / 100) * mult;
    totalGrip += (item.stats.grip / 100) * mult * 50;

    const accelBonus = ((item.stats.grip + item.stats.handling) / 100) * mult;
    totalAccel = Math.max(1.0, totalAccel * (1 - accelBonus * 0.15));
  });

  return {
    power: Math.round(totalPower),
    topSpeed: Math.round(totalTopSpeed),
    accel: Math.round(totalAccel * 100) / 100,
    grip: Math.min(100, Math.round(totalGrip)),
    handling: Math.min(100, Math.round(totalGrip * 1.05)),
    rating: Math.round(
      totalPower * 0.3 +
      totalTopSpeed * 2 +
      (10 - totalAccel) * 50 +
      totalGrip * 3
    ),
  };
}