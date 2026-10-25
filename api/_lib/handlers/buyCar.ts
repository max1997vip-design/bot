// api/_lib/handlers/buyCar.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

const CAR_PRICES: Record<string, number> = {
  // Старые машины
  'audi-tt': 0,
  'bmw-m3': 50000,

  // Тир 1
  'vaz-2107': 0,
  'moskvich': 5000,
  'priora': 15000,
  'vesta': 40000,
  // Тир 2
  'civic': 100000,
  'rx7': 250000,
  'supra': 500000,
  'skyline': 850000,
  // Тир 3
  'mustang': 2000000,
  'camaro': 3500000,
  'm3gtr': 6000000,
  'rs6': 10000000,
  // Тир 4
  'gtr': 25000000,
  'porsche911': 40000000,
  'r8': 60000000,
  'amggt': 85000000,
  // Тир 5
  'ferrari458': 150000000,
  'huracan': 250000000,
  'mclaren720': 350000000,
  'aventador': 500000000,
  // Тир 6
  'sf90': 1000000000,
  'veyron': 1500000000,
  'chiron': 2500000000,
  'speedtail': 4000000000,
  'jesko': 6000000000,
  'solus': 10000000000,
};

export async function buyCarHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { initData, carId } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const price = CAR_PRICES[carId];
    if (price === undefined) {
      return res.status(400).json({ error: 'Машина не найдена или не продается' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 👇 Если у пользователя нет массива ownedCars, даем ему базовую ВАЗ 2107
    const owned = user.ownedCars || ['vaz-2107'];
    
    if (owned.includes(carId)) {
      return res.status(400).json({ error: 'У вас уже есть эта машина' });
    }

    if (user.balance < price) {
      return res.status(400).json({ error: 'Недостаточно монет' });
    }

    const newBalance = user.balance - price;
    const newOwnedCars = [...owned, carId];

    // 👇 ИСПРАВЛЕНА ОШИБКА С ДВОЙНЫМ .update()
    const [updated] = await db
      .update(users)
      .set({ balance: newBalance, ownedCars: newOwnedCars })
      .where(eq(users.id, userId))
      .returning();

    return res.status(200).json({
      success: true,
      newBalance: updated.balance,
      ownedCars: updated.ownedCars,
    });
  } catch (error) {
    console.error('Buy car error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}