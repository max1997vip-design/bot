import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreatePass } from '../pass.js';

export async function getPassHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const pass = getOrCreatePass(user.weeklyPass);
    
    // Если неделя сменилась — сохраняем новый пустой пропуск
    if (pass.weekId !== (user.weeklyPass as any)?.weekId) {
      await db.update(users).set({ weeklyPass: pass }).where(eq(users.id, user.id));
    }

    return res.json({ success: true, pass });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}