// api/_lib/handlers/claimAdReward.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq, sql } from 'drizzle-orm';
import { logTransaction } from '../logger.js';

export async function claimAdRewardHandler(req: any, res: any) {
  const userId = req.query.userId;
  if (!userId) return res.status(400).send('Missing userId');

  try {
    // Начисляем 5000 монет
    await db.update(users)
      .set({ 
        balance: sql`${users.balance} + 5000`,
        totalEarned: sql`${users.totalEarned} + 5000`
      })
      .where(eq(users.id, Number(userId)));

    // Логируем пополнение
    await logTransaction(Number(userId), 5000, 'ad_reward', 'Просмотр рекламы за вознаграждение');

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Ad reward error:', error);
    return res.status(500).send('Internal error');
  }
}