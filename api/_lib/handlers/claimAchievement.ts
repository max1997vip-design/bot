// api/_lib/handlers/claimAchievement.ts
import { db } from '../db.js';
import { users, achievements } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and } from 'drizzle-orm';
import { ACHIEVEMENTS } from '../../../src/config/achievements.js';

export async function claimAchievementHandler(req: any, res: any) {
  try {
    const { initData, achievementId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 1. Находим конфиг достижения
    const config = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!config) return res.status(400).json({ error: 'Достижение не найдено' });

    // 2. Проверяем, не забрано ли уже
    const existing = await db.select().from(achievements)
      .where(and(eq(achievements.userId, user.id), eq(achievements.achievementId, achievementId)));
    
    if (existing.length > 0) return res.status(400).json({ error: 'Уже получено' });

    // 3. Проверяем, выполнено ли условие (защита от читов)
    if (!config.check(user)) return res.status(400).json({ error: 'Условие не выполнено' });

    // 4. Выдаем награду и записываем в БД
    const newBalance = user.balance + config.reward;
    const newTotalEarned = user.totalEarned + config.reward;

    await db.update(users).set({ 
      balance: newBalance, 
      totalEarned: newTotalEarned 
    }).where(eq(users.id, user.id));

    await db.insert(achievements).values({
      userId: user.id,
      achievementId: achievementId,
    });

    return res.json({ success: true, newBalance, reward: config.reward });
  } catch (e) {
    console.error('Claim achievement error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}