// api/_lib/handlers/upgradeClicker.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

export async function upgradeClickerHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const clickLevel = user.clickLevel || 1;
    const cost = Math.floor(1000 * Math.pow(1.5, clickLevel - 1));

    if (user.balance < cost) {
      return res.status(400).json({ error: 'Недостаточно средств' });
    }

    const [updated] = await db.update(users).set({
      balance: sql`${users.balance} - ${cost}`,
      clickLevel: sql`${users.clickLevel} + 1`,
    }).where(eq(users.id, user.id)).returning();

    return res.json({
      success: true,
      newBalance: updated.balance,
      newClickLevel: updated.clickLevel, // 👈 ВАЖНО: возвращаем новый уровень
    });
  } catch (e) {
    console.error('[upgradeClicker]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}