import WebApp from '@twa-dev/sdk';

export const tg = WebApp;

// Флаг, что мы в локальной разработке (Vite)
export const isDev = import.meta.env.DEV;

// Фейковый ID (можешь поставить свой реальный TG ID, чтобы видеть свои данные)
const DEV_USER_ID = 123456789; 

export function getInitData(): string {
  if (isDev && !tg.initData) return 'DEV_BYPASS';
  return tg.initData || '';
}

export function getTelegramUser() {
  if (isDev && !tg.initDataUnsafe?.user) {
    return { id: DEV_USER_ID, first_name: 'Dev', username: 'dev_user' };
  }
  return tg.initDataUnsafe?.user || null;
}

export function expandApp() {
  tg.expand();
  tg.ready();
}