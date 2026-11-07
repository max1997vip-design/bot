// src/config/casinoFair.ts
// ⚠️ Импортируется и клиентом (CasinoScreen), и сервером (flipCoin/flipDice/spinRoulette).
// Не используй здесь ничего браузерного.

/**
 * Возвращает ЭФФЕКТИВНЫЙ шанс выигрыша с учётом античита.
 *
 * @param baseChance — базовый шанс (0.5 для монетки, 0.167 для кубика, 0.474 для рулетки)
 * @param bet — ставка игрока (в ₽)
 * @param threshold — «порог», после которого шанс падает (по умолчанию 50 000 ₽)
 * @param k — степень падения (0.25 — мягко, 0.4 — средне, 0.6 — жёстко)
 */
export function effectiveChance(
  baseChance: number,
  bet: number,
  threshold = 50_000,
  k = 0.25
): number {
  // «Пол» — не ниже 80% от базового шанса
  const floor = baseChance * 0.8;

  if (bet <= threshold) {
    // До порога — линейное падение (незначительное, до 5%)
    const t = bet / threshold;
    return baseChance * (1 - 0.05 * t);
  }

  // После порога — плавное падение по формуле
  const ratio = threshold / bet; // 1..0
  const computed = baseChance * Math.pow(ratio, k);

  // Не ниже «пола»
  return Math.max(floor, computed);
}

/**
 * Возвращает минимальный и максимальный эффективный шанс для UI-подсказки.
 */
export function chanceRange(
  baseChance: number,
  threshold = 50_000,
  k = 0.25
) {
  return {
    min: effectiveChance(baseChance, 1_000_000, threshold, k),
    max: effectiveChance(baseChance, 100, threshold, k),
  };
}

/**
 * Ограничения: минимальная и максимальная ставка.
 */
export const CASINO_LIMITS = {
  minBet: 100,
  maxBet: 1_000_000,
};

/**
 * Бонус за серию неудач: если игрок проиграл N раз подряд,
 * шанс выигрыша увеличивается.
 *
 * @param losses — сколько раз подряд проиграл
 * @param baseChance — базовый шанс (уже с античитом)
 */
export function applyPityBonus(losses: number, chance: number): number {
  if (losses <= 0) return chance;
  // +15% за каждый проигрыш, максимум +45% (3 проигрыша)
  const bonus = Math.min(0.45, losses * 0.15);
  return Math.min(1, chance * (1 + bonus));
}