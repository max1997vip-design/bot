import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { BUSINESSES, getBusinessUpgradeCost } from '../businesses.js';

export async function upgradeBusinessHandler(req: any, res: any) {
  try {
    const { initData, businessId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const config = BUSINESSES[businessId];
    if (!config) return res.status(400).json({ error: 'Бизнес не найден' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    const businesses = { ...(user.businesses || {}) };
    const current = businesses[businessId];

    if (!current) return res.status(400).json({ error: 'Сначала купите бизнес' });

    const cost = getBusinessUpgradeCost(config.baseCost, current.level);
    if (user.balance < cost) return res.status(400).json({ error: 'Недостаточно монет' });

    const newBalance = user.balance - cost;
    businesses[businessId] = { ...current, level: current.level + 1 };

    await db.update(users).set({ balance: newBalance, businesses }).where(eq(users.id, user.id));
    return res.json({ success: true, newBalance, businesses });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}