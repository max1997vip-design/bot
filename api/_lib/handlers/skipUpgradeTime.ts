// api/_lib/handlers/skipUpgradeTime.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

const MAX_REDUCE_MS = 15 * 60 * 1000; // Максимум 15 минут за раз

export async function skipUpgradeTimeHandler(req: any, res: any) {
  try {
    const { initData, itemId, reduceMs } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const partUpg = { ...(user.partUpgrades || {}) };
    const currentUpg = partUpg[itemId];

    if (!currentUpg || !currentUpg.upgradingUntil) {
      return res.status(400).json({ error: 'Нет активного улучшения' });
    }

    if (currentUpg.upgradingUntil <= Date.now()) {
      return res.status(400).json({ error: 'Улучшение уже завершено' });
    }

    // Ограничиваем максимум 15 минутами за один просмотр
    const safeReduce = Math.min(Math.max(0, reduceMs || MAX_REDUCE_MS), MAX_REDUCE_MS);

    // Уменьшаем таймер
    const newUpgradingUntil = Math.max(Date.now(), currentUpg.upgradingUntil - safeReduce);
    partUpg[itemId] = {
      ...currentUpg,
      upgradingUntil: newUpgradingUntil,
    };

    await db.update(users).set({ partUpgrades: partUpg }).where(eq(users.id, user.id));

    // Если таймер теперь в прошлом — автоматически применяем результат
    let applied = false;
    if (newUpgradingUntil <= Date.now()) {
      if (currentUpg.upgradeType === 'level') partUpg[itemId].level += 1;
      if (currentUpg.upgradeType === 'gold') partUpg[itemId].goldStars += 1;
      if (currentUpg.upgradeType === 'red') partUpg[itemId].redStars += 1;
      partUpg[itemId].upgradingUntil = null;
      partUpg[itemId].upgradeType = null;
      await db.update(users).set({ partUpgrades: partUpg }).where(eq(users.id, user.id));
      applied = true;
    }

    return res.json({ 
      success: true, 
      partUpgrades: partUpg,
      applied,
      reducedMs: safeReduce,
    });
  } catch (e) {
    console.error('[skipUpgradeTime]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}