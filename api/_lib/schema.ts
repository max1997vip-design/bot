import {
  pgTable, bigint, text, integer, timestamp, boolean, jsonb, uuid, primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  username: text('username'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  photoUrl: text('photo_url'),
  balance: bigint('balance', { mode: 'number' }).notNull().default(0),
  totalEarned: bigint('total_earned', { mode: 'number' }).notNull().default(0),
  starsBalance: integer('stars_balance').notNull().default(0),
  
  activeCarId: text('active_car_id').notNull().default('audi-tt'),
  ownedCars: jsonb('owned_cars').$type<string[]>().notNull().default(['audi-tt']),
  
  carColor: text('car_color').notNull().default('original'), 
  level: integer('level').notNull().default(1),
  xp: bigint('xp', { mode: 'number' }).notNull().default(0),
  isAdmin: boolean('is_admin').notNull().default(false),
  isBanned: boolean('is_banned').notNull().default(false),
  referredBy: bigint('referred_by', { mode: 'number' }),
  referralEarnings: bigint('referral_earnings', { mode: 'number' }).notNull().default(0),
  rating: integer('rating').notNull().default(100),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at').notNull().defaultNow(),
  lastOnlineAt: timestamp('last_online_at').notNull().defaultNow(),
  
  clickLevel: integer('click_level').notNull().default(1),
  offlineLevel: integer('offline_level').notNull().default(1),
  
  dailyStreak: integer('daily_streak').notNull().default(0),
  lastDailyClaim: timestamp('last_daily_claim', { withTimezone: true }),
  
  dailyQuests: jsonb('daily_quests').$type<any>(),
  
  partUpgrades: jsonb('part_upgrades').$type<Record<string, {
    level: number;
    goldStars: number;
    redStars: number;
    upgradingUntil: number | null;
    upgradeType: 'level' | 'gold' | 'red' | null;
  }>>().notNull().default({}),

  businesses: jsonb('businesses').$type<Record<string, {
    level: number;
    lastCollected: number;
  }>>().notNull().default({}),

  weeklyPass: jsonb('weekly_pass').$type<{
    weekId: number;
    xp: number;
    claimed: number[];
  }>().notNull().default({ weekId: 0, xp: 0, claimed: [] }),
});

export const ownedCars = pgTable('owned_cars', {
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  carId: text('car_id').notNull(),
  purchasedAt: timestamp('purchased_at').notNull().defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.carId] }) }));

export const upgrades = pgTable('upgrades', {
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  upgradeId: text('upgrade_id').notNull(),
  level: integer('level').notNull().default(0),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.upgradeId] }) }));

export const userItems = pgTable('user_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemId: text('item_id').notNull(),
  obtainedAt: timestamp('obtained_at').notNull().defaultNow(),
});

export const equippedItems = pgTable('equipped_items', {
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  slot: text('slot').notNull(),
  itemId: text('item_id'),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.slot] }) }));

export const purchases = pgTable('purchases', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  itemId: text('item_id').notNull(),
  starsAmount: integer('stars_amount').notNull(),
  status: text('status').notNull().default('pending'),
  telegramPaymentChargeId: text('telegram_payment_charge_id').unique(),
  providerPaymentChargeId: text('provider_payment_charge_id'),
  rawPayload: jsonb('raw_payload'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const achievements = pgTable('achievements', {
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: text('achievement_id').notNull(),
  unlockedAt: timestamp('unlocked_at').notNull().defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.achievementId] }) }));

export const clans = pgTable('clans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  leaderId: bigint('leader_id', { mode: 'number' }).notNull(),
  balance: bigint('balance', { mode: 'number' }).notNull().default(0),
  level: integer('level').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const clanMembers = pgTable('clan_members', {
  userId: bigint('user_id', { mode: 'number' }).primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  clanId: uuid('clan_id').notNull().references(() => clans.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'), // 'leader' | 'officer' | 'member'
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const featureFlags = pgTable('feature_flags', {
  name: text('name').primaryKey(), // 'casino', 'clans', 'workshop' и т.д.
  isEnabled: boolean('is_enabled').notNull().default(true),
});

export type User = typeof users.$inferSelect;