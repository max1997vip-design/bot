// api/_lib/handlers/claimLevelReward.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { LEVEL_REWARDS, calcLevel } from '../../../src/config/levelRewards.js';

export async function claimLevelRewardHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const currentLevel = calcLevel(user.xp || 0);
    const lastClaimed = user.lastClaimedLevel || 1;

    // Если уровень не вырос — нечего забирать
    if (currentLevel <= lastClaimed) {
      return res.status(400).json({ error: 'Нет доступных наград' });
    }

    // Собираем все награды от lastClaimed+1 до currentLevel
    const rewardsToClaim = LEVEL_REWARDS.filter(
      r => r.level > lastClaimed && r.level <= currentLevel
    );

    // Если уровень вырос, но конкретных наград нет — просто обновляем lastClaimedLevel
    if (rewardsToClaim.length === 0) {
      await db.update(users).set({
        lastClaimedLevel: currentLevel,
      }).where(eq(users.id, user.id));

      return res.json({ 
        success: true, 
        claimed: [], 
        newBalance: user.balance,
        newStars: user.starsBalance,
        newLastClaimedLevel: currentLevel,
        message: 'Уровень повышен, но награды за него нет'
      });
    }

    // Суммируем награды
    const totalRubles = rewardsToClaim.reduce((sum, r) => sum + (r.rubles || 0), 0);
    const totalStars = rewardsToClaim.reduce((sum, r) => sum + (r.stars || 0), 0);
    
    // Кейсы — самый ценный вариант
    const bestCase = rewardsToClaim
      .filter(r => r.caseType)
      .sort((a, b) => {
        const rank = { hourly: 1, rare: 2, legendary: 3 };
        return (rank[b.caseType as keyof typeof rank] || 0) - (rank[a.caseType as keyof typeof rank] || 0);
      })[0]?.caseType;

    // Обновляем БД
    const [updated] = await db.update(users).set({
      balance: sql`${users.balance} + ${totalRubles}`,
      totalEarned: sql`${users.totalEarned} + ${totalRubles}`,
      starsBalance: sql`${users.starsBalance} + ${totalStars}`,
      lastClaimedLevel: currentLevel,
    }).where(eq(users.id, user.id)).returning();

    return res.json({
      success: true,
      claimed: rewardsToClaim,
      totalRubles,
      totalStars,
      caseType: bestCase || null,
      newBalance: updated.balance,
      newStars: updated.starsBalance,
      newTotalEarned: updated.totalEarned,
      newLastClaimedLevel: currentLevel,
    });
  } catch (e) {
    console.error('[claimLevelReward]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}