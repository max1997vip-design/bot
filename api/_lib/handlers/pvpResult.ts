import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js'; // 👈 Добавили таблицы кланов
import { validateInitData } from '../telegram.js';
import { eq, sql, and } from 'drizzle-orm'; // 👈 Добавили and
import { getOrCreateQuests } from '../quests.js';
import { getOrCreatePass } from '../pass.js';

export async function pvpResultHandler(req: any, res: any) {
  const { initData, won, ratingDelta, coinsDelta } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const safeRating = Math.max(-100, Math.min(100, Math.round(ratingDelta ?? 0)));
    const safeCoins = Math.max(-10000, Math.min(10000, Math.round(coinsDelta ?? 0)));

    // ОБНОВЛЯЕМ КВЕСТЫ
    const quests = getOrCreateQuests(user.dailyQuests);
    if (won) {
      quests.progress.win_3 = Math.min(3, (quests.progress.win_3 || 0) + 1);
    }

    // ОБНОВЛЯЕМ ПРОПУСК (+50 XP за победу)
    const pass = getOrCreatePass(user.weeklyPass);
    if (won) {
      pass.xp += 50;
    }

    // 👇 ЛОГИКА КЛАНОВОГО НАЛОГА (10% от выигрыша) 👇
    let clanTax = 0;
    if (safeCoins > 0) {
      const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, userId));
      if (memberRecord.length > 0) {
        const clanId = memberRecord[0].clanId;
        clanTax = Math.floor(safeCoins * 0.10); // Берем 10%

        if (clanTax > 0) {
          // Начисляем в казну клана
          await db.update(clans)
            .set({ balance: sql`${clans.balance} + ${clanTax}` })
            .where(eq(clans.id, clanId));
          
          // Записываем вклад игроку
          await db.update(clanMembers)
            .set({ contribution: sql`${clanMembers.contribution} + ${clanTax}` })
            .where(and(eq(clanMembers.userId, userId), eq(clanMembers.clanId, clanId)));
        }
      }
    }
    // 👆 КОНЕЦ ЛОГИКИ КЛАНА 👆

    const [updated] = await db
      .update(users)
      .set({
        rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
        balance: sql`GREATEST(0, ${users.balance} + ${safeCoins})`,
        totalEarned: sql`${users.totalEarned} + ${Math.max(0, safeCoins)}`,
        dailyQuests: quests,
        weeklyPass: pass 
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      won: !!won,
      balance: updated.balance,
      rating: updated.rating,
      newBalance: updated.balance,
      newRating: updated.rating,
      quests,
      pass: updated.weeklyPass,
      clanTax // Возвращаем сумму налога на фронт (можешь вывести в уведомлении)
    });
  } catch (error) {
    console.error('[pvpResult]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}