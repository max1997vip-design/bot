import { getInitData } from './telegram';

const API_URL = import.meta.env.VITE_API_URL || ''; // Пусто = тот же домен

export async function apiFetch<T>(endpoint: string, body: object = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initData: getInitData(),
      ...body,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'API Error');
  }

  return res.json();
}

export async function syncGame() {
  return apiFetch<{ user: any; cars: any[]; upgrades: any[] }>('/api/sync');
}