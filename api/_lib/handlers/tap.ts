// api/_lib/handlers/tap.ts
import { db } from '../db.js';
import { users, userItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { ALL_ITEM_IDS, ITEMS, RARITY_DROP_CHANCE } from '../items.js';
import { getOrCreateQuests } from '../quests.js';
import { getOrCreatePass } from '../pass.js';

export async function tapHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { initData, amount, clicks } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const telegramId = validatedData.user.id;
  if (typeof amount !== 'number' || amount <= 0 || amount > 10000) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const clicksToAdd = typeof clicks === 'number' && clicks > 0 ? clicks : amount;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, telegramId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Реферальный бонус (1%)
    if (user.referredBy && amount > 0) {
      const referralBonus = Math.floor(amount * 0.01);
      if (referralBonus > 0) {
        await db.update(users).set({
          balance: sql`${users.balance} + ${referralBonus}`,
          totalEarned: sql`${users.totalEarned} + ${referralBonus}`,
          referralEarnings: sql`${users.referralEarnings} + ${referralBonus}`,
          earnedFromClicks: sql`${users.earnedFromClicks} + ${referralBonus}`,
          xp: sql`${users.xp} + 1`,
        }).where(eq(users.id, user.referredBy));
      }
    }

    const quests = getOrCreateQuests(user.dailyQuests);
    quests.progress.click_1000 = Math.min(1000, (quests.progress.click_1000 || 0) + amount);

    // 👇 ФИКС: XP за клик = фиксировано (не зависит от дохода)
    const pass = getOrCreatePass(user.weeklyPass);
    const xpPerClick = pass.isPremium ? 5 : 1;
    pass.xp += clicksToAdd * xpPerClick; // 👈 умножаем на КОЛИЧЕСТВО кликов

    const [updatedUser] = await db.update(users).set({
      balance: sql`${users.balance} + ${amount}`,
      totalEarned: sql`${users.totalEarned} + ${amount}`,
      earnedFromClicks: sql`${users.earnedFromClicks} + ${amount}`,
      totalClicks: sql`${users.totalClicks} + ${clicksToAdd}`,
      xp: sql`${users.xp} + ${clicksToAdd}`,
      lastOnlineAt: new Date(),
      dailyQuests: quests,
      weeklyPass: pass,
    }).where(eq(users.id, telegramId)).returning();

    let droppedItem = null;

    if (Math.random() < 0.05) {
      const roll = Math.random() * 100;
      let selectedRarity = 'common';
      let cumulative = 0;
      for (const [rarity, chance] of Object.entries(RARITY_DROP_CHANCE)) {
        cumulative += chance;
        if (roll <= cumulative) { selectedRarity = rarity; break; }
      }

      const possibleItems = ALL_ITEM_IDS.filter(id => ITEMS[id].rarity === selectedRarity);
      if (possibleItems.length > 0) {
        const randomItemId = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        const [newItem] = await db.insert(userItems).values({ userId: telegramId, itemId: randomItemId }).returning();
        droppedItem = { ...ITEMS[randomItemId], dbId: newItem.id };
      }
    }

    return res.status(200).json({
      success: true,
      newBalance: updatedUser.balance,
      newTotalEarned: updatedUser.totalEarned,
      totalClicks: updatedUser.totalClicks,
      earnedFromClicks: updatedUser.earnedFromClicks,
      xp: updatedUser.xp,
      droppedItem,
      quests,
      pass: updatedUser.weeklyPass,
    });
  } catch (error) {
    console.error('Tap error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}