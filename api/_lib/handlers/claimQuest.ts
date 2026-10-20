import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreateQuests, QUESTS_CONFIG } from '../quests.js';

export async function claimQuestHandler(req: any, res: any) {
  try {
    const { initData, questId } = req.body;
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!validatedData || !validatedData.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const userId = validatedData.user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const quests = getOrCreateQuests(user.dailyQuests);
    const config = QUESTS_CONFIG[questId as keyof typeof QUESTS_CONFIG];

    if (!config) return res.status(400).json({ success: false, error: 'Квест не найден' });
    if (quests.claimed[questId]) return res.status(400).json({ success: false, error: 'Награда уже получена' });
    if ((quests.progress[questId] || 0) < config.target) return res.status(400).json({ success: false, error: 'Квест еще не выполнен' });

    // Начисляем награду
    quests.claimed[questId] = true;
    const newBalance = user.balance + config.reward;
    const newTotalEarned = (user.totalEarned || 0) + config.reward;

    const [updated] = await db.update(users)
      .set({ balance: newBalance, totalEarned: newTotalEarned, dailyQuests: quests })
      .where(eq(users.id, userId)).returning();

    return res.json({ success: true, newBalance: updated.balance, quests });
  } catch (error) {
    console.error('claimQuest error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}