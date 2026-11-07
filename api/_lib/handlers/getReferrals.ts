// api/_lib/handlers/getReferrals.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function getReferralsHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // Находим всех пользователей, у которых referredBy === наш id
    const referrals = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        photoUrl: users.photoUrl,
        totalEarned: users.totalEarned,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.referredBy, valid.user.id));

    return res.json({ success: true, referrals });
  } catch (e) {
    console.error('Get referrals error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}