// api/_lib/handlers/claimPassReward.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreatePass, PASS_LEVELS, PassLevel } from '../pass.js';

export async function claimPassRewardHandler(req: any, res: any) {
  try {
    const { initData, level, track } = req.body; // 👈 track = 'free' или 'premium'
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const pass = getOrCreatePass(user.weeklyPass);
    const levelConfig = PASS_LEVELS.find((l: PassLevel) => l.level === level);

    if (!levelConfig) return res.status(400).json({ error: 'Уровень не найден' });
    if (pass.xp < levelConfig.xpReq) return res.status(400).json({ error: 'Недостаточно опыта' });

    let rewardAmount = levelConfig.reward;

    if (track === 'premium') {
      if (!pass.isPremium) return res.status(400).json({ error: 'Премиум пропуск не куплен' });
      if (pass.claimedPremium.includes(level)) return res.status(400).json({ error: 'Уже получено' });
      
      rewardAmount = levelConfig.reward * 3; // 👈 Х3 НАГРАДА
      pass.claimedPremium.push(level);
    } else {
      if (pass.claimed.includes(level)) return res.status(400).json({ error: 'Уже получено' });
      pass.claimed.push(level);
    }

    const newBalance = user.balance + rewardAmount;
    const newTotalEarned = user.totalEarned + rewardAmount;

    await db.update(users).set({ 
      balance: newBalance, 
      totalEarned: newTotalEarned,
      weeklyPass: pass 
    }).where(eq(users.id, user.id));

    return res.json({ success: true, newBalance, pass });
  } catch (e) {
    console.error('Claim pass error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}