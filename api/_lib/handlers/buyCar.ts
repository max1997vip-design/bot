// api/_lib/handlers/buyCar.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { CARS } from '../../../src/config/cars.js'; // Импортируем конфиг, чтобы взять цену

export async function buyCarHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { initData, carId } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const carConfig = CARS[carId];
    if (!carConfig) return res.status(400).json({ error: 'Машина не найдена' });
    if (carConfig.price <= 0) return res.status(400).json({ error: 'Эту машину нельзя купить' });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const owned = user.ownedCars || ['audi-tt'];
    if (owned.includes(carId)) {
      return res.status(400).json({ error: 'У вас уже есть эта машина' });
    }

    if (user.balance < carConfig.price) {
      return res.status(400).json({ error: 'Недостаточно монет' });
    }

    // Списываем деньги и добавляем машину
    const newBalance = user.balance - carConfig.price;
    const newOwnedCars = [...owned, carId];

    const [updated] = await db
      .update(users)
      .set({ 
        balance: newBalance, 
        ownedCars: newOwnedCars 
      })
      .where(eq(users.id, userId))
      .returning();

    return res.status(200).json({
      success: true,
      newBalance: updated.balance,
      ownedCars: updated.ownedCars,
      message: `Куплена ${carConfig.name}!`
    });
  } catch (error) {
    console.error('Buy car error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}