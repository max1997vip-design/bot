// api/update-car.ts
import { db } from './_lib/db.js';
import { users } from './_lib/schema.js';
import { validateInitData } from './_lib/telegram.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { initData, carColor } = req.body;

    if (!initData) {
      return res.status(401).json({ error: 'No initData provided' });
    }

    // Используем твою функцию валидации из lib/telegram.js
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);

    if (!validatedData || !validatedData.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = validatedData.user.id;

    // Обновляем цвет в базе данных
    await db.update(users)
      .set({ carColor })
      .where(eq(users.id, userId));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating car color:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}