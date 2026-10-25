import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

// Награды за 1-7 день
const DAILY_REWARDS = [1000, 2500, 5000, 10000, 25000, 50000, 100000];

// 👇 Вспомогательная функция для получения 00:00 по МСК (в формате UTC timestamp)
const getMskMidnight = (offsetDays = 0) => {
  const now = new Date();
  const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // Перевод в UTC+3
  mskTime.setUTCHours(0, 0, 0, 0); // Ставим 00:00
  mskTime.setUTCDate(mskTime.getUTCDate() + offsetDays); // Сдвигаем дни
  return mskTime.getTime() - 3 * 60 * 60 * 1000; // Возвращаем в UTC
};

export async function claimDailyHandler(req: any, res: any) {
  const { initData } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const lastClaimTime = user.lastDailyClaim ? new Date(user.lastDailyClaim).getTime() : 0;
    
    // Время начала сегодняшнего дня и вчерашнего дня по МСК
    const todayMidnightMsk = getMskMidnight(0);
    const yesterdayMidnightMsk = getMskMidnight(-1);

    // ❌ Если последний клейм был ПОСЛЕ сегодняшней полуночи — награда уже получена
    if (lastClaimTime >= todayMidnightMsk) {
      return res.status(400).json({ error: 'Награда еще не готова. Ждите 00:00 МСК.' });
    }

    // 📈 Считаем стрик
    let newStreak = user.dailyStreak || 0;
    
    // Если последний раз забирали ВЧЕРА (после вчерашней полуночи) — стрик продолжается
    if (lastClaimTime >= yesterdayMidnightMsk) {
      newStreak = (newStreak % 7) + 1; 
    } else {
      // Если пропустили день (или это первый заход) — стрик сбрасывается на 1
      newStreak = 1; 
    }

    const reward = DAILY_REWARDS[newStreak - 1];
    const now = new Date(); // Записываем текущее время (оно само сохранится в UTC)

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