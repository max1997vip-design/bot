// api/_lib/handlers/clanRequests.ts
import { db } from '../db.js';
import { users, clans, clanMembers, clanRequests } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { getClanStats } from '../clans.js';
import { eq, and, sql, desc, or } from 'drizzle-orm';

// ============================================================
// 1. Игрок подаёт заявку в клан
// ============================================================
export async function applyToClanHandler(req: any, res: any) {
  try {
    const { initData, clanId, message } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Проверяем, что игрок не в клане
    const inClan = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (inClan.length > 0) return res.status(400).json({ error: 'Вы уже в клане' });

    // Проверяем клан
    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
    if (!clan) return res.status(404).json({ error: 'Клан не найден' });
    if (clan.isOpen === false) return res.status(400).json({ error: 'Клан закрыт для заявок' });

    // Проверяем, не переполнен
    const membersCount = await db.select().from(clanMembers).where(eq(clanMembers.clanId, clanId));
    const stats = getClanStats(clan.level);
    const totalMax = (stats?.maxMembers || 5) + (clan.extraSlots || 0);
    if (membersCount.length >= totalMax) return res.status(400).json({ error: 'Клан переполнен' });

    // Проверяем, нет ли уже активной заявки
    const existing = await db.select().from(clanRequests).where(
      and(
        eq(clanRequests.clanId, clanId),
        eq(clanRequests.userId, valid.user.id),
        eq(clanRequests.direction, 'application'),
        eq(clanRequests.status, 'pending')
      )
    );
    if (existing.length > 0) return res.status(400).json({ error: 'Заявка уже отправлена' });

    // Создаём заявку
    await db.insert(clanRequests).values({
      clanId,
      userId: valid.user.id,
      direction: 'application',
      status: 'pending',
      createdBy: valid.user.id,
      message: message?.trim() || null,
    });

    return res.json({ success: true });
  } catch (e: any) {
    if (e.code === '23505') return res.status(400).json({ error: 'Заявка уже отправлена' });
    console.error('[applyToClan]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 2. Лидер/офицер приглашает игрока по username
// ============================================================
export async function inviteToClanHandler(req: any, res: any) {
  try {
    const { initData, targetUsername } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Проверяем, что приглашающий в клане и его роль >= officer
    const inviter = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (inviter.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    if (inviter[0].role === 'member') return res.status(403).json({ error: 'Недостаточно прав' });

    const clanId = inviter[0].clanId;

    // Находим игрока по username (убираем @)
    const cleanUsername = (targetUsername || '').replace(/^@/, '').trim();
    if (!cleanUsername) return res.status(400).json({ error: 'Укажите username' });

    const [targetUser] = await db.select().from(users).where(eq(users.username, cleanUsername));
    if (!targetUser) return res.status(404).json({ error: 'Игрок с таким username не найден' });
    if (targetUser.id === valid.user.id) return res.status(400).json({ error: 'Нельзя пригласить себя' });

    // Проверяем, что игрок не в клане
    const targetInClan = await db.select().from(clanMembers).where(eq(clanMembers.userId, targetUser.id));
    if (targetInClan.length > 0) return res.status(400).json({ error: 'Игрок уже в клане' });

    // Проверяем, что клан не переполнен
    const membersCount = await db.select().from(clanMembers).where(eq(clanMembers.clanId, clanId));
    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
    const stats = getClanStats(clan.level);
    const totalMax = (stats?.maxMembers || 5) + (clan.extraSlots || 0);
    if (membersCount.length >= totalMax) return res.status(400).json({ error: 'Клан переполнен' });

    // Проверяем, нет ли уже приглашения
    const existing = await db.select().from(clanRequests).where(
      and(
        eq(clanRequests.clanId, clanId),
        eq(clanRequests.userId, targetUser.id),
        eq(clanRequests.direction, 'invite'),
        eq(clanRequests.status, 'pending')
      )
    );
    if (existing.length > 0) return res.status(400).json({ error: 'Приглашение уже отправлено' });

    await db.insert(clanRequests).values({
      clanId,
      userId: targetUser.id,
      direction: 'invite',
      status: 'pending',
      createdBy: valid.user.id,
    });

    return res.json({ success: true, targetName: targetUser.firstName || targetUser.username });
  } catch (e: any) {
    if (e.code === '23505') return res.status(400).json({ error: 'Приглашение уже отправлено' });
    console.error('[inviteToClan]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 3. Получить мои запросы (входящие приглашения + мои заявки)
// ============================================================
export async function getMyClanRequestsHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Входящие приглашения в клан (кто-то пригласил меня)
    const invites = await db.select({
      id: clanRequests.id,
      clanId: clanRequests.clanId,
      clanName: clans.name,
      clanLevel: clans.level,
      createdAt: clanRequests.createdAt,
      expiresAt: clanRequests.expiresAt,
    })
      .from(clanRequests)
      .innerJoin(clans, eq(clanRequests.clanId, clans.id))
      .where(
        and(
          eq(clanRequests.userId, valid.user.id),
          eq(clanRequests.direction, 'invite'),
          eq(clanRequests.status, 'pending'),
          sql`${clanRequests.expiresAt} > NOW()`
        )
      )
      .orderBy(desc(clanRequests.createdAt));

    // Мои заявки в кланы (я подал заявку, жду)
    const applications = await db.select({
      id: clanRequests.id,
      clanId: clanRequests.clanId,
      clanName: clans.name,
      createdAt: clanRequests.createdAt,
      status: clanRequests.status,
    })
      .from(clanRequests)
      .innerJoin(clans, eq(clanRequests.clanId, clans.id))
      .where(
        and(
          eq(clanRequests.userId, valid.user.id),
          eq(clanRequests.direction, 'application'),
          or(
            eq(clanRequests.status, 'pending'),
            eq(clanRequests.status, 'declined')
          )
        )
      )
      .orderBy(desc(clanRequests.createdAt))
      .limit(10);

    return res.json({ success: true, invites, applications });
  } catch (e) {
    console.error('[getMyClanRequests]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 4. Принять приглашение / отклонить
// ============================================================
export async function respondToInviteHandler(req: any, res: any) {
  try {
    const { initData, requestId, accept } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Находим запрос
    const [request] = await db.select().from(clanRequests).where(eq(clanRequests.id, requestId));
    if (!request) return res.status(404).json({ error: 'Приглашение не найдено' });
    if (request.userId !== valid.user.id) return res.status(403).json({ error: 'Не ваше приглашение' });
    if (request.direction !== 'invite') return res.status(400).json({ error: 'Неверный тип запроса' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Уже обработано' });
    if (new Date(request.expiresAt) < new Date()) return res.status(400).json({ error: 'Приглашение истекло' });

    if (!accept) {
      await db.update(clanRequests).set({ status: 'declined' }).where(eq(clanRequests.id, requestId));
      return res.json({ success: true });
    }

    // Проверяем, что не в клане уже
    const inClan = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (inClan.length > 0) return res.status(400).json({ error: 'Вы уже в клане' });

    // Проверяем, что клан не переполнен
    const membersCount = await db.select().from(clanMembers).where(eq(clanMembers.clanId, request.clanId));
    const [clan] = await db.select().from(clans).where(eq(clans.id, request.clanId));
    if (!clan) return res.status(404).json({ error: 'Клан не найден' });
    const stats = getClanStats(clan.level);
    const totalMax = (stats?.maxMembers || 5) + (clan.extraSlots || 0);
    if (membersCount.length >= totalMax) return res.status(400).json({ error: 'Клан переполнен' });

    // Вступаем
    await db.insert(clanMembers).values({
      userId: valid.user.id,
      clanId: request.clanId,
      role: 'member',
    });
    await db.update(clanRequests).set({ status: 'accepted' }).where(eq(clanRequests.id, requestId));

    // Удаляем другие pending приглашения этого игрока
    await db.update(clanRequests)
      .set({ status: 'expired' })
      .where(and(
        eq(clanRequests.userId, valid.user.id),
        eq(clanRequests.status, 'pending'),
        eq(clanRequests.direction, 'invite')
      ));

    return res.json({ success: true });
  } catch (e) {
    console.error('[respondToInvite]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 5. Получить заявки в мой клан (для лидера/офицера)
// ============================================================
export async function getClanApplicationsHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Проверяем, что в клане и роль >= officer
    const member = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (member.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    if (member[0].role === 'member') return res.status(403).json({ error: 'Недостаточно прав' });

    const applications = await db.select({
      id: clanRequests.id,
      userId: clanRequests.userId,
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      photoUrl: users.photoUrl,
      level: users.level,
      xp: users.xp,
      message: clanRequests.message,
      createdAt: clanRequests.createdAt,
    })
      .from(clanRequests)
      .innerJoin(users, eq(clanRequests.userId, users.id))
      .where(
        and(
          eq(clanRequests.clanId, member[0].clanId),
          eq(clanRequests.direction, 'application'),
          eq(clanRequests.status, 'pending')
        )
      )
      .orderBy(desc(clanRequests.createdAt));

    return res.json({ success: true, applications });
  } catch (e) {
    console.error('[getClanApplications]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 6. Принять / отклонить заявку (лидер/офицер)
// ============================================================
export async function respondToApplicationHandler(req: any, res: any) {
  try {
    const { initData, requestId, accept } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Проверяем права
    const member = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (member.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    if (member[0].role === 'member') return res.status(403).json({ error: 'Недостаточно прав' });

    const [request] = await db.select().from(clanRequests).where(eq(clanRequests.id, requestId));
    if (!request) return res.status(404).json({ error: 'Заявка не найдена' });
    if (request.clanId !== member[0].clanId) return res.status(403).json({ error: 'Не ваш клан' });
    if (request.direction !== 'application') return res.status(400).json({ error: 'Неверный тип' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Уже обработано' });

    if (!accept) {
      await db.update(clanRequests).set({ status: 'declined' }).where(eq(clanRequests.id, requestId));
      return res.json({ success: true });
    }

    // Проверяем, что игрок не в клане
    const targetInClan = await db.select().from(clanMembers).where(eq(clanMembers.userId, request.userId));
    if (targetInClan.length > 0) {
      await db.update(clanRequests).set({ status: 'declined' }).where(eq(clanRequests.id, requestId));
      return res.status(400).json({ error: 'Игрок уже в клане' });
    }

    // Проверяем, что клан не переполнен
    const membersCount = await db.select().from(clanMembers).where(eq(clanMembers.clanId, request.clanId));
    const [clan] = await db.select().from(clans).where(eq(clans.id, request.clanId));
    const stats = getClanStats(clan.level);
    const totalMax = (stats?.maxMembers || 5) + (clan.extraSlots || 0);
    if (membersCount.length >= totalMax) return res.status(400).json({ error: 'Клан переполнен' });

    // Вступаем
    await db.insert(clanMembers).values({
      userId: request.userId,
      clanId: request.clanId,
      role: 'member',
    });
    await db.update(clanRequests).set({ status: 'accepted' }).where(eq(clanRequests.id, requestId));

    return res.json({ success: true });
  } catch (e) {
    console.error('[respondToApplication]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 7. Отменить свою заявку
// ============================================================
export async function cancelApplicationHandler(req: any, res: any) {
  try {
    const { initData, requestId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [request] = await db.select().from(clanRequests).where(eq(clanRequests.id, requestId));
    if (!request) return res.status(404).json({ error: 'Заявка не найдена' });
    if (request.userId !== valid.user.id) return res.status(403).json({ error: 'Не ваша заявка' });
    if (request.direction !== 'application') return res.status(400).json({ error: 'Неверный тип' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Уже обработано' });

    await db.update(clanRequests).set({ status: 'declined' }).where(eq(clanRequests.id, requestId));
    return res.json({ success: true });
  } catch (e) {
    console.error('[cancelApplication]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ============================================================
// 8. Поиск игроков (без клана) по username/имени — для приглашений
// ============================================================
export async function searchPlayersHandler(req: any, res: any) {
  try {
    const { initData, query } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Проверяем, что вызывающий в клане и роль >= officer
    const myMembership = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (myMembership.length === 0) return res.status(403).json({ error: 'Вы не в клане' });
    if (myMembership[0].role === 'member') return res.status(403).json({ error: 'Недостаточно прав' });

    const cleanQuery = (query || '').replace(/^@/, '').trim().toLowerCase();
    if (cleanQuery.length < 2) return res.status(400).json({ error: 'Минимум 2 символа' });

    // Ищем игроков, которые НЕ в клане
    const players = await db
      .select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        photoUrl: users.photoUrl,
        level: users.level,
        xp: users.xp,
      })
      .from(users)
      .where(
        and(
          // username ILIKE %query% OR firstName ILIKE %query%
          or(
            sql`LOWER(${users.username}) LIKE ${`%${cleanQuery}%`}`,
            sql`LOWER(${users.firstName}) LIKE ${`%${cleanQuery}%`}`
          ),
          // И НЕ в клане
          sql`NOT EXISTS (
            SELECT 1 FROM ${clanMembers} 
            WHERE ${clanMembers.userId} = ${users.id}
          )`,
          // И это не я
          sql`${users.id} != ${valid.user.id}`
        )
      )
      .limit(20);

    // Проверяем, кому уже отправлено приглашение
    const myClanId = myMembership[0].clanId;
    const existingInvites = await db
      .select({ userId: clanRequests.userId })
      .from(clanRequests)
      .where(
        and(
          eq(clanRequests.clanId, myClanId),
          eq(clanRequests.direction, 'invite'),
          eq(clanRequests.status, 'pending')
        )
      );
    const invitedIds = new Set(existingInvites.map(e => e.userId));

    return res.json({
      success: true,
      players: players.map(p => ({
        ...p,
        invited: invitedIds.has(p.id),
      })),
    });
  } catch (e) {
    console.error('[searchPlayers]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}