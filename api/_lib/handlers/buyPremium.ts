// api/_lib/handlers/buyPremium.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreatePass } from '../pass.js';

const PREMIUM_PRICE = 500000;

export async function buyPremiumHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const pass = getOrCreatePass(user.weeklyPass);

    if (pass.isPremium) return res.status(400).json({ error: 'Премиум уже куплен на эту неделю' });
    if (user.balance < PREMIUM_PRICE) {
      return res.status(400).json({ error: `Недостаточно монет. Нужно: ${PREMIUM_PRICE}, у вас: ${user.balance}` });
    }

    const newBalance = user.balance - PREMIUM_PRICE;
    pass.isPremium = true;

    await db.update(users).set({ 
      balance: newBalance, 
      weeklyPass: pass 
    }).where(eq(users.id, user.id));

    return res.json({ success: true, newBalance, pass });
  } catch (e) {
    console.error('Buy Premium error:', e);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}