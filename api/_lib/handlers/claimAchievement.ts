// api/_lib/handlers/claimAchievement.ts
import { db } from '../db.js';
import { users, achievements } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql, and } from 'drizzle-orm';
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
    // 👇 XP за достижение (можно масштабировать по tier: 100 * tier)
    const xpReward = 100;

    const [updated] = await db.update(users).set({ 
      balance: sql`${users.balance} + ${config.reward}`,
      totalEarned: sql`${users.totalEarned} + ${config.reward}`,
      xp: sql`${users.xp} + ${xpReward}`,
    }).where(eq(users.id, user.id)).returning();

    await db.insert(achievements).values({
      userId: user.id,
      achievementId: achievementId,
    });

    return res.json({ 
      success: true, 
      newBalance: updated.balance,
      newTotalEarned: updated.totalEarned, // 👈 возвращаем
      xp: updated.xp, // 👈 возвращаем
      reward: config.reward,
      xpReward,
    });
  } catch (e) {
    console.error('Claim achievement error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}