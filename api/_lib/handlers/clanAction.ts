// api/_lib/handlers/clanAction.ts
import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and } from 'drizzle-orm';
import { getClanStats } from '../clans.js';

export async function clanActionHandler(req: any, res: any) {
  try {
    const { initData, action, amount, targetId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = valid.user.id;
    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, userId));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    
    const myMember = memberRecord[0];
    const clanId = myMember.clanId;
    const myRole = myMember.role;

    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    // --- ДОНАТ ---
    if (action === 'donate') {
      if (!amount || amount <= 0) return res.status(400).json({ error: 'Неверная сумма' });
      if (user.balance < amount) return res.status(400).json({ error: 'Недостаточно монет' });

      await db.update(users).set({ balance: user.balance - amount }).where(eq(users.id, user.id));
      await db.update(clans).set({ balance: clan.balance + amount }).where(eq(clans.id, clan.id));
      await db.update(clanMembers)
        .set({ contribution: myMember.contribution + amount })
        .where(and(eq(clanMembers.userId, userId), eq(clanMembers.clanId, clanId)));

      return res.json({ success: true, newBalance: user.balance - amount, newClanBalance: clan.balance + amount });
    }

    // --- УЛУЧШЕНИЕ КЛАНА (только лидер) ---
    if (action === 'upgrade') {
      if (myRole !== 'leader') return res.status(403).json({ error: 'Только лидер может качать клан' });
      const nextStats = getClanStats(clan.level + 1);
      if (!nextStats) return res.status(400).json({ error: 'Достигнут максимальный уровень' });
      if (clan.balance < nextStats.upgradeCost) return res.status(400).json({ error: 'Недостаточно средств в казне' });

      await db.update(clans)
        .set({ balance: clan.balance - nextStats.upgradeCost, level: nextStats.level })
        .where(eq(clans.id, clan.id));

      return res.json({ success: true, newClanLevel: nextStats.level, newClanBalance: clan.balance - nextStats.upgradeCost });
    }

        // --- ПОКУПКА МЕСТА ---
    if (action === 'buySlot') {
      if (myRole !== 'leader') return res.status(403).json({ error: 'Только лидер может покупать места' });
      
      const SLOT_COST = 250000; // Цена одного места
      if (clan.balance < SLOT_COST) return res.status(400).json({ error: 'Недостаточно средств в казне' });
      
      // Лимит: например, максимум 10 купленных мест (настраивай по вкусу)
      if (clan.extraSlots >= 10) return res.status(400).json({ error: 'Достигнут лимит покупных мест' });

      await db.update(clans)
        .set({ balance: clan.balance - SLOT_COST, extraSlots: clan.extraSlots + 1 })
        .where(eq(clans.id, clan.id));

      return res.json({ success: true, newClanBalance: clan.balance - SLOT_COST });
    }
    
    // --- КИК УЧАСТНИКА (Лидер или Офицер) ---
    if (action === 'kick') {
      if (myRole === 'member') return res.status(403).json({ error: 'Недостаточно прав' });
      if (targetId === userId) return res.status(400).json({ error: 'Нельзя кикнуть себя' });

      const targetMember = await db.select().from(clanMembers).where(and(eq(clanMembers.userId, targetId), eq(clanMembers.clanId, clanId)));
      if (targetMember.length === 0) return res.status(404).json({ error: 'Игрок не в клане' });
      if (targetMember[0].role === 'leader') return res.status(403).json({ error: 'Нельзя кикнуть лидера' });
      if (targetMember[0].role === 'officer' && myRole !== 'leader') return res.status(403).json({ error: 'Офицер не может кикнуть офицера' });

      await db.delete(clanMembers).where(and(eq(clanMembers.userId, targetId), eq(clanMembers.clanId, clanId)));
      return res.json({ success: true });
    }

    // --- ПОВЫШЕНИЕ / ПОНИЖЕНИЕ (только лидер) ---
    if (action === 'setRole') {
      if (myRole !== 'leader') return res.status(403).json({ error: 'Только лидер может менять роли' });
      if (targetId === userId) return res.status(400).json({ error: 'Нельзя изменить свою роль' });
      
      const newRole = req.body.role; // 'officer' | 'member'
      if (!['officer', 'member'].includes(newRole)) return res.status(400).json({ error: 'Неверная роль' });

      await db.update(clanMembers).set({ role: newRole }).where(and(eq(clanMembers.userId, targetId), eq(clanMembers.clanId, clanId)));
      return res.json({ success: true });
    }

    // --- ПЕРЕДАЧА ЛИДЕРСТВА (только лидер) ---
    if (action === 'transfer') {
      if (myRole !== 'leader') return res.status(403).json({ error: 'Только лидер может передать клан' });
      if (targetId === userId) return res.status(400).json({ error: 'Вы уже лидер' });

      const targetMember = await db.select().from(clanMembers).where(and(eq(clanMembers.userId, targetId), eq(clanMembers.clanId, clanId)));
      if (targetMember.length === 0) return res.status(404).json({ error: 'Игрок не в клане' });

      // Меняем лидера в клане
      await db.update(clans).set({ leaderId: targetId }).where(eq(clans.id, clanId));
      // Меняем роли
      await db.update(clanMembers).set({ role: 'leader' }).where(eq(clanMembers.userId, targetId));
      await db.update(clanMembers).set({ role: 'member' }).where(eq(clanMembers.userId, userId));

      return res.json({ success: true });
    }

    // --- ВЫХОД ИЗ КЛАНА ---
    if (action === 'leave') {
      if (myRole === 'leader') {
        const members = await db.select().from(clanMembers).where(eq(clanMembers.clanId, clanId));
        if (members.length > 1) return res.status(400).json({ error: 'Передайте лидерство перед выходом' });
        // Если лидер один - удаляем клан
        await db.delete(clans).where(eq(clans.id, clanId));
      }
      await db.delete(clanMembers).where(eq(clanMembers.userId, userId));
      return res.json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    console.error('Clan Action error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}