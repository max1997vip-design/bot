import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function switchCarHandler(req: any, res: any) {
  try {
    const { initData, carId } = req.body;
    
    // Твоя авторизация
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });
    const userId = validatedData.user.id;

    if (!carId) return res.status(400).json({ error: 'carId required' });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const owned = user.ownedCars || ['audi-tt'];
    if (!owned.includes(carId)) {
      return res.status(403).json({ error: 'Car not owned' });
    }

    const [updated] = await db
      .update(users)
      .set({ activeCarId: carId })
      .where(eq(users.id, userId))
      .returning();

    return res.json({ activeCarId: updated.activeCarId });
  } catch (error) {
    console.error('[switchCar]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}