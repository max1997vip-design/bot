// api/create-invoice.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { validateInitData, tgApi } from './_lib/telegram.js'; 
import { db } from './_lib/db.js';
import { purchases } from './_lib/schema.js';
import { SHOP_ITEMS } from './_lib/shop.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { initData, itemId } = req.body;

  try {
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!validatedData || !validatedData.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const telegramId = validatedData.user.id;

    const item = SHOP_ITEMS[itemId];
    if (!item) {
      return res.status(400).json({ error: 'Item not found' });
    }

    // Универсальный поиск цены: ищем поле price, stars, cost или starsAmount
    const itemPrice = (item as any).price || (item as any).stars || (item as any).cost || (item as any).starsAmount;
    
    if (!itemPrice) {
      console.error('Не удалось определить цену товара:', item);
      return res.status(500).json({ error: 'Item price not configured' });
    }

    const itemTitle = (item as any).title || itemId;
    const itemDescription = (item as any).description || 'Покупка в игре Гоночный Кликер';

    const newPurchase = await db.insert(purchases).values({
      userId: telegramId,
      itemId: itemId,
      starsAmount: itemPrice,
      status: 'pending',
    }).returning();

    // Вызов Telegram Bot API для создания инвойса
    const result = await tgApi('createInvoiceLink', {
      title: itemTitle,
      description: itemDescription,
      payload: JSON.stringify({ purchaseId: newPurchase[0].id }),
      provider_token: '', // Для Telegram Stars всегда пустая строка
      currency: 'XTR', // Код валюты для Stars
      prices: [{ label: itemTitle, amount: itemPrice }],
    }, process.env.BOT_TOKEN!);

    if (!result.ok) {
      console.error('Telegram API Error:', result);
      return res.status(500).json({ error: result.description });
    }

    return res.status(200).json({ invoiceLink: result.result });
  } catch (error) {
    console.error('Invoice error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}