import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreateQuests } from '../quests.js';

export async function getQuestsHandler(req: any, res: any) {
  const { initData } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Приводим к any, чтобы TS не ругался на неизвестный тип JSONB
  const currentQuests = user.dailyQuests as any;
  const quests = getOrCreateQuests(currentQuests);
  
  // Если квесты сбросились, сохраняем новое состояние
  if (quests.resetAt !== currentQuests?.resetAt) {
    await db.update(users).set({ dailyQuests: quests }).where(eq(users.id, userId));
  }

  return res.json({ success: true, quests });
}