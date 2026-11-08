// api/_lib/handlers/clanBoosters.ts
import { db } from '../db.js';
import { users, clans, clanMembers, clanBoosters, clanBoosterVotes } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { getBoosterCost, getBoosterMultiplier, getClanStats } from '../clans.js';
import { eq, and, gt, sql } from 'drizzle-orm';

type BoosterType = 'boss_damage' | 'income' | 'boss_crit';

// ============================================================
// 🚀 Инициировать буст (лидер) — из казны + помощь 2 членов
// ============================================================
export async function initiateBoosterHandler(req: any, res: any) {
  try {
    const { initData, type } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    if (memberRecord[0].role !== 'leader') return res.status(403).json({ error: 'Только лидер может активировать бусты' });

    const clanId = memberRecord[0].clanId;
    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));

    const stats = getClanStats(clan.level);
    if (!stats || stats.maxBoosters === 0) {
      return res.status(400).json({ error: 'Бусты доступны с 2 уровня клана' });
    }

    // Проверка: нет ли уже активного буста того же типа
    const existing = await db.select().from(clanBoosters)
      .where(and(eq(clanBoosters.clanId, clanId), eq(clanBoosters.type, type), gt(clanBoosters.expiresAt, new Date())));
    if (existing.length > 0) return res.status(400).json({ error: 'Этот буст уже активен' });

    // Проверка: нет ли уже pending-заявки
    const pending = await db.select().from(clanBoosterVotes)
      .where(and(
        eq(clanBoosterVotes.clanId, clanId),
        eq(clanBoosterVotes.type, type),
        eq(clanBoosterVotes.status, 'pending'),
        gt(clanBoosterVotes.expiresAt, new Date())
      ));
    if (pending.length > 0) return res.status(400).json({ error: 'Заявка уже создана' });

    // Проверка: хватает ли денег в казне
    const cost = getBoosterCost(type as BoosterType);
    if (clan.balance < cost) return res.status(400).json({ error: 'Недостаточно средств в казне' });

    // 🎯 Создаём заявку — лидер + 2 члена = 3 голоса
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 час
    const [vote] = await db.insert(clanBoosterVotes).values({
      clanId,
      type,
      initiatedBy: valid.user.id,
      votes: [valid.user.id],
      cost,
      status: 'pending',
      expiresAt, // 👈 ОБЯЗАТЕЛЬНО
    }).returning();

    return res.json({ success: true, vote, needVotes: 2 });
  } catch (e) {
    console.error('[initiateBooster]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 🤝 Помочь с активацией (любой член клана)
// ============================================================
export async function voteBoosterHandler(req: any, res: any) {
  try {
    const { initData, voteId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    const [vote] = await db.select().from(clanBoosterVotes).where(eq(clanBoosterVotes.id, voteId));
    if (!vote) return res.status(404).json({ error: 'Заявка не найдена' });
    if (vote.clanId !== clanId) return res.status(403).json({ error: 'Не ваш клан' });
    if (vote.status !== 'pending') return res.status(400).json({ error: 'Заявка уже обработана' });
    if (new Date(vote.expiresAt) < new Date()) return res.status(400).json({ error: 'Заявка истекла' });

    if (vote.votes.includes(valid.user.id)) {
      return res.status(400).json({ error: 'Вы уже голосовали' });
    }

    const newVotes = [...vote.votes, valid.user.id];

    // Если набрали 3 голоса (лидер + 2 члена) — активируем
    if (newVotes.length >= 3) {
      const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
      if (clan.balance < vote.cost) {
        return res.status(400).json({ error: 'Недостаточно средств в казне' });
      }

      // Списываем из казны
      await db.update(clans).set({ balance: sql`${clans.balance} - ${vote.cost}` }).where(eq(clans.id, clanId));

      // Создаём буст
      const multiplier = getBoosterMultiplier(vote.type as BoosterType);
      await db.insert(clanBoosters).values({
        clanId,
        type: vote.type,
        value: String(multiplier),
        activatedBy: vote.initiatedBy,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      // Обновляем заявку
      await db.update(clanBoosterVotes).set({ votes: newVotes, status: 'activated' }).where(eq(clanBoosterVotes.id, voteId));

      return res.json({ success: true, activated: true });
    }

    // Иначе просто добавляем голос
    await db.update(clanBoosterVotes).set({ votes: newVotes }).where(eq(clanBoosterVotes.id, voteId));
    return res.json({ success: true, activated: false, votes: newVotes.length, needVotes: 3 - newVotes.length });
  } catch (e) {
    console.error('[voteBooster]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// ⭐ Активировать за звёзды (лидер, мгновенно)
// ============================================================
export async function instantBoosterHandler(req: any, res: any) {
  try {
    const { initData, type } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    if (memberRecord[0].role !== 'leader') return res.status(403).json({ error: 'Только лидер может активировать бусты' });

    const clanId = memberRecord[0].clanId;
    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));

    const STAR_COSTS: Record<BoosterType, number> = { boss_damage: 10, income: 15, boss_crit: 20 };
    const starCost = STAR_COSTS[type as BoosterType];

    if ((user.starsBalance || 0) < starCost) {
      return res.status(400).json({ error: `Нужно ${starCost} ⭐` });
    }

    // Проверка: нет ли уже активного
    const existing = await db.select().from(clanBoosters)
      .where(and(eq(clanBoosters.clanId, clanId), eq(clanBoosters.type, type), gt(clanBoosters.expiresAt, new Date())));
    if (existing.length > 0) return res.status(400).json({ error: 'Этот буст уже активен' });

    // Списываем звёзды
    await db.update(users).set({ starsBalance: sql`${users.starsBalance} - ${starCost}` }).where(eq(users.id, valid.user.id));

    // Создаём буст
    const multiplier = getBoosterMultiplier(type as BoosterType);
    const [booster] = await db.insert(clanBoosters).values({
      clanId,
      type,
      value: String(multiplier),
      activatedBy: valid.user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }).returning();

    return res.json({ success: true, booster, newStarsBalance: (user.starsBalance || 0) - starCost });
  } catch (e) {
    console.error('[instantBooster]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 📊 Получить все активные бусты + pending-заявки
// ============================================================
export async function getBoostersHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    const active = await db.select().from(clanBoosters)
      .where(and(eq(clanBoosters.clanId, clanId), gt(clanBoosters.expiresAt, new Date())));

    const pending = await db.select().from(clanBoosterVotes)
      .where(and(
        eq(clanBoosterVotes.clanId, clanId),
        eq(clanBoosterVotes.status, 'pending'),
        gt(clanBoosterVotes.expiresAt, new Date())
      ));

    return res.json({ success: true, active, pending });
  } catch (e) {
    console.error('[getBoosters]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 🎯 Прокачка урона босса (лидер)
// ============================================================
export async function upgradeBossDamageHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    if (memberRecord[0].role !== 'leader') return res.status(403).json({ error: 'Только лидер' });

    const clanId = memberRecord[0].clanId;
    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));

    const stats = getClanStats(clan.level);
    if (!stats || stats.maxBossDamageLevel === 0) {
      return res.status(400).json({ error: 'Прокачка доступна с 2 уровня клана' });
    }

    const currentLevel = clan.bossDamageLevel || 0;
    if (currentLevel >= stats.maxBossDamageLevel) {
      return res.status(400).json({ error: 'Достигнут максимальный уровень прокачки для этого клана' });
    }

    const cost = Math.floor(50_000 * Math.pow(1.4, currentLevel));
    if (clan.balance < cost) {
      return res.status(400).json({ error: 'Недостаточно средств в казне' });
    }

    await db.update(clans).set({
      balance: sql`${clans.balance} - ${cost}`,
      bossDamageLevel: currentLevel + 1,
    }).where(eq(clans.id, clanId));

    return res.json({ success: true, newBossDamageLevel: currentLevel + 1, newBalance: clan.balance - cost });
  } catch (e) {
    console.error('[upgradeBossDamage]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}