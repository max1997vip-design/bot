import WebApp from '@twa-dev/sdk';

export const tg = WebApp;

export function getInitData(): string {
  return tg.initData || '';
}

export function getTelegramUser() {
  return tg.initDataUnsafe?.user || null;
}

export function expandApp() {
  tg.expand();
  tg.ready();
}