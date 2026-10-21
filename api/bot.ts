// api/bot.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { tgApi } from './_lib/telegram.js'; // ИЗМЕНЕНО
import { db } from './_lib/db.js'; // ИЗМЕНЕНО
import { purchases, users } from './_lib/schema.js'; // ИЗМЕНЕНО
import { SHOP_ITEMS } from './_lib/shop.js'; // ИЗМЕНЕНО
import { eq, sql } from 'drizzle-orm';
import { logTransaction } from './_lib/logger.js';

const BOT_TOKEN = process.env.BOT_TOKEN!;

interface PreCheckoutQuery {
  id: string;
  from: { id: number };
  currency: string;
  total_amount: number;
  invoice_payload: string;
}

interface SuccessfulPayment {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  telegram_payment_charge_id: string;
  provider_payment_charge_id?: string;
}

// Тип для элемента магазина (на основе вашего shop.ts)
type ShopItem = {
  type: 'stars_balance' | 'coins' | 'battle_pass' | 'boost' | 'premium_car' | 'unlock_slots';
  amount: number;
  [key: string]: any;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(200).send('ok');
  }

  const update = req.body;

  try {
    // --- 1. ОБРАБОТКА ПРЕДВАРИТЕЛЬНОЙ ОПЛАТЫ ---
    if (update?.pre_checkout_query) {
      const q: PreCheckoutQuery = update.pre_checkout_query;
      let ok = false;
      let errorMessage = 'Товар недоступен';

      try {
        const payload = JSON.parse(q.invoice_payload);
        const purchaseId: string = payload.purchaseId;

        const [purchase] = await db
          .select()
          .from(purchases)
          .where(eq(purchases.id, purchaseId))
          .limit(1);

        if (!purchase) {
          errorMessage = 'Заказ не найден';
        } else if (purchase.userId !== q.from.id) {
          errorMessage = 'Заказ принадлежит другому пользователю';
        } else if (purchase.status !== 'pending') {
          errorMessage = 'Заказ уже обработан';
        } else if (purchase.starsAmount !== q.total_amount) {
          errorMessage = 'Сумма не совпадает';
        } else if (q.currency !== 'XTR') {
          errorMessage = 'Валюта не поддерживается';
        } else {
          ok = true;
        }
      } catch {
        errorMessage = 'Некорректный payload';
      }

      await tgApi(
        'answerPreCheckoutQuery',
        {
          pre_checkout_query_id: q.id,
          ok,
          ...(ok ? {} : { error_message: errorMessage }),
        },
        BOT_TOKEN,
      );

      return res.status(200).send('ok');
    }

    // --- 2. ОБРАБОТКА УСПЕШНОЙ ОПЛАТЫ ---
    if (update?.message?.successful_payment) {
      const msg = update.message;
      const payment: SuccessfulPayment = msg.successful_payment;
      const userId: number = msg.from.id;

      const payload = JSON.parse(payment.invoice_payload);
      const purchaseId: string = payload.purchaseId;

      const [purchase] = await db
        .select()
        .from(purchases)
        .where(eq(purchases.id, purchaseId))
        .limit(1);

      if (!purchase) return res.status(200).send('ok');
      if (purchase.status === 'completed') return res.status(200).send('ok');
      if (purchase.userId !== userId) return res.status(200).send('ok');

      const item = SHOP_ITEMS[purchase.itemId] as ShopItem | undefined;
      if (!item) return res.status(200).send('ok');

      // Атомарно меняем статус, чтобы избежать двойного зачисления
      const updated = await db
        .update(purchases)
        .set({
          status: 'completed',
          telegramPaymentChargeId: payment.telegram_payment_charge_id,
          providerPaymentChargeId: payment.provider_payment_charge_id ?? null,
          rawPayload: payment as any,
          completedAt: new Date(),
        })
        .where(
          sql`${purchases.id} = ${purchaseId} AND ${purchases.status} = 'pending'`,
        )
        .returning({ id: purchases.id });

      if (updated.length === 0) return res.status(200).send('ok');

      // Начисляем товар
      await grantItem(userId, item);

      return res.status(200).send('ok');
    }

    // --- 3. ОБРАБОТКА КОМАНДЫ /start ---
    if (update?.message?.text === '/start') {
      await tgApi(
        'sendMessage',
        {
          chat_id: update.message.chat.id,
          text: 'Добро пожаловать в Racing Idle RPG! Открой игру из меню бота.',
        },
        BOT_TOKEN,
      );
    }

    return res.status(200).send('ok');
  } catch (err) {
    console.error('bot webhook error', err);
    return res.status(200).send('ok');
  }
}

// --- ФУНКЦИЯ НАЧИСЛЕНИЯ ТОВАРА ---
async function grantItem(userId: number, item: ShopItem) {
  switch (item.type) {
    case 'stars_balance':
      await db
        .update(users)
        .set({
          starsBalance: sql`${users.starsBalance} + ${item.amount}`,
        })
        .where(eq(users.id, userId));
      break;

    case 'coins':
      await db
        .update(users)
        .set({
          balance: sql`${users.balance} + ${item.amount}`,
          totalEarned: sql`${users.totalEarned} + ${item.amount}`,
        })
        .where(eq(users.id, userId));
        await logTransaction(userId, item.amount, 'shop', `Покупка в магазине: ${item.title}`);
      break;

    case 'battle_pass':
      console.log('[grant] battle pass', userId);
      // Здесь будет логика выдачи батлпасса
      break;

    case 'boost':
      console.log('[grant] boost', userId, item.amount);
      // Здесь будет логика выдачи буста
      break;

    case 'premium_car':
    case 'unlock_slots':
      console.log('[grant] other', item.type, userId);
      // Здесь будет логика выдачи машин и слотов
      break;
  }
}