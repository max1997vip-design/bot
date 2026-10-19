// api/lib/telegram.ts
import crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface ValidatedInitData {
  user: TelegramUser;
  authDate: number;
  hash: string;
}

/**
 * Проверяет подпись initData от Telegram.
 * @param initData - строка initData из WebApp
 * @param botToken - токен бота (передается из process.env.BOT_TOKEN)
 */
export function validateInitData(
  initData: string,
  botToken: string
): ValidatedInitData | null {
  if (!initData || !botToken) return null;

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return null;

    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      console.warn('Неверная подпись initData');
      return null;
    }

    const userJson = params.get('user');
    if (!userJson) return null;

    const user = JSON.parse(userJson) as TelegramUser;
    const authDate = parseInt(params.get('auth_date') || '0', 10);

    return { user, authDate, hash };
  } catch (e) {
    console.error('Ошибка при валидации initData:', e);
    return null;
  }
}

/**
 * Утилита для вызова методов Telegram Bot API.
 * @param method - название метода (например, 'sendMessage')
 * @param payload - тело запроса
 * @param botToken - токен бота
 */
export async function tgApi(
  method: string,
  payload: any,
  botToken: string
) {
  if (!botToken) throw new Error('BOT_TOKEN is not configured');

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/${method}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  return response.json();
}