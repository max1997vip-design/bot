// api/_lib/handlers/openCase.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
// Если у тебя инвентарь в отдельной таблице, раскомментируй импорт ниже:
// import { inventory } from '../schema.js'; 

const CASES = {
  bronze: { 
    price: 5000, 
    items: [{ id: 'engine_1', weight: 60 }, { id: 'tires_1', weight: 30 }, { id: 'coins_1000', weight: 10 }] 
  },
  silver: { 
    price: 25000, 
    items: [{ id: 'engine_2', weight: 50 }, { id: 'tires_2', weight: 30 }, { id: 'ecu_1', weight: 15 }, { id: 'coins_5000', weight: 5 }] 
  },
  gold: { 
    price: 100000, 
    items: [{ id: 'engine_3', weight: 40 }, { id: 'ecu_3', weight: 30 }, { id: 'suspension_3', weight: 20 }, { id: 'coins_25000', weight: 10 }] 
  }
};

export async function openCaseHandler(req: any, res: any) {
  try {
    const { initData, caseType } = req.body;
    
    // 1. Авторизация (как в flipCoin)
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // 2. Проверка кейса
    const selectedCase = CASES[caseType as keyof typeof CASES];
    if (!selectedCase) {
      return res.status(400).json({ error: 'Неверный тип кейса' });
    }

    // 3. Получаем юзера
    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 4. Проверяем баланс
    if (user.balance < selectedCase.price) {
      return res.status(400).json({ error: 'Недостаточно монет' });
    }

    // 5. Рандомайзер (выбор по весам)
    const totalWeight = selectedCase.items.reduce((acc, item) => acc + item.weight, 0);
    let random = Math.random() * totalWeight;
    let wonItemId = selectedCase.items[0].id;
    
    for (const item of selectedCase.items) {
      if (random < item.weight) {
        wonItemId = item.id;
        break;
      }
      random -= item.weight;
    }

    // 6. Считаем новый баланс
    let newBalance = user.balance - selectedCase.price;
    const isCoins = wonItemId.startsWith('coins_');

    // Если выпали монеты — начисляем их
    if (isCoins) {
      const amount = parseInt(wonItemId.split('_')[1]);
      newBalance += amount;
    }

    // 7. Обновляем БД
    await db.update(users)
      .set({ balance: newBalance })
      .where(eq(users.id, user.id));

    // Если выпал предмет, добавляем в инвентарь
    if (!isCoins) {
      // ⚠️ ВАЖНО: Тут зависит от твоей схемы БД.
      // Если инвентарь хранится в отдельной таблице `inventory`, используй:
      // await db.insert(inventory).values({ userId: user.id, itemId: wonItemId });
      
      // Если инвентарь хранится как массив JSON прямо в таблице users, используй:
      // await db.update(users).set({ inventory: [...(user.inventory || []), wonItemId] }).where(eq(users.id, user.id));
      
      // Пока оставим заглушку, чтобы сборка не упала. 
      // Убери комментарии с нужного варианта выше!
      console.log(`Выпал предмет: ${wonItemId}, нужно добавить в инвентарь юзера ${user.id}`);
    }

    // 8. Отдаем ответ на фронтенд
    return res.json({
      success: true,
      wonItem: { 
        id: wonItemId, 
        rarity: wonItemId.includes('_3') ? 'legendary' : 'common' 
      },
      newBalance: newBalance
    });

  } catch (e) {
    console.error('OpenCase Error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}