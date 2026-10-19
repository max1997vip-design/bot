import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function upgradeClickerHandler(req: any, res: any) {
  const { initData } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return res.status(404).json({ error: 'User not found' });

  const currentLevel = user.clickLevel || 1;
  const cost = Math.floor(1000 * Math.pow(1.5, currentLevel - 1));

  if (user.balance < cost) return res.status(400).json({ error: 'Недостаточно монет' });

  const [updated] = await db.update(users)
    .set({ balance: user.balance - cost, clickLevel: currentLevel + 1 })
    .where(eq(users.id, userId)).returning();

  return res.json({ success: true, newBalance: updated.balance, newClickLevel: updated.clickLevel });
}