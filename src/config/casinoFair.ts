// src/config/casinoFair.ts
// ⚠️ Импортируется и клиентом (CasinoScreen), и сервером (flipCoin/flipDice/spinRoulette).
// Не используй здесь ничего браузерного.

/**
 * Возвращает ЭФФЕКТИВНЫЙ шанс выигрыша с учётом античита.
 *
 * @param baseChance — базовый шанс (0.5 для монетки, 0.167 для кубика, 0.474 для рулетки)
 * @param bet — ставка игрока (в ₽)
 * @param threshold — «порог», после которого шанс падает (по умолчанию 10 000 ₽)
 * @param k — степень падения (0.35 — мягко, 0.5 — средне, 0.7 — жёстко)
 */
export function effectiveChance(
  baseChance: number,
  bet: number,
  threshold = 10_000,
  k = 0.5
): number {
  if (bet <= threshold) {
    // До порога — линейное падение (незначительное)
    const t = bet / threshold; // 0..1
    return baseChance * (1 - 0.05 * t); // до 5% от baseChance
  }
  // После порога — плавное падение по формуле
  const ratio = threshold / bet; // 1..0
  return baseChance * Math.pow(ratio, k);
}

/**
 * Возвращает минимальный и максимальный эффективный шанс для UI-подсказки.
 * Используется только клиентом.
 */
export function chanceRange(
  baseChance: number,
  threshold = 10_000,
  k = 0.5
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