// api/lib/db.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// Поддерживаем оба варианта: POSTGRES_URL (Vercel/Neon) и DATABASE_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Не найдена строка подключения к базе данных');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });