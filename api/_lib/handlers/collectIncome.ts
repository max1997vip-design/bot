// api/_lib/handlers/collectIncome.ts
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
    if (!user) return res.status(404).json({ error: 'User not found' });

    const businesses = { ...(user.businesses || {}) };
    const now = Date.now();
    let totalEarned = 0;
    let hasChanges = false;

    for (const [id, data] of Object.entries(businesses)) {
      const config = BUSINESSES[id];
      if (!config) continue;

      const timePassedMs = now - data.lastCollected;
      const hoursPassed = Math.min(timePassedMs / (1000 * 60 * 60), 24);

      if (hoursPassed > 0) {
        const incomePerHour = getBusinessIncome(config.baseIncomePerHour, data.level);
        const earned = Math.floor(incomePerHour * hoursPassed);

        if (earned > 0) {
          totalEarned += earned;
          businesses[id] = { ...data, lastCollected: now };
          hasChanges = true;
        }
      }
    }

    if (totalEarned === 0 || !hasChanges) {
      return res.json({ success: true, newBalance: user.balance, businesses: user.businesses, collected: 0 });
    }

    const [updated] = await db.update(users).set({ 
      balance: sql`${users.balance} + ${totalEarned}`,
      totalEarned: sql`${users.totalEarned} + ${totalEarned}`,
      earnedFromBusiness: sql`${users.earnedFromBusiness} + ${totalEarned}`, // 👈 ДОБАВЛЕНО
      businesses 
    }).where(eq(users.id, user.id)).returning();

    return res.json({ success: true, newBalance: updated.balance, businesses, collected: totalEarned });
  } catch (e) {
    console.error('Collect income error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}