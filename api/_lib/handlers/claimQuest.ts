import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreateQuests, QUESTS_CONFIG } from '../quests.js';

export async function claimQuestHandler(req: any, res: any) {
  const { initData, questId } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return res.status(404).json({ error: 'User not found' });

  const quests = getOrCreateQuests(user.dailyQuests);
  const config = QUESTS_CONFIG[questId as keyof typeof QUESTS_CONFIG];

  if (!config) return res.status(400).json({ error: 'Квест не найден' });
  if (quests.claimed[questId]) return res.status(400).json({ error: 'Награда уже получена' });
  if ((quests.progress[questId] || 0) < config.target) return res.status(400).json({ error: 'Квест еще не выполнен' });

  // Начисляем награду
  quests.claimed[questId] = true;
  const newBalance = user.balance + config.reward;

  const [updated] = await db.update(users)
    .set({ balance: newBalance, dailyQuests: quests })
    .where(eq(users.id, userId)).returning();

  return res.json({ success: true, newBalance: updated.balance, quests });
}