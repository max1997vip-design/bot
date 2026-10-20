import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { BUSINESSES } from '../businesses.js';

export async function buyBusinessHandler(req: any, res: any) {
  try {
    const { initData, businessId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const config = BUSINESSES[businessId];
    if (!config) return res.status(400).json({ error: 'Бизнес не найден' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const businesses = { ...(user.businesses || {}) };
    if (businesses[businessId]) return res.status(400).json({ error: 'Уже куплено' });

    if (user.balance < config.baseCost) return res.status(400).json({ error: 'Недостаточно монет' });

    const newBalance = user.balance - config.baseCost;
    businesses[businessId] = {
      level: 1,
      lastCollected: Date.now()
    };

    await db.update(users).set({ balance: newBalance, businesses }).where(eq(users.id, user.id));
    return res.json({ success: true, newBalance, businesses });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}