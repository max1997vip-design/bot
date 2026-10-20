import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { BUSINESSES, getBusinessIncome } from '../businesses.js';

export async function collectIncomeHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    const businesses = { ...(user.businesses || {}) };
    const now = Date.now();
    let totalEarned = 0;

    for (const [id, data] of Object.entries(businesses)) {
      const config = BUSINESSES[id];
      if (!config) continue;

      const timePassedMs = now - data.lastCollected;
      const hoursPassed = Math.min(timePassedMs / (1000 * 60 * 60), 24); // Кап 24 часа
      
      if (hoursPassed > 0) {
        const incomePerHour = getBusinessIncome(config.baseIncomePerHour, data.level);
        const earned = Math.floor(incomePerHour * hoursPassed);
        totalEarned += earned;
        
        // Обновляем время сбора, сохраняя остаток времени (если собрали раньше 24ч)
        // Чтобы не терять минуты, сдвигаем lastCollected на целые часы
        const hoursCollected = Math.floor(hoursPassed);
        businesses[id].lastCollected += hoursCollected * 60 * 60 * 1000;
      }
    }

    if (totalEarned === 0) return res.json({ success: true, newBalance: user.balance, businesses, collected: 0 });

    const newBalance = user.balance + totalEarned;
    const newTotalEarned = user.totalEarned + totalEarned;

    await db.update(users).set({ 
      balance: newBalance, 
      totalEarned: newTotalEarned,
      businesses 
    }).where(eq(users.id, user.id));

    return res.json({ success: true, newBalance, businesses, collected: totalEarned });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}