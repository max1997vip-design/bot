import { db } from '../db.js';
import { users, clans, clanMembers, clanBosses } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, sql, desc } from 'drizzle-orm';

export async function getClanBossHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    let [boss] = await db.select().from(clanBosses).where(eq(clanBosses.clanId, clanId));
    if (!boss) {
      const maxHp = 1000000;
      const [newBoss] = await db.insert(clanBosses).values({
        clanId: clanId, level: 1, currentHp: maxHp, maxHp: maxHp,
      }).returning();
      boss = newBoss;
    }

    // 👇 ПОЛУЧАЕМ СТАТИСТИКУ УРОНА 👇
    const damageStats = await db.select({
      userId: clanMembers.userId,
      damage: clanMembers.bossDamage,
      firstName: users.firstName,
    })
    .from(clanMembers)
    .innerJoin(users, eq(clanMembers.userId, users.id))
    .where(eq(clanMembers.clanId, clanId))
    .orderBy(desc(clanMembers.bossDamage)) // Сортируем от большего к меньшему
    .limit(10); // Берем топ-10, чтобы не перегружать UI

    return res.json({ success: true, boss, damageStats });
  } catch (e) {
    console.error('Get Boss error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

export async function attackClanBossHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    let [boss] = await db.select().from(clanBosses).where(eq(clanBosses.clanId, clanId));

    if (!boss) return res.status(404).json({ error: 'Босс не найден' });
    if (boss.currentHp <= 0) return res.status(400).json({ error: 'Босс уже повержен!' });

    const damage = (user.clickLevel || 1) * 500 + (user.rating || 100) * 10;
    const newHp = Math.max(0, boss.currentHp - damage);

    let isDefeated = false;
    let reward = 0;

    // Записываем урон игроку
    await db.update(clanMembers)
      .set({ bossDamage: sql`${clanMembers.bossDamage} + ${damage}` })
      .where(and(eq(clanMembers.userId, valid.user.id), eq(clanMembers.clanId, clanId)));

    if (newHp === 0) {
      isDefeated = true;
      reward = boss.level * 100000;
      
      await db.update(clans).set({ balance: sql`${clans.balance} + ${reward}` }).where(eq(clans.id, clanId));
      await db.update(clanMembers).set({ contribution: sql`${clanMembers.contribution} + ${reward}` }).where(eq(clanMembers.userId, valid.user.id));
      
      const nextHp = Math.floor(boss.maxHp * 1.5);
      await db.update(clanBosses).set({
        level: boss.level + 1, currentHp: nextHp, maxHp: nextHp, lastDefeatedAt: new Date()
      }).where(eq(clanBosses.clanId, clanId));

      // 👇 ОБНУЛЯЕМ УРОН ВСЕМ УЧАСТНИКАМ ДЛЯ НОВОГО БОССА 👇
      await db.update(clanMembers).set({ bossDamage: 0 }).where(eq(clanMembers.clanId, clanId));

    } else {
      await db.update(clanBosses).set({ currentHp: newHp }).where(eq(clanBosses.clanId, clanId));
    }

    const playerCoins = Math.floor(damage / 10);
    await db.update(users).set({ 
      balance: sql`${users.balance} + ${playerCoins}`,
      totalEarned: sql`${users.totalEarned} + ${playerCoins}`
    }).where(eq(users.id, valid.user.id));

    return res.json({ 
      success: true, damage, newHp, isDefeated, reward, playerCoins, newBalance: user.balance + playerCoins 
    });
  } catch (e) {
    console.error('Attack Boss error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}