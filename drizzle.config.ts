// drizzle.config.ts
import { config } from 'dotenv';
config({ path: '.env' });

import type { Config } from 'drizzle-kit';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Не найдена строка подключения. Проверь .env — нужна POSTGRES_URL');
}

export default {
  schema: './api/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
} satisfies Config;