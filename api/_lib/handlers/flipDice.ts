// api/_lib/handlers/flipDice.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { eq, sql } from 'drizzle-orm';
import { effectiveChance, applyPityBonus, CASINO_LIMITS } from '../../../src/config/casinoFair.js';

export async function flipDiceHandler(req: any, res: any) {
  try {
    const { initData, betAmount, guess } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const bet = Math.floor(betAmount);
    if (!bet || bet < CASINO_LIMITS.minBet || bet > CASINO_LIMITS.maxBet) {
      return res.status(400).json({
        error: `Ставка должна быть от ${CASINO_LIMITS.minBet} до ${CASINO_LIMITS.maxBet.toLocaleString('ru-RU')} ₽`,
      });
    }

    const guessNum = Number(guess);
    if (!Number.isInteger(guessNum) || guessNum < 1 || guessNum > 6) {
      return res.status(400).json({ error: 'Угадайте число от 1 до 6' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.balance < bet) return res.status(400).json({ error: 'Недостаточно ₽' });

    // 💰 Античит + pity
    const baseChance = 1 / 6;
    const rawChance = effectiveChance(baseChance, bet);
    const winChance = applyPityBonus(user.casinoLossStreak || 0, rawChance);
    const isWin = Math.random() < winChance;

    // 🎲 Результат
    let roll: number;
    if (isWin) {
      roll = guessNum;
    } else {
      const others = [1, 2, 3, 4, 5, 6].filter((n) => n !== guessNum);
      roll = others[Math.floor(Math.random() * others.length)];
    }

    let newBalance = user.balance - bet;
    let payout = 0;
    if (isWin) {
      payout = Math.floor(bet * 5.5);
      newBalance += payout;
    }

    const newStreak = isWin ? 0 : Math.min(3, (user.casinoLossStreak || 0) + 1);

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
        'casino_dice',
        `Кубик: угадал ${guessNum} (+${payout.toLocaleString('ru-RU')} ₽)`
      );
    } else {
      await logTransaction(
        user.id,
        -bet,
        'casino_dice',
        `Кубик: выпало ${roll} (-${bet.toLocaleString('ru-RU')} ₽)`
      );
    }

    return res.json({
      success: true,
      roll,
      guess: guessNum,
      isWin,
      payout,
      newBalance: updated.balance,
      winChance,
      lossStreak: newStreak,
      bet,
    });
  } catch (e) {
    console.error('[flipDice]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}