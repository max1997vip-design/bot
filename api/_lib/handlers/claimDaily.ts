import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

// Награды за 1-7 день
const DAILY_REWARDS = [1000, 2500, 5000, 10000, 25000, 50000, 100000];

export async function claimDailyHandler(req: any, res: any) {
  const { initData } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
    
    // Проверяем, прошло ли 24 часа
    if (lastClaim && (now.getTime() - lastClaim.getTime()) < 24 * 60 * 60 * 1000) {
      return res.status(400).json({ error: 'Награда еще не готова' });
    }

    // Считаем стрик (если прошло больше 48 часов, стрик сбрасывается)
    let newStreak = user.dailyStreak || 0;
    if (lastClaim && (now.getTime() - lastClaim.getTime()) < 48 * 60 * 60 * 1000) {
      newStreak = (newStreak % 7) + 1; 
    } else {
      newStreak = 1; // Сброс или первый заход
    }

    const reward = DAILY_REWARDS[newStreak - 1];

    const [updated] = await db.update(users)
      .set({ 
        balance: user.balance + reward, 
        dailyStreak: newStreak,
        lastDailyClaim: now 
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({ 
      success: true, 
      newBalance: updated.balance, 
      dailyStreak: updated.dailyStreak, 
      lastDailyClaim: updated.lastDailyClaim,
      reward 
    });
  } catch (error) {
    console.error('Claim Daily error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}