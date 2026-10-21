import { db } from './db.js';
import { transactions } from './schema.js';

export async function logTransaction(userId: number, amount: number, type: string, description: string) {
  if (amount === 0) return;
  try {
    await db.insert(transactions).values({ userId, amount, type, description });
  } catch (e) {
    console.error('Ошибка записи транзакции:', e);
  }
}