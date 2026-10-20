import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreatePass, PASS_LEVELS } from '../pass.js';

export async function claimPassRewardHandler(req: any, res: any) {
  try {
    const { initData, level } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const pass = getOrCreatePass(user.weeklyPass);
    const levelConfig = PASS_LEVELS.find(l => l.level === level);

    if (!levelConfig) return res.status(400).json({ error: 'Уровень не найден' });
    if (pass.xp < levelConfig.xpReq) return res.status(400).json({ error: 'Недостаточно опыта' });
    if (pass.claimed.includes(level)) return res.status(400).json({ error: 'Уже получено' });

    // Начисляем
    pass.claimed.push(level);
    const newBalance = user.balance + levelConfig.reward;
    const newTotalEarned = user.totalEarned + levelConfig.reward;

    await db.update(users).set({ 
      balance: newBalance, 
      totalEarned: newTotalEarned,
      weeklyPass: pass 
    }).where(eq(users.id, user.id));

    return res.json({ success: true, newBalance, pass });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}