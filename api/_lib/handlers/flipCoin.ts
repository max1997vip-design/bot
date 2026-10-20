import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function flipCoinHandler(req: any, res: any) {
  try {
    const { initData, betAmount, choice } = req.body; // choice: 'heads' | 'tails'
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const bet = Math.floor(betAmount);
    if (!bet || bet < 100 || bet > 1000000) {
      return res.status(400).json({ error: 'Ставка должна быть от 100 до 1 000 000' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.balance < bet) return res.status(400).json({ error: 'Недостаточно монет' });

    // Списываем ставку
    let newBalance = user.balance - bet;
    
    // Сервер кидает монетку
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const isWin = result === choice;
    
    let payout = 0;
    if (isWin) {
      payout = Math.floor(bet * 1.9); // Коэффициент 1.9
      newBalance += payout;
    }

    const newTotalEarned = isWin ? user.totalEarned + payout : user.totalEarned;

    await db.update(users)
      .set({ balance: newBalance, totalEarned: newTotalEarned })
      .where(eq(users.id, user.id));

    return res.json({ 
      success: true, 
      result, 
      isWin, 
      payout, 
      newBalance 
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}