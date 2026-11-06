// api/_lib/handlers/getAchievements.ts
import { db } from '../db.js';
import { users, achievements } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { ACHIEVEMENTS } from '../../../src/config/achievements.js';

export async function getAchievementsHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const unlockedRecords = await db.select().from(achievements).where(eq(achievements.userId, user.id));
    const unlockedIds = unlockedRecords.map(r => r.achievementId);

    const list = ACHIEVEMENTS.map(ach => {
      const isUnlocked = unlockedIds.includes(ach.id);
      const isCompleted = ach.check(user);

      return {
        id: ach.id,
        category: ach.category, // 👈 ДОБАВЛЕНО
        tier: ach.tier,         // 👈 ДОБАВЛЕНО
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        reward: ach.reward,
        isUnlocked,
        isCompleted,
      };
    });

    return res.json({ success: true, achievements: list });
  } catch (e) {
    console.error('Get achievements error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}