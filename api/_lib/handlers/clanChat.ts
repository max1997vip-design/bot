import { db } from '../db.js';
import { users, clanMembers, clanMessages } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, desc, and } from 'drizzle-orm';

export async function getClanMessagesHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    // Берем последние 50 сообщений
    const messages = await db.select({
      id: clanMessages.id,
      message: clanMessages.message,
      createdAt: clanMessages.createdAt,
      userId: clanMessages.userId,
      firstName: users.firstName,
      username: users.username
    })
    .from(clanMessages)
    .innerJoin(users, eq(clanMessages.userId, users.id))
    .where(eq(clanMessages.clanId, clanId))
    .orderBy(desc(clanMessages.createdAt))
    .limit(50);

    // Переворачиваем, чтобы старые были сверху
    return res.json({ success: true, messages: messages.reverse() });
  } catch (e) {
    console.error('Get Chat error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

export async function sendClanMessageHandler(req: any, res: any) {
  try {
    const { initData, message } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    if (!message || message.trim().length === 0) return res.status(400).json({ error: 'Пустое сообщение' });
    if (message.length > 200) return res.status(400).json({ error: 'Слишком длинное сообщение' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    const clanId = memberRecord[0].clanId;

    await db.insert(clanMessages).values({
      clanId: clanId,
      userId: valid.user.id,
      message: message.trim(),
    });

    return res.json({ success: true });
  } catch (e) {
    console.error('Send Chat error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}