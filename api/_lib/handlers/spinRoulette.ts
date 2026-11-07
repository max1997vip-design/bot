// api/_lib/handlers/spinRoulette.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { eq, sql } from 'drizzle-orm';
import { effectiveChance, CASINO_LIMITS } from '../../../src/config/casinoFair.js';

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// 🎲 Взвешенный выбор для ЗЕРО (шанс 5.2%)
function pickZeroOrNumber(): number {
  // 5.2% — зеро, остальное — красное/чёрное
  if (Math.random() < 0.052) return 0;
  return Math.floor(Math.random() * 36) + 1;
}

export async function spinRouletteHandler(req: any, res: any) {
  try {
    const { initData, betAmount, betType } = req.body; // betType: 'red' | 'black' | 'zero'
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const bet = Math.floor(betAmount);
    if (!bet || bet < CASINO_LIMITS.minBet || bet > CASINO_LIMITS.maxBet) {
      return res.status(400).json({
        error: `Ставка должна быть от ${CASINO_LIMITS.minBet} до ${CASINO_LIMITS.maxBet.toLocaleString('ru-RU')} ₽`,
      });
    }
    if (!['red', 'black', 'zero'].includes(betType)) {
      return res.status(400).json({ error: 'Неверный тип ставки' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.balance < bet) return res.status(400).json({ error: 'Недостаточно ₽' });

    // 💰 Античит: эффективный шанс
    // Для красное/чёрное: базовый 18/37 = 0.486
    // Для зеро: базовый 1/37 = 0.027
    const baseChance = betType === 'zero' ? 1 / 37 : 18 / 37;
    const winChance = effectiveChance(baseChance, bet);

    const isWin = Math.random() < winChance;

    // 🎡 Результат: подгоняем под ожидаемый исход
    let result: number;
    if (betType === 'zero' && isWin) {
      result = 0;
    } else if (betType === 'red' && isWin) {
      const redArr = Array.from(RED_NUMBERS);
      result = redArr[Math.floor(Math.random() * redArr.length)];
    } else if (betType === 'black' && isWin) {
      result = BLACK_NUMBERS[Math.floor(Math.random() * BLACK_NUMBERS.length)];
    } else {
      // Проигрыш: выбираем любой исход, кроме «выигрышного»
      const losePool: number[] = [];
      if (betType !== 'zero') losePool.push(0);
      if (betType !== 'red') losePool.push(...Array.from(RED_NUMBERS));
      if (betType !== 'black') losePool.push(...BLACK_NUMBERS);
      // Если ставили на красное — не даём красное и т.д.
      const filtered = losePool.filter((n) => {
        if (betType === 'red' && RED_NUMBERS.has(n)) return false;
        if (betType === 'black' && BLACK_NUMBERS.includes(n)) return false;
        if (betType === 'zero' && n === 0) return false;
        return true;
      });
      result = filtered[Math.floor(Math.random() * filtered.length)];
    }

    // 💸 Начисление
    let newBalance = user.balance - bet;
    let payout = 0;
    if (isWin) {
      const multiplier = betType === 'zero' ? 14 : 2;
      payout = Math.floor(bet * multiplier);
      newBalance += payout;
    }

    const [updated] = await db
      .update(users)
      .set({
        balance: newBalance,
        totalEarned: isWin ? sql`${users.totalEarned} + ${payout}` : users.totalEarned,
      })
      .where(eq(users.id, user.id))
      .returning();

    const color = result === 0 ? 'zero' : RED_NUMBERS.has(result) ? 'red' : 'black';

    if (isWin) {
      await logTransaction(
        user.id,
        payout - bet,
        'casino_roulette',
        `Рулетка: выигрыш на ${betType === 'red' ? 'красное' : betType === 'black' ? 'чёрное' : 'зеро'} (+${payout.toLocaleString('ru-RU')} ₽)`
      );
    } else {
      await logTransaction(
        user.id,
        -bet,
        'casino_roulette',
        `Рулетка: выпало ${result} ${color === 'zero' ? '(зеро)' : color === 'red' ? '(красное)' : '(чёрное)'} (-${bet.toLocaleString('ru-RU')} ₽)`
      );
    }

    return res.json({
      success: true,
      result,
      color,
      betType,
      isWin,
      payout,
      newBalance: updated.balance,
      winChance,
      bet,
    });
  } catch (e) {
    console.error('[spinRoulette]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}