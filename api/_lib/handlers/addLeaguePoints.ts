
// api/_lib/handlers/addLeaguePoints.ts
import { db } from '../db.js';           // ← было ../../db.js
import { users } from '../schema.js';    // ← было ../../schema.js
import { validateInitData } from '../telegram.js'; // ← было ../../telegram.js
import { eq, sql } from 'drizzle-orm';

export async function addLeaguePointsHandler(req: any, res: any) {
  const { initData, points } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = validatedData.user.id;
  const safePoints = Math.max(-100, Math.min(100, Math.round(points ?? 0)));

  try {
    const [updated] = await db
      .update(users)
      .set({
        leaguePoints: sql`GREATEST(0, COALESCE(${users.leaguePoints}, 0) + ${safePoints})`,
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      success: true,
      newLeaguePoints: updated.leaguePoints ?? 0,
    });
  } catch (error) {
    console.error('[addLeaguePoints]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}