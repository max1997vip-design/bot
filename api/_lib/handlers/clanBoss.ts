// api/_lib/handlers/clanBoss.ts
import { db } from '../db.js';
import { users, clans, clanMembers, clanBosses, clanBoosters } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { calcBossDamage, getClanStats } from '../clans.js';
import { eq, and, sql, desc, gt } from 'drizzle-orm';

export async function getClanBossHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));

    let [boss] = await db.select().from(clanBosses).where(eq(clanBosses.clanId, clanId));
    if (!boss) {
      const maxHp = 1_000_000;
      const [newBoss] = await db.insert(clanBosses).values({
        clanId, level: 1, currentHp: maxHp, maxHp,
      }).returning();
      boss = newBoss;
    }

    // 🎯 Активные бусты
    const activeBoosters = await db
      .select()
      .from(clanBoosters)
      .where(and(eq(clanBoosters.clanId, clanId), gt(clanBoosters.expiresAt, new Date())));

    const damageStats = await db.select({
      userId: clanMembers.userId,
      damage: clanMembers.bossDamage,
      firstName: users.firstName,
    })
    .from(clanMembers)
    .innerJoin(users, eq(clanMembers.userId, users.id))
    .where(eq(clanMembers.clanId, clanId))
    .orderBy(desc(clanMembers.bossDamage))
    .limit(10);

    return res.json({
      success: true,
      boss,
      damageStats,
      clan: {
        level: clan.level,
        bossDamageLevel: clan.bossDamageLevel || 0,
        balance: clan.balance,
      },
      activeBoosters,
    });
  } catch (e) {
    console.error('Get Boss error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// ⚔️ АТАКА БОССА — урон от clickLevel + прокачка клана + бусты
// ============================================================
export async function attackClanBossHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
    let [boss] = await db.select().from(clanBosses).where(eq(clanBosses.clanId, clanId));

    if (!boss) return res.status(404).json({ error: 'Босс не найден' });
    if (boss.currentHp <= 0) return res.status(400).json({ error: 'Босс уже повержен!' });

    // 🎯 Базовый урон = clickLevel × 50 × clanMultiplier × upgradeMultiplier
    const bossDamageLevel = clan.bossDamageLevel || 0;
    let baseDamage = calcBossDamage(user.clickLevel || 1, clan.level, bossDamageLevel);

    // 🎯 Буст урона по боссу (+50%)
    const bossDamageBooster = await db
      .select()
      .from(clanBoosters)
      .where(and(
        eq(clanBoosters.clanId, clanId),
        eq(clanBoosters.type, 'boss_damage'),
        gt(clanBoosters.expiresAt, new Date())
      ));
    if (bossDamageBooster.length > 0) {
      baseDamage = Math.floor(baseDamage * 1.5);
    }

    // 🎯 Крит по боссу (×2 с шансом 30%)
    const critBooster = await db
      .select()
      .from(clanBoosters)
      .where(and(
        eq(clanBoosters.clanId, clanId),
        eq(clanBoosters.type, 'boss_crit'),
        gt(clanBoosters.expiresAt, new Date())
      ));
    let isCrit = false;
    if (critBooster.length > 0 && Math.random() < 0.3) {
      baseDamage *= 2;
      isCrit = true;
    }

    // 🛡️ Кап 5% HP босса за удар
    const maxHit = Math.max(1000, Math.floor(boss.maxHp * 0.05));
    const damage = Math.min(baseDamage, maxHit);

    const newHp = Math.max(0, boss.currentHp - damage);

    let isDefeated = false;
    let reward = 0;

    await db
      .update(clanMembers)
      .set({ bossDamage: sql`${clanMembers.bossDamage} + ${damage}` })
      .where(and(eq(clanMembers.userId, valid.user.id), eq(clanMembers.clanId, clanId)));

    if (newHp === 0) {
      isDefeated = true;
      reward = boss.level * 100_000;

      await db.update(clans).set({ balance: sql`${clans.balance} + ${reward}` }).where(eq(clans.id, clanId));
      await db.update(clanMembers).set({ contribution: sql`${clanMembers.contribution} + ${reward}` }).where(eq(clanMembers.userId, valid.user.id));

      const nextHp = Math.floor(boss.maxHp * 1.5);
      await db.update(clanBosses).set({
        level: boss.level + 1, currentHp: nextHp, maxHp: nextHp, lastDefeatedAt: new Date()
      }).where(eq(clanBosses.clanId, clanId));

      await db.update(clanMembers).set({ bossDamage: 0 }).where(eq(clanMembers.clanId, clanId));
    } else {
      await db.update(clanBosses).set({ currentHp: newHp }).where(eq(clanBosses.clanId, clanId));
    }

    const playerCoins = Math.floor(damage / 10);
    await db.update(users).set({
      balance: sql`${users.balance} + ${playerCoins}`,
      totalEarned: sql`${users.totalEarned} + ${playerCoins}`,
    }).where(eq(users.id, valid.user.id));

    return res.json({
      success: true,
      damage,
      isCrit,
      newHp,
      isDefeated,
      reward,
      playerCoins,
      newBalance: user.balance + playerCoins,
    });
  } catch (e) {
    console.error('Attack Boss error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}