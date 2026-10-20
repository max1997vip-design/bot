import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function claimUpgradeHandler(req: any, res: any) {
  try {
    const { initData, itemId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    const partUpg = { ...(user.partUpgrades || {}) };
    const currentUpg = partUpg[itemId];

    if (!currentUpg || !currentUpg.upgradingUntil || currentUpg.upgradingUntil > Date.now()) {
      return res.status(400).json({ error: 'Улучшение еще не завершено' });
    }

    // Применяем результат
    if (currentUpg.upgradeType === 'level') currentUpg.level += 1;
    if (currentUpg.upgradeType === 'gold') currentUpg.goldStars += 1;
    if (currentUpg.upgradeType === 'red') currentUpg.redStars += 1;

    currentUpg.upgradingUntil = null;
    currentUpg.upgradeType = null;
    partUpg[itemId] = currentUpg;

    await db.update(users).set({ partUpgrades: partUpg }).where(eq(users.id, user.id));
    return res.json({ success: true, partUpgrades: partUpg });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}