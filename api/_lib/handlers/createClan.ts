import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { CLAN_CREATE_COST } from '../clans.js';

export async function createClanHandler(req: any, res: any) {
  try {
    const { initData, name } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    if (!name || name.length < 3) return res.status(400).json({ error: 'Название слишком короткое' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (user.balance < CLAN_CREATE_COST) return res.status(400).json({ error: 'Недостаточно монет' });

    const alreadyInClan = await db.select().from(clanMembers).where(eq(clanMembers.userId, user.id));
    if (alreadyInClan.length > 0) return res.status(400).json({ error: 'Вы уже в клане' });

    // Списываем деньги
    await db.update(users).set({ balance: user.balance - CLAN_CREATE_COST }).where(eq(users.id, user.id));

    // Создаем клан
    const [newClan] = await db.insert(clans).values({ name, leaderId: user.id }).returning();
    
    // Добавляем лидера
    await db.insert(clanMembers).values({ userId: user.id, clanId: newClan.id, role: 'leader' });

    return res.json({ success: true, newBalance: user.balance - CLAN_CREATE_COST });
  } catch (e: any) {
    if (e.code === '23505') return res.status(400).json({ error: 'Клан с таким названием уже существует' });
    return res.status(500).json({ error: 'Internal error' });
  }
}