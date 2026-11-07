// api/_lib/handlers/badges.ts
import { db } from '../db.js';
import {
  users, userBadges, clanMembers, ownedCars, seasonProcessed,
} from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentSeasonId, getPrevSeasonId } from '../../../src/config/seasons.js';

// ============================================================
// ПОСТОЯННЫЕ БЕЙДЖИ — проверка + выдача
// ============================================================
export async function checkAndAwardBadges(userId: number) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return;

    // 👇 Машины из ОБОИХ источников (JSONB users.ownedCars + таблица owned_cars)
    const ownedFromTable = await db
      .select()
      .from(ownedCars)
      .where(eq(ownedCars.userId, userId));
    const ownedFromJson = user.ownedCars || [];
    const totalOwned = Math.max(ownedFromTable.length, ownedFromJson.length);

    // Уже имеющиеся бейджи
    const existing = await db
      .select({ badgeId: userBadges.badgeId })
      .from(userBadges)
      .where(eq(userBadges.userId, userId));
    const have = new Set(existing.map((b) => b.badgeId));

    const toAdd: string[] = [];

    // 🏆 Чемпион
    if ((user.totalWins || 0) >= 100 && !have.has('champion')) {
      toAdd.push('champion');
    }
    // 💰 Миллиардер
    if ((user.totalEarned || 0) >= 1_000_000_000 && !have.has('billionaire')) {
      toAdd.push('billionaire');
    }
    // ⚡ Кликер-маньяк
    if ((user.totalClicks || 0) >= 100_000 && !have.has('click_master')) {
      toAdd.push('click_master');
    }
    // 💎 Коллекционер (10+ машин)
    if (totalOwned >= 10 && !have.has('collector')) {
      toAdd.push('collector');
    }
    // 👑 Клан-лидер
    const leadership = await db
      .select()
      .from(clanMembers)
      .where(and(eq(clanMembers.userId, userId), eq(clanMembers.role, 'leader')));
    if (leadership.length > 0 && !have.has('clan_leader')) {
      toAdd.push('clan_leader');
    }
    // 🔥 Стрик 30
    if ((user.dailyStreak || 0) >= 30 && !have.has('streak_30')) {
      toAdd.push('streak_30');
    }
    // 🌟 Легенда (5+ других бейджей)
    const othersCount = have.size + toAdd.length;
    if (othersCount >= 5 && !have.has('legend')) {
      toAdd.push('legend');
    }

    if (toAdd.length > 0) {
      for (const badgeId of toAdd) {
        await db.insert(userBadges).values({
          userId,
          badgeId,
          seasonId: '',
        }).onConflictDoNothing();
      }
      console.log(`[checkAndAwardBadges] user ${userId} получил: ${toAdd.join(', ')}`);
    }
  } catch (e) {
    console.error('[checkAndAwardBadges]', e);
  }
}

// ============================================================
// 🔄 СЕЗОННЫЙ СБРОС + ВЫДАЧА ТОП-3 — вызывается при заходе игрока
// ============================================================
export async function processSeasonResetIfNeeded() {
  const currentSeason = getCurrentSeasonId();
  const prevSeason = getPrevSeasonId();

  try {
    const [processed] = await db
      .select()
      .from(seasonProcessed)
      .where(eq(seasonProcessed.seasonId, prevSeason));

    if (processed) {
      return { processed: false };
    }

    // === 1. Выдаём бейджи топ-3 за прошлый сезон ===
    const categories = ['totalClicks', 'balance', 'totalWins'] as const;

    const badgeForRank = (rank: number): string | null => {
      if (rank === 1) return 'season_top_1';
      if (rank === 2) return 'season_top_2';
      if (rank === 3) return 'season_top_3';
      return null;
    };

    for (const cat of categories) {
      const top = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.isBanned, false))
        .orderBy(desc((users as any)[cat]))
        .limit(3);

      for (let i = 0; i < top.length; i++) {
        const badgeId = badgeForRank(i + 1);
        if (!badgeId) continue;
        await db.insert(userBadges).values({
          userId: top[i].id,
          badgeId,
          seasonId: prevSeason,
        }).onConflictDoNothing();
      }
    }

    // === 2. Сбрасываем XP всем игрокам ===
    await db.update(users).set({
      weeklyPass: {
        seasonId: currentSeason,
        weekId: 0,
        xp: 0,
        isPremium: false,
        claimed: [],
        claimedPremium: [],
      } as any,
    });

    // === 3. Отмечаем, что прошлый сезон обработан ===
    await db.insert(seasonProcessed).values({ seasonId: prevSeason }).onConflictDoNothing();

    console.log(`[season] Обработан сезон ${prevSeason}, начался ${currentSeason}`);
    return { processed: true, prevSeason, currentSeason };
  } catch (e) {
    console.error('[processSeasonResetIfNeeded]', e);
    return { processed: false, error: String(e) };
  }
}

// ============================================================
// GET /api/game?action=getMyBadges
// ============================================================
export async function getMyBadgesHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // 1. Сезонная проверка (если нужно — сброс + выдача топ-3)
    await processSeasonResetIfNeeded();

    // 2. Проверка «постоянных» бейджей
    await checkAndAwardBadges(valid.user.id);

    const badges = await db
      .select({
        badgeId: userBadges.badgeId,
        seasonId: userBadges.seasonId,
        unlockedAt: userBadges.unlockedAt,
      })
      .from(userBadges)
      .where(eq(userBadges.userId, valid.user.id))
      .orderBy(desc(userBadges.unlockedAt));

    return res.json({ success: true, badges });
  } catch (e) {
    console.error('[getMyBadges]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// GET /api/game?action=getUserBadges
// ============================================================
export async function getUserBadgesHandler(req: any, res: any) {
  try {
    const { initData, targetUserId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const badges = await db
      .select({
        badgeId: userBadges.badgeId,
        seasonId: userBadges.seasonId,
        unlockedAt: userBadges.unlockedAt,
      })
      .from(userBadges)
      .where(eq(userBadges.userId, Number(targetUserId)))
      .orderBy(desc(userBadges.unlockedAt));

    return res.json({ success: true, badges });
  } catch (e) {
    console.error('[getUserBadges]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}