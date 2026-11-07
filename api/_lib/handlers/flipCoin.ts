// api/_lib/handlers/flipCoin.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { eq, sql } from 'drizzle-orm';
import { effectiveChance, applyPityBonus, CASINO_LIMITS } from '../../../src/config/casinoFair.js';

export async function flipCoinHandler(req: any, res: any) {
  try {
    const { initData, betAmount, choice } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const bet = Math.floor(betAmount);
    if (!bet || bet < CASINO_LIMITS.minBet || bet > CASINO_LIMITS.maxBet) {
      return res.status(400).json({
        error: `Ставка должна быть от ${CASINO_LIMITS.minBet} до ${CASINO_LIMITS.maxBet.toLocaleString('ru-RU')} ₽`,
      });
    }
    if (!['heads', 'tails'].includes(choice)) {
      return res.status(400).json({ error: 'Неверный выбор' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.balance < bet) return res.status(400).json({ error: 'Недостаточно ₽' });

    // 💰 Античит + pity
    const baseChance = 0.5;
    const rawChance = effectiveChance(baseChance, bet);
    const winChance = applyPityBonus(user.casinoLossStreak || 0, rawChance);
    const isWin = Math.random() < winChance;

    const result: 'heads' | 'tails' = isWin ? choice : choice === 'heads' ? 'tails' : 'heads';

    let newBalance = user.balance - bet;
    let payout = 0;
    if (isWin) {
      payout = Math.floor(bet * 1.9);
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
        'casino_coinflip',
        `Монетка: выигрыш (+${payout.toLocaleString('ru-RU')} ₽)`
      );
    } else {
      await logTransaction(
        user.id,
        -bet,
        'casino_coinflip',
        `Монетка: проигрыш (-${bet.toLocaleString('ru-RU')} ₽)`
      );
    }

    return res.json({
      success: true,
      result,
      isWin,
      payout,
      newBalance: updated.balance,
      winChance,
      lossStreak: newStreak,
      bet,
    });
  } catch (e) {
    console.error('[flipCoin]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}