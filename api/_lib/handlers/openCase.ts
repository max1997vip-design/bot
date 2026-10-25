// api/_lib/handlers/openCase.ts
import { db } from '../db.js';
import { users, userItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { eq } from 'drizzle-orm';

const CASES = {
  hourly: { 
    price: 0, 
    currency: 'ad',
    cooldownMs: 60 * 60 * 1000, 
    items: [
      { id: 'coins_10000', weight: 70 }, // 70% монеты
      { id: 'engine_2', weight: 20 },    // 20% движок
      { id: 'tires_2', weight: 8 },      // 8% шины
      { id: 'ecu_2', weight: 2 }         // 2% мозги
    ] 
  },
  silver: { 
    price: 25000, 
    currency: 'coins',
    items: [
      { id: 'coins_5000', weight: 75 },  // 75% монеты (частичный возврат)
      { id: 'engine_2', weight: 15 },    // 15%
      { id: 'tires_2', weight: 8 },      // 8%
      { id: 'ecu_1', weight: 2 }         // 2%
    ] 
  },
  gold: { 
    price: 100000, 
    currency: 'coins',
    items: [
      { id: 'coins_25000', weight: 80 }, // 80% монеты
      { id: 'engine_3', weight: 12 },    // 12%
      { id: 'ecu_3', weight: 6 },        // 6%
      { id: 'susp_3', weight: 2 }        // 2%
    ] 
  },
  platinum: { 
    price: 500000, 
    currency: 'coins',
    items: [
      { id: 'coins_100000', weight: 85 }, // 85% монеты
      { id: 'engine_4', weight: 10 },     // 10%
      { id: 'tires_4', weight: 4 },       // 4%
      { id: 'susp_4', weight: 1 }         // 1%
    ] 
  },
  diamond: { 
    price: 2000000, 
    currency: 'coins',
    items: [
      { id: 'coins_500000', weight: 88 }, // 88% монеты
      { id: 'engine_4', weight: 6 },      // 6%
      { id: 'engine_5', weight: 3 },      // 3% (Легендарка!)
      { id: 'tires_5', weight: 2 },       // 2% (Легендарка!)
      { id: 'susp_5', weight: 1 }         // 1% (Легендарка!)
    ] 
  },
  star_premium: { 
    price: 50, 
    currency: 'stars',
    items: [
      { id: 'coins_5000000', weight: 60 }, // 60% монеты
      { id: 'engine_5', weight: 20 },      // 20%
      { id: 'tires_5', weight: 10 },       // 10%
      { id: 'ecu_5', weight: 8 },          // 8%
      { id: 'susp_5', weight: 2 }          // 2%
    ] 
  }
};

export async function openCaseHandler(req: any, res: any) {
  try {
    const { initData, caseType } = req.body;
    
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const selectedCase = CASES[caseType as keyof typeof CASES];
    if (!selectedCase) return res.status(400).json({ error: 'Неверный тип кейса' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    let newBalance = user.balance;
    let newStars = user.starsBalance;
    let updateData: any = {};

    if (selectedCase.currency === 'ad') {
      const lastAd = user.lastAdCaseAt ? new Date(user.lastAdCaseAt).getTime() : 0;
      if (Date.now() - lastAd < (selectedCase as any).cooldownMs) {
        return res.status(400).json({ error: 'Бесплатный кейс еще не готов. Ждите.' });
      }
      updateData.lastAdCaseAt = new Date();
    } else if (selectedCase.currency === 'stars') {
      if (user.starsBalance < selectedCase.price) return res.status(400).json({ error: 'Недостаточно звезд' });
      newStars -= selectedCase.price;
      updateData.starsBalance = newStars;
    } else {
      if (user.balance < selectedCase.price) return res.status(400).json({ error: 'Недостаточно монет' });
      newBalance -= selectedCase.price;
    }

    // Логика рандомайзера (работает без изменений, просто веса другие)
    const totalWeight = selectedCase.items.reduce((acc, item) => acc + item.weight, 0);
    let random = Math.random() * totalWeight;
    let wonItemId = selectedCase.items[0].id;
    
    for (const item of selectedCase.items) {
      if (random < item.weight) { wonItemId = item.id; break; }
      random -= item.weight;
    }

    const isCoins = wonItemId.startsWith('coins_');
    if (isCoins) {
      const amount = parseInt(wonItemId.split('_')[1]);
      newBalance += amount;
    }

    updateData.balance = newBalance;
    
    await db.update(users).set(updateData).where(eq(users.id, user.id));

    if (!isCoins) {
      await db.insert(userItems).values({ userId: user.id, itemId: wonItemId });
    }

    if (selectedCase.currency === 'coins') {
      await logTransaction(user.id, -selectedCase.price, 'case_open', `Открытие ${caseType} кейса`);
    }
    if (isCoins) {
      const amount = parseInt(wonItemId.split('_')[1]);
      await logTransaction(user.id, amount, 'case_reward', `Выигрыш в ${caseType} кейсе`);
    }

    return res.json({
      success: true,
      wonItem: { id: wonItemId, rarity: wonItemId.includes('_5') ? 'legendary' : wonItemId.includes('_4') ? 'epic' : 'common' },
      newBalance,
      newStars,
      lastAdCaseAt: updateData.lastAdCaseAt || user.lastAdCaseAt
    });

  } catch (e) {
    console.error('OpenCase Error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}