// api/_lib/handlers/upgradeOffline.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

export async function upgradeOfflineHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const offlineLevel = user.offlineLevel || 1;
    const cost = Math.floor(5000 * Math.pow(1.8, offlineLevel - 1));

    if (user.balance < cost) {
      return res.status(400).json({ error: 'Недостаточно средств' });
    }

    const [updated] = await db.update(users).set({
      balance: sql`${users.balance} - ${cost}`,
      offlineLevel: sql`${users.offlineLevel} + 1`,
    }).where(eq(users.id, user.id)).returning();

    return res.json({
      success: true,
      newBalance: updated.balance,
      newOfflineLevel: updated.offlineLevel, // 👈 ВАЖНО
    });
  } catch (e) {
    console.error('[upgradeOffline]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}