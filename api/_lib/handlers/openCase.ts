// api/_lib/handlers/openCase.ts
import { db } from '../db.js';
import { users, userItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { eq } from 'drizzle-orm';
import { CASES } from '../../../src/config/cases.js';

export async function openCaseHandler(req: any, res: any) {
  try {
    const { initData, caseType } = req.body;

    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const selectedCase = CASES[caseType];
    if (!selectedCase) return res.status(400).json({ error: 'Неверный тип кейса' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    let newBalance = user.balance;
    let newStars = user.starsBalance;
    const updateData: any = {};

    // --- Проверка оплаты ---
    if (selectedCase.currency === 'ad') {
      const lastAd = user.lastAdCaseAt ? new Date(user.lastAdCaseAt).getTime() : 0;
      const cd = selectedCase.cooldownMs || 3600000;
      if (Date.now() - lastAd < cd) {
        return res.status(400).json({ error: 'Бесплатный кейс ещё не готов. Ждите.' });
      }
      updateData.lastAdCaseAt = new Date();
    } else if (selectedCase.currency === 'stars') {
      if (user.starsBalance < selectedCase.price) {
        return res.status(400).json({ error: 'Недостаточно звёзд' });
      }
      newStars -= selectedCase.price;
      updateData.starsBalance = newStars;
    } else {
      if (user.balance < selectedCase.price) {
        return res.status(400).json({ error: 'Недостаточно ₽' });
      }
      newBalance -= selectedCase.price;
    }

    // --- Ролл по весам ---
    const totalWeight = selectedCase.items.reduce((sum, it) => sum + it.weight, 0);
    let random = Math.random() * totalWeight;
    let wonItemId = selectedCase.items[0].id;
    for (const item of selectedCase.items) {
      if (random < item.weight) { wonItemId = item.id; break; }
      random -= item.weight;
    }

    // --- Начисление ---
    const isCoins = wonItemId.startsWith('coins_');
    if (isCoins) {
      const amount = parseInt(wonItemId.split('_')[1], 10);
      newBalance += amount;
    }

    updateData.balance = newBalance;
    await db.update(users).set(updateData).where(eq(users.id, user.id));

    if (!isCoins) {
      await db.insert(userItems).values({ userId: user.id, itemId: wonItemId });
    }

    // --- Логирование ---
    if (selectedCase.currency === 'coins') {
      await logTransaction(
        user.id,
        -selectedCase.price,
        'case_open',
        `Открытие ${caseType} кейса`
      );
    }
    if (isCoins) {
      const amount = parseInt(wonItemId.split('_')[1], 10);
      await logTransaction(
        user.id,
        amount,
        'case_reward',
        `Выигрыш в ${caseType} кейсе: ${amount.toLocaleString('ru-RU')} ₽`
      );
    }

    return res.json({
      success: true,
      wonItem: {
        id: wonItemId,
        rarity: wonItemId.includes('_5')
          ? 'legendary'
          : wonItemId.includes('_4')
          ? 'epic'
          : 'common',
      },
      newBalance,
      newStars,
      lastAdCaseAt: updateData.lastAdCaseAt || user.lastAdCaseAt,
    });
  } catch (e) {
    console.error('OpenCase Error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}