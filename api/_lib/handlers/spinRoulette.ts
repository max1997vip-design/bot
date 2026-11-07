// api/_lib/handlers/spinRoulette.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { eq, sql } from 'drizzle-orm';
import { effectiveChance, applyPityBonus, CASINO_LIMITS } from '../../../src/config/casinoFair.js';

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export async function spinRouletteHandler(req: any, res: any) {
  try {
    const { initData, betAmount, betType } = req.body;
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

    // 💰 Античит + pity
    const baseChance = betType === 'zero' ? 1 / 37 : 18 / 37;
    const rawChance = effectiveChance(baseChance, bet);
    const winChance = applyPityBonus(user.casinoLossStreak || 0, rawChance);
    const isWin = Math.random() < winChance;

    // 🎡 Результат
    let result: number;
    if (betType === 'zero' && isWin) {
      result = 0;
    } else if (betType === 'red' && isWin) {
      const redArr = Array.from(RED_NUMBERS);
      result = redArr[Math.floor(Math.random() * redArr.length)];
    } else if (betType === 'black' && isWin) {
      result = BLACK_NUMBERS[Math.floor(Math.random() * BLACK_NUMBERS.length)];
    } else {
      const losePool: number[] = [];
      if (betType !== 'zero') losePool.push(0);
      if (betType !== 'red') losePool.push(...Array.from(RED_NUMBERS));
      if (betType !== 'black') losePool.push(...BLACK_NUMBERS);
      const filtered = losePool.filter((n) => {
        if (betType === 'red' && RED_NUMBERS.has(n)) return false;
        if (betType === 'black' && BLACK_NUMBERS.includes(n)) return false;
        if (betType === 'zero' && n === 0) return false;
        return true;
      });
      result = filtered[Math.floor(Math.random() * filtered.length)];
    }

    let newBalance = user.balance - bet;
    let payout = 0;
    if (isWin) {
      const multiplier = betType === 'zero' ? 14 : 2;
      payout = Math.floor(bet * multiplier);
      newBalance += payout;
    }

    const newStreak = isWin ? 0 : Math.min(3, (user.casinoLossStreak || 0) + 1);
    const color = result === 0 ? 'zero' : RED_NUMBERS.has(result) ? 'red' : 'black';

    const [updated] = await db
      .update(users)
      .set({
        balance: newBalance,
        totalEarned: isWin ? sql`${users.totalEarned} + ${payout}` : users.totalEarned,
        casinoLossStreak: newStreak,
      })
      .where(eq(users.id, user.id))
      .returning();

    if (isWin) {
      await logTransaction(
        user.id,
        payout - bet,
        'casino_roulette',
        `Рулетка: выигрыш на ${betType} (+${payout.toLocaleString('ru-RU')} ₽)`
      );
    } else {
      await logTransaction(
        user.id,
        -bet,
        'casino_roulette',
        `Рулетка: ${result} (-${bet.toLocaleString('ru-RU')} ₽)`
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
      lossStreak: newStreak,
      bet,
    });
  } catch (e) {
    console.error('[spinRoulette]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}