# Racing Idle Snapshot (2026-11-07 20:36)

## 1. Дерево проекта
```
api/_lib/businesses.ts
api/_lib/clans.ts
api/_lib/db.ts
api/_lib/handlers/addLeaguePoints.ts
api/_lib/handlers/admin.ts
api/_lib/handlers/buyBusiness.ts
api/_lib/handlers/buyCar.ts
api/_lib/handlers/buyPremium.ts
api/_lib/handlers/claimAchievement.ts
api/_lib/handlers/claimAdReward.ts
api/_lib/handlers/claimDaily.ts
api/_lib/handlers/claimLevelReward.ts
api/_lib/handlers/claimPassReward.ts
api/_lib/handlers/claimQuest.ts
api/_lib/handlers/claimUpgrade.ts
api/_lib/handlers/clanAction.ts
api/_lib/handlers/clanBoss.ts
api/_lib/handlers/clanChat.ts
api/_lib/handlers/collectIncome.ts
api/_lib/handlers/craftItem.ts
api/_lib/handlers/createClan.ts
api/_lib/handlers/equip.ts
api/_lib/handlers/flipCoin.ts
api/_lib/handlers/getAchievements.ts
api/_lib/handlers/getClan.ts
api/_lib/handlers/getClans.ts
api/_lib/handlers/getHistory.ts
api/_lib/handlers/getPass.ts
api/_lib/handlers/getQuests.ts
api/_lib/handlers/getReferrals.ts
api/_lib/handlers/joinClan.ts
api/_lib/handlers/leaderboard.ts
api/_lib/handlers/openCase.ts
api/_lib/handlers/pvp.ts
api/_lib/handlers/pvpResult.ts
api/_lib/handlers/sellItem.ts
api/_lib/handlers/skipUpgradeTime.ts
api/_lib/handlers/switchCar.ts
api/_lib/handlers/sync.ts
api/_lib/handlers/tap.ts
api/_lib/handlers/upgradeBusiness.ts
api/_lib/handlers/upgradeClicker.ts
api/_lib/handlers/upgradeOffline.ts
api/_lib/handlers/upgradePart.ts
api/_lib/items.ts
api/_lib/logger.ts
api/_lib/pass.ts
api/_lib/quests.ts
api/_lib/raceSim.ts
api/_lib/schema.ts
api/_lib/shop.ts
api/_lib/telegram.ts
api/_lib/upgrades.ts
api/bot.ts
api/create-invoice.ts
api/game.ts
api/tsconfig.json
api/update-car.ts
drizzle.config.ts
drizzle/meta/_journal.json
drizzle/meta/0000_snapshot.json
package.json
src/App.tsx
src/components/AchievementsScreen.tsx
src/components/AdminScreen.tsx
src/components/BusinessScreen.tsx
src/components/CarDealership.tsx
src/components/CaseModal.tsx
src/components/CasinoScreen.tsx
src/components/CityScreen.tsx
src/components/ClanScreen.tsx
src/components/DailyRewardModal.tsx
src/components/GarageScreen.tsx
src/components/HistoryModal.tsx
src/components/LeaderboardModal.tsx
src/components/LeagueBadge.tsx
src/components/LevelRewardModal.tsx
src/components/LoadingScreen.tsx
src/components/PassScreen.tsx
src/components/ProfileScreen.tsx
src/components/QuestModal.tsx
src/components/RaceScreen.tsx
src/components/RacesScreen.tsx
src/components/ReferralScreen.tsx
src/components/ShopModal.tsx
src/components/TintedCarImage.tsx
src/components/WorkshopScreen.tsx
src/config/achievements.ts
src/config/businesses.ts
src/config/cars.ts
src/config/clans.ts
src/config/garage.ts
src/config/items.ts
src/config/leagues.ts
src/config/levelRewards.ts
src/config/pass.ts
src/config/racing.ts
src/hooks/useAdsgram.ts
src/lib/telegram.ts
src/main.tsx
src/store/gameStore.ts
src/styles/achievements.css
src/styles/admin.css
src/styles/animations.css
src/styles/base.css
src/styles/cardealership.css
src/styles/case.css
src/styles/city.css
src/styles/clan.css
src/styles/engine.css
src/styles/garage.css
src/styles/history.css
src/styles/leaderboard.css
src/styles/levelReward.css
src/styles/loading.css
src/styles/pass.css
src/styles/profile.css
src/styles/quests.css
src/styles/race.css
src/styles/races.css
src/styles/referral.css
src/styles/variables.css
src/styles/workshop.css
src/utils/carStats.ts
src/utils/raceEngine.ts
src/utils/raceSim.ts
src/utils/sound.ts
src/vite-env.d.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

## 2. package.json
```json
{
  "name": "racing-idle-rpg",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.0",
    "@twa-dev/sdk": "^8.0.2",
    "@upstash/redis": "^1.34.0",
    "drizzle-orm": "^0.36.0",
    "framer-motion": "^11.11.0",
    "lucide-react": "^1.70.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.7.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vercel/node": "^3.2.0",
    "@vitejs/plugin-react": "^4.3.0",
    "dotenv": "^18.0.8",
    "drizzle-kit": "^0.28.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}

```

## 3. Содержимое файлов


### api/_lib/businesses.ts
```ts
export interface BusinessConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  baseIncomePerHour: number;
}

export const BUSINESSES: Record<string, BusinessConfig> = {
  coffee: { id: 'coffee', name: 'РљРѕС„РµР№РЅСЏ', description: 'Р‘С‹СЃС‚СЂС‹Р№ РєРѕС„Рµ.', icon: 'в•', baseCost: 10000, baseIncomePerHour: 500 },
  car_wash: { id: 'car_wash', name: 'РђРІС‚РѕРјРѕР№РєР°', description: 'Р§РёСЃС‚С‹Рµ РјР°С€РёРЅС‹.', icon: 'рџљї', baseCost: 50000, baseIncomePerHour: 3000 },
  parts_store: { id: 'parts_store', name: 'РњР°РіР°Р·РёРЅ Р·Р°РїС‡Р°СЃС‚РµР№', description: 'РўСЋРЅРёРЅРі.', icon: 'рџ”§', baseCost: 250000, baseIncomePerHour: 15000 },
  gas_station: { id: 'gas_station', name: 'Р—Р°РїСЂР°РІРєР°', description: 'Р‘РµРЅР·РёРЅ.', icon: 'в›Ѕ', baseCost: 1000000, baseIncomePerHour: 80000 },
  night_club: { id: 'night_club', name: 'РќРѕС‡РЅРѕР№ РєР»СѓР±', description: 'РћС‚РґС‹С….', icon: 'рџЄ©', baseCost: 10000000, baseIncomePerHour: 1000000 }
};

export const getBusinessUpgradeCost = (baseCost: number, currentLevel: number) => {
  return Math.floor(baseCost * Math.pow(1.6, currentLevel));
};

export const getBusinessIncome = (baseIncome: number, level: number) => {
  return Math.floor(baseIncome * level * (1 + (level - 1) * 0.2)); 
};
```

### api/_lib/clans.ts
```ts
export const CLAN_CREATE_COST = 100000;

export const CLAN_LEVELS = [
  { level: 1, upgradeCost: 0, maxMembers: 5, clickBonus: 0 },
  { level: 2, upgradeCost: 500000, maxMembers: 7, clickBonus: 1 },
  { level: 3, upgradeCost: 1500000, maxMembers: 10, clickBonus: 2 },
  { level: 4, upgradeCost: 4000000, maxMembers: 15, clickBonus: 3 },
  { level: 5, upgradeCost: 10000000, maxMembers: 20, clickBonus: 5 },
  { level: 6, upgradeCost: 25000000, maxMembers: 30, clickBonus: 7 },
  { level: 7, upgradeCost: 50000000, maxMembers: 40, clickBonus: 10 },
  { level: 8, upgradeCost: 100000000, maxMembers: 50, clickBonus: 15 },
];

export function getClanStats(level: number) {
  // рџ‘‡ РРЎРџР РђР’Р›Р•РќРР•: РЈР±СЂР°Р»Рё || CLAN_LEVELS[0], С‡С‚РѕР±С‹ РЅРµ СЃР±СЂР°СЃС‹РІР°Р»Рѕ РЅР° 1 СѓСЂРѕРІРµРЅСЊ
  return CLAN_LEVELS.find(l => l.level === level); 
}
```

### api/_lib/db.ts
```ts
// api/lib/db.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// РџРѕРґРґРµСЂР¶РёРІР°РµРј РѕР±Р° РІР°СЂРёР°РЅС‚Р°: POSTGRES_URL (Vercel/Neon) Рё DATABASE_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('РќРµ РЅР°Р№РґРµРЅР° СЃС‚СЂРѕРєР° РїРѕРґРєР»СЋС‡РµРЅРёСЏ Рє Р±Р°Р·Рµ РґР°РЅРЅС‹С…');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
```

### api/_lib/handlers/addLeaguePoints.ts
```ts

// api/_lib/handlers/addLeaguePoints.ts
import { db } from '../db.js';           // в†ђ Р±С‹Р»Рѕ ../../db.js
import { users } from '../schema.js';    // в†ђ Р±С‹Р»Рѕ ../../schema.js
import { validateInitData } from '../telegram.js'; // в†ђ Р±С‹Р»Рѕ ../../telegram.js
import { eq, sql } from 'drizzle-orm';

export async function addLeaguePointsHandler(req: any, res: any) {
  const { initData, points } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = validatedData.user.id;
  const safePoints = Math.max(-100, Math.min(100, Math.round(points ?? 0)));

  try {
    const [updated] = await db
      .update(users)
      .set({
        leaguePoints: sql`GREATEST(0, COALESCE(${users.leaguePoints}, 0) + ${safePoints})`,
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      success: true,
      newLeaguePoints: updated.leaguePoints ?? 0,
    });
  } catch (error) {
    console.error('[addLeaguePoints]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/admin.ts
```ts
// api/_lib/handlers/admin.ts
import { db } from '../db.js';
import { users, userItems, featureFlags, equippedItems, ownedCars, clanMembers, clans, transactions } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function adminHandler(req: any, res: any) {
  try {
    const { initData, action, payload } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [admin] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!admin || !admin.isAdmin) return res.status(403).json({ error: 'Р”РѕСЃС‚СѓРї Р·Р°РїСЂРµС‰РµРЅ' });

    // 1. РџРѕР»СѓС‡РёС‚СЊ РІСЃРµ РґР°РЅРЅС‹Рµ РґР»СЏ РїР°РЅРµР»Рё
    if (action === 'getData') {
      const flags = await db.select().from(featureFlags);
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        photoUrl: users.photoUrl,
        balance: users.balance,
        starsBalance: users.starsBalance,
        leaguePoints: users.leaguePoints,
        rating: users.rating,
        isAdmin: users.isAdmin,
        isBanned: users.isBanned,
      }).from(users).limit(200);

      return res.json({ success: true, flags, users: allUsers });
    }

    // 2. РџРµСЂРµРєР»СЋС‡РёС‚СЊ С„РёС‡Сѓ
    if (action === 'toggleFeature') {
      const { name, isEnabled } = payload;
      const existing = await db.select().from(featureFlags).where(eq(featureFlags.name, name));
      if (existing.length === 0) {
        await db.insert(featureFlags).values({ name, isEnabled });
      } else {
        await db.update(featureFlags).set({ isEnabled }).where(eq(featureFlags.name, name));
      }
      return res.json({ success: true });
    }

    // 3. Р’С‹РґР°С‚СЊ РЅР°РіСЂР°РґСѓ (Р±Р°Р»Р°РЅСЃ, Р·РІС‘Р·РґС‹, РѕС‡РєРё Р»РёРіРё РёР»Рё РїСЂРµРґРјРµС‚)
    if (action === 'giveReward') {
      const { targetId, type, amount, itemId } = payload;
      const [targetUser] = await db.select().from(users).where(eq(users.id, Number(targetId)));
      if (!targetUser) return res.status(404).json({ error: 'РРіСЂРѕРє РЅРµ РЅР°Р№РґРµРЅ' });

      if (type === 'balance') {
        const newBalance = targetUser.balance + Number(amount);
        await db.update(users).set({ balance: newBalance }).where(eq(users.id, targetUser.id));
      } 
      else if (type === 'stars') {
        const newStars = (targetUser.starsBalance || 0) + Number(amount);
        await db.update(users).set({ starsBalance: newStars }).where(eq(users.id, targetUser.id));
      }
      else if (type === 'league') {
        const newLeague = (targetUser.leaguePoints || 0) + Number(amount);
        await db.update(users).set({ leaguePoints: newLeague }).where(eq(users.id, targetUser.id));
      }
      else if (type === 'item') {
        await db.insert(userItems).values({ userId: targetUser.id, itemId: String(itemId) });
      }
      return res.json({ success: true });
    }

    // 4. Р‘Р°РЅ / СЂР°Р·Р±Р°РЅ
    if (action === 'banUser' || action === 'unbanUser') {
      const { userId } = payload;
      const isBanned = action === 'banUser';
      await db.update(users).set({ isBanned }).where(eq(users.id, Number(userId)));
      return res.json({ success: true });
    }

    // 5. Р’С‹РґР°С‚СЊ / СЃРЅСЏС‚СЊ РїСЂР°РІР° Р°РґРјРёРЅР°
    if (action === 'giveAdmin' || action === 'removeAdmin') {
      const { userId } = payload;
      const isAdmin = action === 'giveAdmin';
      await db.update(users).set({ isAdmin }).where(eq(users.id, Number(userId)));
      return res.json({ success: true });
    }

    // 6. Р“Р›РћР‘РђР›Р¬РќР«Р™ РЎР‘Р РћРЎ Р’РЎР•РҐ РР“Р РћРљРћР’
    if (action === 'globalReset') {
      await db.update(users).set({
        balance: 0,
        totalEarned: 0,
        starsBalance: 0,
        activeCarId: 'vaz-2107',
        ownedCars: ['vaz-2107'],
        carColor: 'original',
        level: 1,
        xp: 0,
        rating: 100,
        leaguePoints: 0,
        clickLevel: 1,
        offlineLevel: 1,
        dailyStreak: 0,
        lastDailyClaim: null,
        dailyQuests: {},
        partUpgrades: {},
        businesses: {},
        weeklyPass: { weekId: 0, xp: 0, claimed: [] }
      });

      await db.delete(userItems);
      await db.delete(equippedItems);
      await db.delete(ownedCars);
      await db.delete(clanMembers);
      await db.delete(clans);
      await db.delete(transactions);

      return res.json({ success: true, message: 'All players reset successfully' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/buyBusiness.ts
```ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { BUSINESSES } from '../businesses.js';

export async function buyBusinessHandler(req: any, res: any) {
  try {
    const { initData, businessId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const config = BUSINESSES[businessId];
    if (!config) return res.status(400).json({ error: 'Р‘РёР·РЅРµСЃ РЅРµ РЅР°Р№РґРµРЅ' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const businesses = { ...(user.businesses || {}) };
    if (businesses[businessId]) return res.status(400).json({ error: 'РЈР¶Рµ РєСѓРїР»РµРЅРѕ' });

    if (user.balance < config.baseCost) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ' });

    const newBalance = user.balance - config.baseCost;
    businesses[businessId] = {
      level: 1,
      lastCollected: Date.now()
    };

    await db.update(users).set({ balance: newBalance, businesses }).where(eq(users.id, user.id));
    return res.json({ success: true, newBalance, businesses });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/buyCar.ts
```ts
// api/_lib/handlers/buyCar.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

const CAR_PRICES: Record<string, number> = {
  // РЎС‚Р°СЂС‹Рµ РјР°С€РёРЅС‹
  'audi-tt': 0,
  'bmw-m3': 50000,

  // РўРёСЂ 1
  'vaz-2107': 0,
  'moskvich': 5000,
  'priora': 15000,
  'vesta': 40000,
  // РўРёСЂ 2
  'civic': 100000,
  'rx7': 250000,
  'supra': 500000,
  'skyline': 850000,
  // РўРёСЂ 3
  'mustang': 2000000,
  'camaro': 3500000,
  'm3gtr': 6000000,
  'rs6': 10000000,
  // РўРёСЂ 4
  'gtr': 25000000,
  'porsche911': 40000000,
  'r8': 60000000,
  'amggt': 85000000,
  // РўРёСЂ 5
  'ferrari458': 150000000,
  'huracan': 250000000,
  'mclaren720': 350000000,
  'aventador': 500000000,
  // РўРёСЂ 6
  'sf90': 1000000000,
  'veyron': 1500000000,
  'chiron': 2500000000,
  'speedtail': 4000000000,
  'jesko': 6000000000,
  'solus': 10000000000,
};

export async function buyCarHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { initData, carId } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const price = CAR_PRICES[carId];
    if (price === undefined) {
      return res.status(400).json({ error: 'РњР°С€РёРЅР° РЅРµ РЅР°Р№РґРµРЅР° РёР»Рё РЅРµ РїСЂРѕРґР°РµС‚СЃСЏ' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // рџ‘‡ Р•СЃР»Рё Сѓ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РЅРµС‚ РјР°СЃСЃРёРІР° ownedCars, РґР°РµРј РµРјСѓ Р±Р°Р·РѕРІСѓСЋ Р’РђР— 2107
    const owned = user.ownedCars || ['vaz-2107'];
    
    if (owned.includes(carId)) {
      return res.status(400).json({ error: 'РЈ РІР°СЃ СѓР¶Рµ РµСЃС‚СЊ СЌС‚Р° РјР°С€РёРЅР°' });
    }

    if (user.balance < price) {
      return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ' });
    }

    const newBalance = user.balance - price;
    const newOwnedCars = [...owned, carId];

    // рџ‘‡ РРЎРџР РђР’Р›Р•РќРђ РћРЁРР‘РљРђ РЎ Р”Р’РћР™РќР«Рњ .update()
    const [updated] = await db
      .update(users)
      .set({ balance: newBalance, ownedCars: newOwnedCars })
      .where(eq(users.id, userId))
      .returning();

    return res.status(200).json({
      success: true,
      newBalance: updated.balance,
      ownedCars: updated.ownedCars,
    });
  } catch (error) {
    console.error('Buy car error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### api/_lib/handlers/buyPremium.ts
```ts
// api/_lib/handlers/buyPremium.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreatePass } from '../pass.js';

const PREMIUM_PRICE = 500000;

export async function buyPremiumHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const pass = getOrCreatePass(user.weeklyPass);

    if (pass.isPremium) return res.status(400).json({ error: 'РџСЂРµРјРёСѓРј СѓР¶Рµ РєСѓРїР»РµРЅ РЅР° СЌС‚Сѓ РЅРµРґРµР»СЋ' });
    if (user.balance < PREMIUM_PRICE) {
      return res.status(400).json({ error: `РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ. РќСѓР¶РЅРѕ: ${PREMIUM_PRICE}, Сѓ РІР°СЃ: ${user.balance}` });
    }

    const newBalance = user.balance - PREMIUM_PRICE;
    pass.isPremium = true;

    await db.update(users).set({ 
      balance: newBalance, 
      weeklyPass: pass 
    }).where(eq(users.id, user.id));

    return res.json({ success: true, newBalance, pass });
  } catch (e) {
    console.error('Buy Premium error:', e);
    return res.status(500).json({ error: 'Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ РѕС€РёР±РєР° СЃРµСЂРІРµСЂР°' });
  }
}
```

### api/_lib/handlers/claimAchievement.ts
```ts
// api/_lib/handlers/claimAchievement.ts
import { db } from '../db.js';
import { users, achievements } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { getOrCreatePass } from '../pass.js';
import { eq, sql, and } from 'drizzle-orm';
import { ACHIEVEMENTS } from '../../../src/config/achievements.js';

export async function claimAchievementHandler(req: any, res: any) {
  try {
    const { initData, achievementId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 1. РќР°С…РѕРґРёРј РєРѕРЅС„РёРі РґРѕСЃС‚РёР¶РµРЅРёСЏ
    const config = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!config) return res.status(400).json({ error: 'Р”РѕСЃС‚РёР¶РµРЅРёРµ РЅРµ РЅР°Р№РґРµРЅРѕ' });

    // 2. РџСЂРѕРІРµСЂСЏРµРј, РЅРµ Р·Р°Р±СЂР°РЅРѕ Р»Рё СѓР¶Рµ
    const existing = await db.select().from(achievements)
      .where(and(eq(achievements.userId, user.id), eq(achievements.achievementId, achievementId)));
    
    if (existing.length > 0) return res.status(400).json({ error: 'РЈР¶Рµ РїРѕР»СѓС‡РµРЅРѕ' });

    // 3. РџСЂРѕРІРµСЂСЏРµРј, РІС‹РїРѕР»РЅРµРЅРѕ Р»Рё СѓСЃР»РѕРІРёРµ (Р·Р°С‰РёС‚Р° РѕС‚ С‡РёС‚РѕРІ)
    if (!config.check(user)) return res.status(400).json({ error: 'РЈСЃР»РѕРІРёРµ РЅРµ РІС‹РїРѕР»РЅРµРЅРѕ' });

    const xpReward = 50; // рџ‘€ Р±С‹Р»Рѕ 100
    const pass = getOrCreatePass(user.weeklyPass);
    const xpMultiplier = pass.isPremium ? 5 : 1;
    pass.xp += xpReward * xpMultiplier;

    const [updated] = await db.update(users).set({
    balance: sql`${users.balance} + ${config.reward}`,
    totalEarned: sql`${users.totalEarned} + ${config.reward}`,
    xp: sql`${users.xp} + ${xpReward}`,
    weeklyPass: pass,
    }).where(eq(users.id, user.id)).returning();

    await db.insert(achievements).values({
      userId: user.id,
      achievementId: achievementId,
    });

    return res.json({ 
      success: true, 
      newBalance: updated.balance,
      newTotalEarned: updated.totalEarned, // рџ‘€ РІРѕР·РІСЂР°С‰Р°РµРј
      xp: updated.xp, // рџ‘€ РІРѕР·РІСЂР°С‰Р°РµРј
      reward: config.reward,
      xpReward,
    });
  } catch (e) {
    console.error('Claim achievement error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/claimAdReward.ts
```ts
// api/_lib/handlers/claimAdReward.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq, sql } from 'drizzle-orm';
import { logTransaction } from '../logger.js';

export async function claimAdRewardHandler(req: any, res: any) {
  const userId = req.query.userId;
  if (!userId) return res.status(400).send('Missing userId');

  try {
    // РќР°С‡РёСЃР»СЏРµРј 5000 в‚Ѕ
    await db.update(users)
      .set({ 
        balance: sql`${users.balance} + 5000`,
        totalEarned: sql`${users.totalEarned} + 5000`
      })
      .where(eq(users.id, Number(userId)));

    // Р›РѕРіРёСЂСѓРµРј РїРѕРїРѕР»РЅРµРЅРёРµ
    await logTransaction(Number(userId), 5000, 'ad_reward', 'РџСЂРѕСЃРјРѕС‚СЂ СЂРµРєР»Р°РјС‹ Р·Р° РІРѕР·РЅР°РіСЂР°Р¶РґРµРЅРёРµ');

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Ad reward error:', error);
    return res.status(500).send('Internal error');
  }
}
```

### api/_lib/handlers/claimDaily.ts
```ts
// api/_lib/handlers/claimDaily.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { getOrCreatePass } from '../pass.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

// РќР°РіСЂР°РґС‹ Р·Р° 1-7 РґРµРЅСЊ
const DAILY_REWARDS = [1000, 2500, 5000, 10000, 25000, 50000, 100000];

// Р’СЃРїРѕРјРѕРіР°С‚РµР»СЊРЅР°СЏ С„СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ 00:00 РїРѕ РњРЎРљ (РІ С„РѕСЂРјР°С‚Рµ UTC timestamp)
const getMskMidnight = (offsetDays = 0) => {
  const now = new Date();
  const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // РџРµСЂРµРІРѕРґ РІ UTC+3
  mskTime.setUTCHours(0, 0, 0, 0); // РЎС‚Р°РІРёРј 00:00
  mskTime.setUTCDate(mskTime.getUTCDate() + offsetDays); // РЎРґРІРёРіР°РµРј РґРЅРё
  return mskTime.getTime() - 3 * 60 * 60 * 1000; // Р’РѕР·РІСЂР°С‰Р°РµРј РІ UTC
};

export async function claimDailyHandler(req: any, res: any) {
  const { initData } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const lastClaimTime = user.lastDailyClaim ? new Date(user.lastDailyClaim).getTime() : 0;
    
    // Р’СЂРµРјСЏ РЅР°С‡Р°Р»Р° СЃРµРіРѕРґРЅСЏС€РЅРµРіРѕ РґРЅСЏ Рё РІС‡РµСЂР°С€РЅРµРіРѕ РґРЅСЏ РїРѕ РњРЎРљ
    const todayMidnightMsk = getMskMidnight(0);
    const yesterdayMidnightMsk = getMskMidnight(-1);

    // вќЊ Р•СЃР»Рё РїРѕСЃР»РµРґРЅРёР№ РєР»РµР№Рј Р±С‹Р» РџРћРЎР›Р• СЃРµРіРѕРґРЅСЏС€РЅРµР№ РїРѕР»СѓРЅРѕС‡Рё вЂ” РЅР°РіСЂР°РґР° СѓР¶Рµ РїРѕР»СѓС‡РµРЅР°
    if (lastClaimTime >= todayMidnightMsk) {
      return res.status(400).json({ error: 'РќР°РіСЂР°РґР° РµС‰Рµ РЅРµ РіРѕС‚РѕРІР°. Р–РґРёС‚Рµ 00:00 РњРЎРљ.' });
    }

    // рџ“€ РЎС‡РёС‚Р°РµРј СЃС‚СЂРёРє
    let newStreak = user.dailyStreak || 0;
    
    // Р•СЃР»Рё РїРѕСЃР»РµРґРЅРёР№ СЂР°Р· Р·Р°Р±РёСЂР°Р»Рё Р’Р§Р•Р Рђ (РїРѕСЃР»Рµ РІС‡РµСЂР°С€РЅРµР№ РїРѕР»СѓРЅРѕС‡Рё) вЂ” СЃС‚СЂРёРє РїСЂРѕРґРѕР»Р¶Р°РµС‚СЃСЏ
    if (lastClaimTime >= yesterdayMidnightMsk) {
      newStreak = (newStreak % 7) + 1; 
    } else {
      // Р•СЃР»Рё РїСЂРѕРїСѓСЃС‚РёР»Рё РґРµРЅСЊ (РёР»Рё СЌС‚Рѕ РїРµСЂРІС‹Р№ Р·Р°С…РѕРґ) вЂ” СЃС‚СЂРёРє СЃР±СЂР°СЃС‹РІР°РµС‚СЃСЏ РЅР° 1
      newStreak = 1; 
    }

    const reward = DAILY_REWARDS[newStreak - 1];
    const now = new Date();

    const XP_REWARD = 25;
    const pass = getOrCreatePass(user.weeklyPass); // рџ‘€ РЅСѓР¶РµРЅ import
    const xpMultiplier = pass.isPremium ? 5 : 1;
    pass.xp += XP_REWARD * xpMultiplier;

    const [updated] = await db.update(users).set({
    balance: sql`${users.balance} + ${reward}`,
    totalEarned: sql`${users.totalEarned} + ${reward}`,
    earnedFromBusiness: sql`${users.earnedFromBusiness} + ${reward}`,
    dailyStreak: newStreak,
    lastDailyClaim: now,
    xp: sql`${users.xp} + ${XP_REWARD}`,
    weeklyPass: pass, // рџ‘€
    }).where(eq(users.id, userId)).returning();

    return res.json({ 
      success: true, 
      newBalance: updated.balance, 
      newTotalEarned: updated.totalEarned, // рџ‘€ РІРѕР·РІСЂР°С‰Р°РµРј РЅР° РєР»РёРµРЅС‚
      earnedFromBusiness: updated.earnedFromBusiness,
      dailyStreak: updated.dailyStreak, 
      lastDailyClaim: updated.lastDailyClaim,
      xp: updated.xp, // рџ‘€ РІРѕР·РІСЂР°С‰Р°РµРј XP
      reward 
    });
  } catch (error) {
    console.error('Claim Daily error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### api/_lib/handlers/claimLevelReward.ts
```ts
// api/_lib/handlers/claimLevelReward.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { LEVEL_REWARDS, calcLevel } from '../../../src/config/levelRewards.js';

export async function claimLevelRewardHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const currentLevel = calcLevel(user.xp || 0);
    const lastClaimed = user.lastClaimedLevel || 1;

    // Р•СЃР»Рё СѓСЂРѕРІРµРЅСЊ РЅРµ РІС‹СЂРѕСЃ вЂ” РЅРµС‡РµРіРѕ Р·Р°Р±РёСЂР°С‚СЊ
    if (currentLevel <= lastClaimed) {
      return res.status(400).json({ error: 'РќРµС‚ РґРѕСЃС‚СѓРїРЅС‹С… РЅР°РіСЂР°Рґ' });
    }

    // РЎРѕР±РёСЂР°РµРј РІСЃРµ РЅР°РіСЂР°РґС‹ РѕС‚ lastClaimed+1 РґРѕ currentLevel
    const rewardsToClaim = LEVEL_REWARDS.filter(
      r => r.level > lastClaimed && r.level <= currentLevel
    );

    // Р•СЃР»Рё СѓСЂРѕРІРµРЅСЊ РІС‹СЂРѕСЃ, РЅРѕ РєРѕРЅРєСЂРµС‚РЅС‹С… РЅР°РіСЂР°Рґ РЅРµС‚ вЂ” РїСЂРѕСЃС‚Рѕ РѕР±РЅРѕРІР»СЏРµРј lastClaimedLevel
    if (rewardsToClaim.length === 0) {
      await db.update(users).set({
        lastClaimedLevel: currentLevel,
      }).where(eq(users.id, user.id));

      return res.json({ 
        success: true, 
        claimed: [], 
        newBalance: user.balance,
        newStars: user.starsBalance,
        newLastClaimedLevel: currentLevel,
        message: 'РЈСЂРѕРІРµРЅСЊ РїРѕРІС‹С€РµРЅ, РЅРѕ РЅР°РіСЂР°РґС‹ Р·Р° РЅРµРіРѕ РЅРµС‚'
      });
    }

    // РЎСѓРјРјРёСЂСѓРµРј РЅР°РіСЂР°РґС‹
    const totalRubles = rewardsToClaim.reduce((sum, r) => sum + (r.rubles || 0), 0);
    const totalStars = rewardsToClaim.reduce((sum, r) => sum + (r.stars || 0), 0);
    
    // РљРµР№СЃС‹ вЂ” СЃР°РјС‹Р№ С†РµРЅРЅС‹Р№ РІР°СЂРёР°РЅС‚
    const bestCase = rewardsToClaim
      .filter(r => r.caseType)
      .sort((a, b) => {
        const rank = { hourly: 1, rare: 2, legendary: 3 };
        return (rank[b.caseType as keyof typeof rank] || 0) - (rank[a.caseType as keyof typeof rank] || 0);
      })[0]?.caseType;

    // РћР±РЅРѕРІР»СЏРµРј Р‘Р”
    const [updated] = await db.update(users).set({
      balance: sql`${users.balance} + ${totalRubles}`,
      totalEarned: sql`${users.totalEarned} + ${totalRubles}`,
      starsBalance: sql`${users.starsBalance} + ${totalStars}`,
      lastClaimedLevel: currentLevel,
    }).where(eq(users.id, user.id)).returning();

    return res.json({
      success: true,
      claimed: rewardsToClaim,
      totalRubles,
      totalStars,
      caseType: bestCase || null,
      newBalance: updated.balance,
      newStars: updated.starsBalance,
      newTotalEarned: updated.totalEarned,
      newLastClaimedLevel: currentLevel,
    });
  } catch (e) {
    console.error('[claimLevelReward]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/claimPassReward.ts
```ts
// api/_lib/handlers/claimPassReward.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreatePass, PASS_LEVELS, PassLevel } from '../pass.js';

export async function claimPassRewardHandler(req: any, res: any) {
  try {
    const { initData, level, track } = req.body; // рџ‘€ track = 'free' РёР»Рё 'premium'
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const pass = getOrCreatePass(user.weeklyPass);
    const levelConfig = PASS_LEVELS.find((l: PassLevel) => l.level === level);

    if (!levelConfig) return res.status(400).json({ error: 'РЈСЂРѕРІРµРЅСЊ РЅРµ РЅР°Р№РґРµРЅ' });
    if (pass.xp < levelConfig.xpReq) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ РѕРїС‹С‚Р°' });

    let rewardAmount = levelConfig.reward;

    if (track === 'premium') {
      if (!pass.isPremium) return res.status(400).json({ error: 'РџСЂРµРјРёСѓРј РїСЂРѕРїСѓСЃРє РЅРµ РєСѓРїР»РµРЅ' });
      if (pass.claimedPremium.includes(level)) return res.status(400).json({ error: 'РЈР¶Рµ РїРѕР»СѓС‡РµРЅРѕ' });
      
      rewardAmount = levelConfig.reward * 3; // рџ‘€ РҐ3 РќРђР“Р РђР”Рђ
      pass.claimedPremium.push(level);
    } else {
      if (pass.claimed.includes(level)) return res.status(400).json({ error: 'РЈР¶Рµ РїРѕР»СѓС‡РµРЅРѕ' });
      pass.claimed.push(level);
    }

    const newBalance = user.balance + rewardAmount;
    const newTotalEarned = user.totalEarned + rewardAmount;

    await db.update(users).set({ 
      balance: newBalance, 
      totalEarned: newTotalEarned,
      weeklyPass: pass 
    }).where(eq(users.id, user.id));

    return res.json({ success: true, newBalance, pass });
  } catch (e) {
    console.error('Claim pass error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/claimQuest.ts
```ts
// api/_lib/handlers/claimQuest.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { getOrCreateQuests, QUESTS_CONFIG } from '../quests.js';

export async function claimQuestHandler(req: any, res: any) {
  try {
    const { initData, questId } = req.body;
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!validatedData || !validatedData.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const userId = validatedData.user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const quests = getOrCreateQuests(user.dailyQuests);
    const config = QUESTS_CONFIG[questId as keyof typeof QUESTS_CONFIG];

    if (!config) return res.status(400).json({ success: false, error: 'РљРІРµСЃС‚ РЅРµ РЅР°Р№РґРµРЅ' });
    if (quests.claimed[questId]) return res.status(400).json({ success: false, error: 'РќР°РіСЂР°РґР° СѓР¶Рµ РїРѕР»СѓС‡РµРЅР°' });
    if ((quests.progress[questId] || 0) < config.target) return res.status(400).json({ success: false, error: 'РљРІРµСЃС‚ РµС‰Рµ РЅРµ РІС‹РїРѕР»РЅРµРЅ' });

    // РќР°С‡РёСЃР»СЏРµРј РЅР°РіСЂР°РґСѓ
    quests.claimed[questId] = true;

    const [updated] = await db.update(users)
      .set({
        balance: sql`${users.balance} + ${config.reward}`,
        totalEarned: sql`${users.totalEarned} + ${config.reward}`,
        xp: sql`${users.xp} + ${config.rewardXp}`, // рџ‘€ + XP Р·Р° РєРІРµСЃС‚
        dailyQuests: quests,
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      success: true,
      newBalance: updated.balance,
      newTotalEarned: updated.totalEarned,
      xp: updated.xp, // рџ‘€ РІРѕР·РІСЂР°С‰Р°РµРј XP
      rewardXp: config.rewardXp,
      quests,
    });
  } catch (error) {
    console.error('claimQuest error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
```

### api/_lib/handlers/claimUpgrade.ts
```ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function claimUpgradeHandler(req: any, res: any) {
  try {
    const { initData, itemId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    const partUpg = { ...(user.partUpgrades || {}) };
    const currentUpg = partUpg[itemId];

    if (!currentUpg || !currentUpg.upgradingUntil || currentUpg.upgradingUntil > Date.now()) {
      return res.status(400).json({ error: 'РЈР»СѓС‡С€РµРЅРёРµ РµС‰Рµ РЅРµ Р·Р°РІРµСЂС€РµРЅРѕ' });
    }

    // РџСЂРёРјРµРЅСЏРµРј СЂРµР·СѓР»СЊС‚Р°С‚
    if (currentUpg.upgradeType === 'level') currentUpg.level += 1;
    if (currentUpg.upgradeType === 'gold') currentUpg.goldStars += 1;
    if (currentUpg.upgradeType === 'red') currentUpg.redStars += 1;

    currentUpg.upgradingUntil = null;
    currentUpg.upgradeType = null;
    partUpg[itemId] = currentUpg;

    await db.update(users).set({ partUpgrades: partUpg }).where(eq(users.id, user.id));
    return res.json({ success: true, partUpgrades: partUpg });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/clanAction.ts
```ts
// api/_lib/handlers/clanAction.ts
import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and } from 'drizzle-orm';
import { getClanStats } from '../clans.js';

export async function clanActionHandler(req: any, res: any) {
  try {
    const { initData, action, amount, targetId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = valid.user.id;
    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, userId));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Р’С‹ РЅРµ РІ РєР»Р°РЅРµ' });
    
    const myMember = memberRecord[0];
    const clanId = myMember.clanId;
    const myRole = myMember.role;

    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    // --- Р”РћРќРђРў ---
    if (action === 'donate') {
      if (!amount || amount <= 0) return res.status(400).json({ error: 'РќРµРІРµСЂРЅР°СЏ СЃСѓРјРјР°' });
      if (user.balance < amount) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ' });

      await db.update(users).set({ balance: user.balance - amount }).where(eq(users.id, user.id));
      await db.update(clans).set({ balance: clan.balance + amount }).where(eq(clans.id, clan.id));
      await db.update(clanMembers)
        .set({ contribution: myMember.contribution + amount })
        .where(and(eq(clanMembers.userId, userId), eq(clanMembers.clanId, clanId)));

      return res.json({ success: true, newBalance: user.balance - amount, newClanBalance: clan.balance + amount });
    }

    // --- РЈР›РЈР§РЁР•РќРР• РљР›РђРќРђ (С‚РѕР»СЊРєРѕ Р»РёРґРµСЂ) ---
    if (action === 'upgrade') {
      if (myRole !== 'leader') return res.status(403).json({ error: 'РўРѕР»СЊРєРѕ Р»РёРґРµСЂ РјРѕР¶РµС‚ РєР°С‡Р°С‚СЊ РєР»Р°РЅ' });
      const nextStats = getClanStats(clan.level + 1);
      if (!nextStats) return res.status(400).json({ error: 'Р”РѕСЃС‚РёРіРЅСѓС‚ РјР°РєСЃРёРјР°Р»СЊРЅС‹Р№ СѓСЂРѕРІРµРЅСЊ' });
      if (clan.balance < nextStats.upgradeCost) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ СЃСЂРµРґСЃС‚РІ РІ РєР°Р·РЅРµ' });

      await db.update(clans)
        .set({ balance: clan.balance - nextStats.upgradeCost, level: nextStats.level })
        .where(eq(clans.id, clan.id));

      return res.json({ success: true, newClanLevel: nextStats.level, newClanBalance: clan.balance - nextStats.upgradeCost });
    }

        // --- РџРћРљРЈРџРљРђ РњР•РЎРўРђ ---
    if (action === 'buySlot') {
      if (myRole !== 'leader') return res.status(403).json({ error: 'РўРѕР»СЊРєРѕ Р»РёРґРµСЂ РјРѕР¶РµС‚ РїРѕРєСѓРїР°С‚СЊ РјРµСЃС‚Р°' });
      
      const SLOT_COST = 250000; // Р¦РµРЅР° РѕРґРЅРѕРіРѕ РјРµСЃС‚Р°
      if (clan.balance < SLOT_COST) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ СЃСЂРµРґСЃС‚РІ РІ РєР°Р·РЅРµ' });
      
      // Р›РёРјРёС‚: РЅР°РїСЂРёРјРµСЂ, РјР°РєСЃРёРјСѓРј 10 РєСѓРїР»РµРЅРЅС‹С… РјРµСЃС‚ (РЅР°СЃС‚СЂР°РёРІР°Р№ РїРѕ РІРєСѓСЃСѓ)
      if (clan.extraSlots >= 10) return res.status(400).json({ error: 'Р”РѕСЃС‚РёРіРЅСѓС‚ Р»РёРјРёС‚ РїРѕРєСѓРїРЅС‹С… РјРµСЃС‚' });

      await db.update(clans)
        .set({ balance: clan.balance - SLOT_COST, extraSlots: clan.extraSlots + 1 })
        .where(eq(clans.id, clan.id));

      return res.json({ success: true, newClanBalance: clan.balance - SLOT_COST });
    }
    
    // --- РљРРљ РЈР§РђРЎРўРќРРљРђ (Р›РёРґРµСЂ РёР»Рё РћС„РёС†РµСЂ) ---
    if (action === 'kick') {
      if (myRole === 'member') return res.status(403).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ РїСЂР°РІ' });
      if (targetId === userId) return res.status(400).json({ error: 'РќРµР»СЊР·СЏ РєРёРєРЅСѓС‚СЊ СЃРµР±СЏ' });

      const targetMember = await db.select().from(clanMembers).where(and(eq(clanMembers.userId, targetId), eq(clanMembers.clanId, clanId)));
      if (targetMember.length === 0) return res.status(404).json({ error: 'РРіСЂРѕРє РЅРµ РІ РєР»Р°РЅРµ' });
      if (targetMember[0].role === 'leader') return res.status(403).json({ error: 'РќРµР»СЊР·СЏ РєРёРєРЅСѓС‚СЊ Р»РёРґРµСЂР°' });
      if (targetMember[0].role === 'officer' && myRole !== 'leader') return res.status(403).json({ error: 'РћС„РёС†РµСЂ РЅРµ РјРѕР¶РµС‚ РєРёРєРЅСѓС‚СЊ РѕС„РёС†РµСЂР°' });

      await db.delete(clanMembers).where(and(eq(clanMembers.userId, targetId), eq(clanMembers.clanId, clanId)));
      return res.json({ success: true });
    }

    // --- РџРћР’Р«РЁР•РќРР• / РџРћРќРР–Р•РќРР• (С‚РѕР»СЊРєРѕ Р»РёРґРµСЂ) ---
    if (action === 'setRole') {
      if (myRole !== 'leader') return res.status(403).json({ error: 'РўРѕР»СЊРєРѕ Р»РёРґРµСЂ РјРѕР¶РµС‚ РјРµРЅСЏС‚СЊ СЂРѕР»Рё' });
      if (targetId === userId) return res.status(400).json({ error: 'РќРµР»СЊР·СЏ РёР·РјРµРЅРёС‚СЊ СЃРІРѕСЋ СЂРѕР»СЊ' });
      
      const newRole = req.body.role; // 'officer' | 'member'
      if (!['officer', 'member'].includes(newRole)) return res.status(400).json({ error: 'РќРµРІРµСЂРЅР°СЏ СЂРѕР»СЊ' });

      await db.update(clanMembers).set({ role: newRole }).where(and(eq(clanMembers.userId, targetId), eq(clanMembers.clanId, clanId)));
      return res.json({ success: true });
    }

    // --- РџР•Р Р•Р”РђР§Рђ Р›РР”Р•Р РЎРўР’Рђ (С‚РѕР»СЊРєРѕ Р»РёРґРµСЂ) ---
    if (action === 'transfer') {
      if (myRole !== 'leader') return res.status(403).json({ error: 'РўРѕР»СЊРєРѕ Р»РёРґРµСЂ РјРѕР¶РµС‚ РїРµСЂРµРґР°С‚СЊ РєР»Р°РЅ' });
      if (targetId === userId) return res.status(400).json({ error: 'Р’С‹ СѓР¶Рµ Р»РёРґРµСЂ' });

      const targetMember = await db.select().from(clanMembers).where(and(eq(clanMembers.userId, targetId), eq(clanMembers.clanId, clanId)));
      if (targetMember.length === 0) return res.status(404).json({ error: 'РРіСЂРѕРє РЅРµ РІ РєР»Р°РЅРµ' });

      // РњРµРЅСЏРµРј Р»РёРґРµСЂР° РІ РєР»Р°РЅРµ
      await db.update(clans).set({ leaderId: targetId }).where(eq(clans.id, clanId));
      // РњРµРЅСЏРµРј СЂРѕР»Рё
      await db.update(clanMembers).set({ role: 'leader' }).where(eq(clanMembers.userId, targetId));
      await db.update(clanMembers).set({ role: 'member' }).where(eq(clanMembers.userId, userId));

      return res.json({ success: true });
    }

    // --- Р’Р«РҐРћР” РР— РљР›РђРќРђ ---
    if (action === 'leave') {
      if (myRole === 'leader') {
        const members = await db.select().from(clanMembers).where(eq(clanMembers.clanId, clanId));
        if (members.length > 1) return res.status(400).json({ error: 'РџРµСЂРµРґР°Р№С‚Рµ Р»РёРґРµСЂСЃС‚РІРѕ РїРµСЂРµРґ РІС‹С…РѕРґРѕРј' });
        // Р•СЃР»Рё Р»РёРґРµСЂ РѕРґРёРЅ - СѓРґР°Р»СЏРµРј РєР»Р°РЅ
        await db.delete(clans).where(eq(clans.id, clanId));
      }
      await db.delete(clanMembers).where(eq(clanMembers.userId, userId));
      return res.json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    console.error('Clan Action error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/clanBoss.ts
```ts
import { db } from '../db.js';
import { users, clans, clanMembers, clanBosses } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, sql, desc } from 'drizzle-orm';

export async function getClanBossHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Р’С‹ РЅРµ РІ РєР»Р°РЅРµ' });
    const clanId = memberRecord[0].clanId;

    let [boss] = await db.select().from(clanBosses).where(eq(clanBosses.clanId, clanId));
    if (!boss) {
      const maxHp = 1000000;
      const [newBoss] = await db.insert(clanBosses).values({
        clanId: clanId, level: 1, currentHp: maxHp, maxHp: maxHp,
      }).returning();
      boss = newBoss;
    }

    // рџ‘‡ РџРћР›РЈР§РђР•Рњ РЎРўРђРўРРЎРўРРљРЈ РЈР РћРќРђ рџ‘‡
    const damageStats = await db.select({
      userId: clanMembers.userId,
      damage: clanMembers.bossDamage,
      firstName: users.firstName,
    })
    .from(clanMembers)
    .innerJoin(users, eq(clanMembers.userId, users.id))
    .where(eq(clanMembers.clanId, clanId))
    .orderBy(desc(clanMembers.bossDamage)) // РЎРѕСЂС‚РёСЂСѓРµРј РѕС‚ Р±РѕР»СЊС€РµРіРѕ Рє РјРµРЅСЊС€РµРјСѓ
    .limit(10); // Р‘РµСЂРµРј С‚РѕРї-10, С‡С‚РѕР±С‹ РЅРµ РїРµСЂРµРіСЂСѓР¶Р°С‚СЊ UI

    return res.json({ success: true, boss, damageStats });
  } catch (e) {
    console.error('Get Boss error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

export async function attackClanBossHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Р’С‹ РЅРµ РІ РєР»Р°РЅРµ' });
    const clanId = memberRecord[0].clanId;

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    let [boss] = await db.select().from(clanBosses).where(eq(clanBosses.clanId, clanId));

    if (!boss) return res.status(404).json({ error: 'Р‘РѕСЃСЃ РЅРµ РЅР°Р№РґРµРЅ' });
    if (boss.currentHp <= 0) return res.status(400).json({ error: 'Р‘РѕСЃСЃ СѓР¶Рµ РїРѕРІРµСЂР¶РµРЅ!' });

    const damage = (user.clickLevel || 1) * 500 + (user.rating || 100) * 10;
    const newHp = Math.max(0, boss.currentHp - damage);

    let isDefeated = false;
    let reward = 0;

    // Р—Р°РїРёСЃС‹РІР°РµРј СѓСЂРѕРЅ РёРіСЂРѕРєСѓ
    await db.update(clanMembers)
      .set({ bossDamage: sql`${clanMembers.bossDamage} + ${damage}` })
      .where(and(eq(clanMembers.userId, valid.user.id), eq(clanMembers.clanId, clanId)));

    if (newHp === 0) {
      isDefeated = true;
      reward = boss.level * 100000;
      
      await db.update(clans).set({ balance: sql`${clans.balance} + ${reward}` }).where(eq(clans.id, clanId));
      await db.update(clanMembers).set({ contribution: sql`${clanMembers.contribution} + ${reward}` }).where(eq(clanMembers.userId, valid.user.id));
      
      const nextHp = Math.floor(boss.maxHp * 1.5);
      await db.update(clanBosses).set({
        level: boss.level + 1, currentHp: nextHp, maxHp: nextHp, lastDefeatedAt: new Date()
      }).where(eq(clanBosses.clanId, clanId));

      // рџ‘‡ РћР‘РќРЈР›РЇР•Рњ РЈР РћРќ Р’РЎР•Рњ РЈР§РђРЎРўРќРРљРђРњ Р”Р›РЇ РќРћР’РћР“Рћ Р‘РћРЎРЎРђ рџ‘‡
      await db.update(clanMembers).set({ bossDamage: 0 }).where(eq(clanMembers.clanId, clanId));

    } else {
      await db.update(clanBosses).set({ currentHp: newHp }).where(eq(clanBosses.clanId, clanId));
    }

    const playerCoins = Math.floor(damage / 10);
    await db.update(users).set({ 
      balance: sql`${users.balance} + ${playerCoins}`,
      totalEarned: sql`${users.totalEarned} + ${playerCoins}`
    }).where(eq(users.id, valid.user.id));

    return res.json({ 
      success: true, damage, newHp, isDefeated, reward, playerCoins, newBalance: user.balance + playerCoins 
    });
  } catch (e) {
    console.error('Attack Boss error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/clanChat.ts
```ts
import { db } from '../db.js';
import { users, clanMembers, clanMessages } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, desc, and } from 'drizzle-orm';

export async function getClanMessagesHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Р’С‹ РЅРµ РІ РєР»Р°РЅРµ' });
    const clanId = memberRecord[0].clanId;

    // Р‘РµСЂРµРј РїРѕСЃР»РµРґРЅРёРµ 50 СЃРѕРѕР±С‰РµРЅРёР№
    const messages = await db.select({
      id: clanMessages.id,
      message: clanMessages.message,
      createdAt: clanMessages.createdAt,
      userId: clanMessages.userId,
      firstName: users.firstName,
      username: users.username
    })
    .from(clanMessages)
    .innerJoin(users, eq(clanMessages.userId, users.id))
    .where(eq(clanMessages.clanId, clanId))
    .orderBy(desc(clanMessages.createdAt))
    .limit(50);

    // РџРµСЂРµРІРѕСЂР°С‡РёРІР°РµРј, С‡С‚РѕР±С‹ СЃС‚Р°СЂС‹Рµ Р±С‹Р»Рё СЃРІРµСЂС…Сѓ
    return res.json({ success: true, messages: messages.reverse() });
  } catch (e) {
    console.error('Get Chat error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

export async function sendClanMessageHandler(req: any, res: any) {
  try {
    const { initData, message } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    if (!message || message.trim().length === 0) return res.status(400).json({ error: 'РџСѓСЃС‚РѕРµ СЃРѕРѕР±С‰РµРЅРёРµ' });
    if (message.length > 200) return res.status(400).json({ error: 'РЎР»РёС€РєРѕРј РґР»РёРЅРЅРѕРµ СЃРѕРѕР±С‰РµРЅРёРµ' });

    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (memberRecord.length === 0) return res.status(403).json({ error: 'Р’С‹ РЅРµ РІ РєР»Р°РЅРµ' });
    const clanId = memberRecord[0].clanId;

    await db.insert(clanMessages).values({
      clanId: clanId,
      userId: valid.user.id,
      message: message.trim(),
    });

    return res.json({ success: true });
  } catch (e) {
    console.error('Send Chat error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/collectIncome.ts
```ts
// api/_lib/handlers/collectIncome.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { BUSINESSES, getBusinessIncome } from '../businesses.js';

export async function collectIncomeHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const businesses = { ...(user.businesses || {}) };
    const now = Date.now();
    let totalEarned = 0;
    let hasChanges = false;

    for (const [id, data] of Object.entries(businesses)) {
      const config = BUSINESSES[id];
      if (!config) continue;

      const timePassedMs = now - data.lastCollected;
      const hoursPassed = Math.min(timePassedMs / (1000 * 60 * 60), 24);

      if (hoursPassed > 0) {
        const incomePerHour = getBusinessIncome(config.baseIncomePerHour, data.level);
        const earned = Math.floor(incomePerHour * hoursPassed);

        if (earned > 0) {
          totalEarned += earned;
          businesses[id] = { ...data, lastCollected: now };
          hasChanges = true;
        }
      }
    }

    if (totalEarned === 0 || !hasChanges) {
      return res.json({ success: true, newBalance: user.balance, businesses: user.businesses, collected: 0 });
    }

    const [updated] = await db.update(users).set({ 
      balance: sql`${users.balance} + ${totalEarned}`,
      totalEarned: sql`${users.totalEarned} + ${totalEarned}`,
      earnedFromBusiness: sql`${users.earnedFromBusiness} + ${totalEarned}`, // рџ‘€ Р”РћР‘РђР’Р›Р•РќРћ
      businesses 
    }).where(eq(users.id, user.id)).returning();

    return res.json({ success: true, newBalance: updated.balance, businesses, collected: totalEarned, earnedFromBusiness: updated.earnedFromBusiness, });
  } catch (e) {
    console.error('Collect income error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/craftItem.ts
```ts
import { db } from '../db.js';
import { users, userItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, sql } from 'drizzle-orm';
import { ITEMS } from '../items.js';

export async function craftItemHandler(req: any, res: any) {
  try {
    const { initData, itemId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const item = ITEMS[itemId];
    if (!item) return res.status(400).json({ error: 'Item not found' });

    // РС‰РµРј СЃР»РµРґСѓСЋС‰РёР№ СЂР°РЅРі
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const nextRarityIndex = rarities.indexOf(item.rarity) + 1;
    if (nextRarityIndex >= rarities.length) return res.status(400).json({ error: 'РњР°РєСЃРёРјР°Р»СЊРЅС‹Р№ СЂР°РЅРі' });
    
    // Р¤РѕСЂРјРёСЂСѓРµРј ID СЃР»РµРґСѓСЋС‰РµРіРѕ РїСЂРµРґРјРµС‚Р° (РЅР°РїСЂРёРјРµСЂ, engine_1 -> engine_2)
    const nextId = itemId.replace(/_\d$/, `_${nextRarityIndex + 1}`);
    if (!ITEMS[nextId]) return res.status(400).json({ error: 'РќРµС‚ СЃР»РµРґСѓСЋС‰РµРіРѕ РїСЂРµРґРјРµС‚Р°' });

    // РџСЂРѕРІРµСЂСЏРµРј, РµСЃС‚СЊ Р»Рё 5 С€С‚СѓРє
    const owned = await db.select().from(userItems).where(and(eq(userItems.userId, valid.user.id), eq(userItems.itemId, itemId)));
    if (owned.length < 5) return res.status(400).json({ error: 'РќСѓР¶РЅРѕ 5 РґРµС‚Р°Р»РµР№' });

    // РЈРґР°Р»СЏРµРј 5 С€С‚СѓРє
    const toDelete = owned.slice(0, 5).map(i => i.id);
    await db.delete(userItems).where(sql`${userItems.id} IN ${toDelete}`);

    // Р”РѕР±Р°РІР»СЏРµРј 1 РЅРѕРІСѓСЋ
    await db.insert(userItems).values({ userId: valid.user.id, itemId: nextId });

    return res.json({ success: true, newItemId: nextId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/createClan.ts
```ts
import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { CLAN_CREATE_COST } from '../clans.js';

export async function createClanHandler(req: any, res: any) {
  try {
    const { initData, name } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    if (!name || name.length < 3) return res.status(400).json({ error: 'РќР°Р·РІР°РЅРёРµ СЃР»РёС€РєРѕРј РєРѕСЂРѕС‚РєРѕРµ' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (user.balance < CLAN_CREATE_COST) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ' });

    const alreadyInClan = await db.select().from(clanMembers).where(eq(clanMembers.userId, user.id));
    if (alreadyInClan.length > 0) return res.status(400).json({ error: 'Р’С‹ СѓР¶Рµ РІ РєР»Р°РЅРµ' });

    // РЎРїРёСЃС‹РІР°РµРј РґРµРЅСЊРіРё
    await db.update(users).set({ balance: user.balance - CLAN_CREATE_COST }).where(eq(users.id, user.id));

    // РЎРѕР·РґР°РµРј РєР»Р°РЅ
    const [newClan] = await db.insert(clans).values({ name, leaderId: user.id }).returning();
    
    // Р”РѕР±Р°РІР»СЏРµРј Р»РёРґРµСЂР°
    await db.insert(clanMembers).values({ userId: user.id, clanId: newClan.id, role: 'leader' });

    return res.json({ success: true, newBalance: user.balance - CLAN_CREATE_COST });
  } catch (e: any) {
    if (e.code === '23505') return res.status(400).json({ error: 'РљР»Р°РЅ СЃ С‚Р°РєРёРј РЅР°Р·РІР°РЅРёРµРј СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓРµС‚' });
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/equip.ts
```ts
import { db } from '../db.js';
import { equippedItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { and, eq } from 'drizzle-orm';

export async function equipHandler(req: any, res: any) {
  const { initData, itemId, slot } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const existing = await db.query.equippedItems.findFirst({
      where: and(eq(equippedItems.userId, validatedData.user.id), eq(equippedItems.slot, slot))
    });

    if (existing) {
      await db.update(equippedItems).set({ itemId }).where(and(eq(equippedItems.userId, validatedData.user.id), eq(equippedItems.slot, slot)));
    } else {
      await db.insert(equippedItems).values({ userId: validatedData.user.id, slot, itemId });
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/flipCoin.ts
```ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function flipCoinHandler(req: any, res: any) {
  try {
    const { initData, betAmount, choice } = req.body; // choice: 'heads' | 'tails'
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const bet = Math.floor(betAmount);
    if (!bet || bet < 100 || bet > 1000000) {
      return res.status(400).json({ error: 'РЎС‚Р°РІРєР° РґРѕР»Р¶РЅР° Р±С‹С‚СЊ РѕС‚ 100 РґРѕ 1 000 000' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.balance < bet) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ' });

    // РЎРїРёСЃС‹РІР°РµРј СЃС‚Р°РІРєСѓ
    let newBalance = user.balance - bet;
    
    // РЎРµСЂРІРµСЂ РєРёРґР°РµС‚ в‚ЅРєСѓ
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const isWin = result === choice;
    
    let payout = 0;
    if (isWin) {
      payout = Math.floor(bet * 1.9); // РљРѕСЌС„С„РёС†РёРµРЅС‚ 1.9
      newBalance += payout;
    }

    const newTotalEarned = isWin ? user.totalEarned + payout : user.totalEarned;

    await db.update(users)
      .set({ balance: newBalance, totalEarned: newTotalEarned })
      .where(eq(users.id, user.id));

    return res.json({ 
      success: true, 
      result, 
      isWin, 
      payout, 
      newBalance 
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/getAchievements.ts
```ts
// api/_lib/handlers/getAchievements.ts
import { db } from '../db.js';
import { users, achievements } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { ACHIEVEMENTS } from '../../../src/config/achievements.js';

export async function getAchievementsHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const unlockedRecords = await db.select().from(achievements).where(eq(achievements.userId, user.id));
    const unlockedIds = unlockedRecords.map(r => r.achievementId);

    const list = ACHIEVEMENTS.map(ach => {
      const isUnlocked = unlockedIds.includes(ach.id);
      const isCompleted = ach.check(user);

      return {
        id: ach.id,
        category: ach.category, // рџ‘€ Р”РћР‘РђР’Р›Р•РќРћ
        tier: ach.tier,         // рџ‘€ Р”РћР‘РђР’Р›Р•РќРћ
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        reward: ach.reward,
        isUnlocked,
        isCompleted,
      };
    });

    return res.json({ success: true, achievements: list });
  } catch (e) {
    console.error('Get achievements error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/getClan.ts
```ts
// api/_lib/handlers/getClan.ts
import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getClanStats } from '../clans.js';

export async function getClanHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = valid.user.id;
    const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, userId));
    
    if (memberRecord.length === 0) {
      return res.json({ success: true, clan: null, members: [] });
    }

    const clanId = memberRecord[0].clanId;
    const [clan] = await db.select().from(clans).where(eq(clans.id, clanId));
    
    // РџРѕР»СѓС‡Р°РµРј РІСЃРµС… СѓС‡Р°СЃС‚РЅРёРєРѕРІ
    const membersList = await db.select({
      userId: clanMembers.userId,
      role: clanMembers.role,
      contribution: clanMembers.contribution,
      firstName: users.firstName,
      username: users.username,
      balance: users.balance
    }).from(clanMembers)
      .innerJoin(users, eq(clanMembers.userId, users.id))
      .where(eq(clanMembers.clanId, clanId));

    const stats = getClanStats(clan.level);
    
    // рџ‘‡ РРЎРџР РђР’Р›Р•РќРћ: РСЃРїРѕР»СЊР·СѓРµРј clan.extraSlots Рё РїСЂР°РІРёР»СЊРЅРѕ СЃС‡РёС‚Р°РµРј РјР°РєСЃРёРјСѓРј
    const totalMaxMembers = (stats?.maxMembers || 5) + (clan.extraSlots || 0);

    // Р’РѕР·РІСЂР°С‰Р°РµРј РєР»Р°РЅ СЃ РѕР±РЅРѕРІР»РµРЅРЅС‹Рј maxMembers
    return res.json({ 
      success: true, 
      clan: { ...clan, ...stats, maxMembers: totalMaxMembers }, 
      members: membersList 
    });
  } catch (e) {
    console.error('Get Clan error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/getClans.ts
```ts
import { db } from '../db.js';
import { clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

export async function getClansHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // РџРѕР»СѓС‡Р°РµРј РІСЃРµ РѕС‚РєСЂС‹С‚С‹Рµ РєР»Р°РЅС‹ + СЃС‡РёС‚Р°РµРј СѓС‡Р°СЃС‚РЅРёРєРѕРІ
    const result = await db.select({
      id: clans.id,
      name: clans.name,
      level: clans.level,
      leaderId: clans.leaderId,
      extraSlots: clans.extraSlots,
      memberCount: sql<number>`count(${clanMembers.userId})::int`
    })
    .from(clans)
    .leftJoin(clanMembers, eq(clans.id, clanMembers.clanId))
    .where(eq(clans.isOpen, true))
    .groupBy(clans.id)
    .orderBy(clans.level); // РЎРѕСЂС‚РёСЂСѓРµРј РїРѕ СѓСЂРѕРІРЅСЋ (С‚РѕРїРѕРІС‹Рµ СЃРІРµСЂС…Сѓ)

    return res.json({ success: true, clans: result });
  } catch (e) {
    console.error('Get Clans error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/getHistory.ts
```ts
import { db } from '../db.js';
import { transactions } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, desc } from 'drizzle-orm';

export async function getHistoryHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const history = await db.select()
      .from(transactions)
      .where(eq(transactions.userId, valid.user.id))
      .orderBy(desc(transactions.createdAt))
      .limit(15); // Р‘РµСЂРµРј РїРѕСЃР»РµРґРЅРёРµ 15 Р·Р°РїРёСЃРµР№

    return res.json({ success: true, history });
  } catch (e) {
    console.error('History error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/getPass.ts
```ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreatePass } from '../pass.js';

export async function getPassHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const pass = getOrCreatePass(user.weeklyPass);
    
    // Р•СЃР»Рё РЅРµРґРµР»СЏ СЃРјРµРЅРёР»Р°СЃСЊ вЂ” СЃРѕС…СЂР°РЅСЏРµРј РЅРѕРІС‹Р№ РїСѓСЃС‚РѕР№ РїСЂРѕРїСѓСЃРє
    if (pass.weekId !== (user.weeklyPass as any)?.weekId) {
      await db.update(users).set({ weeklyPass: pass }).where(eq(users.id, user.id));
    }

    return res.json({ success: true, pass });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/getQuests.ts
```ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getOrCreateQuests } from '../quests.js';

export async function getQuestsHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!validatedData || !validatedData.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const userId = validatedData.user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // РџСЂРёРІРѕРґРёРј Рє any, С‡С‚РѕР±С‹ TS РЅРµ СЂСѓРіР°Р»СЃСЏ РЅР° РЅРµРёР·РІРµСЃС‚РЅС‹Р№ С‚РёРї JSONB
    const currentQuests = user.dailyQuests as any;
    const quests = getOrCreateQuests(currentQuests);
    
    // Р•СЃР»Рё РєРІРµСЃС‚С‹ СЃР±СЂРѕСЃРёР»РёСЃСЊ, СЃРѕС…СЂР°РЅСЏРµРј РЅРѕРІРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ
    if (quests.resetAt !== currentQuests?.resetAt) {
      await db.update(users).set({ dailyQuests: quests }).where(eq(users.id, userId));
    }

    return res.json({ success: true, quests });
  } catch (error) {
    console.error('getQuests error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
```

### api/_lib/handlers/getReferrals.ts
```ts
// api/_lib/handlers/getReferrals.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function getReferralsHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    // РќР°С…РѕРґРёРј РІСЃРµС… РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№, Сѓ РєРѕС‚РѕСЂС‹С… referredBy === РЅР°С€ id
    const referrals = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        photoUrl: users.photoUrl,
        totalEarned: users.totalEarned,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.referredBy, valid.user.id));

    return res.json({ success: true, referrals });
  } catch (e) {
    console.error('Get referrals error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/joinClan.ts
```ts
import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { getClanStats } from '../clans.js';

export async function joinClanHandler(req: any, res: any) {
  try {
    const { initData, clanName } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [clan] = await db.select().from(clans).where(eq(clans.name, clanName));
    if (!clan) return res.status(404).json({ error: 'РљР»Р°РЅ РЅРµ РЅР°Р№РґРµРЅ' });

    const alreadyIn = await db.select().from(clanMembers).where(eq(clanMembers.userId, valid.user.id));
    if (alreadyIn.length > 0) return res.status(400).json({ error: 'Р’С‹ СѓР¶Рµ РІ РєР»Р°РЅРµ' });

    const membersCount = await db.select().from(clanMembers).where(eq(clanMembers.clanId, clan.id));
    const stats = getClanStats(clan.level);
    const totalMaxMembers = (stats?.maxMembers || 5) + (clan.extraSlots || 0);
    if (membersCount.length >= totalMaxMembers) return res.status(400).json({ error: 'РљР»Р°РЅ РїРµСЂРµРїРѕР»РЅРµРЅ' });

    await db.insert(clanMembers).values({ userId: valid.user.id, clanId: clan.id, role: 'member' });

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/leaderboard.ts
```ts
// api/_lib/handlers/leaderboard.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { desc, eq } from 'drizzle-orm';

export async function leaderboardHandler(req: any, res: any) {
  try {
    const { initData } = req.body || {};
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const rawType = req.query.type;
    const type = Array.isArray(rawType) ? rawType[0] : (rawType || 'balance');

    // рџ‘‡ РІС‹Р±РёСЂР°РµРј СЃРѕСЂС‚РёСЂРѕРІРєСѓ
    let orderBy;
    if (type === 'xp') {
      orderBy = desc(users.xp);
    } else if (type === 'wins') {
      orderBy = desc(users.totalWins);
    } else {
      // balance (РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ)
      orderBy = desc(users.balance);
    }

    const players = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        photoUrl: users.photoUrl,
        balance: users.balance,
        xp: users.xp,
        totalWins: users.totalWins,
        rating: users.rating,
      })
      .from(users)
      .where(eq(users.isBanned, false))
      .orderBy(orderBy)
      .limit(50);

    return res.json({ success: true, players, type });
  } catch (e) {
    console.error('[leaderboard]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/openCase.ts
```ts
// api/_lib/handlers/openCase.ts
import { db } from '../db.js';
import { users, userItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { logTransaction } from '../logger.js';
import { eq } from 'drizzle-orm';

const CASES = {
  hourly: { 
    price: 0, 
    currency: 'ad',
    cooldownMs: 60 * 60 * 1000, 
    items: [
      { id: 'coins_5000', weight: 25 },
      { id: 'coins_10000', weight: 25 },
      { id: 'coins_20000', weight: 15 },
      { id: 'engine_2', weight: 12 },
      { id: 'tires_2', weight: 8 },
      { id: 'ecu_2', weight: 8 },     // рџ‘€ РџСЂРѕС€РёРІРєР°
      { id: 'susp_2', weight: 7 }     // рџ‘€ РџРѕРґРІРµСЃРєР° (С‚РѕР¶Рµ РґРѕР±Р°РІРёР»Рё РґР»СЏ Р±Р°Р»Р°РЅСЃР°)
    ] 
  },
  silver: { 
    price: 25000, 
    currency: 'coins',
    items: [
      { id: 'coins_10000', weight: 25 },
      { id: 'coins_25000', weight: 25 },
      { id: 'coins_40000', weight: 15 },
      { id: 'engine_2', weight: 12 },
      { id: 'tires_2', weight: 8 },
      { id: 'ecu_1', weight: 8 },     // рџ‘€ РџСЂРѕС€РёРІРєР°
      { id: 'susp_2', weight: 7 }
    ] 
  },
  gold: { 
    price: 100000, 
    currency: 'coins',
    items: [
      { id: 'coins_50000', weight: 25 },
      { id: 'coins_100000', weight: 25 },
      { id: 'coins_150000', weight: 15 },
      { id: 'engine_3', weight: 12 },
      { id: 'tires_3', weight: 8 },
      { id: 'ecu_3', weight: 8 },     // рџ‘€ РџСЂРѕС€РёРІРєР°
      { id: 'susp_3', weight: 7 }
    ] 
  },
  platinum: { 
    price: 500000, 
    currency: 'coins',
    items: [
      { id: 'coins_250000', weight: 25 },
      { id: 'coins_500000', weight: 25 },
      { id: 'coins_750000', weight: 15 },
      { id: 'engine_4', weight: 12 },
      { id: 'tires_4', weight: 8 },
      { id: 'ecu_4', weight: 8 },     // рџ‘€ Р”РћР‘РђР’Р›Р•РќРђ РџР РћРЁРР’РљРђ
      { id: 'susp_4', weight: 7 }
    ] 
  },
  diamond: { 
    price: 2000000, 
    currency: 'coins',
    items: [
      { id: 'coins_1000000', weight: 25 },
      { id: 'coins_2000000', weight: 25 },
      { id: 'coins_3000000', weight: 15 },
      { id: 'engine_5', weight: 10 },
      { id: 'tires_5', weight: 8 },
      { id: 'ecu_5', weight: 8 },     // рџ‘€ Р”РћР‘РђР’Р›Р•РќРђ Р›Р•Р“Р•РќР”РђР РќРђРЇ РџР РћРЁРР’РљРђ
      { id: 'susp_5', weight: 9 }
    ] 
  },
  star_premium: { 
    price: 50, 
    currency: 'stars',
    items: [
      { id: 'coins_2000000', weight: 20 },
      { id: 'coins_5000000', weight: 20 },
      { id: 'coins_10000000', weight: 15 },
      { id: 'engine_5', weight: 12 },
      { id: 'tires_5', weight: 11 },
      { id: 'ecu_5', weight: 12 },    // рџ‘€ РџСЂРѕС€РёРІРєР°
      { id: 'susp_5', weight: 10 }
    ] 
  }
};

export async function openCaseHandler(req: any, res: any) {
  try {
    const { initData, caseType } = req.body;
    
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const selectedCase = CASES[caseType as keyof typeof CASES];
    if (!selectedCase) return res.status(400).json({ error: 'РќРµРІРµСЂРЅС‹Р№ С‚РёРї РєРµР№СЃР°' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    let newBalance = user.balance;
    let newStars = user.starsBalance;
    let updateData: any = {};

    if (selectedCase.currency === 'ad') {
      const lastAd = user.lastAdCaseAt ? new Date(user.lastAdCaseAt).getTime() : 0;
      if (Date.now() - lastAd < (selectedCase as any).cooldownMs) {
        return res.status(400).json({ error: 'Р‘РµСЃРїР»Р°С‚РЅС‹Р№ РєРµР№СЃ РµС‰Рµ РЅРµ РіРѕС‚РѕРІ. Р–РґРёС‚Рµ.' });
      }
      updateData.lastAdCaseAt = new Date();
    } else if (selectedCase.currency === 'stars') {
      if (user.starsBalance < selectedCase.price) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ Р·РІРµР·Рґ' });
      newStars -= selectedCase.price;
      updateData.starsBalance = newStars;
    } else {
      if (user.balance < selectedCase.price) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ' });
      newBalance -= selectedCase.price;
    }

    const totalWeight = selectedCase.items.reduce((acc, item) => acc + item.weight, 0);
    let random = Math.random() * totalWeight;
    let wonItemId = selectedCase.items[0].id;
    
    for (const item of selectedCase.items) {
      if (random < item.weight) { wonItemId = item.id; break; }
      random -= item.weight;
    }

    const isCoins = wonItemId.startsWith('coins_');
    if (isCoins) {
      const amount = parseInt(wonItemId.split('_')[1]);
      newBalance += amount;
    }

    updateData.balance = newBalance;
    
    await db.update(users).set(updateData).where(eq(users.id, user.id));

    if (!isCoins) {
      await db.insert(userItems).values({ userId: user.id, itemId: wonItemId });
    }

    if (selectedCase.currency === 'coins') {
      await logTransaction(user.id, -selectedCase.price, 'case_open', `РћС‚РєСЂС‹С‚РёРµ ${caseType} РєРµР№СЃР°`);
    }
    if (isCoins) {
      const amount = parseInt(wonItemId.split('_')[1]);
      await logTransaction(user.id, amount, 'case_reward', `Р’С‹РёРіСЂС‹С€ РІ ${caseType} РєРµР№СЃРµ: ${amount.toLocaleString('ru-RU')} в‚Ѕ`);
    }

    return res.json({
      success: true,
      wonItem: { id: wonItemId, rarity: wonItemId.includes('_5') ? 'legendary' : wonItemId.includes('_4') ? 'epic' : 'common' },
      newBalance,
      newStars,
      lastAdCaseAt: updateData.lastAdCaseAt || user.lastAdCaseAt
    });

  } catch (e) {
    console.error('OpenCase Error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/pvp.ts
```ts
// api/_lib/handlers/pvp.ts
import { db } from '../db.js';
import { users, equippedItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, ne, sql } from 'drizzle-orm';

export async function pvpHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { initData, playerStats } = req.body;
  
  if (!playerStats) {
    return res.status(400).json({ error: 'playerStats is required' });
  }

  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const telegramId = validatedData.user.id;

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, telegramId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const myStats = playerStats;

    const possibleOpponents = await db.select()
      .from(users)
      .where(and(
        ne(users.id, telegramId),
        sql`ABS(${users.rating} - ${user.rating}) < 150`
      ))
      .limit(1);

    let opponentName = 'РџСЂРёР·СЂР°Рє С‚СЂР°СЃСЃС‹';
    let opponentStats = { ...myStats };
    let opponentId: number | null = null;

    if (possibleOpponents.length > 0) {
      const opp = possibleOpponents[0];
      opponentId = opp.id;
      opponentName = opp.firstName || 'Р“РѕРЅС‰РёРє';
      
      if (playerStats.opponentStats) {
        opponentStats = playerStats.opponentStats;
      } else {
        opponentStats = { ...myStats };
        opponentStats.rating += (Math.random() * 20 - 10);
      }
    } else {
      opponentStats.rating += (Math.random() * 20 - 10);
    }

    const calcTime = (stats: any) => {
      const baseTime = (1000 / stats.topSpeed) * 3600; 
      return baseTime - (stats.accel * 0.5) - (stats.grip * 0.05) - (stats.handling * 0.05) + (Math.random() * 1.5);
    };

    const pTime = calcTime(myStats);
    const oTime = calcTime(opponentStats);
    const winner = pTime < oTime ? 'player' : 'opponent';
    
    const log = [
      `рџЏЃ РЎС‚Р°СЂС‚! РЎРѕРїРµСЂРЅРёРє: ${opponentName} (Р РµР№С‚РёРЅРі: ${opponentStats.rating.toFixed(0)})`,
      `Р’С‹ РїСЂРѕРµС…Р°Р»Рё 1000Рј Р·Р° ${pTime.toFixed(2)} СЃРµРє.`,
      `РЎРѕРїРµСЂРЅРёРє РїСЂРѕРµС…Р°Р» Р·Р° ${oTime.toFixed(2)} СЃРµРє.`,
      winner === 'player' ? `рџЏ† РџРѕР±РµРґР°! +5 СЂРµР№С‚РёРЅРіР°.` : `рџ’Ё РџРѕСЂР°Р¶РµРЅРёРµ... -2 СЂРµР№С‚РёРЅРіР°.`
    ];

    let newBalance = user.balance;
    let newRating = user.rating;
    let ratingChange = 0;
    let reward = 0;

    if (winner === 'player') {
      reward = (1000 + myStats.rating * 10) * 5;
      newBalance += reward;
      ratingChange = 5;
      newRating += ratingChange;
      
      if (opponentId) {
        await db.update(users)
          .set({ rating: sql`GREATEST(0, ${users.rating} - 2)` })
          .where(eq(users.id, opponentId));
      }
    } else {
      ratingChange = -2;
      newRating = Math.max(0, newRating + ratingChange);
      
      if (opponentId) {
        await db.update(users)
          .set({ rating: sql`${users.rating} + 5` })
          .where(eq(users.id, opponentId));
      }
    }

    // рџ‘‡ РћР±РЅРѕРІР»СЏРµРј Р±Р°Р»Р°РЅСЃ, СЂРµР№С‚РёРЅРі Рё РЎРўРђРўРРЎРўРРљРЈ Р“РћРќРћРљ
    const statsUpdate = winner === 'player'
      ? {
          balance: newBalance,
          rating: newRating,
          totalRaces: sql`${users.totalRaces} + 1`,
          totalWins: sql`${users.totalWins} + 1`,
        }
      : {
          balance: newBalance,
          rating: newRating,
          totalRaces: sql`${users.totalRaces} + 1`,
          totalLosses: sql`${users.totalLosses} + 1`,
        };

    const [updatedUser] = await db.update(users)
      .set(statsUpdate)
      .where(eq(users.id, telegramId))
      .returning();

    return res.status(200).json({
      success: true,
      result: { winner, log, playerTime: pTime, opponentTime: oTime, ratingChange, reward },
      newBalance: updatedUser.balance,
      newRating: updatedUser.rating,
      // рџ‘‡ РІРѕР·РІСЂР°С‰Р°РµРј СЃС‚Р°С‚РёСЃС‚РёРєСѓ РЅР° РєР»РёРµРЅС‚
      totalRaces: updatedUser.totalRaces,
      totalWins: updatedUser.totalWins,
      totalLosses: updatedUser.totalLosses,
    });
  } catch (error) {
    console.error('PvP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### api/_lib/handlers/pvpResult.ts
```ts
// api/_lib/handlers/pvpResult.ts
import { db } from '../db.js';
import { users, clans, clanMembers } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql, and } from 'drizzle-orm';
import { getOrCreateQuests } from '../quests.js';
import { getOrCreatePass } from '../pass.js';

export async function pvpResultHandler(req: any, res: any) {
  const { initData, won, ratingDelta, coinsDelta } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const safeRating = Math.max(-100, Math.min(100, Math.round(ratingDelta ?? 0)));
    const safeCoins = Math.max(-10000, Math.min(10000, Math.round(coinsDelta ?? 0)));

    const quests = getOrCreateQuests(user.dailyQuests);
    if (won) {
      quests.progress.win_3 = Math.min(3, (quests.progress.win_3 || 0) + 1);
    }

    // рџ‘‡ XP РґР»СЏ РїСЂРѕРїСѓСЃРєР° (РЅРµ РґР»СЏ СѓСЂРѕРІРЅСЏ РїРµСЂСЃРѕРЅР°Р¶Р°)
    const pass = getOrCreatePass(user.weeklyPass);
    const baseRaceXp = won ? 10 : 2; // рџ‘€ Р±С‹Р»Рѕ 50/10, СЃС‚Р°Р»Рѕ 10/2
    const xpMultiplier = pass.isPremium ? 5 : 1;
    pass.xp += baseRaceXp * xpMultiplier;

    let clanTax = 0;
    if (safeCoins > 0) {
      const memberRecord = await db.select().from(clanMembers).where(eq(clanMembers.userId, userId));
      if (memberRecord.length > 0) {
        const clanId = memberRecord[0].clanId;
        clanTax = Math.floor(safeCoins * 0.10);

        if (clanTax > 0) {
          await db.update(clans)
            .set({ balance: sql`${clans.balance} + ${clanTax}` })
            .where(eq(clans.id, clanId));
          
          await db.update(clanMembers)
            .set({ contribution: sql`${clanMembers.contribution} + ${clanTax}` })
            .where(and(eq(clanMembers.userId, userId), eq(clanMembers.clanId, clanId)));
        }
      }
    }

    // рџ‘‡ XP РґР»СЏ СѓСЂРѕРІРЅСЏ РїРµСЂСЃРѕРЅР°Р¶Р° (РѕС‚РґРµР»СЊРЅРѕ)
    const levelXpReward = won ? 50 : 10; // рџ‘€ РґР»СЏ user.xp РѕСЃС‚Р°РІР»СЏРµРј 50/10

    const statsUpdate = won
      ? {
          rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
          balance: sql`GREATEST(0, ${users.balance} + ${safeCoins})`,
          totalEarned: sql`${users.totalEarned} + ${Math.max(0, safeCoins)}`,
          earnedFromRaces: sql`${users.earnedFromRaces} + ${Math.max(0, safeCoins)}`,
          totalRaces: sql`${users.totalRaces} + 1`,
          totalWins: sql`${users.totalWins} + 1`,
          xp: sql`${users.xp} + ${levelXpReward}`,
          dailyQuests: quests,
          weeklyPass: pass,
        }
      : {
          rating: sql`GREATEST(0, ${users.rating} + ${safeRating})`,
          balance: sql`GREATEST(0, ${users.balance} + ${safeCoins})`,
          totalEarned: sql`${users.totalEarned} + ${Math.max(0, safeCoins)}`,
          earnedFromRaces: sql`${users.earnedFromRaces} + ${Math.max(0, safeCoins)}`,
          totalRaces: sql`${users.totalRaces} + 1`,
          totalLosses: sql`${users.totalLosses} + 1`,
          xp: sql`${users.xp} + ${levelXpReward}`,
          dailyQuests: quests,
          weeklyPass: pass,
        };

    const [updated] = await db
      .update(users)
      .set(statsUpdate)
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      won: !!won,
      balance: updated.balance,
      rating: updated.rating,
      newBalance: updated.balance,
      newRating: updated.rating,
      totalRaces: updated.totalRaces,
      totalWins: updated.totalWins,
      totalLosses: updated.totalLosses,
      earnedFromRaces: updated.earnedFromRaces,
      xp: updated.xp,
      quests,
      pass: updated.weeklyPass,
      clanTax,
    });
  } catch (error) {
    console.error('[pvpResult]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/sellItem.ts
```ts
import { db } from '../db.js';
import { users, userItems, equippedItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, sql } from 'drizzle-orm';
import { ITEMS } from '../items.js';
import { getOrCreateQuests } from '../quests.js';
import { logTransaction } from '../logger.js';

const SELL_PRICES: Record<string, number> = {
  common: 100, uncommon: 500, rare: 2500, epic: 15000, legendary: 75000,
};

export async function sellItemHandler(req: any, res: any) {
  const { initData, itemId } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = validatedData.user.id;

  try {
    const itemConfig = ITEMS[itemId];
    if (!itemConfig) return res.status(400).json({ error: 'РџСЂРµРґРјРµС‚ РЅРµ РЅР°Р№РґРµРЅ' });

    const equipped = await db.query.equippedItems.findFirst({
      where: and(eq(equippedItems.userId, userId), eq(equippedItems.itemId, itemId))
    });
    if (equipped) return res.status(400).json({ error: 'РќРµР»СЊР·СЏ РїСЂРѕРґР°С‚СЊ РЅР°РґРµС‚С‹Р№ РїСЂРµРґРјРµС‚' });

    const inventoryItem = await db.query.userItems.findFirst({
      where: and(eq(userItems.userId, userId), eq(userItems.itemId, itemId))
    });
    if (!inventoryItem) return res.status(400).json({ error: 'РџСЂРµРґРјРµС‚ РЅРµ РЅР°Р№РґРµРЅ РІ РёРЅРІРµРЅС‚Р°СЂРµ' });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // РћР‘РќРћР’Р›РЇР•Рњ РљР’Р•РЎРўР«
    const quests = getOrCreateQuests(user.dailyQuests);
    quests.progress.sell_5 = Math.min(5, (quests.progress.sell_5 || 0) + 1);

    const price = SELL_PRICES[itemConfig.rarity] || 100;

    await db.delete(userItems).where(eq(userItems.id, inventoryItem.id));

    const [updatedUser] = await db.update(users)
      .set({ 
        balance: sql`${users.balance} + ${price}`,
        dailyQuests: quests 
      })
      .where(eq(users.id, userId))
      .returning();
    
      await logTransaction(userId, price, 'sell_item', `РџСЂРѕРґР°Р¶Р° РїСЂРµРґРјРµС‚Р°: ${itemId}`);

    return res.json({ success: true, newBalance: updatedUser.balance, price, quests });
  } catch (error) {
    console.error('Sell item error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### api/_lib/handlers/skipUpgradeTime.ts
```ts
// api/_lib/handlers/skipUpgradeTime.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

const MAX_REDUCE_MS = 15 * 60 * 1000; // РњР°РєСЃРёРјСѓРј 15 РјРёРЅСѓС‚ Р·Р° СЂР°Р·

export async function skipUpgradeTimeHandler(req: any, res: any) {
  try {
    const { initData, itemId, reduceMs } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const partUpg = { ...(user.partUpgrades || {}) };
    const currentUpg = partUpg[itemId];

    if (!currentUpg || !currentUpg.upgradingUntil) {
      return res.status(400).json({ error: 'РќРµС‚ Р°РєС‚РёРІРЅРѕРіРѕ СѓР»СѓС‡С€РµРЅРёСЏ' });
    }

    if (currentUpg.upgradingUntil <= Date.now()) {
      return res.status(400).json({ error: 'РЈР»СѓС‡С€РµРЅРёРµ СѓР¶Рµ Р·Р°РІРµСЂС€РµРЅРѕ' });
    }

    const safeReduce = Math.min(Math.max(0, reduceMs || MAX_REDUCE_MS), MAX_REDUCE_MS);
    const newUpgradingUntil = Math.max(Date.now(), currentUpg.upgradingUntil - safeReduce);

    partUpg[itemId] = {
      ...currentUpg,
      upgradingUntil: newUpgradingUntil,
    };

    // Р•СЃР»Рё С‚Р°Р№РјРµСЂ С‚РµРїРµСЂСЊ РІ РїСЂРѕС€Р»РѕРј вЂ” РїСЂРёРјРµРЅСЏРµРј СЂРµР·СѓР»СЊС‚Р°С‚
    let applied = false;
    if (newUpgradingUntil <= Date.now()) {
      if (currentUpg.upgradeType === 'level') partUpg[itemId].level += 1;
      if (currentUpg.upgradeType === 'gold') partUpg[itemId].goldStars += 1;
      if (currentUpg.upgradeType === 'red') partUpg[itemId].redStars += 1;
      partUpg[itemId].upgradingUntil = null;
      partUpg[itemId].upgradeType = null;
      applied = true;
    }

    await db.update(users).set({ partUpgrades: partUpg }).where(eq(users.id, user.id));

    return res.json({
      success: true,
      partUpgrades: partUpg,
      applied,
      reducedMs: safeReduce,
    });
  } catch (e) {
    console.error('[skipUpgradeTime]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/switchCar.ts
```ts
// api/_lib/handlers/switchCar.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';

export async function switchCarHandler(req: any, res: any) {
  try {
    const { initData, carId } = req.body;
    
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });
    const userId = validatedData.user.id;

    if (!carId) return res.status(400).json({ error: 'carId required' });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // рџ‘‡ Р•СЃР»Рё Сѓ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РЅРµС‚ РјР°СЃСЃРёРІР° ownedCars, РґР°РµРј РµРјСѓ Р±Р°Р·РѕРІСѓСЋ Р’РђР— 2107
    const owned = user.ownedCars || ['vaz-2107'];
    if (!owned.includes(carId)) {
      return res.status(403).json({ error: 'Car not owned' });
    }

    const [updated] = await db
      .update(users)
      .set({ activeCarId: carId })
      .where(eq(users.id, userId))
      .returning();

    return res.json({ activeCarId: updated.activeCarId });
  } catch (error) {
    console.error('[switchCar]', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/sync.ts
```ts
// api/_lib/handlers/sync.ts
import { db } from '../db.js';
import { users, userItems, equippedItems, featureFlags } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

const REFERRER_REWARD = 50000;
const REFEREE_REWARD = 10000;

export async function syncHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { initData, startParam } = req.body;

  // рџ‘‡ Р’РќР•Р”Р РЇР•Рњ DEV BYPASS рџ‘‡
  let telegramUser;

  // РџСЂРѕРІРµСЂСЏРµРј, С‡С‚Рѕ РјС‹ РЅРµ РЅР° РїСЂРѕРґРµ Рё С„СЂРѕРЅС‚ РїСЂРёСЃР»Р°Р» РЅР°С€ С„Р»Р°Рі
  if (process.env.NODE_ENV !== 'production' && initData === 'DEV_BYPASS') {
    telegramUser = { 
      id: 123456789, 
      username: 'dev_user', 
      first_name: 'Dev', 
      last_name: 'User', 
      photo_url: null 
    };
  } else {
    // РўРІРѕСЏ СЃС‚Р°РЅРґР°СЂС‚РЅР°СЏ РїСЂРѕРІРµСЂРєР°
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });
    telegramUser = validatedData.user;
  }
  // рџ‘† РљРћРќР•Р¦ DEV BYPASS рџ‘†

  try {
    let user = await db.query.users.findFirst({ where: eq(users.id, telegramUser.id) });
    const isNewUser = !user;
    let bonusCoins = 0;
    let offlineEarnings = 0;

    if (isNewUser) {
      let referredById: number | null = null;
      // рџ‘‡ РџСЂРѕРІРµСЂСЏРµРј СЂРµС„-РєРѕРґ (startapp=ref_ID)
      if (startParam && startParam.startsWith('ref_')) {
        const parsedId = parseInt(startParam.replace('ref_', ''), 10);
        if (parsedId && parsedId !== telegramUser.id) {
          const referrer = await db.query.users.findFirst({ where: eq(users.id, parsedId) });
          if (referrer) {
            referredById = referrer.id;
            bonusCoins = REFEREE_REWARD;
            // РќР°С‡РёСЃР»СЏРµРј Р±РѕРЅСѓСЃ РїСЂРёРіР»Р°СЃРёРІС€РµРјСѓ
            await db.update(users).set({
              balance: sql`${users.balance} + ${REFERRER_REWARD}`,
              totalEarned: sql`${users.totalEarned} + ${REFERRER_REWARD}`,
              referralEarnings: sql`${users.referralEarnings} + ${REFERRER_REWARD}`
            }).where(eq(users.id, parsedId));
          }
        }
      }
      
      const [createdUser] = await db.insert(users).values({
        id: telegramUser.id,
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null,
        lastName: telegramUser.last_name || null,
        photoUrl: telegramUser.photo_url || null,
        balance: bonusCoins,
        totalEarned: bonusCoins,
        referredBy: referredById,
        activeCarId: 'vaz-2107', 
        ownedCars: ['vaz-2107'], 
      }).returning();
      user = createdUser;
    } else {
      // РЎР§РРўРђР•Рњ РћР¤Р¤Р›РђР™Рќ Р”РћРҐРћР”
      const now = new Date();
      if (user) {
        const lastSeen = user.lastSeenAt ? new Date(user.lastSeenAt) : now;
        const diffSeconds = Math.max(0, Math.floor((now.getTime() - lastSeen.getTime()) / 1000));
        const cappedSeconds = Math.min(diffSeconds, 12 * 3600); 
        
        if (cappedSeconds > 60 && (user.offlineLevel || 1) > 0) {
          const hourlyRate = (user.offlineLevel || 1) * 500;
          offlineEarnings = Math.floor((cappedSeconds / 3600) * hourlyRate);
        }

        await db.update(users).set({
          username: telegramUser.username || null,
          firstName: telegramUser.first_name || null,
          photoUrl: telegramUser.photo_url || null,
          lastSeenAt: now,
          balance: sql`${users.balance} + ${offlineEarnings}`,
          totalEarned: sql`${users.totalEarned} + ${offlineEarnings}`
        }).where(eq(users.id, telegramUser.id));
        
        user.balance += offlineEarnings;
      }
    }

    const inventory = await db.query.userItems.findMany({ where: eq(userItems.userId, telegramUser.id) });
    const equipped = await db.query.equippedItems.findMany({ where: eq(equippedItems.userId, telegramUser.id) });
    
    const equippedMap: Record<string, string | null> = { engine: null, tires: null, ecu: null, suspension: null };
    equipped.forEach(e => { equippedMap[e.slot] = e.itemId; });

    const flags = await db.select().from(featureFlags);
    const features: Record<string, boolean> = {};
    flags.forEach(f => { features[f.name] = f.isEnabled; });

    return res.status(200).json({
      success: true,
      user: { 
        ...user!, 
        balance: user!.balance ?? 0, 
        totalEarned: user!.totalEarned ?? 0, 
        referralEarnings: user!.referralEarnings ?? 0,
        ownedCars: user!.ownedCars ?? ['vaz-2107'], 
        activeCarId: user!.activeCarId ?? 'vaz-2107', 
        clickLevel: user!.clickLevel ?? 1,
        offlineLevel: user!.offlineLevel ?? 1,
        isAdmin: user!.isAdmin ?? false,
        features: features
      },
      offlineEarnings,
      inventory: inventory.map(i => i.itemId),
      equipped: equippedMap,
      isNewUser,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### api/_lib/handlers/tap.ts
```ts
// api/_lib/handlers/tap.ts
import { db } from '../db.js';
import { users, userItems } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';
import { ALL_ITEM_IDS, ITEMS, RARITY_DROP_CHANCE } from '../items.js';
import { getOrCreateQuests } from '../quests.js';
import { getOrCreatePass } from '../pass.js';

export async function tapHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { initData, amount, clicks } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);
  if (!validatedData || !validatedData.user) return res.status(401).json({ error: 'Unauthorized' });

  const telegramId = validatedData.user.id;
  if (typeof amount !== 'number' || amount <= 0 || amount > 10000) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const clicksToAdd = typeof clicks === 'number' && clicks > 0 ? clicks : amount;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, telegramId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Р РµС„РµСЂР°Р»СЊРЅС‹Р№ Р±РѕРЅСѓСЃ (1%)
    if (user.referredBy && amount > 0) {
      const referralBonus = Math.floor(amount * 0.01);
      if (referralBonus > 0) {
        await db.update(users).set({
          balance: sql`${users.balance} + ${referralBonus}`,
          totalEarned: sql`${users.totalEarned} + ${referralBonus}`,
          referralEarnings: sql`${users.referralEarnings} + ${referralBonus}`,
          earnedFromClicks: sql`${users.earnedFromClicks} + ${referralBonus}`,
          xp: sql`${users.xp} + 1`,
        }).where(eq(users.id, user.referredBy));
      }
    }

    const quests = getOrCreateQuests(user.dailyQuests);
    quests.progress.click_1000 = Math.min(1000, (quests.progress.click_1000 || 0) + amount);

    // рџ‘‡ Р¤РРљРЎ: XP Р·Р° РєР»РёРє = С„РёРєСЃРёСЂРѕРІР°РЅРѕ (РЅРµ Р·Р°РІРёСЃРёС‚ РѕС‚ РґРѕС…РѕРґР°)
    const pass = getOrCreatePass(user.weeklyPass);
    const xpPerClick = pass.isPremium ? 5 : 1;
    pass.xp += clicksToAdd * xpPerClick; // рџ‘€ СѓРјРЅРѕР¶Р°РµРј РЅР° РљРћР›РР§Р•РЎРўР’Рћ РєР»РёРєРѕРІ

    const [updatedUser] = await db.update(users).set({
      balance: sql`${users.balance} + ${amount}`,
      totalEarned: sql`${users.totalEarned} + ${amount}`,
      earnedFromClicks: sql`${users.earnedFromClicks} + ${amount}`,
      totalClicks: sql`${users.totalClicks} + ${clicksToAdd}`,
      xp: sql`${users.xp} + ${clicksToAdd}`,
      lastOnlineAt: new Date(),
      dailyQuests: quests,
      weeklyPass: pass,
    }).where(eq(users.id, telegramId)).returning();

    let droppedItem = null;

    if (Math.random() < 0.05) {
      const roll = Math.random() * 100;
      let selectedRarity = 'common';
      let cumulative = 0;
      for (const [rarity, chance] of Object.entries(RARITY_DROP_CHANCE)) {
        cumulative += chance;
        if (roll <= cumulative) { selectedRarity = rarity; break; }
      }

      const possibleItems = ALL_ITEM_IDS.filter(id => ITEMS[id].rarity === selectedRarity);
      if (possibleItems.length > 0) {
        const randomItemId = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        const [newItem] = await db.insert(userItems).values({ userId: telegramId, itemId: randomItemId }).returning();
        droppedItem = { ...ITEMS[randomItemId], dbId: newItem.id };
      }
    }

    return res.status(200).json({
      success: true,
      newBalance: updatedUser.balance,
      newTotalEarned: updatedUser.totalEarned,
      totalClicks: updatedUser.totalClicks,
      earnedFromClicks: updatedUser.earnedFromClicks,
      xp: updatedUser.xp,
      droppedItem,
      quests,
      pass: updatedUser.weeklyPass,
    });
  } catch (error) {
    console.error('Tap error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### api/_lib/handlers/upgradeBusiness.ts
```ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { BUSINESSES, getBusinessUpgradeCost } from '../businesses.js';

export async function upgradeBusinessHandler(req: any, res: any) {
  try {
    const { initData, businessId } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const config = BUSINESSES[businessId];
    if (!config) return res.status(400).json({ error: 'Р‘РёР·РЅРµСЃ РЅРµ РЅР°Р№РґРµРЅ' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    const businesses = { ...(user.businesses || {}) };
    const current = businesses[businessId];

    if (!current) return res.status(400).json({ error: 'РЎРЅР°С‡Р°Р»Р° РєСѓРїРёС‚Рµ Р±РёР·РЅРµСЃ' });

    const cost = getBusinessUpgradeCost(config.baseCost, current.level);
    if (user.balance < cost) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ' });

    const newBalance = user.balance - cost;
    businesses[businessId] = { ...current, level: current.level + 1 };

    await db.update(users).set({ balance: newBalance, businesses }).where(eq(users.id, user.id));
    return res.json({ success: true, newBalance, businesses });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/upgradeClicker.ts
```ts
// api/_lib/handlers/upgradeClicker.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

export async function upgradeClickerHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const clickLevel = user.clickLevel || 1;
    const cost = Math.floor(1000 * Math.pow(1.5, clickLevel - 1));

    if (user.balance < cost) {
      return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ СЃСЂРµРґСЃС‚РІ' });
    }

    const [updated] = await db.update(users).set({
      balance: sql`${users.balance} - ${cost}`,
      clickLevel: sql`${users.clickLevel} + 1`,
    }).where(eq(users.id, user.id)).returning();

    return res.json({
      success: true,
      newBalance: updated.balance,
      newClickLevel: updated.clickLevel, // рџ‘€ Р’РђР–РќРћ: РІРѕР·РІСЂР°С‰Р°РµРј РЅРѕРІС‹Р№ СѓСЂРѕРІРµРЅСЊ
    });
  } catch (e) {
    console.error('[upgradeClicker]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/upgradeOffline.ts
```ts
// api/_lib/handlers/upgradeOffline.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, sql } from 'drizzle-orm';

export async function upgradeOfflineHandler(req: any, res: any) {
  try {
    const { initData } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const offlineLevel = user.offlineLevel || 1;
    const cost = Math.floor(5000 * Math.pow(1.8, offlineLevel - 1));

    if (user.balance < cost) {
      return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ СЃСЂРµРґСЃС‚РІ' });
    }

    const [updated] = await db.update(users).set({
      balance: sql`${users.balance} - ${cost}`,
      offlineLevel: sql`${users.offlineLevel} + 1`,
    }).where(eq(users.id, user.id)).returning();

    return res.json({
      success: true,
      newBalance: updated.balance,
      newOfflineLevel: updated.offlineLevel, // рџ‘€ Р’РђР–РќРћ
    });
  } catch (e) {
    console.error('[upgradeOffline]', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/handlers/upgradePart.ts
```ts
// api/_lib/handlers/upgradePart.ts
import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { ITEMS } from '../items.js';

export async function upgradePartHandler(req: any, res: any) {
  try {
    const { initData, itemId, type } = req.body;
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const itemConfig = ITEMS[itemId];
    if (!itemConfig) return res.status(400).json({ error: 'Item not found' });

    const partUpg = { ...(user.partUpgrades || {}) };
    const currentUpg = partUpg[itemId] || {
      level: 0, goldStars: 0, redStars: 0,
      upgradingUntil: null, upgradeType: null,
    };

    if (currentUpg.upgradingUntil && currentUpg.upgradingUntil > Date.now()) {
      return res.status(400).json({ error: 'Р”РµС‚Р°Р»СЊ СѓР¶Рµ СѓР»СѓС‡С€Р°РµС‚СЃСЏ' });
    }

    let cost = 0;
    let durationMs = 0;

    if (type === 'level') {
      if (currentUpg.level >= 50) return res.status(400).json({ error: 'Р”РѕСЃС‚РёРіРЅСѓС‚ РјР°РєСЃРёРјР°Р»СЊРЅС‹Р№ СѓСЂРѕРІРµРЅСЊ' });
      cost = Math.round(500 * Math.pow(1.15, currentUpg.level));

      // рџ‘‡ РџСЂРѕРіСЂРµСЃСЃРёРІРЅРѕРµ РІСЂРµРјСЏ
      const lvl = currentUpg.level;
      let minutes = 0;
      if (lvl < 5) {
        minutes = (lvl + 1) * 2;                // 2, 4, 6, 8, 10 РјРёРЅ
      } else if (lvl < 10) {
        minutes = 10 + (lvl - 5) * 4;           // 10, 14, 18, 22, 26 РјРёРЅ
      } else if (lvl < 15) {
        minutes = 30 + (lvl - 10) * 6;          // 30, 36, 42, 48, 54 РјРёРЅ
      } else if (lvl < 20) {
        minutes = 60 + (lvl - 15) * 12;         // 1С‡ вЂ” 2С‡
      } else if (lvl < 25) {
        minutes = 120 + (lvl - 20) * 24;        // 2С‡ вЂ” 4С‡
      } else if (lvl < 30) {
        minutes = 240 + (lvl - 25) * 48;        // 4С‡ вЂ” 8С‡
      } else if (lvl < 35) {
        minutes = 480 + (lvl - 30) * 48;        // 8С‡ вЂ” 12С‡
      } else if (lvl < 40) {
        minutes = 720 + (lvl - 35) * 72;        // 12С‡ вЂ” 18С‡
      } else if (lvl < 45) {
        minutes = 1080 + (lvl - 40) * 72;       // 18С‡ вЂ” 24С‡
      } else {
        minutes = 1440 + (lvl - 45) * 144;      // 24С‡ вЂ” 36С‡
      }

      durationMs = minutes * 60 * 1000;
    }
    else if (type === 'gold') {
      if (currentUpg.level < 50) return res.status(400).json({ error: 'РЎРЅР°С‡Р°Р»Р° РїСЂРѕРєР°С‡Р°Р№С‚Рµ РґРѕ 50 СѓСЂРѕРІРЅСЏ' });
      if (currentUpg.goldStars >= 5) return res.status(400).json({ error: 'Р”РѕСЃС‚РёРіРЅСѓС‚ РјР°РєСЃРёРјСѓРј Р·РѕР»РѕС‚С‹С… Р·РІРµР·Рґ' });
      cost = 50000 * (currentUpg.goldStars + 1);
      durationMs = 2 * 60 * 60 * 1000; // 2 С‡Р°СЃР°
    }
    else if (type === 'red') {
      if (currentUpg.goldStars < 5) return res.status(400).json({ error: 'РЎРЅР°С‡Р°Р»Р° РїРѕР»СѓС‡РёС‚Рµ 5 Р·РѕР»РѕС‚С‹С… Р·РІРµР·Рґ' });
      if (currentUpg.redStars >= 5) return res.status(400).json({ error: 'Р”РѕСЃС‚РёРіРЅСѓС‚ РјР°РєСЃРёРјСѓРј РєСЂР°СЃРЅС‹С… Р·РІРµР·Рґ' });
      cost = 500000 * (currentUpg.redStars + 1);
      durationMs = 12 * 60 * 60 * 1000; // 12 С‡Р°СЃРѕРІ
    }

    if (user.balance < cost) return res.status(400).json({ error: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ' });

    const newBalance = user.balance - cost;
    partUpg[itemId] = {
      ...currentUpg,
      upgradingUntil: Date.now() + durationMs,
      upgradeType: type,
    };

    await db.update(users).set({ balance: newBalance, partUpgrades: partUpg }).where(eq(users.id, user.id));

    return res.json({ success: true, newBalance, partUpgrades: partUpg });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### api/_lib/items.ts
```ts
// api/lib/items.ts
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemSlot = 'engine' | 'tires' | 'suspension' | 'ecu';

export interface ItemConfig {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: ItemRarity;
  stats: { power: number; topSpeed: number; grip: number; handling: number; };
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#aaaaaa', uncommon: '#00d97e', rare: '#00bfff', epic: '#b000ff', legendary: '#ffcc00',
};

export const ITEMS: Record<string, ItemConfig> = {
  'engine_1': { id: 'engine_1', name: 'РЎС‚РѕРєРѕРІС‹Р№ РјРѕС‚РѕСЂ', slot: 'engine', rarity: 'common', stats: { power: 20, topSpeed: 5, grip: 0, handling: 0 } },
  'engine_2': { id: 'engine_2', name: 'РўСѓСЂР±Рѕ-РєРёС‚ Stage 1', slot: 'engine', rarity: 'uncommon', stats: { power: 50, topSpeed: 10, grip: 0, handling: 0 } },
  'engine_3': { id: 'engine_3', name: 'V8 Р‘РёС‚СѓСЂР±Рѕ', slot: 'engine', rarity: 'rare', stats: { power: 120, topSpeed: 25, grip: 0, handling: 0 } },
  'engine_4': { id: 'engine_4', name: 'Р”РІРёРіР°С‚РµР»СЊ РѕС‚ Р“РўР ', slot: 'engine', rarity: 'epic', stats: { power: 250, topSpeed: 50, grip: 5, handling: 0 } },
  'engine_5': { id: 'engine_5', name: 'РџСЂРѕС‚РѕС‚РёРї F1', slot: 'engine', rarity: 'legendary', stats: { power: 500, topSpeed: 100, grip: 10, handling: 10 } },
  'tires_1': { id: 'tires_1', name: 'РЈР»РёС‡РЅР°СЏ СЂРµР·РёРЅР°', slot: 'tires', rarity: 'common', stats: { power: 0, topSpeed: 0, grip: 15, handling: 5 } },
  'tires_2': { id: 'tires_2', name: 'РџРѕР»СѓСЃР»РёРє', slot: 'tires', rarity: 'uncommon', stats: { power: 0, topSpeed: 2, grip: 35, handling: 10 } },
  'tires_3': { id: 'tires_3', name: 'РЎР»РёРє Michelin', slot: 'tires', rarity: 'rare', stats: { power: 0, topSpeed: 5, grip: 60, handling: 20 } },
  'tires_4': { id: 'tires_4', name: 'Р”СЂРёС„С‚-СЂРµР·РёРЅР°', slot: 'tires', rarity: 'epic', stats: { power: 0, topSpeed: 10, grip: 90, handling: 40 } },
  'tires_5': { id: 'tires_5', name: 'РќР°РЅРѕ-СЂРµР·РёРЅР°', slot: 'tires', rarity: 'legendary', stats: { power: 10, topSpeed: 20, grip: 150, handling: 80 } },
  'ecu_1': { id: 'ecu_1', name: 'Р—Р°РІРѕРґСЃРєР°СЏ РїСЂРѕС€РёРІРєР°', slot: 'ecu', rarity: 'common', stats: { power: 5, topSpeed: 5, grip: 0, handling: 10 } },
  'ecu_2': { id: 'ecu_2', name: 'Р§РёРї-С‚СЋРЅРёРЅРі', slot: 'ecu', rarity: 'uncommon', stats: { power: 15, topSpeed: 10, grip: 0, handling: 20 } },
  'ecu_3': { id: 'ecu_3', name: 'Р“РѕРЅРѕС‡РЅС‹Р№ ECU', slot: 'ecu', rarity: 'rare', stats: { power: 30, topSpeed: 20, grip: 5, handling: 40 } },
  'ecu_4': { id: 'ecu_4', name: 'РҐР°РєРµСЂСЃРєРёР№ Р±Р»РѕРє', slot: 'ecu', rarity: 'epic', stats: { power: 60, topSpeed: 40, grip: 10, handling: 70 } },
  'ecu_5': { id: 'ecu_5', name: 'РР-РЈРїСЂР°РІР»РµРЅРёРµ', slot: 'ecu', rarity: 'legendary', stats: { power: 100, topSpeed: 60, grip: 20, handling: 100 } },
  'susp_1': { id: 'susp_1', name: 'РЎС‚РѕРєРѕРІР°СЏ РїРѕРґРІРµСЃРєР°', slot: 'suspension', rarity: 'common', stats: { power: 0, topSpeed: 0, grip: 5, handling: 15 } },
  'susp_2': { id: 'susp_2', name: 'РЎРїРѕСЂС‚-РїСЂСѓР¶РёРЅС‹', slot: 'suspension', rarity: 'uncommon', stats: { power: 0, topSpeed: 0, grip: 10, handling: 35 } },
  'susp_3': { id: 'susp_3', name: 'Р’РёРЅС‚РѕРІР°СЏ РїРѕРґРІРµСЃРєР°', slot: 'suspension', rarity: 'rare', stats: { power: 0, topSpeed: 2, grip: 20, handling: 60 } },
  'susp_4': { id: 'susp_4', name: 'РџРЅРµРІРјРѕ-РїРѕРґРІРµСЃРєР°', slot: 'suspension', rarity: 'epic', stats: { power: 0, topSpeed: 5, grip: 40, handling: 90 } },
  'susp_5': { id: 'susp_5', name: 'РњР°РіРЅРёС‚РЅР°СЏ РїРѕРґРІРµСЃРєР° F1', slot: 'suspension', rarity: 'legendary', stats: { power: 10, topSpeed: 10, grip: 80, handling: 150 } },
};

export const ALL_ITEM_IDS = Object.keys(ITEMS);
export const RARITY_DROP_CHANCE: Record<string, number> = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };
export const SELL_PRICES: Record<ItemRarity, number> = { common: 100, uncommon: 500, rare: 2500, epic: 15000, legendary: 75000 };
```

### api/_lib/logger.ts
```ts
import { db } from './db.js';
import { transactions } from './schema.js';

export async function logTransaction(userId: number, amount: number, type: string, description: string) {
  if (amount === 0) return;
  try {
    await db.insert(transactions).values({ userId, amount, type, description });
  } catch (e) {
    console.error('РћС€РёР±РєР° Р·Р°РїРёСЃРё С‚СЂР°РЅР·Р°РєС†РёРё:', e);
  }
}
```

### api/_lib/pass.ts
```ts
// api/_lib/pass.ts
export interface PassLevel {
  level: number;
  xpReq: number;
  reward: number;
}

export const PASS_LEVELS: PassLevel[] = [
  { level: 1, xpReq: 1000, reward: 5000 },
  { level: 2, xpReq: 5000, reward: 15000 },
  { level: 3, xpReq: 15000, reward: 30000 },
  { level: 4, xpReq: 35000, reward: 50000 },
  { level: 5, xpReq: 70000, reward: 100000 },
  { level: 6, xpReq: 120000, reward: 150000 },
  { level: 7, xpReq: 200000, reward: 250000 },
  { level: 8, xpReq: 350000, reward: 400000 },
  { level: 9, xpReq: 500000, reward: 700000 },
  { level: 10, xpReq: 750000, reward: 1000000 },
];

export function getOrCreatePass(dbPass: any) {
  const currentWeek = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  
  // Р•СЃР»Рё РЅРµРґРµР»СЏ СЃРјРµРЅРёР»Р°СЃСЊ РёР»Рё РїСЂРѕРїСѓСЃРєР° РЅРµС‚ вЂ” СЃРѕР·РґР°РµРј РЅРѕРІС‹Р№
  if (!dbPass || dbPass.weekId !== currentWeek) {
    return { weekId: currentWeek, xp: 0, isPremium: false, claimed: [], claimedPremium: [] };
  }
  
  // РРЅР°С‡Рµ РІРѕР·РІСЂР°С‰Р°РµРј СЃ Р±РµР·РѕРїР°СЃРЅС‹РјРё РґРµС„РѕР»С‚Р°РјРё
  return {
    ...dbPass,
    isPremium: dbPass.isPremium || false,
    claimed: dbPass.claimed || [],
    claimedPremium: dbPass.claimedPremium || []
  };
}
```

### api/_lib/quests.ts
```ts
// api/_lib/quests.ts

export interface QuestData {
  resetAt: number;
  progress: Record<string, number>;
  claimed: Record<string, boolean>;
}

// рџ‘‡ Р Р°СЃС€РёСЂСЏРµРј РєРѕРЅС„РёРі: РґРѕР±Р°РІР»СЏРµРј rewardXp
export const QUESTS_CONFIG = {
  click_1000: { target: 1000, reward: 5000, rewardXp: 25 },
  win_3:      { target: 3,    reward: 15000, rewardXp: 50 },
  sell_5:     { target: 5,    reward: 5000, rewardXp: 15 },
  // рџ‘‡ РќРћР’Р«Р• Р—РђР”РђРќРРЇ
  click_5000: { target: 5000, reward: 25000, rewardXp: 100 },
  win_5:      { target: 5,    reward: 50000, rewardXp: 150 },
};

export function getOrCreateQuests(dbQuests: any): QuestData {
  const now = Date.now();
  
  // Р•СЃР»Рё РєРІРµСЃС‚РѕРІ РЅРµС‚ РёР»Рё РІСЂРµРјСЏ СЃР±СЂРѕСЃР° РїСЂРѕС€Р»Рѕ вЂ” СЃРѕР·РґР°С‘Рј РЅРѕРІС‹Рµ
  if (!dbQuests || !dbQuests.resetAt || dbQuests.resetAt < now) {
    const emptyProgress: Record<string, number> = {};
    const emptyClaimed: Record<string, boolean> = {};
    
    Object.keys(QUESTS_CONFIG).forEach(key => {
      emptyProgress[key] = 0;
      emptyClaimed[key] = false;
    });

    return {
      resetAt: now + 24 * 60 * 60 * 1000, // РЎР±СЂРѕСЃ С‡РµСЂРµР· 24 С‡Р°СЃР°
      progress: emptyProgress,
      claimed: emptyClaimed,
    };
  }
  
  return dbQuests as QuestData;
}
```

### api/_lib/raceSim.ts
```ts
// api/lib/raceSim.ts
export interface RacingStats {
  power: number; topSpeed: number; accel: number; grip: number; handling: number; rating: number;
}

export function getServerRacingStats(levels: any): RacingStats {
  const engine = levels.engine || 0;
  const tires = levels.tires || 0;
  const suspension = levels.suspension || 0;
  const diagnostics = levels.diagnostics || 0;

  const power = 200 + engine * 35;
  const topSpeed = 220 + engine * 12 + tires * 2;
  const accel = Math.max(2.0, 6.5 - engine * 0.15 - tires * 0.08 - suspension * 0.02);
  const grip = Math.min(100, tires * 4 + suspension * 2);
  const handling = Math.min(100, suspension * 4 + diagnostics * 1.5);
  const rating = Math.round(engine * 10 + tires * 8 + suspension * 8 + diagnostics * 6);

  return { power, topSpeed, accel, grip, handling, rating };
}

export function simulateRaceServer(p: RacingStats, o: RacingStats, oName: string) {
  const calcTime = (stats: RacingStats) => {
    const baseTime = (400 / stats.topSpeed) * 3600;
    const accelBonus = stats.accel * 0.5;
    const gripBonus = stats.grip * 0.05;
    const handlingBonus = stats.handling * 0.05;
    return Math.max(5, baseTime - accelBonus - gripBonus - handlingBonus + (Math.random() * 1.5));
  };

  const pTime = calcTime(p);
  const oTime = calcTime(o);
  const winner = pTime < oTime ? 'player' : 'opponent';

  return {
    winner,
    playerTime: pTime,
    opponentTime: oTime,
    log: [
      `рџЏЃ РЎС‚Р°СЂС‚! РЎРѕРїРµСЂРЅРёРє: ${oName}`,
      `Р’С‹ РїСЂРѕРµС…Р°Р»Рё 400Рј Р·Р° ${pTime.toFixed(2)} СЃРµРє.`,
      `${oName} РїСЂРѕРµС…Р°Р» Р·Р° ${oTime.toFixed(2)} СЃРµРє.`,
      winner === 'player' ? `рџЏ† РџРѕР±РµРґР°! Р’С‹ Р±С‹Р»Рё Р±С‹СЃС‚СЂРµРµ.` : `рџ’Ё РџРѕСЂР°Р¶РµРЅРёРµ... РЎРѕРїРµСЂРЅРёРє Р±С‹Р» Р±С‹СЃС‚СЂРµРµ.`
    ]
  };
}
```

### api/_lib/schema.ts
```ts
// api/_lib/schema.ts
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
  leaguePoints: integer('league_points').default(0).notNull(),
  lastClaimedLevel: integer('last_claimed_level').notNull().default(1),
  
  activeCarId: text('active_car_id').notNull().default('vaz-2107'),
  ownedCars: jsonb('owned_cars').$type<string[]>().notNull().default(['vaz-2107']),
  
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
  totalClicks: integer('total_clicks').notNull().default(0),
  totalRaces: integer('total_races').notNull().default(0),
  totalWins: integer('total_wins').notNull().default(0),
  totalLosses: integer('total_losses').notNull().default(0),
  
  clickLevel: integer('click_level').notNull().default(1),
  offlineLevel: integer('offline_level').notNull().default(1),
  earnedFromClicks: bigint('earned_from_clicks', { mode: 'number' }).notNull().default(0),
  earnedFromRaces: bigint('earned_from_races', { mode: 'number' }).notNull().default(0),
  earnedFromBusiness: bigint('earned_from_business', { mode: 'number' }).notNull().default(0),

  dailyStreak: integer('daily_streak').notNull().default(0),
  lastDailyClaim: timestamp('last_daily_claim', { withTimezone: true }),
  lastAdCaseAt: timestamp('last_ad_case_at', { withTimezone: true }),
  
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
    isPremium?: boolean;
    claimed: number[];
    claimedPremium?: number[];
  }>().notNull().default({ weekId: 0, xp: 0, isPremium: false, claimed: [], claimedPremium: [] }),
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
  description: text('description').default(''),
  isOpen: boolean('is_open').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  extraSlots: integer('extra_slots').notNull().default(0),
});

export const clanMembers = pgTable('clan_members', {
  userId: bigint('user_id', { mode: 'number' }).primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  clanId: uuid('clan_id').notNull().references(() => clans.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  contribution: bigint('contribution', { mode: 'number' }).notNull().default(0),
  bossDamage: integer('boss_damage').notNull().default(0),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const featureFlags = pgTable('feature_flags', {
  name: text('name').primaryKey(),
  isEnabled: boolean('is_enabled').notNull().default(true),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const clanMessages = pgTable('clan_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  clanId: uuid('clan_id').notNull().references(() => clans.id, { onDelete: 'cascade' }),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const clanBosses = pgTable('clan_bosses', {
  clanId: uuid('clan_id').primaryKey().references(() => clans.id, { onDelete: 'cascade' }),
  level: integer('level').notNull().default(1),
  currentHp: bigint('current_hp', { mode: 'number' }).notNull(),
  maxHp: bigint('max_hp', { mode: 'number' }).notNull(),
  lastDefeatedAt: timestamp('last_defeated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
```

### api/_lib/shop.ts
```ts
export type ShopItemType =
  | 'stars_balance'
  | 'coins'
  | 'battle_pass'
  | 'boost'
  | 'premium_car'
  | 'unlock_slots';

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  stars: number;
  type: ShopItemType;
  amount: number;
  bonus?: number;
}

export const SHOP_ITEMS: Record<string, ShopItem> = {
  stars_500: {
    id: 'stars_500',
    title: '500 Р·РІС‘Р·Рґ',
    description: 'РџСЂРµРјРёСѓРј-РІР°Р»СЋС‚Р° РґР»СЏ СЂРµРґРєРёС… РїРѕРєСѓРїРѕРє',
    stars: 20,
    type: 'stars_balance',
    amount: 500,
  },
  stars_3000: {
    id: 'stars_3000',
    title: '3000 Р·РІС‘Р·Рґ (+10%)',
    description: 'Р‘РѕР»СЊС€РѕР№ РїР°РєРµС‚ СЃ Р±РѕРЅСѓСЃРѕРј',
    stars: 100,
    type: 'stars_balance',
    amount: 3300,
    bonus: 10,
  },
  coins_100k: {
    id: 'coins_100k',
    title: '100 000 в‚Ѕ',
    description: 'РњРіРЅРѕРІРµРЅРЅРѕРµ СѓСЃРєРѕСЂРµРЅРёРµ РїСЂРѕРіСЂРµСЃСЃР°',
    stars: 10,
    type: 'coins',
    amount: 100_000,
  },
  coins_1m: {
    id: 'coins_1m',
    title: '1 000 000 в‚Ѕ',
    description: 'Р”Р»СЏ СЃРµСЂСЊС‘Р·РЅС‹С… РіРѕРЅС‰РёРєРѕРІ',
    stars: 80,
    type: 'coins',
    amount: 1_000_000,
  },
  battle_pass_s1: {
    id: 'battle_pass_s1',
    title: 'Battle Pass вЂ” РЎРµР·РѕРЅ 1',
    description: 'Р”РѕСЃС‚СѓРї Рє РїСЂРµРјРёСѓРј-РЅР°РіСЂР°РґР°Рј СЃРµР·РѕРЅР°',
    stars: 150,
    type: 'battle_pass',
    amount: 1,
  },
  boost_x2_24h: {
    id: 'boost_x2_24h',
    title: 'Р‘СѓСЃС‚ Г—2 РґРѕС…РѕРґР°',
    description: 'РЈРґРІР°РёРІР°РµС‚ РІРµСЃСЊ РґРѕС…РѕРґ РЅР° 24 С‡Р°СЃР°',
    stars: 30,
    type: 'boost',
    amount: 2,
  },
};
```

### api/_lib/telegram.ts
```ts
// api/_lib/telegram.ts
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
 * РџСЂРѕРІРµСЂСЏРµС‚ РїРѕРґРїРёСЃСЊ initData РѕС‚ Telegram.
 * @param initData - СЃС‚СЂРѕРєР° initData РёР· WebApp
 * @param botToken - С‚РѕРєРµРЅ Р±РѕС‚Р° (РїРµСЂРµРґР°РµС‚СЃСЏ РёР· process.env.BOT_TOKEN)
 */
export function validateInitData(
  initData: string,
  botToken: string
): ValidatedInitData | null {
  
  // рџ‘‡ Р‘Р•Р—РћРџРђРЎРќР«Р™ DEV BYPASS Р”Р›РЇ Р›РћРљРђР›Р¬РќРћР™ Р РђР—Р РђР‘РћРўРљР рџ‘‡
  // РЎСЂР°Р±РѕС‚Р°РµС‚, С‚РѕР»СЊРєРѕ РµСЃР»Рё РІ .env.local СЏРІРЅРѕ СѓРєР°Р·Р°РЅРѕ ALLOW_DEV_BYPASS=true
  if (
    process.env.ALLOW_DEV_BYPASS === 'true' && 
    initData === 'DEV_BYPASS'
  ) {
    return {
      user: {
        id: 123456789, // Р”РѕР»Р¶РµРЅ СЃРѕРІРїР°РґР°С‚СЊ СЃ DEV_USER_ID РІРѕ С„СЂРѕРЅС‚РµРЅРґ-С„Р°Р№Р»Рµ telegram.ts
        first_name: 'Dev',
        last_name: 'User',
        username: 'dev_user',
      },
      authDate: Math.floor(Date.now() / 1000),
      hash: 'dev_bypass_hash',
    };
  }
  // рџ‘† РљРћРќР•Р¦ DEV BYPASS рџ‘†

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
      console.warn('РќРµРІРµСЂРЅР°СЏ РїРѕРґРїРёСЃСЊ initData');
      return null;
    }

    const userJson = params.get('user');
    if (!userJson) return null;

    const user = JSON.parse(userJson) as TelegramUser;
    const authDate = parseInt(params.get('auth_date') || '0', 10);

    return { user, authDate, hash };
  } catch (e) {
    console.error('РћС€РёР±РєР° РїСЂРё РІР°Р»РёРґР°С†РёРё initData:', e);
    return null;
  }
}

/**
 * РЈС‚РёР»РёС‚Р° РґР»СЏ РІС‹Р·РѕРІР° РјРµС‚РѕРґРѕРІ Telegram Bot API.
 * @param method - РЅР°Р·РІР°РЅРёРµ РјРµС‚РѕРґР° (РЅР°РїСЂРёРјРµСЂ, 'sendMessage')
 * @param payload - С‚РµР»Рѕ Р·Р°РїСЂРѕСЃР°
 * @param botToken - С‚РѕРєРµРЅ Р±РѕС‚Р°
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
```

### api/_lib/upgrades.ts
```ts
export type GarageUpgradeType = 'engine' | 'tires' | 'suspension' | 'diagnostics';

export interface UpgradeDef {
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
}

export const UPGRADE_DEFS: Record<GarageUpgradeType, UpgradeDef> = {
  engine:      { maxLevel: 20, baseCost: 5_000, costMultiplier: 1.7 },
  tires:       { maxLevel: 20, baseCost: 3_000, costMultiplier: 1.6 },
  suspension:  { maxLevel: 20, baseCost: 4_000, costMultiplier: 1.65 },
  diagnostics: { maxLevel: 20, baseCost: 2_000, costMultiplier: 1.5 },
};

export function getUpgradeCost(type: GarageUpgradeType, level: number): number {
  const def = UPGRADE_DEFS[type];
  return Math.floor(def.baseCost * Math.pow(def.costMultiplier, level));
}

export function levelField(type: GarageUpgradeType):
  | 'engineLevel'
  | 'tiresLevel'
  | 'suspensionLevel'
  | 'diagnosticsLevel' {
  switch (type) {
    case 'engine':      return 'engineLevel';
    case 'tires':       return 'tiresLevel';
    case 'suspension':  return 'suspensionLevel';
    case 'diagnostics': return 'diagnosticsLevel';
  }
}

export interface UpgradeLevels {
  engine: number;
  tires: number;
  suspension: number;
  diagnostics: number;
}

export interface RacingStats {
  power: number;    // HP
  topSpeed: number; // km/h
  accel: number;    // СЃРµРє РґРѕ 100
  grip: number;     // 0..100
  handling: number; // 0..100
  rating: number;   // СЃРІРѕРґРЅС‹Р№ СЂРµР№С‚РёРЅРі
}

/**
 * РЎС‡РёС‚Р°РµС‚ С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё РјР°С€РёРЅС‹ РЅР° РѕСЃРЅРѕРІРµ СѓСЂРѕРІРЅРµР№ РіР°СЂР°Р¶РЅС‹С… Р°РїРіСЂРµР№РґРѕРІ.
 * Р­С‚Р° Р¶Рµ С„РѕСЂРјСѓР»Р° РїСЂРѕРґСѓР±Р»РёСЂРѕРІР°РЅР° РЅР° РєР»РёРµРЅС‚Рµ РІ src/config/racing.ts вЂ”
 * С‡С‚РѕР±С‹ UI РјРѕРі РїРѕРєР°Р·С‹РІР°С‚СЊ РїСЂРµРґРїСЂРѕСЃРјРѕС‚СЂ Р±РµР· Р·Р°РїСЂРѕСЃР° РЅР° СЃРµСЂРІРµСЂ.
 * Р›РѕРіРёРєР° РіРѕРЅРѕРє (РєРѕРіРґР° РїРѕСЏРІРёС‚СЃСЏ) Р±СѓРґРµС‚ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ СЃРµСЂРІРµСЂРЅСѓСЋ РІРµСЂСЃРёСЋ.
 */
export function getRacingStats(levels: UpgradeLevels): RacingStats {
  const { engine, tires, suspension, diagnostics } = levels;

  const power = 200 + engine * 35;
  const topSpeed = 220 + engine * 12 + tires * 2;
  const accel = Math.max(
    2.0,
    6.5 - engine * 0.15 - tires * 0.08 - suspension * 0.02,
  );
  const grip = Math.min(100, tires * 4 + suspension * 2);
  const handling = Math.min(100, suspension * 4 + diagnostics * 1.5);

  const rating = Math.round(
    engine * 10 + tires * 8 + suspension * 8 + diagnostics * 6,
  );

  return {
    power,
    topSpeed,
    accel: Math.round(accel * 100) / 100,
    grip,
    handling,
    rating,
  };
}
```

### api/bot.ts
```ts
// api/bot.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { tgApi } from './_lib/telegram.js'; // РР—РњР•РќР•РќРћ
import { db } from './_lib/db.js'; // РР—РњР•РќР•РќРћ
import { purchases, users } from './_lib/schema.js'; // РР—РњР•РќР•РќРћ
import { SHOP_ITEMS } from './_lib/shop.js'; // РР—РњР•РќР•РќРћ
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

// РўРёРї РґР»СЏ СЌР»РµРјРµРЅС‚Р° РјР°РіР°Р·РёРЅР° (РЅР° РѕСЃРЅРѕРІРµ РІР°С€РµРіРѕ shop.ts)
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
    // --- 1. РћР‘Р РђР‘РћРўРљРђ РџР Р•Р”Р’РђР РРўР•Р›Р¬РќРћР™ РћРџР›РђРўР« ---
    if (update?.pre_checkout_query) {
      const q: PreCheckoutQuery = update.pre_checkout_query;
      let ok = false;
      let errorMessage = 'РўРѕРІР°СЂ РЅРµРґРѕСЃС‚СѓРїРµРЅ';

      try {
        const payload = JSON.parse(q.invoice_payload);
        const purchaseId: string = payload.purchaseId;

        const [purchase] = await db
          .select()
          .from(purchases)
          .where(eq(purchases.id, purchaseId))
          .limit(1);

        if (!purchase) {
          errorMessage = 'Р—Р°РєР°Р· РЅРµ РЅР°Р№РґРµРЅ';
        } else if (purchase.userId !== q.from.id) {
          errorMessage = 'Р—Р°РєР°Р· РїСЂРёРЅР°РґР»РµР¶РёС‚ РґСЂСѓРіРѕРјСѓ РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ';
        } else if (purchase.status !== 'pending') {
          errorMessage = 'Р—Р°РєР°Р· СѓР¶Рµ РѕР±СЂР°Р±РѕС‚Р°РЅ';
        } else if (purchase.starsAmount !== q.total_amount) {
          errorMessage = 'РЎСѓРјРјР° РЅРµ СЃРѕРІРїР°РґР°РµС‚';
        } else if (q.currency !== 'XTR') {
          errorMessage = 'Р’Р°Р»СЋС‚Р° РЅРµ РїРѕРґРґРµСЂР¶РёРІР°РµС‚СЃСЏ';
        } else {
          ok = true;
        }
      } catch {
        errorMessage = 'РќРµРєРѕСЂСЂРµРєС‚РЅС‹Р№ payload';
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

    // --- 2. РћР‘Р РђР‘РћРўРљРђ РЈРЎРџР•РЁРќРћР™ РћРџР›РђРўР« ---
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

      // РђС‚РѕРјР°СЂРЅРѕ РјРµРЅСЏРµРј СЃС‚Р°С‚СѓСЃ, С‡С‚РѕР±С‹ РёР·Р±РµР¶Р°С‚СЊ РґРІРѕР№РЅРѕРіРѕ Р·Р°С‡РёСЃР»РµРЅРёСЏ
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

      // РќР°С‡РёСЃР»СЏРµРј С‚РѕРІР°СЂ
      await grantItem(userId, item);

      return res.status(200).send('ok');
    }

    // --- 3. РћР‘Р РђР‘РћРўРљРђ РљРћРњРђРќР”Р« /start ---
    if (update?.message?.text === '/start') {
      await tgApi(
        'sendMessage',
        {
          chat_id: update.message.chat.id,
          text: 'Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ РІ Racing Idle RPG! РћС‚РєСЂРѕР№ РёРіСЂСѓ РёР· РјРµРЅСЋ Р±РѕС‚Р°.',
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

// --- Р¤РЈРќРљР¦РРЇ РќРђР§РРЎР›Р•РќРРЇ РўРћР’РђР Рђ ---
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
        await logTransaction(userId, item.amount, 'shop', `РџРѕРєСѓРїРєР° РІ РјР°РіР°Р·РёРЅРµ: ${item.title}`);
      break;

    case 'battle_pass':
      console.log('[grant] battle pass', userId);
      // Р—РґРµСЃСЊ Р±СѓРґРµС‚ Р»РѕРіРёРєР° РІС‹РґР°С‡Рё Р±Р°С‚Р»РїР°СЃСЃР°
      break;

    case 'boost':
      console.log('[grant] boost', userId, item.amount);
      // Р—РґРµСЃСЊ Р±СѓРґРµС‚ Р»РѕРіРёРєР° РІС‹РґР°С‡Рё Р±СѓСЃС‚Р°
      break;

    case 'premium_car':
    case 'unlock_slots':
      console.log('[grant] other', item.type, userId);
      // Р—РґРµСЃСЊ Р±СѓРґРµС‚ Р»РѕРіРёРєР° РІС‹РґР°С‡Рё РјР°С€РёРЅ Рё СЃР»РѕС‚РѕРІ
      break;
  }
}
```

### api/create-invoice.ts
```ts
// api/create-invoice.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { validateInitData, tgApi } from './_lib/telegram.js'; 
import { db } from './_lib/db.js';
import { purchases } from './_lib/schema.js';
import { SHOP_ITEMS } from './_lib/shop.js';

interface TelegramApiResponse<T = unknown> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

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

    // РЈРЅРёРІРµСЂСЃР°Р»СЊРЅС‹Р№ РїРѕРёСЃРє С†РµРЅС‹: РёС‰РµРј РїРѕР»Рµ price, stars, cost РёР»Рё starsAmount
    const itemPrice = (item as any).price || (item as any).stars || (item as any).cost || (item as any).starsAmount;
    
    if (!itemPrice) {
      console.error('РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ С†РµРЅСѓ С‚РѕРІР°СЂР°:', item);
      return res.status(500).json({ error: 'Item price not configured' });
    }

    const itemTitle = (item as any).title || itemId;
    const itemDescription = (item as any).description || 'РџРѕРєСѓРїРєР° РІ РёРіСЂРµ Р“РѕРЅРѕС‡РЅС‹Р№ РљР»РёРєРµСЂ';

    const newPurchase = await db.insert(purchases).values({
      userId: telegramId,
      itemId: itemId,
      starsAmount: itemPrice,
      status: 'pending',
    }).returning();

    // Р’С‹Р·РѕРІ Telegram Bot API РґР»СЏ СЃРѕР·РґР°РЅРёСЏ РёРЅРІРѕР№СЃР°
    const result = (await tgApi(
      'createInvoiceLink',
      {
        title: itemTitle,
        description: itemDescription,
        payload: JSON.stringify({ purchaseId: newPurchase[0].id }),
        provider_token: '', // Р”Р»СЏ Telegram Stars РІСЃРµРіРґР° РїСѓСЃС‚Р°СЏ СЃС‚СЂРѕРєР°
        currency: 'XTR',    // РљРѕРґ РІР°Р»СЋС‚С‹ РґР»СЏ Stars
        prices: [{ label: itemTitle, amount: itemPrice }],
      },
      process.env.BOT_TOKEN!
    )) as TelegramApiResponse<string>;

    if (!result.ok || typeof result.result !== 'string') {
      console.error('Telegram API Error:', result);
      return res.status(500).json({ error: result.description ?? 'Telegram API error' });
    }

    return res.status(200).json({ invoiceLink: result.result });
  } catch (error) {
    console.error('Invoice error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### api/game.ts
```ts
import { syncHandler } from './_lib/handlers/sync.js';
import { tapHandler } from './_lib/handlers/tap.js';
import { pvpHandler } from './_lib/handlers/pvp.js';
import { leaderboardHandler } from './_lib/handlers/leaderboard.js';
import { equipHandler } from './_lib/handlers/equip.js';
import { switchCarHandler } from './_lib/handlers/switchCar.js';
import { pvpResultHandler } from './_lib/handlers/pvpResult.js';
import { buyCarHandler } from './_lib/handlers/buyCar.js';
import { upgradeClickerHandler } from './_lib/handlers/upgradeClicker.js';
import { upgradeOfflineHandler } from './_lib/handlers/upgradeOffline.js';
import { sellItemHandler } from './_lib/handlers/sellItem.js';
import { claimDailyHandler } from './_lib/handlers/claimDaily.js';
import { getQuestsHandler } from './_lib/handlers/getQuests.js';
import { claimQuestHandler } from './_lib/handlers/claimQuest.js';
import { upgradePartHandler } from './_lib/handlers/upgradePart.js';
import { claimUpgradeHandler } from './_lib/handlers/claimUpgrade.js';
import { craftItemHandler } from './_lib/handlers/craftItem.js';
import { buyBusinessHandler } from './_lib/handlers/buyBusiness.js';
import { upgradeBusinessHandler } from './_lib/handlers/upgradeBusiness.js';
import { collectIncomeHandler } from './_lib/handlers/collectIncome.js';
import { flipCoinHandler } from './_lib/handlers/flipCoin.js';
import { getPassHandler } from './_lib/handlers/getPass.js';
import { claimPassRewardHandler } from './_lib/handlers/claimPassReward.js';
import { getClanHandler } from './_lib/handlers/getClan.js';
import { createClanHandler } from './_lib/handlers/createClan.js';
import { joinClanHandler } from './_lib/handlers/joinClan.js';
import { clanActionHandler } from './_lib/handlers/clanAction.js';
import { adminHandler } from './_lib/handlers/admin.js';
import { claimAdRewardHandler } from './_lib/handlers/claimAdReward.js';
import { openCaseHandler } from './_lib/handlers/openCase.js';
import { getHistoryHandler } from './_lib/handlers/getHistory.js';
import { buyPremiumHandler } from './_lib/handlers/buyPremium.js';
import { getAchievementsHandler } from './_lib/handlers/getAchievements.js';
import { claimAchievementHandler } from './_lib/handlers/claimAchievement.js';
import { getClansHandler } from './_lib/handlers/getClans.js';
import { getReferralsHandler } from './_lib/handlers/getReferrals.js';
import { addLeaguePointsHandler } from './_lib/handlers/addLeaguePoints.js';
import { getClanMessagesHandler, sendClanMessageHandler } from './_lib/handlers/clanChat.js';
import { skipUpgradeTimeHandler } from './_lib/handlers/skipUpgradeTime.js';
import { claimLevelRewardHandler } from './_lib/handlers/claimLevelReward.js';
import { getClanBossHandler, attackClanBossHandler } from './_lib/handlers/clanBoss.js';

export default async function handler(req: any, res: any) {
  const rawAction = req.query.action;
  const action = Array.isArray(rawAction) ? rawAction[0] : rawAction;

  // рџ‘‡ DEV BYPASS Р”Р›РЇ Р›РћРљРђР›Р¬РќРћР™ Р РђР—Р РђР‘РћРўРљР рџ‘‡
  // Р•СЃР»Рё РјС‹ Р»РѕРєР°Р»СЊРЅРѕ Рё С„СЂРѕРЅС‚ РїСЂРёСЃР»Р°Р» РЅР°С€ С„Р»Р°Рі, РїРѕРґРјРµРЅСЏРµРј РґР°РЅРЅС‹Рµ
  if (process.env.NODE_ENV !== 'production' && req.body?.initData === 'DEV_BYPASS') {
    // РџРѕРґРјРµРЅСЏРµРј initData РЅР° С„РµР№РєРѕРІС‹Р№ РІР°Р»РёРґРЅС‹Р№ С‚РѕРєРµРЅ РёР»Рё РїСЂСЏРјРѕ РІ req.body
    // Р•СЃР»Рё С‚РІРѕРё С…РµРЅРґР»РµСЂС‹ РёСЃРїРѕР»СЊР·СѓСЋС‚ Р±РёР±Р»РёРѕС‚РµРєСѓ С‚РёРїР° @telegram-apps/init-data-node
    // С‚РµР±Рµ РЅСѓР¶РЅРѕ Р±СѓРґРµС‚ СЃРіРµРЅРµСЂРёСЂРѕРІР°С‚СЊ РІР°Р»РёРґРЅСѓСЋ СЃС‚СЂРѕРєСѓ. 
    // РќРѕ СЃР°РјС‹Р№ РїСЂРѕСЃС‚РѕР№ РїСѓС‚СЊ - РїРµСЂРµРґР°С‚СЊ С„Р»Р°Рі РґР°Р»СЊС€Рµ, РµСЃР»Рё С…РµРЅРґР»РµСЂС‹ РµРіРѕ РїРѕРЅРёРјР°СЋС‚.
    
    // Р’Р Р•РњР•РќРќРћ: РџРѕРґРјРµРЅСЏРµРј telegramId (РµСЃР»Рё С…РµРЅРґР»РµСЂС‹ С‡РёС‚Р°СЋС‚ req.user)
    // Р’ РёРґРµР°Р»Рµ С‚РµР±Рµ РЅСѓР¶РЅРѕ РґРѕР±Р°РІРёС‚СЊ РІ СЃРІРѕР№СЃС‚РІРѕ req.user С„РµР№РєРѕРІРѕРіРѕ СЋР·РµСЂР°.
    req.user = { id: 123456789, first_name: 'Dev' }; 
  }

  switch (action) {
    case 'sync': return syncHandler(req, res);
    case 'openCase': return openCaseHandler(req, res);
    case 'tap': return tapHandler(req, res);
    case 'pvp': return pvpHandler(req, res);
    case 'leaderboard': return leaderboardHandler(req, res);
    case 'equip': return equipHandler(req, res);
    case 'claimAdReward': return claimAdRewardHandler(req, res);
    case 'switchCar': return switchCarHandler(req, res);
    case 'pvpResult': return pvpResultHandler(req, res);
    case 'buyCar': return buyCarHandler(req, res);
    case 'upgradeClicker': return upgradeClickerHandler(req, res);
    case 'upgradeOffline': return upgradeOfflineHandler(req, res);
    case 'sellItem': return sellItemHandler(req, res);
    case 'claimDaily': return claimDailyHandler(req, res);
    case 'getQuests': return getQuestsHandler(req, res); 
    case 'claimQuest': return claimQuestHandler(req, res); 
    case 'upgradePart': return upgradePartHandler(req, res);
    case 'claimUpgrade': return claimUpgradeHandler(req, res);
    case 'craftItem': return craftItemHandler(req, res);
    case 'buyBusiness': return buyBusinessHandler(req, res);
    case 'upgradeBusiness': return upgradeBusinessHandler(req, res);
    case 'collectIncome': return collectIncomeHandler(req, res);
    case 'flipCoin': return flipCoinHandler(req, res);
    case 'getPass': return getPassHandler(req, res);
    case 'claimPassReward': return claimPassRewardHandler(req, res);
    case 'getClan': return getClanHandler(req, res);
    case 'createClan': return createClanHandler(req, res);
    case 'joinClan': return joinClanHandler(req, res);
    case 'clanAction': return clanActionHandler(req, res);
    case 'admin': return adminHandler(req, res);
    case 'getHistory': return getHistoryHandler(req, res);
    case 'getReferrals': return getReferralsHandler(req, res);
    case 'getAchievements': return getAchievementsHandler(req, res);
    case 'claimAchievement': return claimAchievementHandler(req, res);
    case 'buyPremium': return buyPremiumHandler(req, res);
    case 'getClans': return getClansHandler(req, res);
    case 'getClanMessages': return getClanMessagesHandler(req, res);
    case 'sendClanMessage': return sendClanMessageHandler(req, res);
    case 'getClanBoss': return getClanBossHandler(req, res);
    case 'attackClanBoss': return attackClanBossHandler(req, res);
    case 'addLeaguePoints': return addLeaguePointsHandler(req, res);
    case 'claimLevelReward': return claimLevelRewardHandler(req, res);
    case 'skipUpgradeTime': return skipUpgradeTimeHandler(req, res);
    default: return res.status(400).json({ error: 'Invalid action' });
  }
}
```

### api/update-car.ts
```ts
// api/update-car.ts
import { db } from './_lib/db.js';
import { users } from './_lib/schema.js';
import { validateInitData } from './_lib/telegram.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { initData, carColor } = req.body;

    if (!initData) {
      return res.status(401).json({ error: 'No initData provided' });
    }

    // РСЃРїРѕР»СЊР·СѓРµРј С‚РІРѕСЋ С„СѓРЅРєС†РёСЋ РІР°Р»РёРґР°С†РёРё РёР· lib/telegram.js
    const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);

    if (!validatedData || !validatedData.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = validatedData.user.id;

    // РћР±РЅРѕРІР»СЏРµРј С†РІРµС‚ РІ Р±Р°Р·Рµ РґР°РЅРЅС‹С…
    await db.update(users)
      .set({ carColor })
      .where(eq(users.id, userId));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating car color:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

### src/App.tsx
```tsx
import { useEffect, useState } from 'react';
import { Flag, Building2, Wrench, User } from 'lucide-react';
import { useGameStore } from './store/gameStore';
import { RaceScreen } from './components/RaceScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { GarageScreen } from './components/GarageScreen';
import { CityScreen } from './components/CityScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { DailyRewardModal } from './components/DailyRewardModal';
import { CARS } from './config/cars';
import WebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/clan.css';
import { getInitData } from './lib/telegram';

type Tab = 'race' | 'city' | 'garage' | 'profile';

type FullscreenWebApp = typeof WebApp & {
  version?: string;
  isFullscreen?: boolean;
  requestFullscreen?: () => void;
  disableVerticalSwipes?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
};

const getMskMidnight = (offsetDays = 0) => {
  const now = new Date();
  const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  mskTime.setUTCHours(0, 0, 0, 0);
  mskTime.setUTCDate(mskTime.getUTCDate() + offsetDays);
  return mskTime.getTime() - 3 * 60 * 60 * 1000;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('race');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineEarnings, setOfflineEarnings] = useState(0);
  const [showAutoDaily, setShowAutoDaily] = useState(false);

  const setUser = useGameStore((state) => state.setUser);
  const syncTaps = useGameStore((state) => state.syncTaps);
  const user = useGameStore((state) => state.user);

  useEffect(() => {
    const imagesToPreload = [
      '/images/bg-garage.jpg',
      '/images/bg-night-city.jpg',
      '/images/tires.png',
      '/images/suspension.png',
      '/images/computer.png',
    ];

    if (CARS) {
      Object.values(CARS).forEach((car: any) => {
        if (car && car.image) imagesToPreload.push(car.image);
      });
    }

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const webApp = WebApp as FullscreenWebApp;

    let cancelled = false;
    let readyTimeout: ReturnType<typeof setTimeout> | undefined;

    webApp.ready();

    const platform = webApp.platform;
    const isMobile = platform === 'ios' || platform === 'android';

    if (isMobile) {
      document.documentElement.style.setProperty(
        '--tg-safe-top',
        'max(85px, env(safe-area-inset-top, 0px))'
      );
    } else {
      document.documentElement.style.setProperty('--tg-safe-top', '0px');
    }

    if (isMobile) {
      try {
        webApp.setHeaderColor?.('#000000');
        webApp.setBackgroundColor?.('#000000');
        webApp.expand();
        webApp.disableVerticalSwipes?.();
        const version = Number(webApp.version || '0');
        if (version >= 8 && typeof webApp.requestFullscreen === 'function' && !webApp.isFullscreen) {
          webApp.requestFullscreen();
        }
      } catch (e) {
        console.error('[Telegram] РћС€РёР±РєР° РЅР°СЃС‚СЂРѕР№РєРё СЌРєСЂР°РЅР°:', e);
      }
    }

    const loadUser = async () => {
      const startTime = Date.now();

      try {
        const initData = getInitData();
        const startParam = webApp.initDataUnsafe?.start_param || '';

        const res = await fetch('/api/game?action=sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData, startParam }),
        });

        if (!res.ok) throw new Error(`РћС€РёР±РєР° СЃРµСЂРІРµСЂР°: ${res.status}`);

        const data = await res.json();
        if (cancelled) return;

        if (data.user && data.user.id) {
          setUser(
            data.user,
            data.inventory || [],
            data.equipped || { engine: null, tires: null, ecu: null, suspension: null }
          );

          const lastDaily = data.user.lastDailyClaim
            ? new Date(data.user.lastDailyClaim).getTime()
            : 0;
          const todayMidnight = getMskMidnight(0);

          if (lastDaily < todayMidnight) {
            setShowAutoDaily(true);
          }

          if (data.offlineEarnings > 0) {
            setOfflineEarnings(data.offlineEarnings);
          }
        } else {
          setError(data.error || 'РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РїСЂРѕС„РёР»СЊ');
        }
      } catch (e) {
        console.error('РћС€РёР±РєР° sync:', e);
        if (!cancelled) setError('РћС€РёР±РєР° СЃРµС‚Рё. РџСЂРѕРІРµСЂСЊС‚Рµ РёРЅС‚РµСЂРЅРµС‚ Рё РїРѕРїСЂРѕР±СѓР№С‚Рµ СЃРЅРѕРІР°.');
      } finally {
        if (!cancelled) {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 1500 - elapsed);
          readyTimeout = setTimeout(() => {
            if (!cancelled) setIsReady(true);
          }, remaining);
        }
      }
    };

    const loadTimeout = setTimeout(loadUser, 100);
    const syncInterval = setInterval(() => syncTaps(), 1000);

    return () => {
      cancelled = true;
      clearTimeout(loadTimeout);
      clearInterval(syncInterval);
      if (readyTimeout) clearTimeout(readyTimeout);
    };
  }, [setUser, syncTaps]);

  const reloadApp = () => window.location.reload();

  return (
    <>
      <AnimatePresence>{!isReady && <LoadingScreen />}</AnimatePresence>

      {isReady && (error || !user) && (
        <div className="app-error">
          <h2>РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё</h2>
          <p>{error || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ РЅР°Р№РґРµРЅ'}</p>
          <button onClick={reloadApp}>РџРµСЂРµР·Р°РіСЂСѓР·РёС‚СЊ</button>
        </div>
      )}

      {isReady && !error && user && (
        <div className="game-wrapper">
          <div className="app-container">
            <main className="main-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {activeTab === 'race' && <RaceScreen />}
                  {activeTab === 'city' && <CityScreen />}
                  {activeTab === 'garage' && <GarageScreen />}
                  {activeTab === 'profile' && <ProfileScreen />}
                </motion.div>
              </AnimatePresence>
            </main>

            <nav className="bottom-nav">
              <button
                className={`nav-btn ${activeTab === 'race' ? 'active' : ''}`}
                onClick={() => setActiveTab('race')}
              >
                <span className="nav-icon">
                  <Flag size={24} strokeWidth={2.2} />
                </span>
                <span className="nav-label">Р“РѕРЅРєР°</span>
              </button>
              <button
                className={`nav-btn ${activeTab === 'city' ? 'active' : ''}`}
                onClick={() => setActiveTab('city')}
              >
                <span className="nav-icon">
                  <Building2 size={24} strokeWidth={2.2} />
                </span>
                <span className="nav-label">Р“РѕСЂРѕРґ</span>
              </button>
              <button
                className={`nav-btn ${activeTab === 'garage' ? 'active' : ''}`}
                onClick={() => setActiveTab('garage')}
              >
                <span className="nav-icon">
                  <Wrench size={24} strokeWidth={2.2} />
                </span>
                <span className="nav-label">Р“Р°СЂР°Р¶</span>
              </button>
              <button
                className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="nav-icon">
                  <User size={24} strokeWidth={2.2} />
                </span>
                <span className="nav-label">РџСЂРѕС„РёР»СЊ</span>
              </button>
            </nav>

            {showAutoDaily && <DailyRewardModal onClose={() => setShowAutoDaily(false)} />}

            <AnimatePresence>
              {offlineEarnings > 0 && (
                <motion.div
                  className="offline-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="offline-card"
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                  >
                    <h2>РЎ РІРѕР·РІСЂР°С‰РµРЅРёРµРј!</h2>
                    <p>РџРѕРєР° РІР°СЃ РЅРµ Р±С‹Р»Рѕ, РјРµС…Р°РЅРёРєРё Р·Р°СЂР°Р±РѕС‚Р°Р»Рё:</p>
                    <div className="offline-amount">
                      +{offlineEarnings.toLocaleString('ru-RU')} в‚Ѕ
                    </div>
                    <button onClick={() => setOfflineEarnings(0)}>Р—Р°Р±СЂР°С‚СЊ</button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
```

### src/components/AchievementsScreen.tsx
```tsx
// src/components/AchievementsScreen.tsx
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Lock, Check,
  Coins, Wallet, Gem, Crown, Landmark,
  Pointer, Zap, Flame, Rocket, Sparkles,
  Flag, Gauge, Medal, Award,
  Car, CarFront, CarTaxiFront, Warehouse,
  Wrench, Cog, Hammer, Shield, Star, TrendingUp,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { CATEGORY_META, TIER_META, AchievementCategory } from '../config/achievements';
import '../styles/achievements.css';

const ICON_MAP: Record<string, any> = {
  Coins, Wallet, Gem, Crown, Landmark,
  Pointer, Zap, Flame, Rocket, Sparkles,
  Flag, Gauge, Trophy, Medal, Award,
  Car, CarFront, CarTaxiFront, Warehouse,
  Wrench, Cog, Hammer, Shield, Star, TrendingUp,
};

const renderLucideIcon = (name: string, size = 20, color = 'currentColor') => {
  const IconComponent = ICON_MAP[name] || Trophy;
  return <IconComponent size={size} color={color} strokeWidth={2} />;
};

export const AchievementsScreen = ({ onClose }: { onClose: () => void }) => {
  const achievementsList = useGameStore((s) => s.achievementsList);
  const getAchievements = useGameStore((s) => s.getAchievements);
  const claimAchievement = useGameStore((s) => s.claimAchievement);

  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('wealth');

  useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  const handleClaim = async (id: string) => {
    const success = await claimAchievement(id);
    if (success) WebApp.HapticFeedback?.notificationOccurred('success');
    else WebApp.HapticFeedback?.notificationOccurred('error');
  };

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    achievementsList.forEach((ach: any) => {
      const cat = ach.category || 'legend';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(ach);
    });
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => (a.tier || 0) - (b.tier || 0));
    });
    return groups;
  }, [achievementsList]);

  const totalUnlocked = achievementsList.filter(a => a.isUnlocked).length;
  const totalClaimable = achievementsList.filter(a => a.isCompleted && !a.isUnlocked).length;
  const activeAchievements = grouped[activeCategory] || [];
  const activeUnlocked = activeAchievements.filter(a => a.isUnlocked).length;

  return (
    <div className="achievements-screen" onClick={onClose}>
      <motion.div
        className="achievements-content"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* РЁР°РїРєР° */}
        <div className="achievements-header">
          <h2>
            <Trophy size={18} color="#ffd700" />
            Р”РѕСЃС‚РёР¶РµРЅРёСЏ
            {totalClaimable > 0 && (
              <span style={{
                background: '#ff4444', color: '#fff', fontSize: '10px', fontWeight: 'bold',
                padding: '2px 6px', borderRadius: '10px', marginLeft: 4,
              }}>
                {totalClaimable}
              </span>
            )}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: 700 }}>
              {totalUnlocked}/{achievementsList.length}
            </span>
            <button className="achievements-close" onClick={onClose}>вњ•</button>
          </div>
        </div>

        {/* РўР°Р±С‹ РєР°С‚РµРіРѕСЂРёР№ */}
        <div className="achievements-tabs">
          {(Object.keys(CATEGORY_META) as AchievementCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const catAchievements = grouped[cat] || [];
            const catUnlocked = catAchievements.filter(a => a.isUnlocked).length;
            const hasClaimable = catAchievements.some(a => a.isCompleted && !a.isUnlocked);
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                className={`achievement-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={isActive ? { borderColor: meta.color, color: meta.color } : {}}
              >
                {renderLucideIcon(meta.icon, 16, isActive ? meta.color : '#888')}
                <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                  {meta.name}
                </span>
                <span style={{ fontSize: '8px', color: '#666' }}>
                  {catUnlocked}/{catAchievements.length}
                </span>
                {hasClaimable && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#ff4444', boxShadow: '0 0 6px #ff4444',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* РџСЂРѕРіСЂРµСЃСЃ РєР°С‚РµРіРѕСЂРёРё */}
        <div className="achievements-progress-bar">
          <div
            className="achievements-progress-fill"
            style={{
              width: activeAchievements.length > 0 ? `${(activeUnlocked / activeAchievements.length) * 100}%` : '0%',
              background: `linear-gradient(90deg, ${CATEGORY_META[activeCategory].color}, ${CATEGORY_META[activeCategory].color}88)`,
              boxShadow: `0 0 10px ${CATEGORY_META[activeCategory].color}66`
            }}
          />
        </div>

        {/* РЎРїРёСЃРѕРє РґРѕСЃС‚РёР¶РµРЅРёР№ */}
        <div className="achievements-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {activeAchievements.length === 0 && (
                <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
                  РќРµС‚ РґРѕСЃС‚РёР¶РµРЅРёР№ РІ СЌС‚РѕР№ РєР°С‚РµРіРѕСЂРёРё
                </div>
              )}

              {activeAchievements.map((ach: any) => {
                const isUnlocked = ach.isUnlocked;
                const isClaimable = ach.isCompleted && !ach.isUnlocked;
                const tier = (ach.tier || 1) as 1 | 2 | 3 | 4 | 5;
                const tierColor = TIER_META[tier]?.color || '#888';

                let cardClass = 'achievement-card';
                if (isUnlocked) cardClass += ' unlocked';
                if (isClaimable) cardClass += ' claimable';

                return (
                  <div key={ach.id} className={cardClass}>
                    <div className={`achievement-icon-wrapper ${isUnlocked ? 'unlocked' : ''} ${isClaimable ? 'claimable' : ''}`}>
                      {isUnlocked ? (
                        <Check size={20} color="var(--success)" strokeWidth={3} />
                      ) : isClaimable ? (
                        renderLucideIcon(ach.icon, 20, 'var(--gold)')
                      ) : (
                        <Lock size={18} color="#666" />
                      )}
                    </div>

                    <div className="achievement-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            fontSize: '9px', fontWeight: 900, padding: '1px 6px',
                            borderRadius: 4, background: `${tierColor}22`,
                            color: tierColor, border: `1px solid ${tierColor}44`,
                            textTransform: 'uppercase', letterSpacing: '0.5px',
                          }}
                        >
                          {TIER_META[tier]?.name || 'T' + tier}
                        </span>
                        <span className="achievement-name">{ach.name}</span>
                      </div>
                      <span className="achievement-desc">{ach.description}</span>
                      <span className="achievement-reward">
                        {ach.reward?.toLocaleString('ru-RU') || 0}
                        <span className="currency-ruble sm" style={{ marginLeft: 4 }}>в‚Ѕ</span>
                      </span>
                    </div>

                    {isUnlocked && <span className="achievement-status done">вњ“</span>}
                    {isClaimable && (
                      <button className="achievement-claim-btn" onClick={() => handleClaim(ach.id)}>
                        Р—РђР‘Р РђРўР¬
                      </button>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
```

### src/components/AdminScreen.tsx
```tsx
// src/components/AdminScreen.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, TrendingUp, Users, Shield, AlertCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import '../styles/admin.css';

type AdminTab = 'overview' | 'give' | 'flags' | 'users';

interface FeatureFlag {
  name: string;
  isEnabled: boolean;
  description?: string;
}

interface AdminUser {
  id: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  balance: number;
  starsBalance?: number;
  leaguePoints?: number;
  rating: number;
  isAdmin: boolean;
  isBanned: boolean;
}

interface AdminStats {
  totalUsers: number;
  totalBalance: number;
  avgRating: number;
  bannedUsers: number;
  totalStars: number;
  totalLeague: number;
}

interface AdminScreenProps {
  onClose?: () => void; // рџ‘€ РґРѕР±Р°РІРёР»Рё
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const adminGetData = useGameStore((s) => s.adminGetData);
  const adminAction = useGameStore((s) => s.adminAction);
  const user = useGameStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'error' } | null>(null);

  // Р¤РѕСЂРјР° РІС‹РґР°С‡Рё
  const [giveUserId, setGiveUserId] = useState('');
  const [giveType, setGiveType] = useState<'balance' | 'stars' | 'league'>('balance');
  const [giveAmount, setGiveAmount] = useState('');

  const isAdmin = user?.isAdmin || false;

  const showToast = (msg: string, type: 'ok' | 'error' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminGetData();
      if (data) {
        setFlags(data.flags || []);
        setUsers(data.users || []);

        const totalBalance = data.users.reduce((sum: number, u: any) => sum + (u.balance || 0), 0);
        const totalStars = data.users.reduce((sum: number, u: any) => sum + (u.starsBalance || 0), 0);
        const totalLeague = data.users.reduce((sum: number, u: any) => sum + (u.leaguePoints || 0), 0);
        const avgRating = data.users.length
          ? Math.round(data.users.reduce((sum: number, u: any) => sum + (u.rating || 0), 0) / data.users.length)
          : 0;
        const bannedUsers = data.users.filter((u: any) => u.isBanned).length;

        setStats({
          totalUsers: data.users.length,
          totalBalance,
          avgRating,
          bannedUsers,
          totalStars,
          totalLeague,
        });
      }
    } catch (e) {
      console.error(e);
      showToast('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const toggleFlag = async (name: string, current: boolean) => {
    if (actionLoading) return;
    setActionLoading(name);
    setFlags((prev) => prev.map((f) => (f.name === name ? { ...f, isEnabled: !current } : f)));
    const ok = await adminAction('toggleFeature', { name, isEnabled: !current });
    if (!ok) {
      setFlags((prev) => prev.map((f) => (f.name === name ? { ...f, isEnabled: current } : f)));
      showToast('РќРµ СѓРґР°Р»РѕСЃСЊ РёР·РјРµРЅРёС‚СЊ С„Р»Р°Рі', 'error');
    } else {
      showToast(`Р¤Р»Р°Рі "${name}" ${!current ? 'РІРєР»СЋС‡С‘РЅ' : 'РІС‹РєР»СЋС‡РµРЅ'}`);
    }
    setActionLoading(null);
  };

  const banUser = async (userId: number, currentBan: boolean) => {
    if (actionLoading) return;
    setActionLoading(`ban_${userId}`);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: !currentBan } : u)));
    const ok = await adminAction(currentBan ? 'unbanUser' : 'banUser', { userId });
    if (!ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: currentBan } : u)));
      showToast('РќРµ СѓРґР°Р»РѕСЃСЊ РёР·РјРµРЅРёС‚СЊ Р±Р°РЅ', 'error');
    } else {
      showToast(currentBan ? 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ СЂР°Р·Р±Р°РЅРµРЅ' : 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ Р·Р°Р±Р°РЅРµРЅ');
    }
    setActionLoading(null);
  };

  const giveAdmin = async (userId: number, currentAdmin: boolean) => {
    if (actionLoading) return;
    setActionLoading(`admin_${userId}`);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: !currentAdmin } : u)));
    const ok = await adminAction(currentAdmin ? 'removeAdmin' : 'giveAdmin', { userId });
    if (!ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: currentAdmin } : u)));
      showToast('РќРµ СѓРґР°Р»РѕСЃСЊ РёР·РјРµРЅРёС‚СЊ РїСЂР°РІР°', 'error');
    } else {
      showToast(currentAdmin ? 'РџСЂР°РІР° СЃРЅСЏС‚С‹' : 'РџСЂР°РІР° РІС‹РґР°РЅС‹');
    }
    setActionLoading(null);
  };

  const handleGive = async () => {
    const amount = parseInt(giveAmount, 10);
    const userId = parseInt(giveUserId, 10);
    if (!userId || !amount || amount <= 0) {
      showToast('РЈРєР°Р¶РёС‚Рµ ID Рё СЃСѓРјРјСѓ', 'error');
      return;
    }
    if (actionLoading) return;
    setActionLoading('give');
    const ok = await adminAction('giveReward', {
      targetId: userId,
      type: giveType,
      amount,
    });
    if (ok) {
      showToast(`Р’С‹РґР°РЅРѕ ${amount}`);
      setGiveAmount('');
      loadData();
    } else {
      showToast('РќРµ СѓРґР°Р»РѕСЃСЊ РІС‹РґР°С‚СЊ', 'error');
    }
    setActionLoading(null);
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.id.toString().includes(q)
    );
  });

  if (!isAdmin) {
    return (
      <div className="admin-screen">
        <div className="admin-header">
          <h2>РђРґРјРёРЅ</h2>
          {onClose && (
            <button className="admin-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <AlertCircle size={48} color="#ff4444" style={{ marginBottom: 16 }} />
          <div style={{ color: '#ff4444', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Р”РѕСЃС‚СѓРї Р·Р°РїСЂРµС‰С‘РЅ
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-screen">
        <div className="admin-header">
          <h2>РђРґРјРёРЅ</h2>
          {onClose && (
            <button className="admin-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <RefreshCw size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div>Р—Р°РіСЂСѓР·РєР°...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <h2>РђРґРјРёРЅ</h2>
        <span className="admin-badge">ADMIN</span>
        {onClose && (
          <button className="admin-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="admin-tabs">
        {[
          { id: 'overview', label: 'рџ“Љ РћР±Р·РѕСЂ' },
          { id: 'give', label: 'рџ’ё Р’С‹РґР°С‚СЊ' },
          { id: 'flags', label: 'рџљ© Р¤Р»Р°РіРё' },
          { id: 'users', label: 'рџ‘Ґ РРіСЂРѕРєРё' },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as AdminTab)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* === РћР‘Р—РћР  === */}
        {activeTab === 'overview' && stats && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-label">РџРѕР»СЊР·РѕРІР°С‚РµР»РµР№</div>
                <div className="admin-stat-value cyan">{stats.totalUsers}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">РЎСЂ. СЂРµР№С‚РёРЅРі</div>
                <div className="admin-stat-value gold">{stats.avgRating}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">РћР±С‰РёР№ Р±Р°Р»Р°РЅСЃ</div>
                <div className="admin-stat-value green">{stats.totalBalance.toLocaleString()}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Р’СЃРµРіРѕ Р·РІС‘Р·Рґ</div>
                <div className="admin-stat-value gold">{stats.totalStars.toLocaleString()}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">РћС‡РєРё Р»РёРіРё</div>
                <div className="admin-stat-value cyan">{stats.totalLeague.toLocaleString()}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Р—Р°Р±Р°РЅРµРЅРѕ</div>
                <div className="admin-stat-value red">{stats.bannedUsers}</div>
              </div>
            </div>

            <div className="admin-card">
              <h3>Р‘С‹СЃС‚СЂС‹Рµ РґРµР№СЃС‚РІРёСЏ</h3>
              <button className="admin-btn primary" onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <RefreshCw size={16} /> РћР±РЅРѕРІРёС‚СЊ РґР°РЅРЅС‹Рµ
              </button>
            </div>
          </motion.div>
        )}

        {/* === Р’Р«Р”РђРўР¬ === */}
        {activeTab === 'give' && (
          <motion.div key="give" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="admin-card">
              <h3>РќР°С‡РёСЃР»РёС‚СЊ РІР°Р»СЋС‚Сѓ</h3>

              <div className="admin-form-row">
                <label className="admin-form-label">ID РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ</label>
                <input
                  className="admin-input"
                  type="number"
                  placeholder="РќР°РїСЂРёРјРµСЂ: 123456789"
                  value={giveUserId}
                  onChange={(e) => setGiveUserId(e.target.value)}
                />
              </div>

              <div className="admin-form-row">
                <label className="admin-form-label">РўРёРї РІР°Р»СЋС‚С‹</label>
              </div>
              <div className="admin-currency-options">
                <div className={`admin-currency-option ${giveType === 'balance' ? 'active' : ''}`} onClick={() => setGiveType('balance')}>
                  в‚Ѕ Р СѓР±Р»Рё
                </div>
                <div className={`admin-currency-option ${giveType === 'stars' ? 'active' : ''}`} onClick={() => setGiveType('stars')}>
                  в­ђ Р—РІС‘Р·РґС‹
                </div>
                <div className={`admin-currency-option ${giveType === 'league' ? 'active' : ''}`} onClick={() => setGiveType('league')}>
                  рџЏ† Р›РёРіР°
                </div>
              </div>

              <div className="admin-form-row">
                <label className="admin-form-label">РЎСѓРјРјР°</label>
                <input
                  className="admin-input"
                  type="number"
                  placeholder="РќР°РїСЂРёРјРµСЂ: 1000"
                  value={giveAmount}
                  onChange={(e) => setGiveAmount(e.target.value)}
                />
              </div>

              <div className="admin-quick-amounts">
                {[100, 1000, 10000, 100000].map((v) => (
                  <button key={v} className="admin-quick-btn" onClick={() => setGiveAmount(String(v))}>
                    +{v >= 1000 ? `${v / 1000}K` : v}
                  </button>
                ))}
              </div>

              <div className="admin-form-actions">
                <button
                  className="admin-btn primary"
                  onClick={handleGive}
                  disabled={actionLoading === 'give' || !giveUserId || !giveAmount}
                >
                  {actionLoading === 'give' ? 'вЏі...' : 'вњ… Р’С‹РґР°С‚СЊ'}
                </button>
              </div>
            </div>

            <div className="admin-card" style={{ color: '#666', fontSize: '12px', lineHeight: 1.5 }}>
              рџ’Ў РџРѕРґСЃРєР°Р·РєР°: ID РјРѕР¶РЅРѕ РЅР°Р№С‚Рё РІРѕ РІРєР»Р°РґРєРµ В«рџ‘Ґ РРіСЂРѕРєРёВ».
            </div>
          </motion.div>
        )}

        {/* === Р¤Р›РђР“Р === */}
        {activeTab === 'flags' && (
          <motion.div key="flags" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {flags.length === 0 ? (
              <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                РќРµС‚ С„Р»Р°РіРѕРІ
              </div>
            ) : (
              <div className="admin-card">
                {flags.map((flag) => (
                  <div key={flag.name} className="admin-flag-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-flag-name">{flag.name}</div>
                      {flag.description && <div className="admin-flag-desc">{flag.description}</div>}
                    </div>
                    <div
                      className={`admin-toggle ${flag.isEnabled ? 'on' : ''}`}
                      onClick={() => toggleFlag(flag.name, flag.isEnabled)}
                      style={{ opacity: actionLoading === flag.name ? 0.5 : 1 }}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* === РџРћР›Р¬Р—РћР’РђРўР•Р›Р === */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <input
              className="admin-input"
              placeholder="рџ”Ќ РџРѕРёСЃРє РїРѕ РёРјРµРЅРё, username РёР»Рё ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '12px' }}
            />

            {filteredUsers.length === 0 ? (
              <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                {searchQuery ? 'РќРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ' : 'РќРµС‚ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№'}
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} className="admin-user-row">
                  <div className="admin-user-avatar" style={{ backgroundImage: u.photoUrl ? `url(${u.photoUrl})` : undefined }} />
                  <div className="admin-user-info">
                    <div className="admin-user-name">
                      {u.firstName || u.username || 'Р‘РµР·С‹РјСЏРЅРЅС‹Р№'}
                      {u.isAdmin && <span style={{ color: '#00e5ff', marginLeft: '6px', fontSize: '10px' }}>ADMIN</span>}
                      {u.isBanned && <span style={{ color: '#ff4444', marginLeft: '6px', fontSize: '10px' }}>BAN</span>}
                    </div>
                    <div className="admin-user-id">ID: {u.id}</div>
                  </div>
                  <div className="admin-user-balance">
                    {u.balance.toLocaleString()} <span className="currency-ruble sm">в‚Ѕ</span>
                  </div>
                  <div className="admin-user-actions">
                    <button
                      className="admin-icon-btn"
                      onClick={() => { setGiveUserId(String(u.id)); setActiveTab('give'); }}
                      title="РќР°С‡РёСЃР»РёС‚СЊ РІР°Р»СЋС‚Сѓ"
                    >
                      рџ’ё
                    </button>
                    <button
                      className="admin-icon-btn"
                      onClick={() => giveAdmin(u.id, u.isAdmin)}
                      disabled={actionLoading === `admin_${u.id}`}
                      title={u.isAdmin ? 'РЎРЅСЏС‚СЊ Р°РґРјРёРЅР°' : 'Р”Р°С‚СЊ Р°РґРјРёРЅР°'}
                    >
                      {u.isAdmin ? 'рџ‘‘' : 'в­ђ'}
                    </button>
                    <button
                      className="admin-icon-btn danger"
                      onClick={() => banUser(u.id, u.isBanned)}
                      disabled={actionLoading === `ban_${u.id}`}
                      title={u.isBanned ? 'Р Р°Р·Р±Р°РЅРёС‚СЊ' : 'Р—Р°Р±Р°РЅРёС‚СЊ'}
                    >
                      {u.isBanned ? 'вњ…' : 'рџљ«'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className={`admin-toast ${toast.type === 'error' ? 'error' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### src/components/BusinessScreen.tsx
```tsx
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BUSINESSES, getBusinessUpgradeCost, getBusinessIncome, BusinessConfig } from '../config/businesses';

export const BusinessScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const buyBusiness = useGameStore((s) => s.buyBusiness);
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);
  const collectIncome = useGameStore((s) => s.collectIncome);
  const [loading, setLoading] = useState<string | null>(null);

  const businesses = user?.businesses || {};
  const now = Date.now();
  let totalPending = 0;

  Object.entries(businesses).forEach(([id, data]) => {
    const config = BUSINESSES[id];
    if (!config) return;
    const hoursPassed = Math.min((now - data.lastCollected) / (1000 * 60 * 60), 24);
    if (hoursPassed > 0) {
      totalPending += Math.floor(getBusinessIncome(config.baseIncomePerHour, data.level) * hoursPassed);
    }
  });

  const handleAction = async (action: () => Promise<any>, id: string) => {
    setLoading(id);
    await action();
    setLoading(null);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#111', zIndex: 1000, overflowY: 'auto', padding: '20px',
      paddingTop: 'calc(20px + var(--tg-safe-top, 0px))', // рџ‘€ Р”РћР‘РђР’РРўР¬
      paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' // рџ‘€ Р”РћР‘РђР’РРўР¬ (РґР»СЏ iPhone)

    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>рџЏў Р‘РёР·РЅРµСЃС‹</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Р—Р°РєСЂС‹С‚СЊ</button>
        </div>

        {totalPending > 0 && (
          <div style={{ background: 'rgba(0,217,126,0.1)', border: '1px solid #00d97e', borderRadius: '12px', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#00d97e', fontWeight: 'bold' }}>Р”РѕСЃС‚СѓРїРЅРѕ Рє СЃР±РѕСЂСѓ:</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{totalPending.toLocaleString('ru-RU')} в‚Ѕ</div>
            </div>
            <button 
              onClick={() => handleAction(collectIncome, 'collect')}
              disabled={loading === 'collect'}
              style={{ background: '#00d97e', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading === 'collect' ? '...' : 'РЎРћР‘Р РђРўР¬'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {Object.values(BUSINESSES).map((config: BusinessConfig) => {
            const owned = businesses[config.id];
            const level = owned?.level || 0;
            const upgradeCost = getBusinessUpgradeCost(config.baseCost, level);
            const income = getBusinessIncome(config.baseIncomePerHour, level || 1);

            return (
              <div key={config.id} style={{ background: '#222', borderRadius: '12px', padding: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ fontSize: '32px' }}>{config.icon}</div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>{config.name}</div>
                      <div style={{ color: '#888', fontSize: '12px' }}>{config.description}</div>
                      {owned && (
                        <div style={{ color: '#ffd700', fontSize: '13px', marginTop: '4px' }}>
                          РЈСЂ. {level} | Р”РѕС…РѕРґ: {income.toLocaleString('ru-RU')} в‚Ѕ/С‡Р°СЃ
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!owned ? (
                    <button 
                      onClick={() => handleAction(() => buyBusiness(config.id), config.id)}
                      disabled={loading === config.id}
                      style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {config.baseCost.toLocaleString('ru-RU')} в‚Ѕ
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleAction(() => upgradeBusiness(config.id), config.id)}
                      disabled={loading === config.id}
                      style={{ background: 'rgba(255,215,0,0.2)', color: '#ffd700', border: '1px solid #ffd700', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {upgradeCost.toLocaleString('ru-RU')} в‚Ѕ
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

### src/components/CarDealership.tsx
```tsx
// src/components/CarDealership.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flag, Gauge, Target, ShoppingCart, X, Check } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { CARS, CarConfig } from '../config/cars';
import { playSound } from '../utils/sound';
import '../styles/cardealership.css';

// рџ‘‡ Р“СЂСѓРїРїРёСЂРѕРІРєР° РјР°С€РёРЅ РїРѕ С‚РёСЂР°Рј
const TIERS = [
  { id: 'budget', name: 'Р‘СЋРґР¶РµС‚', minPrice: 0, maxPrice: 100000 },
  { id: 'classic', name: 'РљР»Р°СЃСЃРёРєР°', minPrice: 100000, maxPrice: 1000000 },
  { id: 'sport', name: 'РЎРїРѕСЂС‚', minPrice: 1000000, maxPrice: 10000000 },
  { id: 'super', name: 'РЎСѓРїРµСЂРєР°СЂС‹', minPrice: 10000000, maxPrice: 100000000 },
  { id: 'hyper', name: 'Р“РёРїРµСЂРєР°СЂС‹', minPrice: 100000000, maxPrice: Infinity },
];

type TierId = typeof TIERS[number]['id'];

export const CarDealership: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const buyCar = useGameStore((s) => s.buyCar);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<TierId>('budget');

  const ownedCars = user?.ownedCars || ['vaz-2107'];
  const balance = user?.balance || 0;

  // рџ‘‡ Р¤РёР»СЊС‚СЂСѓРµРј РїРѕ С‚РёСЂСѓ Рё СѓР±РёСЂР°РµРј РєСѓРїР»РµРЅРЅС‹Рµ
  const availableCars = useMemo(() => {
    const tier = TIERS.find(t => t.id === activeTier);
    if (!tier) return [];
    
    return Object.values(CARS).filter(car => 
      !ownedCars.includes(car.id) && 
      car.price >= tier.minPrice && 
      car.price < tier.maxPrice
    ).sort((a, b) => a.price - b.price);
  }, [ownedCars, activeTier]);

  // рџ‘‡ РЎС‡С‘С‚С‡РёРє РјР°С€РёРЅ РїРѕ С‚РёСЂР°Рј (РґР»СЏ Р±РµР№РґР¶РµР№ РЅР° С‚Р°Р±Р°С…)
  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TIERS.forEach(tier => {
      counts[tier.id] = Object.values(CARS).filter(car => 
        !ownedCars.includes(car.id) && 
        car.price >= tier.minPrice && 
        car.price < tier.maxPrice
      ).length;
    });
    return counts;
  }, [ownedCars]);

  const handleBuy = async (carId: string, price: number) => {
    if (balance < price || buyingId) return;
    setBuyingId(carId);
    const success = await buyCar(carId, price);
    setBuyingId(null);
    if (success) {
      playSound('coin');
    }
  };

  return (
    <div className="cardealer-overlay" onClick={onClose}>
      <motion.div
        className="cardealer-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* РЁР°РїРєР° */}
        <div className="cardealer-header">
          <h2>
            <ShoppingCart size={18} color="var(--gold)" /> РђР’РўРћРЎРђР›РћРќ
          </h2>
          <div className="cardealer-balance">
            {balance.toLocaleString('ru-RU')}
            <span className="currency-ruble sm" style={{ marginLeft: 4 }}>в‚Ѕ</span>
          </div>
          <button className="cardealer-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* РўР°Р±С‹ РїРѕ С‚РёСЂР°Рј */}
        <div className="cardealer-tabs">
          {TIERS.map(tier => (
            <button
              key={tier.id}
              className={`cardealer-tab ${activeTier === tier.id ? 'active' : ''}`}
              onClick={() => setActiveTier(tier.id)}
            >
              <span>{tier.name}</span>
              {tierCounts[tier.id] > 0 && (
                <span className="cardealer-tab-count">{tierCounts[tier.id]}</span>
              )}
            </button>
          ))}
        </div>

        {/* РЎРїРёСЃРѕРє РјР°С€РёРЅ */}
        <div className="cardealer-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTier}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="cardealer-list"
            >
              {availableCars.length === 0 && (
                <div className="cardealer-empty">
                  <ShoppingCart size={48} color="var(--text-muted)" />
                  <h3>РќРµС‚ РґРѕСЃС‚СѓРїРЅС‹С… РјР°С€РёРЅ</h3>
                  <p>Р’ СЌС‚РѕРј С‚РёСЂРµ РІСЃРµ РјР°С€РёРЅС‹ СѓР¶Рµ РєСѓРїР»РµРЅС‹</p>
                </div>
              )}

              {availableCars.map((car: CarConfig) => {
                const canAfford = balance >= car.price;
                const isBuying = buyingId === car.id;

                return (
                  <motion.div
                    key={car.id}
                    className={`cardealer-card ${canAfford ? 'affordable' : ''}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {/* РљР°СЂС‚РёРЅРєР° */}
                    <div className="cardealer-image">
                      <span className="cardealer-image-fallback">рџЏЋпёЏ</span>
                      {car.image && !car.image.includes('placeholder') && (
                        <img
                          src={car.image}
                          alt={car.name}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>

                    {/* РРЅС„Рѕ */}
                    <div className="cardealer-info">
                      <h3 className="cardealer-name">{car.name}</h3>
                      <div className="cardealer-stats">
                        <div className="cardealer-stat">
                          <Zap size={12} color="#ffd700" />
                          <span>{car.baseStats.power} HP</span>
                        </div>
                        <div className="cardealer-stat">
                          <Flag size={12} color="var(--accent)" />
                          <span>{car.baseStats.topSpeed} Vmax</span>
                        </div>
                        <div className="cardealer-stat">
                          <Gauge size={12} color="var(--success)" />
                          <span>{car.baseStats.grip} Grip</span>
                        </div>
                        <div className="cardealer-stat">
                          <Target size={12} color="#ff8800" />
                          <span>{car.baseStats.handling} Handl</span>
                        </div>
                      </div>
                    </div>

                    {/* Р¦РµРЅР° + РєРЅРѕРїРєР° */}
                    <div className="cardealer-footer">
                      <div className="cardealer-price" style={{ color: canAfford ? 'var(--gold)' : 'var(--danger)' }}>
                        {car.price.toLocaleString('ru-RU')}
                        <span className="currency-ruble sm" style={{ marginLeft: 3 }}>в‚Ѕ</span>
                      </div>
                      <button
                        className={`cardealer-buy ${canAfford ? 'ready' : ''}`}
                        onClick={() => handleBuy(car.id, car.price)}
                        disabled={!canAfford || !!buyingId}
                      >
                        {isBuying ? '...' : canAfford ? 'РљРЈРџРРўР¬' : 'РњРђР›Рћ в‚Ѕ'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
```

### src/components/CaseModal.tsx
```tsx
// src/components/CaseModal.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ITEMS } from '../config/items'; 
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import { useAdsgram } from '../hooks/useAdsgram';
import '../styles/case.css';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseType: string;
}

const CASE_ITEMS: Record<string, any> = {
  hourly: { name: 'Р РµРєР»Р°РјРЅС‹Р№', price: 0, icon: 'рџЋ¬', currency: 'ad', cooldown: 3600000 },
  silver: { name: 'РЎРµСЂРµР±СЂСЏРЅС‹Р№', price: 25000, icon: 'рџЋЃ', currency: 'coins' },
  gold: { name: 'Р—РѕР»РѕС‚РѕР№', price: 100000, icon: 'рџЏ†', currency: 'coins' },
  platinum: { name: 'РџР»Р°С‚РёРЅРѕРІС‹Р№', price: 500000, icon: 'в‚Ѕ', currency: 'coins' },
  diamond: { name: 'РђР»РјР°Р·РЅС‹Р№', price: 2000000, icon: 'рџ’ ', currency: 'coins' },
  star_premium: { name: 'Р—РІРµР·РґРЅС‹Р№', price: 50, icon: 'в­ђ', currency: 'stars' }
};

const CASE_ITEMS_POOL = {
  hourly: [
    'coins_5000', 'coins_5000', 'coins_5000', 'coins_5000', 'coins_5000',
    'coins_10000', 'coins_10000', 'coins_10000', 'coins_10000', 'coins_10000',
    'coins_20000', 'coins_20000', 'coins_20000',
    'engine_2', 'engine_2', 'engine_2',
    'tires_2', 'tires_2',
    'ecu_2', 'ecu_2'
  ],
  silver: [
    'coins_10000', 'coins_10000', 'coins_10000', 'coins_10000', 'coins_10000',
    'coins_25000', 'coins_25000', 'coins_25000', 'coins_25000', 'coins_25000',
    'coins_40000', 'coins_40000', 'coins_40000',
    'engine_2', 'engine_2', 'engine_2',
    'tires_2', 'tires_2',
    'ecu_1', 'ecu_1'
  ],
  gold: [
    'coins_50000', 'coins_50000', 'coins_50000', 'coins_50000', 'coins_50000',
    'coins_100000', 'coins_100000', 'coins_100000', 'coins_100000', 'coins_100000',
    'coins_150000', 'coins_150000', 'coins_150000',
    'engine_3', 'engine_3', 'engine_3',
    'ecu_3', 'ecu_3',
    'susp_3', 'susp_3'
  ],
  platinum: [
    'coins_250000', 'coins_250000', 'coins_250000', 'coins_250000', 'coins_250000',
    'coins_500000', 'coins_500000', 'coins_500000', 'coins_500000', 'coins_500000',
    'coins_750000', 'coins_750000', 'coins_750000',
    'engine_4', 'engine_4', 'engine_4',
    'tires_4', 'tires_4',
    'ecu_4', 'ecu_4', // рџ‘€ Р”РѕР±Р°РІР»РµРЅР° РїСЂРѕС€РёРІРєР°
    'susp_4', 'susp_4'
  ],
  diamond: [
    'coins_1000000', 'coins_1000000', 'coins_1000000', 'coins_1000000', 'coins_1000000',
    'coins_2000000', 'coins_2000000', 'coins_2000000', 'coins_2000000', 'coins_2000000',
    'coins_3000000', 'coins_3000000', 'coins_3000000',
    'engine_5', 'engine_5', 
    'tires_5', 'tires_5',
    'ecu_5', 'ecu_5', // рџ‘€ Р”РѕР±Р°РІР»РµРЅР° РїСЂРѕС€РёРІРєР°
    'susp_5'
  ],
  star_premium: [
    'coins_2000000', 'coins_2000000', 'coins_2000000', 'coins_2000000', 'coins_2000000',
    'coins_5000000', 'coins_5000000', 'coins_5000000', 'coins_5000000', 'coins_5000000',
    'coins_10000000', 'coins_10000000', 'coins_10000000',
    'engine_5', 'engine_5', 'engine_5',
    'tires_5', 'tires_5',
    'ecu_5', // рџ‘€ Р”РѕР±Р°РІР»РµРЅР° РїСЂРѕС€РёРІРєР°
    'susp_5'
  ]
};

export function CaseModal({ isOpen, onClose, caseType: initialCaseType }: CaseModalProps) {
  const [activeCase, setActiveCase] = useState(initialCaseType || 'hourly');
  const [isOpening, setIsOpening] = useState(false);
  const [reelItems, setReelItems] = useState<string[]>([]);
  const [wonItem, setWonItem] = useState<any | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [pendingAdOpen, setPendingAdOpen] = useState(false);
  const [targetX, setTargetX] = useState(0);
  
  const reelRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isWatchingAd, pendingAdOpen, activeCase });
  useEffect(() => {
    stateRef.current = { isWatchingAd, pendingAdOpen, activeCase };
  }, [isWatchingAd, pendingAdOpen, activeCase]);

  const balance = useGameStore((s) => s.balance);
  const user = useGameStore((s) => s.user);
  const openCase = useGameStore((s) => s.openCase); 

  const caseConfig = CASE_ITEMS[activeCase];
  const itemsPool = CASE_ITEMS_POOL[activeCase as keyof typeof CASE_ITEMS_POOL];

  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (activeCase !== 'hourly' || !user?.lastAdCaseAt) return;
    const interval = setInterval(() => {
      const last = new Date(user.lastAdCaseAt!).getTime();
      const remaining = Math.max(0, (last + 3600000) - Date.now());
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCase, user?.lastAdCaseAt]);

  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}Рј ${s}СЃ`;
  };

  const executeCaseOpening = async (caseTypeToOpen: string) => {
    setIsOpening(true);
    setWonItem(null);
    setReelItems([]); 
    playSound('click');

    try {
      const res = await openCase(caseTypeToOpen);
      
      if (res.success && res.wonItem) {
        const pool = CASE_ITEMS_POOL[caseTypeToOpen as keyof typeof CASE_ITEMS_POOL];
        const newReel = Array.from({ length: 50 }, () => 
          pool[Math.floor(Math.random() * pool.length)]
        );
        newReel[45] = res.wonItem.id;
        
        setReelItems(newReel);
        setWonItem(res.wonItem);

        const containerWidth = reelRef.current ? reelRef.current.offsetWidth : 300;
        const ITEM_WIDTH = 100;
        const exactX = (containerWidth / 2) - (45 * ITEM_WIDTH + 45);
        
        setTargetX(exactX);

        setTimeout(() => {
          setIsOpening(false);
          playSound(res.wonItem.rarity === 'legendary' ? 'win' : 'coin');
          try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}
        }, 4200);
      } else {
        setIsOpening(false);
        WebApp.showAlert(res.error || "РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РєСЂС‹С‚СЊ РєРµР№СЃ.");
      }
    } catch (e) {
      setIsOpening(false);
      WebApp.showAlert("РћС€РёР±РєР° СЃРѕРµРґРёРЅРµРЅРёСЏ СЃ СЃРµСЂРІРµСЂРѕРј.");
    }
  };

  const showAd = useAdsgram({
    blockId: '55486', 
    onReward: async () => {
      setIsWatchingAd(false);
      setPendingAdOpen(false);
      setTimeout(() => {
        executeCaseOpening(stateRef.current.activeCase);
      }, 100);
    },
    onError: (err) => {
      setIsWatchingAd(false);
      setPendingAdOpen(false);
      WebApp.showAlert("Р РµРєР»Р°РјР° РЅРµ Р±С‹Р»Р° РїСЂРѕСЃРјРѕС‚СЂРµРЅР° РґРѕ РєРѕРЅС†Р°. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.");
    },
  });

  const getItemData = (id: string) => {
    if (id.startsWith('coins_')) {
      const amount = id.split('_')[1];
      return { name: `${Number(amount).toLocaleString('ru-RU')} в‚Ѕ`, icon: 'в‚Ѕ', rarity: 'common' };
    }
    const item = (ITEMS as any)[id];
    
    let icon = 'рџ“¦';
    if (item?.slot === 'engine') icon = 'вљ™пёЏ';
    else if (item?.slot === 'tires') icon = 'рџ›ћ';
    else if (item?.slot === 'ecu') icon = 'рџ’»';
    else if (item?.slot === 'suspension') icon = 'рџ§І';

    return { name: item?.name || 'РќРµРёР·РІРµСЃС‚РЅС‹Р№ РїСЂРµРґРјРµС‚', icon, rarity: item?.rarity || 'common' };
  };

  const handleOpenClick = () => {
    if (isOpening || isWatchingAd) return;
    if (caseConfig.currency === 'ad') {
      if (timeLeft > 0) return;
      setPendingAdOpen(true);
      setIsWatchingAd(true);
      showAd();
    } else {
      executeCaseOpening(activeCase);
    }
  };

  if (!isOpen) return null;

  const canAfford = caseConfig.currency === 'coins' ? balance >= caseConfig.price : 
                    caseConfig.currency === 'stars' ? (user?.starsBalance || 0) >= caseConfig.price : true;

  return (
    <div className="case-overlay">
      <motion.div 
        className="case-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        
        <div className="case-header">
          <h2>РћС‚РєСЂС‹С‚РёРµ РљРµР№СЃРѕРІ</h2>
          <button className="case-close-btn" onClick={onClose} disabled={isOpening}>вњ•</button>
        </div>

        <div className="case-tabs">
          {Object.keys(CASE_ITEMS).map((key) => (
            <button
              key={key}
              className={`case-tab ${activeCase === key ? 'active' : ''} ${CASE_ITEMS[key].currency === 'ad' ? 'ad-tab' : ''}`}
              onClick={() => { setActiveCase(key); setReelItems([]); setWonItem(null); }}
              disabled={isOpening}
            >
              {CASE_ITEMS[key].icon} {CASE_ITEMS[key].name}
            </button>
          ))}
        </div>

        <div className="case-reel-container" ref={reelRef}>
          <div className="case-reel-pointer" />
          {reelItems.length > 0 ? (
            <motion.div 
              className="case-reel"
              key={activeCase + reelItems[45]}
              initial={{ x: 0 }}
              animate={{ x: targetX }}
              transition={{ duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
            >
              {reelItems.map((itemId, index) => {
                const itemData = getItemData(itemId);
                return (
                  <div key={index} className={`case-reel-item rarity-${itemData.rarity}`}>
                    <div className="item-icon">{itemData.icon}</div>
                    <span className="item-name">{itemData.name}</span>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            /* рџ‘‡ РќРћР’Р«Р™ РџР›Р•Р™РЎРҐРћР›Р”Р•Р  */
            <div className="case-placeholder">
              <div className="case-placeholder-icon">рџЋЃ</div>
              <div>РСЃРїС‹С‚Р°Р№ СЃРІРѕСЋ СѓРґР°С‡Сѓ</div>
            </div>
          )}
        </div>

        <div className="case-actions">
          
          <AnimatePresence mode="wait">
            {wonItem && !isOpening && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.8, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="case-result"
              >
                <h3>Р’С‹ РїРѕР»СѓС‡РёР»Рё:</h3>
                <div className="result-item-name">{getItemData(wonItem.id).name}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            className={`case-btn-primary ${canAfford || caseConfig.currency === 'ad' ? 'ready' : ''}`}
            onClick={handleOpenClick} 
            disabled={(!canAfford && caseConfig.currency !== 'ad') || isOpening || isWatchingAd || (caseConfig.currency === 'ad' && timeLeft > 0)}
          >
            {isOpening ? 'РљСЂСѓС‚РёРј...' : 
             isWatchingAd ? 'Р—Р°РіСЂСѓР·РєР° СЂРµРєР»Р°РјС‹...' :
             caseConfig.currency === 'ad' && timeLeft > 0 ? `Р–РґР°С‚СЊ ${formatTime(timeLeft)}` :
             caseConfig.currency === 'ad' ? 'рџЋ¬ РЎРјРѕС‚СЂРµС‚СЊ СЂРµРєР»Р°РјСѓ (Р‘РµСЃРїР»Р°С‚РЅРѕ)' :
             caseConfig.currency === 'stars' ? `РћС‚РєСЂС‹С‚СЊ Р·Р° ${caseConfig.price} в­ђ` :
             `РћС‚РєСЂС‹С‚СЊ Р·Р° ${caseConfig.price.toLocaleString('ru-RU')} в‚Ѕ`}
          </button>

        </div>
      </motion.div>
    </div>
  );
}
```

### src/components/CasinoScreen.tsx
```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const CasinoScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const playCoinFlip = useGameStore((s) => s.playCoinFlip);
  
  const [bet, setBet] = useState<number | ''>('');
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isWin: boolean; payout: number; result: string } | null>(null);
  const [flipping, setFlipping] = useState(false);

    const handlePlay = async () => {
    if (!bet || bet < 100) return alert('РњРёРЅРёРјР°Р»СЊРЅР°СЏ СЃС‚Р°РІРєР° 100 в‚Ѕ');
    if (user && bet > user.balance) return alert('РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ в‚Ѕ!');
    
    setLoading(true);
    setResult(null);
    setFlipping(true);

    const res = await playCoinFlip(bet, choice);
    
    setTimeout(() => {
      setFlipping(false);
      setLoading(false);
      if (res.success && res.isWin !== undefined && res.payout !== undefined && res.result) {
        setResult({ isWin: res.isWin, payout: res.payout, result: res.result });
      } else {
        // РџРѕРєР°Р·С‹РІР°РµРј РѕС€РёР±РєСѓ, РµСЃР»Рё СЃРµСЂРІРµСЂ РѕС‚РєР°Р·Р°Р»
        alert(res.error || 'Р§С‚Рѕ-С‚Рѕ РїРѕС€Р»Рѕ РЅРµ С‚Р°Рє');
      }
    }, 1500);
  };

  const quickBets = [100, 1000, 10000, 100000];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle at center, #2a0a0a 0%, #111 100%)', zIndex: 1000, overflowY: 'auto', padding: '20px',
      paddingTop: 'calc(20px + var(--tg-safe-top, 0px))', // рџ‘€ Р”РћР‘РђР’РРўР¬
      paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' // рџ‘€ Р”РћР‘РђР’РРўР¬ (РґР»СЏ iPhone)
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#ff4444', margin: 0 }}>рџЋ° РљР°Р·РёРЅРѕ</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Р—Р°РєСЂС‹С‚СЊ</button>
        </div>

        {/* в‚ЅРєР° */}
        <div style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <motion.div
            animate={flipping ? { rotateY: [0, 720, 1440], scale: [1, 1.5, 1] } : { rotateY: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd700, #b8860b)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontSize: '40px', boxShadow: '0 0 20px rgba(255,215,0,0.5)',
              border: '4px solid #fff'
            }}
          >
            {flipping ? 'в‚Ѕ' : (result ? (result.result === 'heads' ? 'рџ‘‘' : 'рџ¦…') : 'в‚Ѕ')}
          </motion.div>
        </div>

        {/* Р РµР·СѓР»СЊС‚Р°С‚ */}
        {result && !flipping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '20px', minHeight: '60px' }}>
            <h3 style={{ color: result.isWin ? '#00d97e' : '#ff4444', margin: 0 }}>
              {result.isWin ? 'РџРћР‘Р•Р”Рђ!' : 'Р’Р« РџР РћРР“Р РђР›Р'}
            </h3>
            <p style={{ color: '#fff', margin: '5px 0 0 0' }}>
              {result.result === 'heads' ? 'Р’С‹РїР°Р» РћСЂРµР» рџ‘‘' : 'Р’С‹РїР°Р»Р° Р РµС€РєР° рџ¦…'} <br/>
              {result.isWin ? `Р’С‹РёРіСЂС‹С€: +${result.payout.toLocaleString('ru-RU')} в‚Ѕ` : `РџРѕС‚РµСЂСЏРЅРѕ: -${bet.toLocaleString('ru-RU')} в‚Ѕ`}
            </p>
          </motion.div>
        )}

        {/* Р’С‹Р±РѕСЂ СЃС‚РѕСЂРѕРЅС‹ */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setChoice('heads')}
            disabled={loading}
            style={{
              flex: 1, padding: '15px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold',
              background: choice === 'heads' ? '#ffd700' : 'rgba(255,255,255,0.1)',
              color: choice === 'heads' ? '#000' : '#fff',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >РћСЂРµР» рџ‘‘</button>
          
          <button
            onClick={() => setChoice('tails')}
            disabled={loading}
            style={{
              flex: 1, padding: '15px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold',
              background: choice === 'tails' ? '#ffd700' : 'rgba(255,255,255,0.1)',
              color: choice === 'tails' ? '#000' : '#fff',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >Р РµС€РєР° рџ¦…</button>
        </div>

        {/* РЎС‚Р°РІРєР° */}
        <div style={{ background: '#222', borderRadius: '12px', padding: '20px' }}>
          <div style={{ color: '#aaa', marginBottom: '10px' }}>РЎСѓРјРјР° СЃС‚Р°РІРєРё:</div>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={loading}
            placeholder="Р’РІРµРґРёС‚Рµ СЃСѓРјРјСѓ..."
            style={{
              width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #444',
              background: '#111', color: '#fff', fontSize: '20px', textAlign: 'center', marginBottom: '15px',
              outline: 'none'
            }}
          />
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {quickBets.map(qb => (
              <button
                key={qb}
                onClick={() => setBet(qb)}
                disabled={loading}
                style={{ flex: 1, padding: '8px 0', background: 'rgba(255,255,255,0.05)', color: '#aaa', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }}
              >
                {qb >= 1000 ? `${qb/1000}k` : qb}
              </button>
            ))}
          </div>

          <button
            onClick={handlePlay}
            disabled={loading || !bet || bet < 100}
            style={{
              width: '100%', padding: '18px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold',
              background: loading ? '#555' : '#ff4444', color: '#fff', border: 'none', cursor: loading ? 'wait' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 20px rgba(255,68,68,0.4)'
            }}
          >
            {loading ? 'РљР РЈРўРРњ...' : 'РЎР”Р•Р›РђРўР¬ РЎРўРђР’РљРЈ'}
          </button>
          <div style={{ color: '#888', fontSize: '12px', marginTop: '15px' }}>
            РљРѕСЌС„С„РёС†РёРµРЅС‚ РІС‹РёРіСЂС‹С€Р°: x1.9 <br/>
            Р‘Р°Р»Р°РЅСЃ: {user?.balance.toLocaleString('ru-RU')} в‚Ѕ
          </div>
        </div>
      </div>
    </div>
  );
};
```

### src/components/CityScreen.tsx
```tsx
// src/components/CityScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag, Castle, Coins, Building2, Dices, Package, ShoppingCart,
  Wrench, Briefcase, Wrench as AdminWrench, X, Trophy
} from 'lucide-react';
import { RacesScreen } from './RacesScreen';
import { CarDealership } from './CarDealership';
import { WorkshopScreen } from './WorkshopScreen';
import { BusinessScreen } from './BusinessScreen';
import { CasinoScreen } from './CasinoScreen';
import { ClanScreen } from './ClanScreen';
import { AdminScreen } from './AdminScreen';
import { LeaderboardModal } from './LeaderboardModal';
import { useGameStore } from '../store/gameStore';
import { CaseModal } from './CaseModal';
import { ShopModal } from './ShopModal';
import '../styles/city.css';

export const CityScreen = () => {
  const [activeLocation, setActiveLocation] = useState<'menu' | 'track'>('menu');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDealership, setShowDealership] = useState(false);
  const [showWorkshop, setShowWorkshop] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const [showCasino, setShowCasino] = useState(false);
  const [showClan, setShowClan] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [activeCase, setActiveCase] = useState<string | null>(null);

  const user = useGameStore((s) => s.user);
  const features = user?.features || {};

  // рџ‘‡ РЎРїРёСЃРѕРє РєР°СЂС‚РѕС‡РµРє РіРѕСЂРѕРґР°
  const cityCards = [
    { id: 'track', title: 'РўСЂРµРє', desc: 'Р“РѕРЅРєРё СЃ Р±РѕС‚Р°РјРё, PvP', icon: Flag, color: 'var(--accent)', action: () => setActiveLocation('track') },
    { id: 'clans', title: 'РљР»Р°РЅС‹', desc: 'РЎРѕРѕР±С‰РµСЃС‚РІРѕ Рё Р±РѕРЅСѓСЃС‹', icon: Castle, color: '#ff8800', action: () => setShowClan(true), hidden: features.clans === false },
    { id: 'leaderboard', title: 'РўРѕРї РёРіСЂРѕРєРѕРІ', desc: 'Р‘Р°Р»Р°РЅСЃ, РѕРїС‹С‚, РїРѕР±РµРґС‹', icon: Trophy, color: '#ffd700', action: () => setShowLeaderboard(true) },
    { id: 'dealership', title: 'РђРІС‚РѕСЃР°Р»РѕРЅ', desc: 'РџРѕРєСѓРїРєР° РјР°С€РёРЅ', icon: Building2, color: 'var(--accent)', action: () => setShowDealership(true) },
    { id: 'casino', title: 'РљР°Р·РёРЅРѕ', desc: 'РСЃРїС‹С‚Р°Р№ СѓРґР°С‡Сѓ', icon: Dices, color: '#ff4444', action: () => setShowCasino(true), hidden: features.casino === false },
    { id: 'cases', title: 'РљРµР№СЃС‹', desc: 'Р‘РµСЃРїР»Р°С‚РЅС‹Р№ Рё РґСЂСѓРіРёРµ', icon: Package, color: 'var(--gold)', action: () => setActiveCase('hourly') },
    { id: 'shop', title: 'РњР°РіР°Р·РёРЅ', desc: 'РџРѕРєСѓРїРєР° в‚Ѕ', icon: ShoppingCart, color: '#ffd700', action: () => setShowShop(true), highlight: true },
    { id: 'workshop', title: 'РњР°СЃС‚РµСЂСЃРєР°СЏ', desc: 'РўСЋРЅРёРЅРі Рё РєСЂР°С„С‚', icon: Wrench, color: 'var(--accent)', action: () => setShowWorkshop(true), hidden: features.workshop === false },
    { id: 'business', title: 'Р‘РёР·РЅРµСЃС‹', desc: 'РџР°СЃСЃРёРІРЅС‹Р№ РґРѕС…РѕРґ', icon: Briefcase, color: 'var(--success)', action: () => setShowBusiness(true), hidden: features.business === false },
    { id: 'admin', title: 'РђРґРјРёРЅРєР°', desc: 'РЈРїСЂР°РІР»РµРЅРёРµ РёРіСЂРѕР№', icon: AdminWrench, color: '#ff4444', action: () => setShowAdmin(true), hidden: !user?.isAdmin, admin: true },
  ];

  return (
    <div className="city-screen">
      <AnimatePresence mode="wait">
        {activeLocation === 'menu' && (
          <motion.div
            key="city-menu"
            className="city-hub"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="city-title">Р“РћР РћР”</h2>

            <div className="city-grid">
              {cityCards.filter((c) => !c.hidden).map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    className={`city-card ${card.admin ? 'admin' : ''} ${card.highlight ? 'highlight' : ''}`}
                    onClick={card.action}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="city-card-icon" style={{ background: `${card.color}15`, border: `1px solid ${card.color}44` }}>
                      <Icon size={24} color={card.color} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeLocation === 'track' && (
          <motion.div
            key="city-track"
            className="city-location"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <button className="back-to-city" onClick={() => setActiveLocation('menu')}>
              в†ђ РќР°Р·Р°Рґ
            </button>
            <RacesScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* РњРѕРґР°Р»РєРё */}
      {showDealership && <CarDealership onClose={() => setShowDealership(false)} />}
      {showWorkshop && <WorkshopScreen onClose={() => setShowWorkshop(false)} />}
      {showBusiness && <BusinessScreen onClose={() => setShowBusiness(false)} />}
      {showCasino && <CasinoScreen onClose={() => setShowCasino(false)} />}
      {showClan && <ClanScreen onClose={() => setShowClan(false)} />}
      {showAdmin && <AdminScreen onClose={() => setShowAdmin(false)} />}
      {showShop && <ShopModal onClose={() => setShowShop(false)} />}
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}

      <CaseModal
        isOpen={activeCase !== null}
        onClose={() => setActiveCase(null)}
        caseType={activeCase || 'hourly'}
      />
    </div>
  );
};
```

### src/components/ClanScreen.tsx
```tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  Trophy, Crown, Star, Swords, Link as LinkIcon, X as XIcon, Users, Flag,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { CLAN_CREATE_COST, CLAN_LEVELS, getClanStats } from '../config/clans';
import { motion, AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import '../styles/clan.css';

type Tab = 'main' | 'members' | 'chat' | 'manage' | 'boss' | 'rating';
const SLOT_COST = 250000;

export const ClanScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const clanInfo = useGameStore((s) => s.clanInfo);
  const clanMembers = useGameStore((s) => s.clanMembers);
  const clansList = useGameStore((s) => s.clansList);
  const clanMessages = useGameStore((s) => s.clanMessages);
  const hasUnreadClanMessages = useGameStore((s) => s.hasUnreadClanMessages);
  const markClanChatAsRead = useGameStore((s) => s.markClanChatAsRead);

  const clanBoss = useGameStore((s) => s.clanBoss);
  const bossDamageStats = useGameStore((s) => s.bossDamageStats);
  const fetchClanBoss = useGameStore((s) => s.fetchClanBoss);
  const attackClanBoss = useGameStore((s) => s.attackClanBoss);

  const fetchClan = useGameStore((s) => s.fetchClan);
  const fetchClans = useGameStore((s) => s.fetchClans);
  const createClan = useGameStore((s) => s.createClan);
  const joinClan = useGameStore((s) => s.joinClan);
  const clanAction = useGameStore((s) => s.clanAction);
  const fetchClanMessages = useGameStore((s) => s.fetchClanMessages);
  const sendClanMessage = useGameStore((s) => s.sendClanMessage);

  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>('main');
  const [createName, setCreateName] = useState('');
  const [donateAmount, setDonateAmount] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isAttacking, setIsAttacking] = useState(false);
  const [damagePopup, setDamagePopup] = useState<{ id: number; amount: number } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    fetchClan().then(() => {
      const info = useGameStore.getState().clanInfo;
      if (!info) fetchClans();
      else fetchClanBoss();
    });
  }, [fetchClan, fetchClans, fetchClanBoss]);

  useEffect(() => {
    if (clanInfo) {
      if (activeTab === 'chat') fetchClanMessages();
      if (activeTab === 'boss') fetchClanBoss();

      const interval = setInterval(() => {
        if (activeTab === 'chat') fetchClanMessages();
        if (activeTab === 'boss') fetchClanBoss();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [clanInfo, activeTab, fetchClanMessages, fetchClanBoss]);

  useEffect(() => {
    if (activeTab === 'chat' && clanMessages.length > 0) markClanChatAsRead();
  }, [activeTab, clanMessages, markClanChatAsRead]);

  useEffect(() => {
    if (activeTab === 'chat') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [clanMessages, activeTab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const success = await sendClanMessage(chatInput);
    if (success) {
      setChatInput('');
      fetchClanMessages();
    } else {
      WebApp.showAlert('РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё!');
    }
  };

  const handleAttackBoss = async () => {
    if (isAttacking || cooldown || !clanBoss || clanBoss.currentHp <= 0) return;

    setIsAttacking(true);
    setCooldown(true);
    setIsShaking(true);

    const res = await attackClanBoss();

    if (res.success && res.damage) {
      setDamagePopup({ id: Date.now(), amount: res.damage });
      setTimeout(() => setDamagePopup(null), 800);

      if (res.isDefeated) {
        setTimeout(
          () => WebApp.showAlert(
            `Р‘РѕСЃСЃ РїРѕРІРµСЂР¶РµРЅ! РљР°Р·РЅРµ РЅР°С‡РёСЃР»РµРЅРѕ ${res.reward?.toLocaleString('ru-RU')} в‚µ`
          ),
          500
        );
      }
    }

    setTimeout(() => setIsAttacking(false), 300);
    setTimeout(() => setIsShaking(false), 300);
    setTimeout(() => setCooldown(false), 1000);
  };

  const handleCopyInvite = () => {
    if (!clanInfo) return;
    const botUsername = 'YOUR_BOT_USERNAME'; // рџ‘€ Р·Р°РјРµРЅРёС‚СЊ
    const link = `https://t.me/${botUsername}?startapp=clan_${clanInfo.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        WebApp.HapticFeedback?.notificationOccurred('success');
        WebApp.showAlert(`РЎСЃС‹Р»РєР° СЃРєРѕРїРёСЂРѕРІР°РЅР°!\n${link}`);
      }).catch(() => WebApp.showAlert(`РЎСЃС‹Р»РєР°: ${link}`));
    } else {
      WebApp.showAlert(`РЎСЃС‹Р»РєР°: ${link}`);
    }
  };

  /* ============================================================
     Р­РљР РђРќ В«РќР•Рў РљР›РђРќРђВ» вЂ” СЃРѕР·РґР°РЅРёРµ / РїРѕРёСЃРє
     ============================================================ */
  if (!clanInfo) {
    const filteredClans = clansList.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
      <div className="clan-screen-overlay">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="clan-container"
        >
          <div className="clan-header">
            <div className="clan-title-wrap">
              <span className="clan-badge"><Users size={22} color="var(--accent)" /></span>
              <h2 className="neon-text">РљР›РђРќР«</h2>
            </div>
            <button onClick={onClose} className="btn-close">
              <XIcon size={18} />
            </button>
          </div>

          <div className="clan-card" style={{ padding: 15 }}>
            <h3 className="neon-text">РЎРѕР·РґР°С‚СЊ СЃРІРѕР№ РєР»Р°РЅ</h3>
            <p className="clan-desc" style={{ marginBottom: 10 }}>
              РЎС‚РѕРёРјРѕСЃС‚СЊ: {CLAN_CREATE_COST.toLocaleString('ru-RU')} в‚µ
            </p>
            <div className="donate-inputs">
              <input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="РќР°Р·РІР°РЅРёРµ РєР»Р°РЅР°"
                className="clan-input"
              />
              <button
                className="btn-neon-cyan"
                onClick={async () => {
                  if (await createClan(createName)) WebApp.showAlert('РљР»Р°РЅ СЃРѕР·РґР°РЅ!');
                  else WebApp.showAlert('РћС€РёР±РєР°');
                }}
              >
                РЎРћР—Р”РђРўР¬
              </button>
            </div>
          </div>

          <div className="clan-search-section">
            <h3 style={{ color: '#fff', marginTop: 20, marginBottom: 15 }}>РџРѕРёСЃРє РєР»Р°РЅРѕРІ</h3>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ..."
              className="clan-input"
              style={{ marginBottom: 15 }}
            />
            <div className="clans-list">
              {filteredClans.map((c: any) => {
                const stats = getClanStats(c.level);
                const maxM = (stats?.maxMembers || 5) + (c.extraSlots || 0);
                return (
                  <div key={c.id} className="clan-search-row">
                    <div className="clan-info">
                      <span className="clan-name-s">
                        {c.name}{' '}
                        <span className="clan-level-badge">LVL {c.level}</span>
                      </span>
                      <span className="clan-members-count">
                        {c.memberCount} / {maxM} СѓС‡Р°СЃС‚РЅРёРєРѕРІ
                      </span>
                    </div>
                    <button
                      className={`btn-sm ${c.memberCount >= maxM ? 'btn-neon-red' : 'btn-neon-green'}`}
                      disabled={c.memberCount >= maxM}
                      onClick={async () => {
                        if (await joinClan(c.name)) WebApp.showAlert('Р’С‹ РІСЃС‚СѓРїРёР»Рё!');
                        else WebApp.showAlert('РћС€РёР±РєР°');
                      }}
                    >
                      {c.memberCount >= maxM ? 'РџРћР›РћРќ' : 'Р’РЎРўРЈРџРРўР¬'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ============================================================
     Р­РљР РђРќ В«Р’ РљР›РђРќР•В»
     ============================================================ */
  const isLeader = clanInfo.leaderId === user?.id;
  const myRole = clanMembers.find((m: any) => m.userId === user?.id)?.role;
  const nextLevelStats = getClanStats(clanInfo.level + 1);
  const isMaxLevel = !nextLevelStats || clanInfo.level >= CLAN_LEVELS.length;
  const upgradeCost = nextLevelStats?.upgradeCost || 0;
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, (clanInfo.balance / (upgradeCost || 1)) * 100);
  const canUpgrade = clanInfo.balance >= upgradeCost && !isMaxLevel;
  const canBuySlot = clanInfo.balance >= SLOT_COST && (clanInfo.extraSlots || 0) < 10;

  const bossHpPercent = clanBoss
    ? Math.max(0, (clanBoss.currentHp / clanBoss.maxHp) * 100)
    : 100;
  const bossHpColor =
    bossHpPercent > 50 ? '#00d97e' : bossHpPercent > 20 ? '#ffd700' : '#ff0055';

  // рџ‘‡ РЈР РћРќ: Р±С‹Р»Рѕ Г—500 / Г—10 в†’ СЃС‚Р°Р»Рѕ Г—50 / Г—2 (РІ 8-10 СЂР°Р· РјРµРЅСЊС€Рµ)
  const estimatedDamage =
    (user?.clickLevel || 1) * 50 + (user?.rating || 100) * 2;

  return (
    <div className="clan-screen-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="clan-container"
        style={{ display: 'flex', flexDirection: 'column', height: '85vh' }}
      >
        <div className="clan-header">
          <div className="clan-title-wrap">
            <span className="clan-badge"><Flag size={22} color="var(--accent)" /></span>
            <h2 className="neon-text">{clanInfo.name}</h2>
            <span className="clan-level-badge">LVL {clanInfo.level}</span>
          </div>
          <button onClick={onClose} className="btn-close">
            <XIcon size={18} />
          </button>
        </div>

        <div className="clan-tabs">
          <button className={activeTab === 'main' ? 'active' : ''} onClick={() => setActiveTab('main')}>Р“Р›РђР’РќРђРЇ</button>
          <button className={activeTab === 'boss' ? 'active' : ''} onClick={() => setActiveTab('boss')}>Р‘РћРЎРЎ</button>
          <button className={activeTab === 'rating' ? 'active' : ''} onClick={() => setActiveTab('rating')}>Р Р•Р™РўРРќР“</button>
          <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>
            Р§РђРў {hasUnreadClanMessages && activeTab !== 'chat' && <span className="unread-badge" />}
          </button>
          {myRole !== 'member' && (
            <button className={activeTab === 'manage' ? 'active' : ''} onClick={() => setActiveTab('manage')}>РЈРџР РђР’Р›Р•РќРР•</button>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">

            {/* ==================== MAIN ==================== */}
            {activeTab === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="clan-tab-content hide-scrollbar"
              >
                <div className="clan-info-grid">
                  <div className="clan-stat-box">
                    <span className="stat-label">РЈР РћР’Р•РќР¬</span>
                    <span className="stat-value">{clanInfo.level}</span>
                  </div>
                  <div
                    className="clan-stat-box clickable"
                    onClick={() => setActiveTab('members')}
                  >
                    <span className="stat-label">РЈР§РђРЎРўРќРРљР</span>
                    <span className="stat-value">
                      {clanMembers.length}
                      <span className="stat-max">/{clanInfo.maxMembers}</span>
                    </span>
                  </div>
                  <div className="clan-stat-box full-width treasury-box">
                    <span className="stat-label">РљРђР—РќРђ РљР›РђРќРђ</span>
                    <span className="stat-value gold">
                      {clanInfo.balance.toLocaleString('ru-RU')}{' '}
                      <span className="currency-icon">в‚µ</span>
                    </span>
                  </div>
                </div>

                {isLeader && (
                  <div className="upgrade-section">
                    <div className="upgrade-header">
                      <span className="upgrade-title">РЈР РћР’Р•РќР¬ {clanInfo.level + 1}</span>
                      <span className={`upgrade-cost ${canUpgrade ? 'can-afford' : ''}`}>
                        {isMaxLevel ? 'MAX' : `${upgradeCost.toLocaleString('ru-RU')} в‚µ`}
                      </span>
                    </div>
                    {!isMaxLevel && (
                      <div className="upgrade-progress-wrap">
                        <div className="upgrade-progress-bar">
                          <motion.div
                            className="upgrade-progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="upgrade-progress-text">{Math.floor(progressPercent)}%</span>
                      </div>
                    )}
                    <div className="upgrade-bonus">
                      <span className="bonus-icon">вљЎ</span> Р”Р°РµС‚: +{nextLevelStats?.clickBonus || 0}% Рє СЃРёР»Рµ РєР»РёРєР°
                    </div>
                    <button
                      className={`btn-neon-gold full-width ${!canUpgrade ? 'disabled' : ''}`}
                      disabled={!canUpgrade}
                      onClick={async () => {
                        if (await clanAction('upgrade')) WebApp.showAlert('РљР»Р°РЅ СѓР»СѓС‡С€РµРЅ!');
                      }}
                    >
                      {isMaxLevel ? 'РњРђРљРЎ. РЈР РћР’Р•РќР¬' : canUpgrade ? 'РЈР›РЈР§РЁРРўР¬ РљР›РђРќ' : 'РќР•Р”РћРЎРўРђРўРћР§РќРћ РЎР Р•Р”РЎРўР’'}
                    </button>
                  </div>
                )}

                {isLeader && (
                  <div
                    className="upgrade-section"
                    style={{
                      borderColor: 'rgba(0, 191, 255, 0.3)',
                      background: 'rgba(0, 191, 255, 0.05)',
                    }}
                  >
                    <div className="upgrade-header">
                      <span className="upgrade-title" style={{ color: '#00bfff' }}>
                        Р”РћРџ. РњР•РЎРўРћ ({(clanInfo.extraSlots || 0)}/10)
                      </span>
                      <span className="upgrade-cost" style={{ color: '#00bfff' }}>
                        {SLOT_COST.toLocaleString('ru-RU')} в‚µ
                      </span>
                    </div>
                    <div className="upgrade-bonus" style={{ color: '#8892b0' }}>
                      РЈРІРµР»РёС‡РёРІР°РµС‚ Р»РёРјРёС‚ РЅР° 1
                    </div>
                    <button
                      className={`btn-neon-cyan full-width ${!canBuySlot ? 'disabled' : ''}`}
                      disabled={!canBuySlot}
                      onClick={async () => {
                        if (await clanAction('buySlot')) WebApp.showAlert('РњРµСЃС‚Рѕ РєСѓРїР»РµРЅРѕ!');
                      }}
                    >
                      {canBuySlot ? 'РљРЈРџРРўР¬ РњР•РЎРўРћ' : 'РќР•Р”РћРЎРўРђРўРћР§РќРћ РЎР Р•Р”РЎРўР’'}
                    </button>
                  </div>
                )}

                <div className="clan-donate-box">
                  <h4>РџРѕРґРґРµСЂР¶Р°С‚СЊ РєР»Р°РЅ</h4>
                  <div className="quick-donate">
                    <button onClick={() => setDonateAmount(1000)}>+1K</button>
                    <button onClick={() => setDonateAmount(10000)}>+10K</button>
                    <button onClick={() => setDonateAmount(100000)}>+100K</button>
                    <button onClick={() => setDonateAmount(user?.balance || 0)}>MAX</button>
                  </div>
                  <div className="donate-inputs">
                    <input
                      type="number"
                      value={donateAmount}
                      onChange={(e) => setDonateAmount(Number(e.target.value))}
                      placeholder="РЎСѓРјРјР°"
                      className="clan-input"
                    />
                    <button
                      className="btn-neon-green"
                      onClick={async () => {
                        if (await clanAction('donate', Number(donateAmount))) {
                          WebApp.showAlert('Р’РЅРµСЃРµРЅРѕ!');
                          setDonateAmount('');
                        }
                      }}
                    >
                      Р’РќР•РЎРўР
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== BOSS ==================== */}
            {activeTab === 'boss' && (
              <motion.div
                key="boss"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`clan-tab-content hide-scrollbar boss-tab ${isShaking ? 'screen-shake' : ''}`}
              >
                {clanBoss ? (
                  <div className="boss-arena">
                    <div className="boss-scanlines" />

                    <div className="boss-header">
                      <div className="boss-title-wrap">
                        <span className="boss-warning">вљ пёЏ</span>
                        <span className="boss-title">РњР•Р“Рђ-РўР РђРљ</span>
                      </div>
                      <span className="boss-level-badge">РЈР . {clanBoss.level}</span>
                    </div>

                    <div className="boss-visual-container">
                      <div className="boss-tech-ring outer"></div>
                      <div className="boss-tech-ring inner"></div>
                      <div className="boss-shadow"></div>

                      <motion.div
                        className={`boss-avatar ${isAttacking ? 'hit' : ''}`}
                        animate={
                          isAttacking
                            ? { x: [-5, 5, -5, 5, 0], filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'] }
                            : { y: [0, -5, 0] }
                        }
                        transition={
                          isAttacking
                            ? { duration: 0.3 }
                            : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                        }
                      >
                        <img src="/images/boss.png" alt="Mega Tractor Boss" className="boss-img" />
                      </motion.div>

                      <AnimatePresence>
                        {damagePopup && (
                          <motion.div
                            key={damagePopup.id}
                            initial={{ opacity: 1, y: 0, scale: 0.5 }}
                            animate={{ opacity: 0, y: -80, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            className="damage-popup"
                          >
                            -{damagePopup.amount}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="spark s1"></div>
                      <div className="spark s2"></div>
                      <div className="spark s3"></div>
                      <div className="spark s4"></div>
                    </div>

                    <div className="boss-hp-wrap">
                      <div className="boss-hp-bar">
                        <div className="boss-hp-markers"></div>
                        <motion.div
                          className={`boss-hp-fill ${bossHpPercent < 20 ? 'pulse-danger' : ''}`}
                          style={{
                            background: bossHpColor,
                            boxShadow: `0 0 25px ${bossHpColor}`,
                          }}
                          initial={{ width: '100%' }}
                          animate={{ width: `${bossHpPercent}%` }}
                        >
                          <div className="boss-hp-gloss"></div>
                        </motion.div>
                      </div>
                      <div className="boss-hp-text">
                        <span className="hp-current">{clanBoss.currentHp.toLocaleString('ru-RU')}</span>
                        <span className="hp-max">/ {clanBoss.maxHp.toLocaleString('ru-RU')} HP</span>
                      </div>
                    </div>

                    <div className="boss-stats-grid">
                      <div className="boss-stat-card">
                        <span className="b-stat-label">РќРђР“Р РђР”Рђ</span>
                        <span className="b-stat-value gold">
                          {(clanBoss.level * 100000).toLocaleString('ru-RU')} в‚µ
                        </span>
                      </div>
                      <div className="boss-stat-card">
                        <span className="b-stat-label">РўР’РћР™ РЈР РћРќ</span>
                        <span className="b-stat-value green">
                          ~{estimatedDamage.toLocaleString('ru-RU')}
                        </span>
                      </div>
                    </div>

                    <button
                      className={`boss-attack-btn ${clanBoss.currentHp <= 0 ? 'disabled' : ''}`}
                      disabled={clanBoss.currentHp <= 0 || isAttacking || cooldown}
                      onClick={handleAttackBoss}
                    >
                      <div className="btn-bg"></div>
                      <span className="btn-content">
                        {clanBoss.currentHp <= 0 ? (
                          'Р’РћРЎРЎРўРђРќРћР’Р›Р•РќРР•...'
                        ) : (
                          <>
                            <Swords size={22} style={{ marginRight: 10 }} /> РђРўРђРљРћР’РђРўР¬
                          </>
                        )}
                      </span>
                    </button>

                    <div className="boss-damage-list">
                      <div className="b-damage-title">
                        <span><Trophy size={12} /> РўРћРџ РЈР РћРќРђ</span>
                      </div>
                      {bossDamageStats && bossDamageStats.length > 0 ? (
                        bossDamageStats.map((stat, index) => (
                          <div
                            key={stat.userId}
                            className={`b-damage-row ${stat.userId === user?.id ? 'is-me' : ''}`}
                          >
                            <span className="b-damage-rank">{index + 1}</span>
                            <span className="b-damage-name">{stat.firstName || 'РРіСЂРѕРє'}</span>
                            <span className="b-damage-val">{stat.damage.toLocaleString('ru-RU')}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ textAlign: 'center', color: '#8892b0', fontSize: 12, padding: 10 }}>
                          РџРѕРєР° РЅРёРєС‚Рѕ РЅРµ Р±РёР» Р±РѕСЃСЃР°
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#8892b0', marginTop: 50 }}>
                    Р—Р°РіСЂСѓР·РєР°...
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== RATING ==================== */}
            {activeTab === 'rating' && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="clan-tab-content hide-scrollbar"
              >
                {/* РџРѕ РІРєР»Р°РґСѓ */}
                <div className="rating-section">
                  <h3 className="rating-title">
                    <Trophy size={16} color="var(--gold)" /> РўРћРџ РџРћ Р’РљР›РђР”РЈ
                  </h3>
                  <div className="rating-list">
                    {[...clanMembers]
                      .sort((a: any, b: any) => (b.contribution || 0) - (a.contribution || 0))
                      .slice(0, 10)
                      .map((m: any, idx: number) => (
                        <div
                          key={m.userId}
                          className={`rating-row ${m.userId === user?.id ? 'is-me' : ''}`}
                        >
                          <span className={`rating-rank rank-${idx + 1}`}>{idx + 1}</span>
                          <div className="rating-avatar">{m.firstName?.[0] || 'Р'}</div>
                          <span className="rating-name">
                            {m.firstName || 'РРіСЂРѕРє'}
                            {m.role === 'leader' && <Crown size={12} color="var(--gold)" />}
                            {m.role === 'officer' && <Star size={12} color="var(--accent)" />}
                          </span>
                          <span className="rating-value gold">
                            {(m.contribution || 0).toLocaleString('ru-RU')} в‚µ
                          </span>
                        </div>
                      ))}
                    {clanMembers.length === 0 && (
                      <div className="rating-empty">РџРѕРєР° РЅРµС‚ РґР°РЅРЅС‹С…</div>
                    )}
                  </div>
                </div>

                {/* РџРѕ СѓСЂРѕРЅСѓ */}
                <div className="rating-section">
                  <h3 className="rating-title">
                    <Swords size={16} color="var(--danger)" /> РўРћРџ РџРћ РЈР РћРќРЈ Р‘РћРЎРЎРЈ
                  </h3>
                  <div className="rating-list">
                    {bossDamageStats && bossDamageStats.length > 0 ? (
                      bossDamageStats.slice(0, 10).map((stat: any, idx: number) => (
                        <div
                          key={stat.userId}
                          className={`rating-row ${stat.userId === user?.id ? 'is-me' : ''}`}
                        >
                          <span className={`rating-rank rank-${idx + 1}`}>{idx + 1}</span>
                          <div className="rating-avatar">{stat.firstName?.[0] || 'Р'}</div>
                          <span className="rating-name">{stat.firstName || 'РРіСЂРѕРє'}</span>
                          <span className="rating-value green">
                            {stat.damage.toLocaleString('ru-RU')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="rating-empty">РџРѕРєР° РЅРёРєС‚Рѕ РЅРµ Р±РёР» Р±РѕСЃСЃР°</div>
                    )}
                  </div>
                </div>

                {/* РџСЂРёРіР»Р°С€РµРЅРёРµ */}
                <div className="clan-invite-box">
                  <h4>РџСЂРёРіР»Р°СЃРёС‚СЊ РІ РєР»Р°РЅ</h4>
                  <p className="clan-invite-desc">
                    РћС‚РїСЂР°РІСЊ РґСЂСѓРіСѓ СЃСЃС‹Р»РєСѓ вЂ” РѕРЅ РїРѕРїР°РґС‘С‚ СЃСЂР°Р·Сѓ РІ С‚РІРѕР№ РєР»Р°РЅ.
                  </p>
                  <button className="btn-neon-cyan full-width" onClick={handleCopyInvite}>
                    <LinkIcon size={16} style={{ marginRight: 8 }} /> РЎРљРћРџРР РћР’РђРўР¬ РЎРЎР«Р›РљРЈ
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==================== CHAT ==================== */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div className="chat-messages hide-scrollbar">
                  {clanMessages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#8892b0', marginTop: 20 }}>
                      РЎРѕРѕР±С‰РµРЅРёР№ РЅРµС‚. Р‘СѓРґСЊС‚Рµ РїРµСЂРІС‹Рј!
                    </div>
                  )}
                  {clanMessages.map((msg: any) => {
                    const isMe = msg.userId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`chat-bubble-wrap ${isMe ? 'me' : ''}`}
                      >
                        {!isMe && (
                          <div className="chat-author">{msg.firstName || 'РРіСЂРѕРє'}</div>
                        )}
                        <div className={`chat-bubble ${isMe ? 'me' : ''}`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-area">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="РќР°РїРёСЃР°С‚СЊ..."
                    className="clan-input"
                    style={{ marginBottom: 0 }}
                    maxLength={200}
                  />
                  <button
                    className="btn-neon-cyan"
                    onClick={handleSendMessage}
                    style={{ padding: '0 20px' }}
                  >
                    вћ¤
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==================== MEMBERS ==================== */}
            {activeTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="clan-tab-content hide-scrollbar"
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 10 }}>
                  <button
                    className="btn-sm btn-neon-cyan"
                    style={{ padding: '6px 12px' }}
                    onClick={() => setActiveTab('main')}
                  >
                    в†ђ РќРђР—РђР”
                  </button>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: 16 }}>РЎРѕСЃС‚Р°РІ РєР»Р°РЅР°</h3>
                </div>
                <div className="members-list">
                  {clanMembers.map((m: any) => (
                    <div key={m.userId} className="member-row">
                      <div className="member-avatar">{m.firstName?.[0] || 'Р'}</div>
                      <div className="member-info">
                        <span className="member-name">
                          {m.firstName || 'РРіСЂРѕРє'}
                          {m.role === 'leader' && <Crown size={12} color="var(--gold)" />}
                          {m.role === 'officer' && <Star size={12} color="var(--accent)" />}
                        </span>
                        <span className="member-donate">
                          Р’РєР»Р°Рґ: {(m.contribution || 0).toLocaleString('ru-RU')} в‚µ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ==================== MANAGE ==================== */}
            {activeTab === 'manage' && (
              <motion.div
                key="manage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="clan-tab-content hide-scrollbar"
              >
                <div className="members-list">
                  {clanMembers
                    .filter((m: any) => m.userId !== user?.id)
                    .map((m: any) => (
                      <div key={m.userId} className="member-row manage">
                        <div className="member-info">
                          <span className="member-name">{m.firstName || 'РРіСЂРѕРє'}</span>
                          <span className="member-role">{m.role}</span>
                        </div>
                        <div className="member-actions">
                          {myRole === 'leader' && (
                            <>
                              <button
                                className="btn-sm btn-neon-cyan"
                                onClick={() => clanAction('setRole', undefined, m.userId, 'officer')}
                                title="РЎРґРµР»Р°С‚СЊ РѕС„РёС†РµСЂРѕРј"
                              >
                                <Star size={12} />
                              </button>
                              <button
                                className="btn-sm btn-neon-pink"
                                onClick={() => clanAction('setRole', undefined, m.userId, 'member')}
                                title="РЎРґРµР»Р°С‚СЊ СѓС‡Р°СЃС‚РЅРёРєРѕРј"
                              >
                                <Users size={12} />
                              </button>
                              <button
                                className="btn-sm btn-neon-pink"
                                onClick={() => {
                                  if (confirm('РџРµСЂРµРґР°С‚СЊ Р»РёРґРµСЂСЃС‚РІРѕ?'))
                                    clanAction('transfer', undefined, m.userId);
                                }}
                                title="РџРµСЂРµРґР°С‚СЊ Р»РёРґРµСЂСЃС‚РІРѕ"
                              >
                                <Crown size={12} />
                              </button>
                            </>
                          )}
                          <button
                            className="btn-sm btn-neon-red"
                            onClick={() => {
                              if (confirm('РљРёРєРЅСѓС‚СЊ?')) clanAction('kick', undefined, m.userId);
                            }}
                            title="РљРёРєРЅСѓС‚СЊ"
                          >
                            <XIcon size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  className="btn-neon-red full-width"
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    if (confirm('Р’С‹Р№С‚Рё РёР· РєР»Р°РЅР°?'))
                      clanAction('leave').then(() => onClose());
                  }}
                >
                  Р’Р«Р™РўР РР— РљР›РђРќРђ
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
```

### src/components/DailyRewardModal.tsx
```tsx
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound';

interface Props {
  onClose: () => void;
}

const REWARDS = [1000, 2500, 5000, 10000, 25000, 50000, 100000];

// Р’СЃРїРѕРјРѕРіР°С‚РµР»СЊРЅР°СЏ С„СѓРЅРєС†РёСЏ: РІРѕР·РІСЂР°С‰Р°РµС‚ timestamp 00:00 РїРѕ РњРЎРљ (UTC+3)
// offsetDays = 0 (СЃРµРіРѕРґРЅСЏ), 1 (Р·Р°РІС‚СЂР°) Рё С‚.Рґ.
const getMskMidnight = (offsetDays = 0) => {
  const now = new Date();
  const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // РџРµСЂРµРІРѕРґРёРј РІ UTC+3
  mskTime.setUTCHours(0, 0, 0, 0); // РЎС‚Р°РІРёРј 00:00
  mskTime.setUTCDate(mskTime.getUTCDate() + offsetDays); // РџСЂРёР±Р°РІР»СЏРµРј РґРЅРё
  return mskTime.getTime() - 3 * 60 * 60 * 1000; // Р’РѕР·РІСЂР°С‰Р°РµРј РІ UTC timestamp
};

export const DailyRewardModal: React.FC<Props> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const claimDaily = useGameStore((s) => s.claimDaily);
  const [isLoading, setIsLoading] = useState(false);

  const streak = user?.dailyStreak || 0;
  const lastClaim = user?.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canClaim, setCanClaim] = useState<boolean>(true);

  useEffect(() => {
    const updateTimer = () => {
      if (!lastClaim) {
        setCanClaim(true);
        setTimeLeft(0);
        return;
      }

      const todayMidnight = getMskMidnight(0); // РќР°С‡Р°Р»Рѕ СЃРµРіРѕРґРЅСЏС€РЅРµРіРѕ РґРЅСЏ (00:00 РњРЎРљ)
      
      // Р•СЃР»Рё РїРѕСЃР»РµРґРЅРёР№ РєР»РµР№Рј Р±С‹Р» РґРѕ СЃРµРіРѕРґРЅСЏС€РЅРµР№ РїРѕР»СѓРЅРѕС‡Рё РњРЎРљ вЂ” РЅР°РіСЂР°РґР° РґРѕСЃС‚СѓРїРЅР°
      if (lastClaim.getTime() < todayMidnight) {
        setCanClaim(true);
        setTimeLeft(0);
      } else {
        // РРЅР°С‡Рµ РїРѕРєР°Р·С‹РІР°РµРј С‚Р°Р№РјРµСЂ РґРѕ СЃР»РµРґСѓСЋС‰РµР№ РїРѕР»СѓРЅРѕС‡Рё (Р·Р°РІС‚СЂР°С€РЅРµР№)
        const nextMidnight = getMskMidnight(1);
        setCanClaim(false);
        setTimeLeft(nextMidnight - Date.now());
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastClaim]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  let activeDay = streak;
  if (canClaim) {
    activeDay = (streak % 7) + 1;
  }

  const handleClaim = async () => {
    if (isLoading || !canClaim) return;
    setIsLoading(true);
    try {
      const success = await claimDaily();
      if (success) {
        playSound('coin');
        // РџРѕСЃР»Рµ СѓСЃРїРµС€РЅРѕРіРѕ РїРѕР»СѓС‡РµРЅРёСЏ РїСЂРёРЅСѓРґРёС‚РµР»СЊРЅРѕ РѕР±РЅРѕРІР»СЏРµРј С‚Р°Р№РјРµСЂ
        const nextMidnight = getMskMidnight(1);
        setTimeLeft(nextMidnight - Date.now());
        setCanClaim(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      paddingTop: 'var(--tg-safe-top, 0px)', // рџ‘€ Р”РѕР±Р°РІР»РµРЅ Р±РµР·РѕРїР°СЃРЅС‹Р№ РѕС‚СЃС‚СѓРї СЃРІРµСЂС…Сѓ
      paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px'
    }}>
      <div style={{ 
        background: '#1a1a1a', 
        borderRadius: '20px', 
        padding: '25px', 
        width: '100%', 
        maxWidth: '400px', 
        border: '1px solid rgba(255,215,0,0.3)',
        position: 'relative'
      }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          вњ•
        </button>

        <h2 style={{ color: '#ffd700', textAlign: 'center', margin: '0 0 20px 0' }}>рџЋЃ Р•Р¶РµРґРЅРµРІРЅС‹Р№ Р±РѕРЅСѓСЃ</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {REWARDS.slice(0, 6).map((reward, index) => {
            const day = index + 1;
            const isClaimed = streak >= day && !canClaim;
            const isActive = day === activeDay && canClaim;
            
            return (
              <div key={day} style={{
                background: isActive ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
                border: isActive ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '10px 5px', textAlign: 'center',
                opacity: isClaimed ? 0.5 : 1,
                position: 'relative'
              }}>
                <div style={{ fontSize: '11px', color: isActive ? '#ffd700' : '#888', marginBottom: '4px', fontWeight: 'bold' }}>
                  Р”РµРЅСЊ {day}
                </div>
                <div style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>
                  {reward.toLocaleString('ru-RU')}
                </div>
                <div style={{ fontSize: '10px', color: '#ffd700' }}>в‚Ѕ</div>
                {isClaimed && <div style={{ position: 'absolute', top: 2, right: 4, color: '#00d97e', fontSize: '14px' }}>вњ“</div>}
              </div>
            );
          })}
          {/* 7-Р№ РґРµРЅСЊ РЅР° РІСЃСЋ С€РёСЂРёРЅСѓ */}
          <div style={{
             gridColumn: 'span 3',
             background: activeDay === 7 && canClaim ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
             border: activeDay === 7 && canClaim ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
             borderRadius: '10px', padding: '12px', textAlign: 'center',
             opacity: streak >= 7 && !canClaim ? 0.5 : 1,
             marginTop: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px'
          }}>
             <div style={{ color: '#888', fontSize: '12px', fontWeight: 'bold' }}>Р”РµРЅСЊ 7</div>
             <div style={{ color: '#00d97e', fontSize: '18px', fontWeight: 'bold' }}>100,000 в‚Ѕ</div>
          </div>
        </div>

        {!canClaim && timeLeft > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <span style={{ color: '#aaa', fontSize: '13px' }}>РЎР»РµРґСѓСЋС‰Р°СЏ РЅР°РіСЂР°РґР° С‡РµСЂРµР·:</span>
            <div style={{ color: '#ffd700', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px' }}>
              {formatTime(timeLeft)}
            </div>
          </div>
        )}

        <button
          onClick={canClaim ? handleClaim : undefined}
          disabled={!canClaim || isLoading}
          style={{
            width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
            fontSize: '16px', fontWeight: 'bold',
            background: !canClaim ? 'rgba(255,255,255,0.05)' : isLoading ? '#888' : '#ffd700',
            color: !canClaim ? '#666' : 'black',
            cursor: (!canClaim || isLoading) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isLoading ? 'РџРћР›РЈР§РђР•Рњ...' : canClaim ? 'Р—РђР‘Р РђРўР¬ РќРђР“Р РђР”РЈ' : 'РџРћР”РћР–Р”РРўР•'}
        </button>
      </div>
    </div>
  );
};
```

### src/components/GarageScreen.tsx
```tsx
// src/components/GarageScreen.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import { UpgradeType, PAINT_COLORS } from '../config/garage';
import { ITEMS, RARITY_COLORS, SELL_PRICES, calculateStats } from '../config/items';
import { CARS } from '../config/cars';
import { TintedCarImage } from './TintedCarImage';
import '../styles/garage.css';

export const GarageScreen: React.FC = () => {
  const [activeUpgrade, setActiveUpgrade] = useState<UpgradeType | null>(null);
  const [sellingId, setSellingId] = useState<string | null>(null);
  const [showCarSelector, setShowCarSelector] = useState(false);

  const user = useGameStore((s) => s.user);
  const carColor = useGameStore((s) => s.carColor);
  const setCarColor = useGameStore((s) => s.setCarColor);
  const inventory = useGameStore((s) => s.inventory);
  const equipped = useGameStore((s) => s.equipped);
  const equipItem = useGameStore((s) => s.equipItem);
  const switchCar = useGameStore((s) => s.switchCar);
  const sellItem = useGameStore((s) => s.sellItem);

  const activeCarId = user?.activeCarId || 'audi-tt';
  const activeCar = CARS[activeCarId] || CARS['audi-tt'];
  const ownedCars = user?.ownedCars || ['audi-tt'];

  // вљЎ Р¤РёРЅР°Р»СЊРЅС‹Рµ С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё С‚РµРєСѓС‰РµР№ РјР°С€РёРЅС‹
  const finalStats = useMemo(
    () => calculateStats(equipped, user?.partUpgrades || {}, activeCarId),
    [equipped, user?.partUpgrades, activeCarId]
  );

  // вљЎ РҐР°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё РІСЃРµС… РєСѓРїР»РµРЅРЅС‹С… РјР°С€РёРЅ
  const carOptions = useMemo(() => {
    return ownedCars
      .map((id) => {
        const car = CARS[id] || CARS['audi-tt'];
        const stats = calculateStats(equipped, user?.partUpgrades || {}, id);
        return { id, car, stats, isActive: id === activeCarId };
      })
      .sort((a, b) => b.stats.rating - a.stats.rating);
  }, [ownedCars, equipped, user?.partUpgrades, activeCarId]);

  const handleUpgradeClick = (id: UpgradeType) => {
    setActiveUpgrade(id);
    try {
      WebApp.HapticFeedback?.impactOccurred('light');
    } catch {}
  };

  const handleColorSelect = (colorId: string) => {
    setCarColor(colorId);
    try {
      WebApp.HapticFeedback?.impactOccurred('medium');
    } catch {}
  };

  const handleSelectCar = async (carId: string) => {
    if (carId === activeCarId) {
      setShowCarSelector(false);
      return;
    }
    try {
      WebApp.HapticFeedback?.impactOccurred('medium');
    } catch {}
    await switchCar(carId);
    setShowCarSelector(false);
  };

  const getModalTitle = () => {
    if (activeUpgrade === 'engine') return 'Р”РІРёРіР°С‚РµР»СЊ';
    if (activeUpgrade === 'tires') return 'РЁРёРЅС‹';
    if (activeUpgrade === 'ecu') return 'РџСЂРѕС€РёРІРєР° (ECU)';
    if (activeUpgrade === 'suspension') return 'РџРѕРґРІРµСЃРєР°';
    if (activeUpgrade === 'paint') return 'РџРѕРєСЂР°СЃРєР°';
    return 'РЈР»СѓС‡С€РµРЅРёРµ';
  };

  const activeColorHex =
    PAINT_COLORS.find((color) => color.id === carColor)?.hex || 'transparent';

  const renderUpgradeSection = (slot: string) => {
    const slotItems = inventory.filter((id) => ITEMS[id]?.slot === slot);
    const uniqueItems = Array.from(new Set(slotItems));

    uniqueItems.sort((a, b) => {
      const rarities = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
      return rarities.indexOf(ITEMS[a].rarity) - rarities.indexOf(ITEMS[b].rarity);
    });

    return (
      <div className="inventory-list">
        <p style={{ color: '#aaa', marginBottom: '10px', fontSize: '13px' }}>
          РќР°Р¶РјРёС‚Рµ РЅР° РїСЂРµРґРјРµС‚, С‡С‚РѕР±С‹ РЅР°РґРµС‚СЊ, РёР»Рё РїСЂРѕРґР°Р№С‚Рµ Р·Р° в‚ЅС‹:
        </p>

        {uniqueItems.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>
            РџСѓСЃС‚Рѕ. РљР»РёРєР°Р№С‚Рµ РЅР° РіР»Р°РІРЅРѕРј СЌРєСЂР°РЅРµ, С‡С‚РѕР±С‹ РІС‹Р±РёС‚СЊ Р·Р°РїС‡Р°СЃС‚Рё!
          </p>
        )}

        {uniqueItems.map((itemId, index) => {
          const item = ITEMS[itemId];
          const isEquipped = equipped[item.slot] === itemId;
          const sellPrice = SELL_PRICES[item.rarity];
          const isSelling = sellingId === itemId;

          const upg = user?.partUpgrades?.[itemId] || { level: 0, goldStars: 0, redStars: 0 };
          const levelMulti = 1 + (upg.level || 0) * 0.02;
          const goldMulti = 1 + (upg.goldStars || 0) * 0.10;
          const redMulti = 1 + (upg.redStars || 0) * 0.25;
          const finalMulti = levelMulti * goldMulti * redMulti;

          const power = Math.round(item.stats.power * finalMulti);
          const topSpeed = Math.round(item.stats.topSpeed * finalMulti);
          const grip = Math.round(item.stats.grip * finalMulti);
          const handling = Math.round(item.stats.handling * finalMulti);
          const hasUpgrades = upg.level > 0 || upg.goldStars > 0 || upg.redStars > 0;

          return (
            <motion.div
              key={itemId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2, ease: 'easeOut' }}
              className={`inventory-item ${isEquipped ? 'equipped' : ''}`}
              style={{
                borderColor: isEquipped ? '#00e5ff' : RARITY_COLORS[item.rarity],
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                cursor: isEquipped || isSelling ? 'default' : 'pointer',
                background: isEquipped
                  ? 'linear-gradient(90deg, rgba(0,229,255,0.08) 0%, rgba(0,229,255,0.02) 100%)'
                  : 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                marginBottom: '8px',
                borderWidth: '1px',
                borderStyle: 'solid',
                opacity: isSelling ? 0.5 : 1,
              }}
              onClick={() => {
                if (!isEquipped && !isSelling) equipItem(item.slot, itemId);
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  className="item-name"
                  style={{
                    color: RARITY_COLORS[item.rarity],
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '5px',
                    fontSize: '14px',
                  }}
                >
                  {item.name} {isEquipped && 'вњ“'}
                  {hasUpgrades && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 'normal',
                        color: '#888',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Lv.{upg.level}
                      {upg.goldStars > 0 && <span style={{ color: 'gold', marginLeft: '4px' }}>в…{upg.goldStars}</span>}
                      {upg.redStars > 0 && <span style={{ color: '#ff4444', marginLeft: '4px' }}>в…{upg.redStars}</span>}
                    </span>
                  )}
                </div>
                <div className="item-stats" style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  {power > 0 && <span>+{power} HP </span>}
                  {topSpeed > 0 && <span>+{topSpeed} Vmax </span>}
                  {grip > 0 && <span>+{grip} РЎС†РµРї. </span>}
                  {handling > 0 && <span>+{handling} РЈРїСЂР°РІ. </span>}
                </div>
              </div>

              {!isEquipped ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelling) return;
                    setSellingId(itemId);
                    sellItem(itemId).finally(() => setSellingId(null));
                  }}
                  disabled={isSelling}
                  style={{
                    background: isSelling ? 'rgba(255,255,255,0.1)' : 'rgba(255,68,68,0.15)',
                    border: '1px solid rgba(255,68,68,0.5)',
                    color: isSelling ? '#aaa' : '#ff4444',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: isSelling ? 'wait' : 'pointer',
                    whiteSpace: 'nowrap',
                    minWidth: '60px',
                  }}
                >
                  {isSelling ? '...' : `рџ’° ${sellPrice}`}
                </button>
              ) : (
                <span style={{ fontSize: '11px', color: '#00d97e', fontWeight: 'bold' }}>
                  РќР°РґРµС‚Рѕ
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="garage-screen">
      <div className="garage-scene">
        <div className="garage-bg" />

        {/* --- РљРЅРѕРїРєР° СЃРјРµРЅС‹ РјР°С€РёРЅС‹ --- */}
        {ownedCars.length > 1 && (
          <div className="garage-car-switch-wrapper">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCarSelector(true)}
              className="garage-car-switch-btn"
            >
              <span>рџљ—</span>
              <span>{activeCar.name}</span>
              <span style={{ color: '#00e5ff', marginLeft: '4px' }}>в–ј</span>
            </motion.button>
          </div>
        )}

        {/* --- РџР»Р°С€РєР° С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРє (РїРµСЂРµРЅРµСЃРµРЅР° РЅР° top 16%) --- */}
        <div
          style={{
            position: 'absolute',
            top: '21%',
            left: '10%',
            width: '80%',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            zIndex: 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#aaa',
            fontFamily: 'monospace',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>рџљЂ {finalStats.topSpeed} РєРј/С‡</span>
            <span>вљЎ {Number(finalStats.accel ?? 0).toFixed(1)} СЃ</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
            <span>рџ’Є {finalStats.power} Р».СЃ.</span>
            <span>в­ђ Р РµР№С‚РёРЅРі: {finalStats.rating}</span>
          </div>
        </div>

        {/* --- РњР°С€РёРЅР° --- */}
        <div
          className="garage-car-container"
          style={{
            top: '38%',
            left: '25%',
            width: '52%',
            position: 'absolute',
            zIndex: 10,
          }}
          onClick={() => handleUpgradeClick('engine')}
        >
          <div className="car-tooltip">Р”РІРёРіР°С‚РµР»СЊ</div>
          <div className="car-image-wrapper">
            <TintedCarImage
              imageUrl={activeCar.image}
              colorHex={activeColorHex}
              className="garage-car-img"
              style={{ filter: 'none', width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* --- РЁРёРЅС‹, РїРѕРґРІРµСЃРєР°, ECU --- */}
        <motion.img
          src="/images/tires.png"
          alt="РЁРёРЅС‹"
          className="interactive-object"
          style={{ top: '41%', left: '0%', width: '18%' }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          whileTap={{ scale: 1.15 }}
          onClick={() => handleUpgradeClick('tires')}
        />
        <motion.img
          src="/images/suspension.png"
          alt="РџРѕРґРІРµСЃРєР°"
          className="interactive-object"
          style={{ top: '33%', left: '76%', width: '25%' }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          whileTap={{ scale: 1.15 }}
          onClick={() => handleUpgradeClick('suspension')}
        />
        <motion.img
          src="/images/computer.png"
          alt="РџСЂРѕС€РёРІРєР° (ECU)"
          className="interactive-object"
          style={{ top: '74%', left: '6%', width: '32%' }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          whileTap={{ scale: 1.15 }}
          onClick={() => handleUpgradeClick('ecu')}
        />
      </div>

      {/* ============================================ */}
      {/* РњРћР”РђР›РљРђ Р’Р«Р‘РћР Рђ РњРђРЁРРќР«                        */}
      {/* ============================================ */}
      <AnimatePresence>
        {showCarSelector && (
          <motion.div
            className="garage-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCarSelector(false)}
          >
            <motion.div
              className="garage-modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="garage-modal-header">
                <h2>Р’С‹Р±РѕСЂ РјР°С€РёРЅС‹</h2>
                <button className="close-btn" onClick={() => setShowCarSelector(false)}>
                  вњ•
                </button>
              </div>

              <div className="garage-modal-body">
                <p style={{ color: '#888', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
                  РљСѓРїР»РµРЅРѕ РјР°С€РёРЅ: {ownedCars.length}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {carOptions.map((opt) => {
                    const diffSpeed = opt.stats.topSpeed - finalStats.topSpeed;
                    const diffPower = opt.stats.power - finalStats.power;
                    const diffRating = opt.stats.rating - finalStats.rating;

                    return (
                      <motion.div
                        key={opt.id}
                        whileTap={{ scale: opt.isActive ? 1 : 0.98 }}
                        onClick={() => handleSelectCar(opt.id)}
                        className={`car-option-card ${opt.isActive ? 'active' : ''}`}
                        style={{
                          background: opt.isActive
                            ? 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,136,255,0.05))'
                            : 'rgba(255,255,255,0.03)',
                          border: opt.isActive
                            ? '2px solid #00e5ff'
                            : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '14px',
                          padding: '12px 14px',
                          cursor: opt.isActive ? 'default' : 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                              {opt.car.name}
                            </div>
                            {opt.isActive && (
                              <div style={{ color: '#00e5ff', fontSize: '10px', marginTop: '2px', fontWeight: 'bold', letterSpacing: '1px' }}>
                                вњ“ Р’Р«Р‘Р РђРќРђ
                              </div>
                            )}
                          </div>
                          <div style={{
                            color: opt.isActive ? '#00e5ff' : '#aaa',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                          }}>
                            в­ђ {opt.stats.rating}
                          </div>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '4px 12px',
                          fontSize: '11px',
                          color: '#aaa',
                          fontFamily: 'monospace',
                        }}>
                          <span>рџљЂ {opt.stats.topSpeed} РєРј/С‡</span>
                          <span>рџ’Є {opt.stats.power} Р».СЃ.</span>
                          <span>вљЎ {Number(opt.stats.accel).toFixed(1)} СЃ</span>
                          <span>рџ›ћ {opt.stats.grip}</span>
                        </div>

                        {!opt.isActive && (diffSpeed !== 0 || diffPower !== 0 || diffRating !== 0) && (
                          <div style={{
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px dashed rgba(255,255,255,0.1)',
                            fontSize: '10px',
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                          }}>
                            {diffSpeed !== 0 && (
                              <span style={{ color: diffSpeed > 0 ? '#00d97e' : '#ff4444' }}>
                                {diffSpeed > 0 ? 'в–І' : 'в–ј'} {Math.abs(diffSpeed)} РєРј/С‡
                              </span>
                            )}
                            {diffPower !== 0 && (
                              <span style={{ color: diffPower > 0 ? '#00d97e' : '#ff4444' }}>
                                {diffPower > 0 ? 'в–І' : 'в–ј'} {Math.abs(diffPower)} Р».СЃ.
                              </span>
                            )}
                            {diffRating !== 0 && (
                              <span style={{ color: diffRating > 0 ? '#00d97e' : '#ff4444' }}>
                                в­ђ {diffRating > 0 ? '+' : ''}{diffRating}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* РњРћР”РђР›РљРђ РџР РћРљРђР§РљР / РџРћРљР РђРЎРљР                  */}
      {/* ============================================ */}
      <AnimatePresence>
        {activeUpgrade && (
          <motion.div
            className="garage-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveUpgrade(null)}
          >
            <motion.div
              className="garage-modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="garage-modal-header">
                <h2>{getModalTitle()}</h2>
                <button className="close-btn" onClick={() => setActiveUpgrade(null)}>
                  вњ•
                </button>
              </div>

              <div className="garage-modal-body">
                {activeUpgrade === 'paint' && (
                  <div className="paint-section">
                    <p className="paint-desc">Р’С‹Р±РµСЂРёС‚Рµ С†РІРµС‚ РєСѓР·РѕРІР°:</p>
                    <div className="color-grid">
                      {PAINT_COLORS.map((color) => (
                        <motion.button
                          key={color.id}
                          whileTap={{ scale: 0.95 }}
                          className={`color-btn ${carColor === color.id ? 'active' : ''}`}
                          onClick={() => handleColorSelect(color.id)}
                        >
                          <div
                            className="color-swatch"
                            style={{
                              backgroundColor: color.hex === 'transparent' ? '#888' : color.hex,
                            }}
                          />
                          <span>{color.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {['engine', 'tires', 'suspension', 'ecu'].includes(activeUpgrade) &&
                  renderUpgradeSection(activeUpgrade)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### src/components/HistoryModal.tsx
```tsx
// src/components/HistoryModal.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { TrendingUp, TrendingDown, X, History } from 'lucide-react';
import '../styles/history.css';

export function HistoryModal({ onClose }: { onClose: () => void }) {
  const history = useGameStore((s) => s.history);
  const fetchHistory = useGameStore((s) => s.fetchHistory);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // РџРѕРєР°Р·С‹РІР°РµРј С‚РѕР»СЊРєРѕ 10 РїРѕСЃР»РµРґРЅРёС… РѕРїРµСЂР°С†РёР№
  const recentHistory = history.slice(0, 10);

  return (
    <motion.div 
      className="history-overlay"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="history-container"
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* РЁР°РїРєР° */}
        <div className="history-header">
          <h2>
            <History size={18} color="var(--accent)" />
            РРЎРўРћР РРЇ
          </h2>
          <button className="history-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* РЎРїРёСЃРѕРє */}
        <div className="history-body">
          {recentHistory.length === 0 && (
            <div className="history-empty">
              <History size={32} color="var(--text-muted)" />
              <p>РџРѕРєР° РЅРµС‚ РѕРїРµСЂР°С†РёР№</p>
            </div>
          )}

          {recentHistory.map((tx: any, index: number) => {
            const isPositive = tx.amount > 0;
            const IconComponent = isPositive ? TrendingUp : TrendingDown;
            // рџ‘‡ РСЃРїРѕР»СЊР·СѓРµРј РїРµСЂРµРјРµРЅРЅС‹Рµ С‡РµСЂРµР· inline-СЃС‚РёР»Рё
            const colorVar = isPositive ? 'var(--success)' : 'var(--danger)';
            const glowVar = isPositive ? 'var(--success-glow)' : 'var(--danger-glow)';
            const bgVar = isPositive ? 'rgba(0, 217, 126, 0.15)' : 'rgba(255, 68, 68, 0.15)';
            const borderVar = isPositive ? 'rgba(0, 217, 126, 0.4)' : 'rgba(255, 68, 68, 0.4)';

            return (
              <motion.div 
                key={tx.id}
                className="history-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                style={{ borderLeftColor: colorVar }}
              >
                <div className="history-icon" style={{ background: bgVar, border: `1px solid ${borderVar}` }}>
                  <IconComponent size={14} color={colorVar} />
                </div>

                <div className="history-info">
                  <span className="history-desc">{tx.description}</span>
                  <span className="history-date">
                    {new Date(tx.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>

                <span className="history-amount" style={{ color: colorVar, textShadow: `0 0 8px ${glowVar}` }}>
                  {isPositive ? '+' : ''}{tx.amount.toLocaleString('ru-RU')}
                  <span className="currency-ruble sm" style={{ marginLeft: 3 }}>в‚Ѕ</span>
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Р¤СѓС‚РµСЂ (РѕРїС†РёРѕРЅР°Р»СЊРЅРѕ) */}
        {history.length > 10 && (
          <div className="history-footer">
            РџРѕРєР°Р·Р°РЅС‹ РїРѕСЃР»РµРґРЅРёРµ 10 РѕРїРµСЂР°С†РёР№
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
```

### src/components/LeaderboardModal.tsx
```tsx
// src/components/LeaderboardModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Trophy, X, Crown } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import '../styles/leaderboard.css';

type LeaderboardType = 'balance' | 'xp' | 'wins';

interface Player {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  balance: number;
  xp: number;
  totalWins: number;
  rating: number;
}

interface LeaderboardModalProps {
  onClose: () => void;
}

const TABS: { id: LeaderboardType; label: string; icon: any; color: string }[] = [
  { id: 'balance', label: 'Р‘Р°Р»Р°РЅСЃ', icon: Coins,       color: '#ffd700' },
  { id: 'xp',      label: 'РћРїС‹С‚',   icon: TrendingUp,  color: '#00e5ff' },
  { id: 'wins',    label: 'РџРѕР±РµРґС‹', icon: Trophy,      color: '#00d97e' },
];

export const LeaderboardModal = ({ onClose }: LeaderboardModalProps) => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('balance');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const initData = WebApp.initData || '';
        const res = await fetch(`/api/game?action=leaderboard&type=${activeTab}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });
        const data = await res.json();
        if (data.success) setPlayers(data.players);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, [activeTab]);

  const getValue = (player: Player, type: LeaderboardType) => {
    if (type === 'xp') return `${player.xp.toLocaleString('ru-RU')} XP`;
    if (type === 'wins') return `${player.totalWins} рџЏ†`;
    return `${player.balance.toLocaleString('ru-RU')} в‚Ѕ`;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'var(--gold)';
    if (index === 1) return '#c0c0c0';
    if (index === 2) return '#cd7f32';
    return 'var(--text-muted)';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown size={16} color="var(--gold)" />;
    return <span style={{ fontFamily: 'Impact, sans-serif', color: getRankColor(index) }}>#{index + 1}</span>;
  };

  return (
    <div className="leaderboard-overlay" onClick={onClose}>
      <motion.div
        className="leaderboard-content"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="leaderboard-header">
          <h2>
            <Trophy size={18} color="var(--gold)" /> РўРћРџ РР“Р РћРљРћР’
          </h2>
          <button className="leaderboard-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* РўР°Р±С‹ */}
        <div className="leaderboard-tabs">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`leaderboard-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={isActive ? { borderColor: tab.color, color: tab.color } : {}}
              >
                <Icon size={16} color={isActive ? tab.color : '#888'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* РЎРїРёСЃРѕРє */}
        <div className="leaderboard-body">
          {loading && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              Р—Р°РіСЂСѓР·РєР°...
            </div>
          )}

          {!loading && players.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              РџРѕРєР° РЅРёРєРѕРіРѕ РЅРµС‚
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="leaderboard-list"
            >
              {players.map((p, i) => {
                const tab = TABS.find(t => t.id === activeTab)!;
                return (
                  <div
                    key={p.id}
                    className={`leaderboard-row ${i < 3 ? 'top-3' : ''}`}
                  >
                    <div className="lb-rank">
                      {getRankIcon(i)}
                    </div>
                    {p.photoUrl ? (
                      <img src={p.photoUrl} alt="" className="lb-avatar" />
                    ) : (
                      <div className="lb-avatar-placeholder">
                        {(p.firstName?.[0] || 'Р“').toUpperCase()}
                      </div>
                    )}
                    <div className="lb-info">
                      <div className="lb-name">
                        {[p.firstName, p.lastName].filter(Boolean).join(' ') || p.username || 'Р“РѕРЅС‰РёРє'}
                      </div>
                      {p.username && <div className="lb-username">@{p.username}</div>}
                    </div>
                    <div
                      className="lb-value"
                      style={{ color: tab.color }}
                    >
                      {getValue(p, activeTab)}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
```

### src/components/LeagueBadge.tsx
```tsx
// src/components/LeagueBadge.tsx
import { motion } from 'framer-motion';
import { getLeagueByPoints, getLeagueProgress, getNextLeague } from '../config/leagues';
import { useGameStore } from '../store/gameStore';

export const LeagueBadge = () => {
  const leaguePoints = useGameStore((s) => s.user?.leaguePoints ?? 0);
  const league = getLeagueByPoints(leaguePoints);
  const progress = getLeagueProgress(leaguePoints);
  const next = getNextLeague(league.id);

  return (
    <motion.div
      className="league-badge"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="league-badge-content">
        <span className="league-badge-icon">{league.icon}</span>
        <div className="league-badge-info">
          <span className="league-badge-name" style={{ color: league.color }}>
            {league.name}
          </span>
          <span className="league-badge-points">
            {leaguePoints} РѕС‡РєРѕРІ
            {next && ` В· РґРѕ ${next.name}: ${Math.max(0, next.minPoints - leaguePoints)}`}
          </span>
        </div>
      </div>
      
      {/* РџРѕР»РѕСЃР° РїСЂРѕРіСЂРµСЃСЃР° (РѕРїС†РёРѕРЅР°Р»СЊРЅРѕ, РјРѕР¶РЅРѕ РѕСЃС‚Р°РІРёС‚СЊ РґР»СЏ РІРёР·СѓР°Р»Р°) */}
      <div className="league-badge-progress">
        <motion.div
          className="league-badge-progress-fill"
          style={{ background: league.gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};
```

### src/components/LevelRewardModal.tsx
```tsx
// src/components/LevelRewardModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coins, Star, Package, Sparkles, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import '../styles/levelReward.css';

interface LevelRewardModalProps {
  onClose: () => void;
  onClaimed?: () => void;
}

export const LevelRewardModal = ({ onClose, onClaimed }: LevelRewardModalProps) => {
  const claimLevelReward = useGameStore((s) => s.claimLevelReward);
  const user = useGameStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleClaim = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await claimLevelReward();
      if (res.success) {
        playSound('coin');
        WebApp.HapticFeedback?.notificationOccurred('success');
        setResult(res);
        onClaimed?.();
      } else {
        WebApp.HapticFeedback?.notificationOccurred('error');
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentLevel = Math.floor(Math.sqrt((user?.xp || 0) / 100)) + 1;

  return (
    <div className="level-reward-overlay" onClick={result ? onClose : undefined}>
      <motion.div
        className="level-reward-content"
        initial={{ scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.7, y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Р”РµРєРѕСЂР°С‚РёРІРЅС‹Рµ РёСЃРєСЂС‹ */}
        {!result && (
          <>
            <motion.div
              className="sparkle sparkle-1"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={20} color="#ffd700" />
            </motion.div>
            <motion.div
              className="sparkle sparkle-2"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles size={16} color="#00e5ff" />
            </motion.div>
          </>
        )}

        {/* Р—РђР“РћР›РћР’РћРљ */}
        <div className="level-reward-header">
          <Trophy size={48} color="#ffd700" strokeWidth={2.5} />
          <h2>{result ? 'РџРћР—Р”Р РђР’Р›РЇР•Рњ!' : 'РќРћР’Р«Р™ РЈР РћР’Р•РќР¬!'}</h2>
          <div className="level-badge-big">LVL {currentLevel}</div>
        </div>

        {/* РўР•Р›Рћ */}
        {!result ? (
          <>
            <p className="level-reward-subtitle">
              РўС‹ РґРѕСЃС‚РёРі РЅРѕРІРѕРіРѕ СѓСЂРѕРІРЅСЏ Рё Р·Р°СЃР»СѓР¶РёР» РЅР°РіСЂР°РґСѓ!
            </p>

            <button
              className="level-reward-btn"
              onClick={handleClaim}
              disabled={loading}
            >
              {loading ? 'Р—РђР“Р РЈР—РљРђ...' : 'Р—РђР‘Р РђРўР¬ РќРђР“Р РђР”РЈ'}
            </button>
          </>
        ) : (
          <>
            <p className="level-reward-subtitle">РўРІРѕРё РЅР°РіСЂР°РґС‹:</p>

            <div className="level-rewards-list">
              {result.totalRubles > 0 && (
                <div className="level-reward-item">
                  <div className="reward-item-icon" style={{ background: 'rgba(255,215,0,0.15)', borderColor: 'rgba(255,215,0,0.4)' }}>
                    <Coins size={22} color="#ffd700" />
                  </div>
                  <span className="reward-item-value">
                    +{result.totalRubles.toLocaleString('ru-RU')}
                    <span className="currency-ruble" style={{ marginLeft: 4 }}>в‚Ѕ</span>
                  </span>
                </div>
              )}

              {result.totalStars > 0 && (
                <div className="level-reward-item">
                  <div className="reward-item-icon" style={{ background: 'rgba(0,229,255,0.15)', borderColor: 'rgba(0,229,255,0.4)' }}>
                    <Star size={22} color="#00e5ff" />
                  </div>
                  <span className="reward-item-value">
                    +{result.totalStars} в­ђ
                  </span>
                </div>
              )}

              {result.caseType && (
                <div className="level-reward-item">
                  <div className="reward-item-icon" style={{ background: 'rgba(255,136,0,0.15)', borderColor: 'rgba(255,136,0,0.4)' }}>
                    <Package size={22} color="#ff8800" />
                  </div>
                  <span className="reward-item-value">
                    РљРµР№СЃ: <strong>{result.caseType === 'hourly' ? 'РћР±С‹С‡РЅС‹Р№' : result.caseType === 'rare' ? 'Р РµРґРєРёР№' : 'Р›РµРіРµРЅРґР°СЂРЅС‹Р№'}</strong>
                  </span>
                </div>
              )}
            </div>

            <button className="level-reward-btn" onClick={onClose}>
              РћРўР›РР§РќРћ!
            </button>
          </>
        )}

        {/* РљР Р•РЎРўРРљ */}
        <button className="level-reward-close" onClick={onClose}>
          <X size={18} />
        </button>
      </motion.div>
    </div>
  );
};
```

### src/components/LoadingScreen.tsx
```tsx
// src/components/LoadingScreen.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/loading.css';

const loadingTexts = [
  'РџР РћР“Р Р•Р’ РЁРРќ...',
  'Р—РђРџР РђР’РљРђ Р‘РђРљРђ...',
  'РџРћР”РљР›Р®Р§Р•РќРР• Рљ РЎР•Р Р’Р•Р РЈ...',
  'РЎРРќРҐР РћРќРР—РђР¦РРЇ Р”РђРќРќР«РҐ...',
  'РџРћР”Р“РћРўРћР’РљРђ Рљ Р—РђР•Р—Р”РЈ...'
];

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(100, prev + Math.floor(Math.random() * 2) + 3);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 500);
    return () => clearInterval(textInterval);
  }, []);

  return (
    <motion.div 
     className="loading-screen"
     initial={{ opacity: 1 }}
     exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: 0.3 } }}
     style={{ 
     position: 'fixed', inset: 0, zIndex: 9999,
     background: '#090A0C' // рџ‘€ Р”РѕР±Р°РІСЊ РїР»РѕС‚РЅС‹Р№ С„РѕРЅ
  }}
> 
      <div className="loading-bg" />
      <div className="loading-overlay" />

      <div className="loading-content">
        <motion.h1 
          className="loading-logo"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          RACING<span>IDLE</span>
        </motion.h1>

        <div className="loading-bar-container">
          <motion.div 
            className="loading-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="loading-info">
          <motion.span 
            key={textIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="loading-text"
          >
            {loadingTexts[textIndex]}
          </motion.span>
          <span className="loading-percent">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};
```

### src/components/PassScreen.tsx
```tsx
// src/components/PassScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Lock, Check, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { PASS_LEVELS, PassLevel } from '../config/pass';
import { playSound } from '../utils/sound';
import '../styles/pass.css';

const EMPTY_PASS = {
  xp: 0,
  isPremium: false,
  claimed: [] as number[],
  claimedPremium: [] as number[],
};

export const PassScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const getPass = useGameStore((s) => s.getPass);
  const claimPassReward = useGameStore((s) => s.claimPassReward);
  const buyPremiumPass = useGameStore((s) => s.buyPremiumPass);
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);

  useEffect(() => {
    getPass();
  }, [getPass]);

  const pass = user?.weeklyPass ?? EMPTY_PASS;
  const currentXp = pass.xp || 0;
  const isPremium = pass.isPremium || false;
  const claimed = pass.claimed || [];
  const claimedPremium = pass.claimedPremium || [];

  const handleClaim = async (level: number, track: 'free' | 'premium') => {
    setLoading(`${level}_${track}`);
    await claimPassReward(level, track);
    playSound('coin');
    setLoading(null);
  };

  const handleBuyPremium = async () => {
    setLoading('buy');
    const result = await buyPremiumPass();
    setLoading(null);
    setShowBuyConfirm(false);

    if (result.success) {
      playSound('coin');
    } else {
      alert(`РћС€РёР±РєР°: ${result.error}`);
    }
  };

  const maxedOut = !PASS_LEVELS.some((l) => currentXp < l.xpReq);
  const nextLevel =
    PASS_LEVELS.find((l) => currentXp < l.xpReq) || PASS_LEVELS[PASS_LEVELS.length - 1];
  const prevXpReq = nextLevel.level === 1 ? 0 : PASS_LEVELS[nextLevel.level - 2].xpReq;
  const progressPercent = maxedOut
    ? 100
    : Math.min(
        100,
        ((currentXp - prevXpReq) / (nextLevel.xpReq - prevXpReq)) * 100
      );
  const displayLevel = maxedOut
    ? PASS_LEVELS[PASS_LEVELS.length - 1].level
    : nextLevel.level - 1;

  return (
    <div className="pass-overlay" onClick={onClose}>
      <motion.div
        className="pass-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        style={{ willChange: 'transform' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* РЁР°РїРєР° */}
        <div className="pass-header">
          <h2>
            <Trophy size={18} color="var(--gold)" /> Р“РћРќРћР§РќР«Р™ РџР РћРџРЈРЎРљ
          </h2>
          <button className="pass-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* РџСЂРѕРіСЂРµСЃСЃ-Р±Р°СЂ */}
        <div className="pass-progress-section">
          <div className="pass-progress-header">
            <span className="pass-progress-level">РЈР . {displayLevel}</span>
            <span className="pass-progress-xp">
              {currentXp.toLocaleString('ru-RU')} /{' '}
              {nextLevel.xpReq.toLocaleString('ru-RU')} XP
            </span>
          </div>
          <div className="pass-progress-bar">
            <div
              className="pass-progress-fill"
              style={{
                width: `${progressPercent}%`,
                background: isPremium
                  ? 'linear-gradient(90deg, var(--gold), var(--gold-dim))'
                  : 'linear-gradient(90deg, var(--accent), var(--accent-dim))',
              }}
            />
          </div>
        </div>

        {/* РџСЂРµРјРёСѓРј-СЃС‚Р°С‚СѓСЃ / РєРЅРѕРїРєР° */}
        {isPremium ? (
          <div className="pass-premium-active">
            <Crown size={18} color="var(--gold)" />
            <span>РџР Р•РњРРЈРњ РђРљРўРР’Р•Рќ вЂ” x3 РќРђР“Р РђР”Р«</span>
          </div>
        ) : (
          <button
            className="pass-buy-premium"
            onClick={() => setShowBuyConfirm(true)}
            disabled={loading === 'buy'}
          >
            <Crown size={18} />
            {loading === 'buy' ? '...' : 'РљРЈРџРРўР¬ РџР Р•РњРРЈРњ вЂ” 500,000 в‚Ѕ'}
          </button>
        )}

        {/* РўР°Р±С‹ */}
        <div className="pass-tabs">
          <button
            className={`pass-tab free ${activeTab === 'free' ? 'active' : ''}`}
            onClick={() => setActiveTab('free')}
          >
            Р‘Р•РЎРџР›РђРўРќРћ
          </button>
          <button
            className={`pass-tab premium ${activeTab === 'premium' ? 'active' : ''}`}
            onClick={() => setActiveTab('premium')}
          >
            <Crown size={14} /> РџР Р•РњРРЈРњ
          </button>
        </div>

        {/* РЎРїРёСЃРѕРє СѓСЂРѕРІРЅРµР№ */}
        <div className="pass-body">
          {PASS_LEVELS.map((lvl: PassLevel) => {
            const isFreeClaimed = claimed.includes(lvl.level);
            const canClaimFree = currentXp >= lvl.xpReq && !isFreeClaimed;
            const isPremiumClaimed = claimedPremium.includes(lvl.level);
            const canClaimPremium =
              currentXp >= lvl.xpReq && !isPremiumClaimed && isPremium;
            const isUnlocked = currentXp >= lvl.xpReq;

            const showFree = activeTab === 'free';
            const showPremium = activeTab === 'premium';

            return (
              <div
                key={lvl.level}
                className={`pass-level ${isUnlocked ? 'unlocked' : 'locked'} ${
                  isPremium ? 'premium' : ''
                }`}
              >
                <div className="pass-level-header">
                  <div className={`pass-level-badge ${isUnlocked ? 'unlocked' : ''}`}>
                    {isUnlocked ? (
                      <Check size={14} color="#000" strokeWidth={3} />
                    ) : (
                      lvl.level
                    )}
                  </div>
                  <div className="pass-level-title">РЈР РћР’Р•РќР¬ {lvl.level}</div>
                  <div className="pass-level-req">
                    {isUnlocked ? 'вњ“' : <Lock size={12} />}
                    {lvl.xpReq.toLocaleString('ru-RU')} XP
                  </div>
                </div>

                {showFree && (
                  <div className="pass-reward free">
                    <div className="pass-reward-info">
                      <div className="pass-reward-label">Р‘Р•РЎРџР›РђРўРќРћ</div>
                      <div className="pass-reward-value">
                        {lvl.reward.toLocaleString('ru-RU')}
                        <span
                          className="currency-ruble sm"
                          style={{ marginLeft: 4 }}
                        >
                          в‚Ѕ
                        </span>
                      </div>
                    </div>
                    <button
                      className={`pass-claim-btn ${
                        isFreeClaimed ? 'claimed' : canClaimFree ? 'ready' : ''
                      }`}
                      onClick={() => handleClaim(lvl.level, 'free')}
                      disabled={!canClaimFree || loading === `${lvl.level}_free`}
                    >
                      {isFreeClaimed
                        ? 'вњ“ РџРћР›РЈР§Р•РќРћ'
                        : loading === `${lvl.level}_free`
                        ? '...'
                        : canClaimFree
                        ? 'Р—РђР‘Р РђРўР¬'
                        : 'Р—РђРљР Р«РўРћ'}
                    </button>
                  </div>
                )}

                {showPremium && (
                  <div className="pass-reward premium">
                    <div className="pass-reward-info">
                      <div className="pass-reward-label">
                        <Crown size={12} /> РџР Р•РњРРЈРњ (x3)
                      </div>
                      <div className="pass-reward-value gold">
                        {(lvl.reward * 3).toLocaleString('ru-RU')}
                        <span
                          className="currency-ruble sm"
                          style={{ marginLeft: 4 }}
                        >
                          в‚Ѕ
                        </span>
                      </div>
                    </div>
                    <button
                      className={`pass-claim-btn ${
                        isPremiumClaimed
                          ? 'claimed'
                          : canClaimPremium
                          ? 'ready-premium'
                          : ''
                      }`}
                      onClick={() => {
                        if (!isPremium) {
                          setShowBuyConfirm(true);
                          return;
                        }
                        handleClaim(lvl.level, 'premium');
                      }}
                      disabled={
                        isPremium &&
                        (!canClaimPremium || loading === `${lvl.level}_premium`)
                      }
                    >
                      {isPremiumClaimed ? (
                        'вњ“ РџРћР›РЈР§Р•РќРћ'
                      ) : !isPremium ? (
                        <>
                          <Lock size={12} /> РљРЈРџРРўР¬
                        </>
                      ) : loading === `${lvl.level}_premium` ? (
                        '...'
                      ) : canClaimPremium ? (
                        'Р—РђР‘Р РђРўР¬'
                      ) : (
                        'РќР•Рў XP'
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* РњРѕРґР°Р»РєР° РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ РїРѕРєСѓРїРєРё */}
      <AnimatePresence>
        {showBuyConfirm && (
          <motion.div
            className="pass-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBuyConfirm(false)}
          >
            <motion.div
              className="pass-confirm-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Crown size={48} color="var(--gold)" />
              <h3>РљРЈРџРРўР¬ РџР Р•РњРРЈРњ?</h3>
              <p>500,000 в‚Ѕ Р·Р° С…3 РЅР°РіСЂР°РґС‹</p>
              <div className="pass-confirm-actions">
                <button
                  className="pass-confirm-cancel"
                  onClick={() => setShowBuyConfirm(false)}
                >
                  РћРўРњР•РќРђ
                </button>
                <button
                  className="pass-confirm-buy"
                  onClick={handleBuyPremium}
                  disabled={loading === 'buy'}
                >
                  {loading === 'buy' ? '...' : 'РљРЈРџРРўР¬'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### src/components/ProfileScreen.tsx
```tsx
// src/components/ProfileScreen.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, Star, Car, Trophy, Gift, History, 
  TrendingUp, MousePointerClick, Flag, Building2, Sparkles, ChevronRight, Lock, Check
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ReferralScreen } from './ReferralScreen';
import { HistoryModal } from './HistoryModal';
import { AchievementsScreen } from './AchievementsScreen';
import { LevelRewardModal } from './LevelRewardModal';
import { CARS } from '../config/cars';
import { getLeagueByPoints } from '../config/leagues';
import { LEVEL_REWARDS, calcLevel } from '../config/levelRewards';
import { CATEGORY_META, TIER_META } from '../config/achievements';
import * as LucideIcons from 'lucide-react';
import '../styles/profile.css';

const calcLevelInfo = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpNextLevel = Math.pow(level, 2) * 100;
  const progress = Math.min(100, Math.max(0, ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100));
  return { level, xpCurrentLevel, xpNextLevel, progress };
};

const renderLucideIcon = (name: string, size = 20, color = 'currentColor') => {
  const IconComponent = (LucideIcons as any)[name] || Trophy;
  return <IconComponent size={size} color={color} strokeWidth={2} />;
};

export const ProfileScreen = () => {
  const user = useGameStore((state) => state.user);
  const achievementsList = useGameStore((state) => state.achievementsList);
  const getAchievements = useGameStore((state) => state.getAchievements);

  const earnedClicks = useGameStore((state) => state.user?.earnedFromClicks || 0);
  const earnedRaces = useGameStore((state) => state.user?.earnedFromRaces || 0);
  const earnedBusiness = useGameStore((state) => state.user?.earnedFromBusiness || 0);
  const totalRaces = useGameStore((state) => state.user?.totalRaces || 0);
  const totalWins = useGameStore((state) => state.user?.totalWins || 0);
  const totalLosses = useGameStore((state) => state.user?.totalLosses || 0);
  const totalClicks = useGameStore((state) => state.user?.totalClicks || 0);
  
  const [showReferral, setShowReferral] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLevelReward, setShowLevelReward] = useState(false);

  useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  // рџ‘‡ 3 РїРѕСЃР»РµРґРЅРёС… СЂР°Р·Р±Р»РѕРєРёСЂРѕРІР°РЅРЅС‹С… РёР»Рё Р±Р»РёР¶Р°Р№С€РёС… Рє СЂР°Р·Р±Р»РѕРєРёСЂРѕРІРєРµ
  const recentAchievements = useMemo(() => {
    if (!achievementsList.length) return [];
    
    // РЎРЅР°С‡Р°Р»Р° С‚Рµ, С‡С‚Рѕ РіРѕС‚РѕРІС‹ Р·Р°Р±СЂР°С‚СЊ (isCompleted && !isUnlocked)
    const claimable = achievementsList.filter((a: any) => a.isCompleted && !a.isUnlocked);
    // РџРѕС‚РѕРј СѓР¶Рµ РїРѕР»СѓС‡РµРЅРЅС‹Рµ (isUnlocked)
    const unlocked = achievementsList.filter((a: any) => a.isUnlocked);
    // РџРѕС‚РѕРј РІ РїСЂРѕС†РµСЃСЃРµ
    const inProgress = achievementsList.filter((a: any) => !a.isCompleted && !a.isUnlocked);

    const combined = [...claimable, ...unlocked, ...inProgress];
    return combined.slice(0, 3);
  }, [achievementsList]);

  if (!user) {
    return (
      <div className="profile-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Р—Р°РіСЂСѓР·РєР°...</div>
      </div>
    );
  }

  const { level, xpCurrentLevel, xpNextLevel, progress } = calcLevelInfo(user.xp || 0);
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Р“РѕРЅС‰РёРє';
  const activeCar = CARS[user.activeCarId] || CARS['vaz-2107'];
  const league = getLeagueByPoints(user.leaguePoints || 0);

  const joinDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const unclaimedCount = achievementsList.filter((a: any) => a.isCompleted && !a.isUnlocked).length;
  const winRate = totalRaces > 0 ? Math.round((totalWins / totalRaces) * 100) : 0;
  const winRateColor = winRate >= 50 ? 'var(--success)' : winRate >= 30 ? '#ffcc00' : 'var(--danger)';
  const winRateGlow = winRate >= 50 ? 'var(--success-glow)' : winRate >= 30 ? 'rgba(255,204,0,0.4)' : 'var(--danger-glow)';

  const lastClaimed = user.lastClaimedLevel || 1;
  const currentLevelNum = calcLevel(user.xp || 0);
  const hasLevelReward = currentLevelNum > lastClaimed && 
    LEVEL_REWARDS.some(r => r.level > lastClaimed && r.level <= currentLevelNum);

  return (
    <motion.div className="profile-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="profile-content">
        
        {/* === РЁРђРџРљРђ === */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={displayName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">{displayName[0]?.toUpperCase() || 'Р“'}</div>
            )}
            <div className="level-badge">
              LVL {level}
              {hasLevelReward && (
                <span 
                  onClick={() => setShowLevelReward(true)}
                  style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'var(--gold)', color: '#000',
                    fontSize: 11, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 10px var(--gold)', cursor: 'pointer',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                >!</span>
              )}
            </div>
          </div>
          <h1 className="profile-name">{displayName}</h1>
          {user.username && <p className="profile-username">@{user.username}</p>}
        </div>

        {/* XP-Р±Р°СЂ */}
        <div className="xp-section">
          <div className="xp-labels">
            <span className="xp-label-title">РћРџР«Рў</span>
            <span className="xp-label-value">
              {Math.max(0, Math.floor((user.xp || 0) - xpCurrentLevel))} / {xpNextLevel - xpCurrentLevel} XP
            </span>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* РќРђР“Р РђР”Рђ Р—Рђ РЈР РћР’Р•РќР¬ */}
        {hasLevelReward && (
          <button
            className="profile-menu-btn"
            onClick={() => setShowLevelReward(true)}
            style={{
              borderColor: 'var(--gold)',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 136, 0, 0.05))',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }}
          >
            <span className="menu-icon" style={{ background: 'rgba(255, 215, 0, 0.15)', borderColor: 'rgba(255, 215, 0, 0.4)' }}>
              <Sparkles size={20} color="var(--gold)" />
            </span>
            <div className="menu-text">
              <span className="menu-title" style={{ color: 'var(--gold)' }}>РќРђР“Р РђР”Рђ Р—Рђ РЈР РћР’Р•РќР¬!</span>
              <span className="menu-sub">LVL {currentLevelNum} вЂ” Р·Р°Р±РµСЂРё РЅР°РіСЂР°РґСѓ</span>
            </div>
            <span className="menu-arrow" style={{ color: 'var(--gold)' }}>вЂє</span>
          </button>
        )}

        {/* === РЎРўРђРўРРЎРўРРљРђ Р”РћРҐРћР”Рђ === */}
        <div className="profile-card income-card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={16} color="var(--accent)" />
              <span>РЎРўРђРўРРЎРўРРљРђ Р”РћРҐРћР”Рђ</span>
            </div>
            <button className="card-action" onClick={() => setShowHistory(true)}>
              <History size={14} /> РРЎРўРћР РРЇ
            </button>
          </div>
          <div className="income-list">
            <div className="income-row">
              <div className="income-label"><MousePointerClick size={14} color="#00e5ff" /> РЎ РєР»РёРєРѕРІ</div>
              <div className="income-value">{earnedClicks.toLocaleString('ru-RU')} <span className="currency-ruble sm">в‚Ѕ</span></div>
            </div>
            <div className="income-row">
              <div className="income-label"><Flag size={14} color="#ffd700" /> РЎ РіРѕРЅРѕРє</div>
              <div className="income-value">{earnedRaces.toLocaleString('ru-RU')} <span className="currency-ruble sm">в‚Ѕ</span></div>
            </div>
            <div className="income-row">
              <div className="income-label"><Building2 size={14} color="var(--success)" /> РЎ Р±РёР·РЅРµСЃР°</div>
              <div className="income-value">{earnedBusiness.toLocaleString('ru-RU')} <span className="currency-ruble sm">в‚Ѕ</span></div>
            </div>
          </div>
        </div>

        {/* Р‘РђР›РђРќРЎ Р Р—Р’РЃР—Р”Р« */}
        <div className="profile-grid-2">
          <div className="profile-card mini-card">
            <div className="mini-icon" style={{ background: 'rgba(255, 204, 0, 0.1)', borderColor: 'rgba(255, 204, 0, 0.3)' }}><Coins size={20} color="#ffcc00" /></div>
            <div className="mini-info">
              <span className="mini-label">Р‘РђР›РђРќРЎ</span>
              <span className="mini-value">{user.balance.toLocaleString('ru-RU')} <span className="currency-ruble sm">в‚Ѕ</span></span>
            </div>
          </div>
          <div className="profile-card mini-card">
            <div className="mini-icon" style={{ background: 'rgba(0, 229, 255, 0.1)', borderColor: 'rgba(0, 229, 255, 0.3)' }}><Star size={20} color="var(--accent)" /></div>
            <div className="mini-info">
              <span className="mini-label">Р—Р’РЃР—Р”Р«</span>
              <span className="mini-value">{user.starsBalance}</span>
            </div>
          </div>
        </div>

        {/* Р›РР“Рђ Р РњРђРЁРРќРђ */}
        <div className="profile-grid-2">
          <div className="profile-card mini-card">
            <div className="mini-icon" style={{ background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}><Trophy size={20} color="#ffd700" /></div>
            <div className="mini-info">
              <span className="mini-label">{league.name}</span>
              <span className="mini-value">{user.leaguePoints || 0} РћР§Рљ.</span>
            </div>
          </div>
          <div className="profile-card mini-card">
            <div className="mini-icon" style={{ background: 'rgba(0, 217, 126, 0.1)', borderColor: 'rgba(0, 217, 126, 0.3)' }}><Car size={20} color="var(--success)" /></div>
            <div className="mini-info">
              <span className="mini-label">РњРђРЁРРќРђ</span>
              <span className="mini-value" style={{ fontSize: '12px' }}>{activeCar.name}</span>
            </div>
          </div>
        </div>

        {/* РР“Р РћР’РђРЇ РЎРўРђРўРРЎРўРРљРђ */}
        <div className="profile-card game-stats-card">
          <div className="game-stat">
            <div className="game-stat-icon"><MousePointerClick size={18} color="#00e5ff" /></div>
            <div className="game-stat-value">{totalClicks.toLocaleString('ru-RU')}</div>
            <div className="game-stat-label">РљР›РРљРћР’</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon"><Flag size={18} color="#ffd700" /></div>
            <div className="game-stat-value">{totalRaces}</div>
            <div className="game-stat-label">Р“РћРќРћРљ</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon"><Trophy size={18} color="var(--success)" /></div>
            <div className="game-stat-value" style={{ color: 'var(--success)' }}>{totalWins}</div>
            <div className="game-stat-label">РџРћР‘Р•Р”</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon"><Flag size={18} color="var(--danger)" /></div>
            <div className="game-stat-value" style={{ color: 'var(--danger)' }}>{totalLosses}</div>
            <div className="game-stat-label">РџРћР РђР–Р•РќРР™</div>
          </div>
        </div>

        {/* WINRATE */}
        <div className="profile-card winrate-card">
          <div className="winrate-label"><TrendingUp size={16} /> WINRATE</div>
          <div className="winrate-value" style={{ color: winRateColor, textShadow: `0 0 12px ${winRateGlow}` }}>
            {winRate}%
          </div>
        </div>

        {/* рџ‘‡ РџРћРЎР›Р•Р”РќРР• Р”РћРЎРўРР–Р•РќРРЇ */}
        {recentAchievements.length > 0 && (
          <div className="profile-card recent-achievements-card">
            <div className="card-header">
              <div className="card-title">
                <Trophy size={16} color="var(--gold)" />
                <span>РџРћРЎР›Р•Р”РќРР• Р”РћРЎРўРР–Р•РќРРЇ</span>
              </div>
              <button className="card-action" onClick={() => setShowAchievements(true)}>
                Р’РЎР• <ChevronRight size={14} />
              </button>
            </div>
            <div className="recent-achievements-list">
              {recentAchievements.map((ach: any) => {
                const isUnlocked = ach.isUnlocked;
                const isClaimable = ach.isCompleted && !isUnlocked;
                const categoryMeta = CATEGORY_META[ach.category as keyof typeof CATEGORY_META] || CATEGORY_META.wealth;
                const tierMeta = TIER_META[ach.tier as 1|2|3|4|5] || TIER_META[1];

                return (
                  <div key={ach.id} className={`recent-ach-item ${isUnlocked ? 'unlocked' : ''} ${isClaimable ? 'claimable' : ''}`}>
                    <div 
                      className={`recent-ach-icon ${isUnlocked ? 'unlocked' : ''} ${isClaimable ? 'claimable' : ''}`}
                      style={{
                        background: isUnlocked 
                          ? 'rgba(0, 217, 126, 0.15)' 
                          : isClaimable 
                            ? 'rgba(255, 215, 0, 0.15)'
                            : `${categoryMeta.color}15`,
                        borderColor: isUnlocked 
                          ? 'rgba(0, 217, 126, 0.4)' 
                          : isClaimable 
                            ? 'rgba(255, 215, 0, 0.5)'
                            : `${categoryMeta.color}44`,
                      }}
                    >
                      {isUnlocked ? (
                        <Check size={18} color="var(--success)" strokeWidth={3} />
                      ) : isClaimable ? (
                        renderLucideIcon(ach.icon, 18, 'var(--gold)')
                      ) : (
                        <Lock size={16} color={categoryMeta.color} />
                      )}
                    </div>
                    <div className="recent-ach-info">
                      <div className="recent-ach-name">{ach.name}</div>
                      <div className="recent-ach-meta">
                        <span 
                          className="recent-ach-tier"
                          style={{ color: tierMeta.color, borderColor: `${tierMeta.color}44` }}
                        >
                          {tierMeta.name}
                        </span>
                        <span className="recent-ach-reward">
                          {ach.reward.toLocaleString('ru-RU')} <span className="currency-ruble sm">в‚Ѕ</span>
                        </span>
                      </div>
                    </div>
                    {isClaimable && <span className="recent-ach-badge">!</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* РљРќРћРџРљР */}
        <button className="profile-menu-btn" onClick={() => setShowAchievements(true)} style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }}>
          <span className="menu-icon" style={{ background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}><Trophy size={20} color="#ffd700" /></span>
          <span className="menu-title" style={{ color: '#ffd700' }}>Р”РћРЎРўРР–Р•РќРРЇ</span>
          {unclaimedCount > 0 && <span className="menu-badge">{unclaimedCount}</span>}
          <span className="menu-arrow">вЂє</span>
        </button>

        <button className="profile-menu-btn" onClick={() => setShowReferral(true)}>
          <span className="menu-icon"><Gift size={20} color="var(--accent)" /></span>
          <div className="menu-text">
            <span className="menu-title">РџР РР“Р›РђРЎРРўР¬ Р”Р РЈР“Рђ</span>
            <span className="menu-sub">Р—Р°СЂР°Р±РѕС‚Р°РЅРѕ: {(user.referralEarnings || 0).toLocaleString('ru-RU')} <span className="currency-ruble sm">в‚Ѕ</span></span>
          </div>
          <span className="menu-arrow">вЂє</span>
        </button>

        {/* РРќР¤Рћ */}
        <div className="profile-card info-card">
          <div className="info-row">
            <span className="info-label">Telegram ID</span>
            <span className="info-value">{user.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Р”Р°С‚Р° СЂРµРіРёСЃС‚СЂР°С†РёРё</span>
            <span className="info-value">{joinDate}</span>
          </div>
          <div className="info-row">
            <span className="info-label">РЎС‚Р°С‚СѓСЃ</span>
            <span className="info-value" style={{ color: 'var(--success)', textShadow: '0 0 8px var(--success-glow)' }}>в—Џ РђРєС‚РёРІРµРЅ</span>
          </div>
        </div>

      </div>

      {showReferral && <ReferralScreen onClose={() => setShowReferral(false)} />}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showAchievements && <AchievementsScreen onClose={() => setShowAchievements(false)} />}
      {showLevelReward && (
        <LevelRewardModal 
          onClose={() => setShowLevelReward(false)} 
        />
      )}
    </motion.div>
  );
};
```

### src/components/QuestModal.tsx
```tsx
// src/components/QuestModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointerClick, Flag, Coins, Zap, Trophy, X, Check
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import '../styles/quests.css';

interface Props {
  onClose: () => void;
}

// рџ‘‡ 5 Р·Р°РґР°РЅРёР№ СЃ XP
const QUESTS_INFO = [
  { id: 'click_1000', title: 'РљР»РёРєРµСЂ',        desc: 'РЎРґРµР»Р°Р№ 1000 РєР»РёРєРѕРІ',    target: 1000, reward: 5000,  rewardXp: 25,  icon: MousePointerClick, color: '#00e5ff' },
  { id: 'win_3',      title: 'Р“РѕРЅС‰РёРє',        desc: 'Р’С‹РёРіСЂР°Р№ 3 РіРѕРЅРєРё',        target: 3,    reward: 15000, rewardXp: 50,  icon: Flag,              color: '#ffd700' },
  { id: 'sell_5',     title: 'Р‘Р°СЂР°С…РѕР»РєР°',     desc: 'РџСЂРѕРґР°Р№ 5 РїСЂРµРґРјРµС‚РѕРІ',     target: 5,    reward: 5000,  rewardXp: 15,  icon: Coins,             color: '#00d97e' },
  { id: 'click_5000', title: 'РљР»РёРєРµСЂ-РјР°СЃС‚РµСЂ', desc: 'РЎРґРµР»Р°Р№ 5000 РєР»РёРєРѕРІ',     target: 5000, reward: 25000, rewardXp: 100, icon: Zap,               color: '#ff8800' },
  { id: 'win_5',      title: 'Р§РµРјРїРёРѕРЅ',       desc: 'Р’С‹РёРіСЂР°Р№ 5 РіРѕРЅРѕРє',        target: 5,    reward: 50000, rewardXp: 150, icon: Trophy,            color: '#ff4444' },
];

export const QuestModal: React.FC<Props> = ({ onClose }) => {
  const claimQuest = useGameStore((s) => s.claimQuest);
  const [quests, setQuests] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initData = WebApp.initData || '';
    fetch('/api/game?action=getQuests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setQuests(data.quests);
        else setError(true);
      })
      .catch(() => setError(true));
  }, []);

  const handleClaim = async (questId: string) => {
    setLoadingId(questId);
    const newQuests = await claimQuest(questId);
    if (newQuests) {
      setQuests(newQuests);
      playSound('coin');
      WebApp.HapticFeedback?.notificationOccurred('success');
    }
    setLoadingId(null);
  };

  return (
    <div className="quest-overlay" onClick={onClose}>
      <motion.div
        className="quest-content"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quest-header">
          <h2>
            <Trophy size={18} color="var(--gold)" /> Р•Р–Р•Р”РќР•Р’РќР«Р• Р—РђР”РђРќРРЇ
          </h2>
          <button className="quest-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="quest-body">
          {!quests && !error && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              Р—Р°РіСЂСѓР·РєР° Р·Р°РґР°РЅРёР№...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '40px 0' }}>
              РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё. РџРѕРїСЂРѕР±СѓР№ РїРѕР·Р¶Рµ.
            </div>
          )}

          {quests && QUESTS_INFO.map((q) => {
            const progress = quests.progress?.[q.id] || 0;
            const isCompleted = progress >= q.target;
            const isClaimed = quests.claimed?.[q.id];
            const progressPercent = Math.min(100, (progress / q.target) * 100);
            const Icon = q.icon;

            return (
              <div key={q.id} className={`quest-card ${isCompleted ? 'completed' : ''} ${isClaimed ? 'claimed' : ''}`}>
                <div className="quest-icon-wrapper" style={{ background: `${q.color}15`, borderColor: `${q.color}44` }}>
                  {isClaimed ? (
                    <Check size={22} color="var(--success)" strokeWidth={3} />
                  ) : (
                    <Icon size={22} color={q.color} />
                  )}
                </div>

                <div className="quest-info">
                  <div className="quest-title-row">
                    <span className="quest-title">{q.title}</span>
                    <span className="quest-reward">
                      +{q.reward.toLocaleString('ru-RU')} <span className="currency-ruble sm">в‚Ѕ</span>
                      <span className="quest-reward-xp">+{q.rewardXp} XP</span>
                    </span>
                  </div>
                  <div className="quest-desc">{q.desc}</div>

                  <div className="quest-progress-bar">
                    <div
                      className="quest-progress-fill"
                      style={{
                        width: `${progressPercent}%`,
                        background: isCompleted
                          ? 'linear-gradient(90deg, var(--success), var(--success-dim))'
                          : `linear-gradient(90deg, ${q.color}, ${q.color}88)`,
                        boxShadow: `0 0 8px ${isCompleted ? 'var(--success-glow)' : `${q.color}66`}`,
                      }}
                    />
                  </div>

                  <div className="quest-footer">
                    <span className="quest-progress-text">
                      {progress.toLocaleString('ru-RU')} / {q.target.toLocaleString('ru-RU')}
                    </span>
                    {isClaimed ? (
                      <span className="quest-status done">РџРћР›РЈР§Р•РќРћ</span>
                    ) : isCompleted ? (
                      <button
                        className="quest-claim-btn"
                        onClick={() => handleClaim(q.id)}
                        disabled={loadingId === q.id}
                      >
                        {loadingId === q.id ? '...' : 'Р—РђР‘Р РђРўР¬'}
                      </button>
                    ) : (
                      <span className="quest-status progress">Р’ РџР РћР¦Р•РЎРЎР•</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
```

### src/components/RaceScreen.tsx
```tsx
// src/components/RaceScreen.tsx
import React, { useCallback, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ClipboardList, Flag } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { PAINT_COLORS } from '../config/garage';
import { CARS } from '../config/cars';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import { QuestModal } from './QuestModal';
import { PassScreen } from './PassScreen';
import { TintedCarImage } from './TintedCarImage';
import '../styles/race.css';
import '../styles/races.css';

const FLASH_DURATION_MS = 110;

interface FloatingText {
  id: number;
  x: number;
  y: number;
  value: number;
}

const CarClicker = memo(({ 
  isFlashing, 
  isRejected, 
  carColor, 
  activeCar, 
  carStyles, 
  onPointerDown 
}: any) => {
  const activeColorHex = PAINT_COLORS.find((c: any) => c.id === carColor)?.hex || 'transparent';
  const isPlaceholder = !activeCar.image || activeCar.image.includes('placeholder');

  return (
    <div
      className={`race-car-container ${isRejected ? 'rejected' : ''}`}
      onPointerDown={onPointerDown}
      style={carStyles}
    >
      <motion.div
        whileTap={{ scale: 0.96 }}
        className="race-car-wrapper"
        style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <span style={{ 
          fontSize: '120px', position: 'absolute', zIndex: 0,
          opacity: isPlaceholder ? 1 : 0, transition: 'opacity 0.3s ease'
        }}>
          рџЏЋпёЏ
        </span>

        {!isPlaceholder && (
          <TintedCarImage
            imageUrl={activeCar.image}
            colorHex={activeColorHex}
            className="race-car-image"
            style={{
              filter: 'none',
              transition: 'opacity 0.3s ease',
              position: 'relative', zIndex: 1
            }}
          />
        )}
      </motion.div>
    </div>
  );
});

export function RaceScreen() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rejectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textIdCounter = useRef(0);

  const tap = useGameStore((s) => s.tap);
  const balance = useGameStore((s) => s.balance); 
  const carColor = useGameStore((s) => s.carColor);
  
  const user = useGameStore((s) => s.user);
  const upgradeClicker = useGameStore((s) => s.upgradeClicker);
  const upgradeOffline = useGameStore((s) => s.upgradeOffline);

  const xp = user?.xp || 0;
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpNextLevel = Math.pow(level, 2) * 100;
  const progress = Math.min(100, Math.max(0, ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100));

  const activeCarId = user?.activeCarId || 'vaz-2107';
  const activeCar = CARS[activeCarId] || CARS['vaz-2107'];

  const clickLevel = user?.clickLevel || 1;
  const offlineLevel = user?.offlineLevel || 1;
  const clickCost = Math.floor(1000 * Math.pow(1.5, clickLevel - 1));
  const offlineCost = Math.floor(5000 * Math.pow(1.8, offlineLevel - 1));

  const canUpgrade = balance >= clickCost || balance >= offlineCost;
  const hasPassRewards = false; // Р·Р°РіР»СѓС€РєР°

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const before = useGameStore.getState().balance;
    tap();
    const after = useGameStore.getState().balance;
    const accepted = after > before;

    if (accepted) {
      playSound('click');
      try { WebApp.HapticFeedback?.impactOccurred('light'); } catch {}

      setIsFlashing(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setIsFlashing(false), FLASH_DURATION_MS);

      const newText: FloatingText = {
        id: textIdCounter.current++,
        x: e.clientX,
        y: e.clientY - 50,
        value: clickLevel
      };
      
      setFloatingTexts(prev => [...prev, newText]);

      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
      }, 800);

    } else {
      setIsRejected(true);
      if (rejectTimer.current) clearTimeout(rejectTimer.current);
      rejectTimer.current = setTimeout(() => setIsRejected(false), 160);
    }
  }, [tap, clickLevel]);

  const carStyles = {
    '--left-hl-x': activeCar.leftHeadlight?.x || '30%',
    '--left-hl-y': activeCar.leftHeadlight?.y || '50%',
    '--right-hl-x': activeCar.rightHeadlight?.x || '70%',
    '--right-hl-y': activeCar.rightHeadlight?.y || '50%',
  } as React.CSSProperties;

  return (
    <div className="race-screen">
      <div className="race-scene">
        <div className="race-background" />
        <div className="race-background-overlay" />

        <AnimatePresence>
          {floatingTexts.map(text => (
            <motion.div
              key={text.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -120, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: 'fixed',
                left: text.x,
                top: text.y,
                color: 'var(--gold)',
                fontSize: '24px',
                fontWeight: '900',
                fontFamily: 'Impact, sans-serif',
                textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255,215,0,0.6)',
                pointerEvents: 'none',
                zIndex: 9999,
                userSelect: 'none',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              +{text.value} <span className="currency-ruble">в‚Ѕ</span>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="race-top-ui">
          <div className="race-hud">
            <span className="race-hud-coins">{Math.floor(balance).toLocaleString('ru-RU')}</span>
            <span className="currency-ruble sm" style={{ marginLeft: 4 }}>в‚Ѕ</span>
          </div>
          <div className="race-level-bar-wrapper">
            <div className="race-level-text">
              <span>LVL {level}</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="race-xp-bar">
              <div className="race-xp-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <CarClicker 
          isFlashing={isFlashing}
          isRejected={isRejected}
          carColor={carColor}
          activeCar={activeCar}
          carStyles={carStyles}
          onPointerDown={handlePointerDown}
        />

        {/* Р’Р•Р РўРРљРђР›Р¬РќРђРЇ РџРђРќР•Р›Р¬ Р”Р•Р™РЎРўР’РР™ */}
        <div className="race-action-panel">
          <button
            onClick={() => setShowQuests(true)}
            className="race-action-btn"
            style={{ '--btn-color': '#ff8c00' } as any}
          >
            <ClipboardList size={22} />
            <span className="race-action-label">Р—Р°РґР°РЅРёСЏ</span>
          </button>

          <button
            onClick={() => setShowPass(true)}
            className="race-action-btn"
            style={{ '--btn-color': 'var(--accent)' } as any}
          >
            <Flag size={22} />
            <span className="race-action-label">РџСЂРѕРїСѓСЃРє</span>
            {hasPassRewards && <span className="race-action-badge">!</span>}
          </button>

          <button
            onClick={() => setShowUpgrades(true)}
            className="race-action-btn"
            style={{ '--btn-color': 'var(--success)' } as any}
          >
            <Zap size={22} />
            <span className="race-action-label">РђРїРіСЂРµР№Рґ</span>
            {canUpgrade && <span className="race-action-badge dot" />}
          </button>
        </div>

        {showQuests && <QuestModal onClose={() => setShowQuests(false)} />}
        {showPass && <PassScreen onClose={() => setShowPass(false)} />}

        {/* РњРћР”РђР›РљРђ РЈР›РЈР§РЁР•РќРР™ */}
        <AnimatePresence>
          {showUpgrades && (
            <motion.div
              className="race-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgrades(false)}
            >
              <motion.div
                className="race-modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="race-modal-header">
                  <h2>
                    <Zap size={18} color="var(--success)" /> РЈР›РЈР§РЁР•РќРРЇ
                  </h2>
                  <button className="race-modal-close" onClick={() => setShowUpgrades(false)}>
                    вњ•
                  </button>
                </div>

                <div className="race-modal-body">
                  <div className="race-upgrade-card">
                    <div className="race-upgrade-icon" style={{ background: 'rgba(0,217,126,0.15)', border: '1px solid rgba(0,217,126,0.3)' }}>
                      <Zap size={24} color="var(--success)" />
                    </div>
                    <div className="race-upgrade-info">
                      <div className="race-upgrade-title">РЎРёР»Р° РєР»РёРєР°</div>
                      <div className="race-upgrade-desc">+1 в‚Ѕ Р·Р° РєР»РёРє</div>
                      <div className="race-upgrade-level" style={{ color: 'var(--success)' }}>
                        РЈСЂРѕРІРµРЅСЊ: {clickLevel}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await upgradeClicker();
                        playSound('coin');
                      }}
                      disabled={balance < clickCost}
                      className="race-upgrade-buy"
                      style={{
                        background: balance >= clickCost ? 'linear-gradient(90deg, var(--success), var(--success-dim))' : '#333',
                        color: balance >= clickCost ? '#000' : '#666',
                      }}
                    >
                      {clickCost.toLocaleString('ru-RU')} в‚Ѕ
                    </button>
                  </div>

                  <div className="race-upgrade-card">
                    <div className="race-upgrade-icon" style={{ background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.3)' }}>
                      <Zap size={24} color="var(--accent)" />
                    </div>
                    <div className="race-upgrade-info">
                      <div className="race-upgrade-title">РћС„С„Р»Р°Р№РЅ-РґРѕС…РѕРґ</div>
                      <div className="race-upgrade-desc">+500 в‚Ѕ/С‡Р°СЃ</div>
                      <div className="race-upgrade-level" style={{ color: 'var(--accent)' }}>
                        РЈСЂРѕРІРµРЅСЊ: {offlineLevel}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await upgradeOffline();
                        playSound('coin');
                      }}
                      disabled={balance < offlineCost}
                      className="race-upgrade-buy"
                      style={{
                        background: balance >= offlineCost ? 'linear-gradient(90deg, var(--accent), var(--accent-dim))' : '#333',
                        color: balance >= offlineCost ? '#000' : '#666',
                      }}
                    >
                      {offlineCost.toLocaleString('ru-RU')} в‚Ѕ
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

### src/components/RacesScreen.tsx
```tsx
// src/components/RacesScreen.tsx
import { useState, useRef, useEffect, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound';
import { CARS } from '../config/cars';
import { simulateRacePhysics, CarPhysics } from '../utils/raceEngine';
import { getFinalCarStats } from '../utils/carStats';
import { LeagueBadge } from './LeagueBadge';
import { getLeagueByPoints, getNextLeague } from '../config/leagues';
import '../styles/races.css';

type RacePhase = 'idle' | 'racing' | 'finish';

const OPPONENT_NAMES = ['Turbo Rider', 'Neon Racer', 'NightRider', 'DriftKing', 'RoadRunner'];

export const RacesScreen = () => {
  const user = useGameStore((s) => s.user);
  const equipped = useGameStore((s) => s.equipped);
  const reportPvpResult = useGameStore((s) => s.reportPvpResult);
  const addLeaguePoints = useGameStore((s) => s.addLeaguePoints);
  
  const [view, setView] = useState<'menu' | 'racing' | 'result'>('menu');
  const [raceResult, setRaceResult] = useState<any>(null);
  const [racePhase, setRacePhase] = useState<RacePhase>('idle');
  const [leaguePointsEarned, setLeaguePointsEarned] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const raceStageRef = useRef<HTMLDivElement>(null);
  const playerCarRef = useRef<HTMLDivElement>(null);
  const opponentCarRef = useRef<HTMLDivElement>(null);
  const playerProgressRef = useRef<HTMLDivElement>(null);
  const opponentProgressRef = useRef<HTMLDivElement>(null);
  const hudSpeedTextRef = useRef<HTMLSpanElement>(null);
  const speedometerValueRef = useRef<HTMLSpanElement>(null);
  const speedometerFillRef = useRef<SVGCircleElement>(null);
  const speedLinesContainerRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const activeCarId = user?.activeCarId || 'vaz-2107';
  const activeCar = CARS[activeCarId] || CARS['vaz-2107'];
  
  // вљЎ Р¤РР—РРљРђ РР“Р РћРљРђ РЎ РЈР§РЃРўРћРњ РџР РћРљРђР§РљР
  const playerPhysics: CarPhysics = useMemo(
    () => getFinalCarStats(activeCar, equipped, user?.partUpgrades || {}),
    [activeCar, equipped, user?.partUpgrades]
  );

  // рџЋЇ РњРђРўР§РњР•Р™РљРРќР“ РџРћ Р Р•РђР›Р¬РќРћР™ РЎРљРћР РћРЎРўР
  const opponentData = useMemo(() => {
    const playerSpeed = playerPhysics.topSpeed;
    const candidates = Object.values(CARS).filter(c => c.id !== activeCar.id);

    let pool = candidates.filter(c => Math.abs(c.performance.topSpeed - playerSpeed) <= 40);
    if (pool.length === 0) {
      pool = [...candidates].sort((a, b) =>
        Math.abs(a.performance.topSpeed - playerSpeed) - Math.abs(b.performance.topSpeed - playerSpeed)
      ).slice(0, 5);
    }

    const rival = pool[Math.floor(Math.random() * pool.length)] || CARS['vaz-2107'];
    const rivalName = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];

    const jitter = (val: number, pct = 0.05) => val * (1 + (Math.random() - 0.5) * pct);

    return {
      car: rival,
      name: rivalName,
      physics: {
        power: jitter(rival.performance.power, 0.05),
        topSpeed: jitter(rival.performance.topSpeed, 0.05),
        accel: jitter(rival.performance.accel, 0.08),
        grip: rival.performance.grip,
        handling: rival.performance.grip,
      } as CarPhysics,
    };
  }, [playerPhysics.topSpeed, activeCar.id]);

  const opponentPhysics = opponentData.physics;
  const opponentCar = opponentData.car;

  const leaguePoints = user?.leaguePoints ?? 0;
  const league = getLeagueByPoints(leaguePoints);
  const nextLeague = getNextLeague(league.id);
  
  const playerCarImage = `/cars/side/${activeCarId}.png`;
  const opponentCarImage = `/cars/side/${opponentCar.id}.png`;

  useEffect(() => {
    if (view === 'menu') {
      if (playerCarRef.current) playerCarRef.current.style.transform = 'translate3d(0px, 0, 0)';
      if (opponentCarRef.current) opponentCarRef.current.style.transform = 'translate3d(0px, 0, 0)';
      if (playerProgressRef.current) playerProgressRef.current.style.width = '0%';
      if (opponentProgressRef.current) opponentProgressRef.current.style.width = '0%';
      if (hudSpeedTextRef.current) hudSpeedTextRef.current.textContent = '0';
      if (speedometerValueRef.current) speedometerValueRef.current.textContent = '0';
      if (speedometerFillRef.current) speedometerFillRef.current.style.strokeDashoffset = '283';
      
      playerCarRef.current?.classList.remove('max-speed-glow');
      opponentCarRef.current?.classList.remove('max-speed-glow');
      speedLinesContainerRef.current?.classList.remove('is-max');
      vignetteRef.current?.classList.remove('is-max');
    }
  }, [view]);

  const handleStartRace = () => {
    playSound('click');
    setView('racing');
    setRacePhase('racing');
    setLeaguePointsEarned(0);

    setTimeout(() => {
      const result = simulateRacePhysics(playerPhysics, opponentPhysics, opponentData.name);
      setRaceResult(result);
      startAnimation(result.ticks, result); 
    }, 1000);
  };

  const startAnimation = (ticks: any[], result: any) => {
    const duration = 4500;
    const startTime = performance.now();
    
    const stageWidth = raceStageRef.current?.clientWidth || 320;
    const carWidth = 120;
    const finishOffset = 60;
    
    const maxDistance = Math.max(180, stageWidth - carWidth - finishOffset);
    const isPlayerWinner = result.winner === 'player';
    
    const relativeGap = Math.abs(ticks[0].playerDist - ticks[0].opponentDist) / Math.max(1, ticks[0].playerDist, ticks[0].opponentDist);
    const finishGap = Math.min(92, 52 + relativeGap * 260);
    const loserDistance = Math.max(150, maxDistance - finishGap);
    
    const playerTarget = isPlayerWinner ? maxDistance : loserDistance;
    const opponentTarget = isPlayerWinner ? loserDistance : maxDistance;

    let nosTriggered = false;
    const nitroValue = activeCar.performance.nitro || 50;
    const nitroStart = 1 - (nitroValue / 100) * 0.35;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 2.4);
      
      const playerX = eased * playerTarget;
      const opponentX = eased * opponentTarget;
      
      if (playerCarRef.current) playerCarRef.current.style.transform = `translate3d(${playerX}px, 0, 0)`;
      if (opponentCarRef.current) opponentCarRef.current.style.transform = `translate3d(${opponentX}px, 0, 0)`;
      
      if (playerProgressRef.current) playerProgressRef.current.style.width = `${Math.min(100, (playerX / maxDistance) * 100)}%`;
      if (opponentProgressRef.current) opponentProgressRef.current.style.width = `${Math.min(100, (opponentX / maxDistance) * 100)}%`;

      const currentSpd = Math.round(playerPhysics.topSpeed * progress);
      if (hudSpeedTextRef.current) hudSpeedTextRef.current.textContent = currentSpd.toString();
      if (speedometerValueRef.current) speedometerValueRef.current.textContent = currentSpd.toString();
      
      if (speedometerFillRef.current) {
        const offset = 283 - (283 * (currentSpd / (playerPhysics.topSpeed || 1)));
        speedometerFillRef.current.style.strokeDashoffset = offset.toString();
      }

      if (progress > nitroStart && progress < 0.95) {
        if (!nosTriggered) {
          nosTriggered = true;
          playerCarRef.current?.classList.add('max-speed-glow');
          opponentCarRef.current?.classList.add('max-speed-glow');
          speedLinesContainerRef.current?.classList.add('is-max');
          vignetteRef.current?.classList.add('is-max');
        }
      } else {
        if (nosTriggered) {
          nosTriggered = false;
          playerCarRef.current?.classList.remove('max-speed-glow');
          opponentCarRef.current?.classList.remove('max-speed-glow');
          speedLinesContainerRef.current?.classList.remove('is-max');
          vignetteRef.current?.classList.remove('is-max');
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRacePhase('finish');
        
        const pointsDelta = isPlayerWinner ? league.winPoints : league.losePoints;
        setLeaguePointsEarned(pointsDelta);
        addLeaguePoints(pointsDelta);

        setTimeout(() => {
          setView('result');
      if (result.winner === 'player') playSound('win');
  
  // рџ‘‡ РџР•Р Р•Р”РђРЃРњ playerStats РћР‘РЇР—РђРўР•Р›Р¬РќРћ
      reportPvpResult({
      won: result.winner === 'player',
      ratingDelta: result.winner === 'player' ? 15 : -10,
      coinsDelta: result.winner === 'player' ? 3000 : 0,
      playerStats: {
      power: playerPhysics.power,
      topSpeed: playerPhysics.topSpeed,
      accel: playerPhysics.accel,
      grip: playerPhysics.grip,
      handling: playerPhysics.handling,
      rating: user?.rating || 100,
      opponentStats: {
        power: opponentPhysics.power,
        topSpeed: opponentPhysics.topSpeed,
        accel: opponentPhysics.accel,
        grip: opponentPhysics.grip,
        handling: opponentPhysics.handling,
        rating: user?.rating || 100,
      },
    },
  });
}, 400);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleBackToMenu = () => {
    setView('menu');
    setRacePhase('idle');
  };

  const fakeLeaderboard = [
    { id: 1, name: 'Turbo Rider', points: 1540, isMe: false },
    { id: 2, name: 'Dev (Р’С‹)', points: leaguePoints, isMe: true },
    { id: 3, name: 'Neon Racer', points: 1200, isMe: false },
    { id: 4, name: 'NightRider', points: 980, isMe: false },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="races-screen">
      <div className="races-header">
        <h2>РўР Р•Рљ</h2>
      </div>

      {view === 'menu' && (
        <div className="race-hub">
          <div className="race-hub-heading">
            <h1>Р“РѕРЅРєРё</h1>
            <p>Р’С‹Р±РµСЂРёС‚Рµ С„РѕСЂРјР°С‚ Рё РІС‹С…РѕРґРёС‚Рµ РЅР° СЃС‚Р°СЂС‚</p>
          </div>

          <button className="league-badge-button" onClick={() => setShowLeaderboard(true)}>
             <LeagueBadge />
          </button>

          <button className="race-mode-primary" onClick={handleStartRace}>
            <div className="race-mode-bg-glow"></div>
            <span className="race-icon">рџЏЃ</span>
            <div className="race-mode-info">
              <strong>Р‘С‹СЃС‚СЂР°СЏ РіРѕРЅРєР°</strong>
              <small>
                {activeCar.name} В· {playerPhysics.topSpeed} РєРј/С‡ В· {playerPhysics.power} Р».СЃ.
              </small>
            </div>
            <span className="race-mode-action">РќР°С‡Р°С‚СЊ Р·Р°РµР·Рґ</span>
          </button>

          <div className="race-extra-modes">
            <div className="race-extra-card">
              <span className="extra-icon">рџЏ†</span>
              <div>
                <strong>РўСѓСЂРЅРёСЂ</strong>
                <small>РЎРєРѕСЂРѕ</small>
              </div>
            </div>
            <div className="race-extra-card">
              <span className="extra-icon">вЏі</span>
              <div>
                <strong>РќР° РІСЂРµРјСЏ</strong>
                <small>РЎРєРѕСЂРѕ</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'racing' && (
        <div className="premium-race-container">
          <LeagueBadge />

          <div className="online-versus-card">
            <article className="racer-profile">
              <div className="racer-avatar">
                <img src={user?.photoUrl || ''} alt="" referrerPolicy="no-referrer" draggable="false" />
              </div>
              <div className="racer-meta">
                <small>Р’С‹</small>
                <strong>{user?.firstName || 'РРіСЂРѕРє'}</strong>
                <span>{activeCar.name}</span>
                <em>PX В· {playerPhysics.topSpeed} РєРј/С‡</em>
              </div>
            </article>

            <div className="versus-badge">VS</div>

            <article className="racer-profile enemy-profile found">
              <div className="racer-avatar enemy"><span>PX</span></div>
              <div className="racer-meta">
                <small>РЎРѕРїРµСЂРЅРёРє</small>
                <strong>{opponentData.name}</strong>
                <span>{opponentCar.name}</span>
                <em>PX В· {Math.round(opponentPhysics.topSpeed)} РєРј/С‡</em>
              </div>
            </article>
          </div>

          <div 
            ref={raceStageRef}
            className={`race-stage ${racePhase === 'racing' ? 'is-racing' : ''} ${racePhase === 'finish' ? 'is-finishing' : ''}`} 
            id="race-stage"
          >
            <div className="race-sky">
              <div className="race-sun"></div>
              <div className="race-city"></div>
            </div>
            
            <div className="race-horizon"></div>
            <div className="race-road-bg"></div>

            <div className="race-track-hud">
              <span>NEON SPRINT В· 1/4 РњРР›Р</span>
              <strong><span ref={hudSpeedTextRef}>0</span> РєРј/С‡</strong>
            </div>

            <div className="race-lane lane-one">
              <div className="lane-label">Р’Р« <span>{playerPhysics.topSpeed}</span></div>
              <div className="road-marks-inner"></div>
              <div className="finish-line-inner"></div>
              <div ref={playerCarRef} className="race-car" id="my-race-car">
                <img 
                  className="paintable-car paint-gloss" 
                  src={playerCarImage} 
                  alt={activeCar.name}
                  onError={(e) => { e.currentTarget.src = '/cars/side/vaz-2107.png'; }}
                />
              </div>
            </div>

            <div className="race-lane lane-two">
                <div className="lane-label">{opponentData.name.toUpperCase()} <span>{Math.round(opponentPhysics.topSpeed)}</span></div>
                <div className="road-marks-inner"></div>
                <div className="finish-line-inner"></div>
                <div ref={opponentCarRef} className="race-car enemy-car-sprite" id="enemy-race-car">
                <img 
                 src={opponentCarImage} 
                 alt={opponentCar.name} 
                 className="enemy-img"
                 onError={(e) => { e.currentTarget.src = '/cars/side/vaz-2107.png'; }}
                />
              </div>
            </div>

            <div className="race-side-barrier left"></div>
            <div className="race-side-barrier right"></div>

            <div ref={speedLinesContainerRef} className="speed-lines-container">
              <div className="speed-line"></div>
              <div className="speed-line"></div>
              <div className="speed-line"></div>
              <div className="speed-line"></div>
              <div className="speed-line"></div>
            </div>
            
            <div ref={vignetteRef} className="race-vignette"></div>

            <div className="speedometer">
              <svg className="speedometer-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="speedometer-track" />
                <circle 
                  ref={speedometerFillRef}
                  cx="50" cy="50" r="45" 
                  className="speedometer-fill" 
                  style={{ strokeDasharray: 283, strokeDashoffset: 283 }} 
                />
              </svg>
              <div className="speedometer-content">
                <span className="speedometer-value" ref={speedometerValueRef}>0</span>
                <span className="speedometer-unit">РєРј/С‡</span>
              </div>
            </div>

            <div className="race-guardrail"></div>
          </div>

          <div className="bottom-progress-bars">
            <div className="progress-row">
              <span className="progress-label">Р’Р«</span>
              <div className="progress-track">
                <div ref={playerProgressRef} className="progress-fill green" style={{ width: '0%' }} />
              </div>
            </div>
            <div className="progress-row">
              <span className="progress-label">РЎРћРџР•Р РќРРљ</span>
              <div className="progress-track">
                <div ref={opponentProgressRef} className="progress-fill red" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'result' && raceResult && (
        <div className="race-result-modal">
          <div className="race-result-content">
            <h2 className={raceResult.winner === 'player' ? 'win-text' : 'lose-text'}>
              {raceResult.winner === 'player' ? 'РџРћР‘Р•Р”Рђ!' : 'РџРћР РђР–Р•РќРР•'}
            </h2>

            <div className="league-result">
              <span className="league-result-icon">{league.icon}</span>
              <span className="league-result-label">{league.name}</span>
              <span className={`league-result-points ${leaguePointsEarned >= 0 ? 'positive' : 'negative'}`}>
                {leaguePointsEarned >= 0 ? '+' : ''}{leaguePointsEarned} РѕС‡РєРѕРІ
              </span>
            </div>

            {nextLeague && leaguePointsEarned > 0 && (
              <div className="league-next-hint">
                Р”Рѕ {nextLeague.name}: {Math.max(0, nextLeague.minPoints - (leaguePoints + leaguePointsEarned))} РѕС‡РєРѕРІ
              </div>
            )}

            <div className="race-log">
              {Array.isArray(raceResult.log) ? (
                raceResult.log.map((line: any, i: number) => (
                  <p key={i}>{typeof line === 'string' ? line : JSON.stringify(line)}</p>
                ))
              ) : (
                <p>Р“РѕРЅРєР° Р·Р°РІРµСЂС€РµРЅР°!</p>
              )}
            </div>
            
            <button className="race-close-btn" onClick={handleBackToMenu}>
              Р’ РњР•РќР®
            </button>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div className="leaderboard-modal">
          <div className="leaderboard-content">
            <div className="leaderboard-header">
              <span className="leaderboard-icon">{league.icon}</span>
              <h2>{league.name} Р›РёРіР°</h2>
              <p>РўРѕРї РёРіСЂРѕРєРѕРІ СЂР°РЅРіР°</p>
            </div>
            
            <div className="leaderboard-list">
              {fakeLeaderboard.map((player, idx) => (
                <div key={player.id} className={`leaderboard-row ${player.isMe ? 'is-me' : ''}`}>
                  <span className="leaderboard-place">{idx + 1}</span>
                  <span className="leaderboard-name">{player.name}</span>
                  <span className="leaderboard-points">{player.points} РѕС‡Рє.</span>
                </div>
              ))}
            </div>

            <button className="leaderboard-close-btn" onClick={() => setShowLeaderboard(false)}>
              Р—РђРљР Р«РўР¬
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### src/components/ReferralScreen.tsx
```tsx
// src/components/ReferralScreen.tsx
import React, { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Gift, Copy, Share2, ArrowLeft, Users, TrendingUp, UserPlus } from 'lucide-react';
import '../styles/referral.css';

const BOT_NAME = 'kliker_one_bot'; 

export const ReferralScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const referrals = useGameStore((s) => s.referrals);
  const fetchReferrals = useGameStore((s) => s.fetchReferrals);
  
  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  if (!user) return null;

  const referralEarnings = user.referralEarnings || 0;
  const refLink = `https://t.me/${BOT_NAME}?startapp=ref_${user.id}`; 

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    WebApp.HapticFeedback?.notificationOccurred('success');
    WebApp.showAlert('РЎСЃС‹Р»РєР° СЃРєРѕРїРёСЂРѕРІР°РЅР°!');
  };

  const handleShare = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent('РџСЂРёСЃРѕРµРґРёРЅСЏР№СЃСЏ Рє РіРѕРЅРєР°Рј! РџРѕР»СѓС‡Рё 10,000 в‚Ѕ Р±РѕРЅСѓСЃРѕРј рџЏЋпёЏрџ’Ё')}`;
    WebApp.openTelegramLink(shareUrl);
  };

  return (
    <motion.div 
      className="referral-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="referral-container">
        <div className="referral-topbar">
          <button className="referral-back" onClick={onClose}>
            <ArrowLeft size={18} />
          </button>
          <h2><Users size={18} /> РџР РР“Р›РђРЁРђР™ Р”Р РЈР—Р•Р™</h2>
          <div style={{ width: 36 }} />
        </div>

        <div className="referral-content">
          <div className="referral-bonus-card">
            <div className="bonus-icon"><Gift size={32} color="var(--accent)" /></div>
            <div className="bonus-text">
              <h3>Р‘РѕРЅСѓСЃ Р·Р° РґСЂСѓРіР°</h3>
              <p>РџРѕР»СѓС‡Р°Р№ <strong>50,000 в‚Ѕ</strong> Рё <strong>1%</strong> СЃ РєР°Р¶РґРѕРіРѕ РєР»РёРєР° РґСЂСѓРіР°!</p>
            </div>
          </div>

          <div className="referral-earnings-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="var(--success)" />
              <span className="earnings-label">Р—Р°СЂР°Р±РѕС‚Р°РЅРѕ СЃ СЂРµС„РµСЂР°Р»РѕРІ</span>
            </div>
            <span className="earnings-value">
              {referralEarnings.toLocaleString('ru-RU')}
              <span className="currency-ruble" style={{ marginLeft: 4 }}>в‚Ѕ</span>
            </span>
          </div>

          <div className="referral-how-it-works">
            <h4>РљР°Рє СЌС‚Рѕ СЂР°Р±РѕС‚Р°РµС‚?</h4>
            <div className="how-step">
              <div className="how-step-num">1</div>
              <p>РћС‚РїСЂР°РІСЊ СЃСЃС‹Р»РєСѓ РґСЂСѓРіСѓ</p>
            </div>
            <div className="how-step">
              <div className="how-step-num">2</div>
              <p>Р”СЂСѓРі Р·Р°РїСѓСЃРєР°РµС‚ РёРіСЂСѓ Рё РїРѕР»СѓС‡Р°РµС‚ <strong>10,000 в‚Ѕ</strong></p>
            </div>
            <div className="how-step">
              <div className="how-step-num">3</div>
              <p>РўС‹ РїРѕР»СѓС‡Р°РµС€СЊ <strong>50,000 в‚Ѕ</strong> + 1% СЃ РµРіРѕ РєР»РёРєРѕРІ</p>
            </div>
          </div>

          <div className="referral-link-box" onClick={handleCopy}>
            <span className="link-text">{refLink}</span>
            <Copy size={16} color="var(--accent)" style={{ flexShrink: 0, marginLeft: 8 }} />
          </div>

          {/* рџ‘‡ Р‘Р›РћРљ Р”Р РЈР—Р•Р™ */}
          <div className="referral-friends-card">
            <div className="friends-header">
              <UserPlus size={16} color="var(--accent)" />
              <span>РџСЂРёРіР»Р°С€С‘РЅРЅС‹Рµ РґСЂСѓР·СЊСЏ</span>
              <span className="friends-count">{referrals.length}</span>
            </div>

            {referrals.length === 0 ? (
              <div className="friends-empty">
                <Users size={32} color="var(--text-muted)" />
                <p>РџРѕРєР° РЅРёРєРѕРіРѕ РЅРµС‚.<br />РћС‚РїСЂР°РІСЊ СЃСЃС‹Р»РєСѓ РїРµСЂРІС‹Рј!</p>
              </div>
            ) : (
              <div className="friends-list">
                {referrals.map((ref: any) => (
                  <div key={ref.id} className="friend-row">
                    {ref.photoUrl ? (
                      <img src={ref.photoUrl} alt="" className="friend-avatar" />
                    ) : (
                      <div className="friend-avatar-placeholder">
                        {(ref.firstName?.[0] || 'Р“').toUpperCase()}
                      </div>
                    )}
                    <div className="friend-info">
                      <div className="friend-name">
                        {[ref.firstName, ref.lastName].filter(Boolean).join(' ') || ref.username || 'Р“РѕРЅС‰РёРє'}
                      </div>
                      <div className="friend-date">
                        РЎ {new Date(ref.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <div className="friend-earned">
                      {Math.floor((ref.totalEarned || 0) * 0.01).toLocaleString('ru-RU')}
                      <span className="currency-ruble sm" style={{ marginLeft: 2 }}>в‚Ѕ</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="referral-actions">
            <button onClick={handleCopy} className="referral-btn-copy">
              <Copy size={16} />
              РЎРљРћРџРР РћР’РђРўР¬
            </button>
            <button onClick={handleShare} className="referral-btn-action">
              <Share2 size={16} />
              РџРћР”Р•Р›РРўР¬РЎРЇ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
```

### src/components/ShopModal.tsx
```tsx
// src/components/ShopModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';

export function ShopModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const syncTaps = useGameStore((s) => s.syncTaps);

  // рџ‘‡ Р”СѓР±Р»РёСЂСѓРµРј РєРѕРЅС„РёРі СЃ Р±СЌРєРµРЅРґР° РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ
  const SHOP_ITEMS = [
    { id: 'stars_500', title: '500 Р·РІС‘Р·Рґ', stars: 20, type: 'stars', icon: 'в­ђ' },
    { id: 'stars_3000', title: '3000 Р·РІС‘Р·Рґ (+10%)', stars: 100, type: 'stars', icon: 'рџЊџ' },
    { id: 'coins_100k', title: '100 000 в‚Ѕ', stars: 10, type: 'coins', icon: 'в‚Ѕ' },
    { id: 'coins_1m', title: '1 000 000 в‚Ѕ', stars: 80, type: 'coins', icon: 'рџ’°' },
    { id: 'battle_pass_s1', title: 'Battle Pass вЂ” РЎРµР·РѕРЅ 1', stars: 150, type: 'pass', icon: 'рџЏЃ' },
    { id: 'boost_x2_24h', title: 'Р‘СѓСЃС‚ Г—2 РґРѕС…РѕРґР° (24С‡)', stars: 30, type: 'boost', icon: 'вљЎ' },
  ];

  const handleBuy = async (itemId: string) => {
    if (isLoading) return;
    setIsLoading(itemId);
    
    try {
      const initData = WebApp.initData || '';
      
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      
      const data = await res.json();

      if (data.invoiceLink) {
        WebApp.openInvoice(data.invoiceLink, (status) => {
          if (status === 'paid') {
            WebApp.showAlert("РћРїР»Р°С‚Р° РїСЂРѕС€Р»Р° СѓСЃРїРµС€РЅРѕ! РџСЂРµРґРјРµС‚ Р·Р°С‡РёСЃР»РµРЅ.");
            setTimeout(() => syncTaps(), 1000); // РЎРёРЅС…СЂРѕРЅРёР·РёСЂСѓРµРј Р±Р°Р»Р°РЅСЃ
            onClose();
          } else if (status === 'failed') {
            WebApp.showAlert("РћС€РёР±РєР° РїСЂРё РѕРїР»Р°С‚Рµ.");
          }
          setIsLoading(null);
        });
      } else {
        WebApp.showAlert(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ СЃС‡РµС‚.");
        setIsLoading(null);
      }
    } catch (e) {
      console.error(e);
      WebApp.showAlert("РћС€РёР±РєР° СЃРµС‚Рё.");
      setIsLoading(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>рџ›’ РњР°РіР°Р·РёРЅ</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', fontSize: '16px', cursor: 'pointer' }}>вњ•</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SHOP_ITEMS.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' }}>{item.icon}</span>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{item.title}</div>
                  {/* РњРѕР¶РЅРѕ РґРѕР±Р°РІРёС‚СЊ РѕРїРёСЃР°РЅРёРµ, РµСЃР»Рё РЅСѓР¶РЅРѕ */}
                </div>
              </div>
              
              <button 
                onClick={() => handleBuy(item.id)}
                disabled={isLoading !== null}
                style={{ 
                  background: isLoading === item.id ? '#555' : (item.type === 'stars' ? '#ffd700' : '#00d97e'), 
                  color: 'black', 
                  border: 'none', padding: '8px 12px', borderRadius: '8px', 
                  fontWeight: 'bold', fontSize: '13px', 
                  cursor: isLoading !== null ? 'not-allowed' : 'pointer',
                  minWidth: '70px'
                }}
              >
                {isLoading === item.id ? '...' : `${item.stars} в­ђ`}
              </button>

            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
```

### src/components/TintedCarImage.tsx
```tsx
// src/components/TintedCarImage.tsx
import React, { useEffect, useRef, useState } from 'react';

interface TintedCarImageProps {
  imageUrl: string;
  colorHex: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TintedCarImage: React.FC<TintedCarImageProps> = ({ imageUrl, colorHex, className, style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Р•СЃР»Рё С†РІРµС‚ Р·Р°РІРѕРґСЃРєРѕР№ (original) РёР»Рё РїСЂРѕР·СЂР°С‡РЅС‹Р№, РЅРёС‡РµРіРѕ РЅРµ РєСЂР°СЃРёРј
    if (colorHex === 'original' || colorHex === 'transparent') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // рџ‘‡ Р”РћР‘РђР’Р›Р•РќРћ: { willReadFrequently: true } СѓР±РёСЂР°РµС‚ РїСЂРµРґСѓРїСЂРµР¶РґРµРЅРёРµ РІ РєРѕРЅСЃРѕР»Рё рџ‘‡
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsLoaded(false); // РЎР±СЂР°СЃС‹РІР°РµРј СЃРѕСЃС‚РѕСЏРЅРёРµ РїСЂРё СЃРјРµРЅРµ РєР°СЂС‚РёРЅРєРё/С†РІРµС‚Р°

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // РљРѕРЅРІРµСЂС‚РёСЂСѓРµРј HEX С†РІРµС‚ РІ RGB
      const r = parseInt(colorHex.slice(1, 3), 16);
      const g = parseInt(colorHex.slice(3, 5), 16);
      const b = parseInt(colorHex.slice(5, 7), 16);

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha === 0) continue; // РџСЂРѕРїСѓСЃРєР°РµРј РїСЂРѕР·СЂР°С‡РЅС‹Рµ РїРёРєСЃРµР»Рё

        // РЎС‡РёС‚Р°РµРј СЏСЂРєРѕСЃС‚СЊ РїРёРєСЃРµР»СЏ (luminance)
        const pr = data[i];
        const pg = data[i + 1];
        const pb = data[i + 2];
        const brightness = (0.299 * pr + 0.587 * pg + 0.114 * pb) / 255;

        // РњРђР“РРЇ РўРћРќРР РћР’РђРќРРЇ (СЃРѕС…СЂР°РЅРµРЅРёРµ Р±Р»РёРєРѕРІ Рё С‚РµРЅРµР№)
        if (brightness < 0.5) {
          const factor = brightness * 2;
          data[i] = r * factor;
          data[i + 1] = g * factor;
          data[i + 2] = b * factor;
        } else {
          const factor = (brightness - 0.5) * 2;
          data[i] = r + (255 - r) * factor;
          data[i + 1] = g + (255 - g) * factor;
          data[i + 2] = b + (255 - b) * factor;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setIsLoaded(true);
    };
  }, [imageUrl, colorHex]);

  // Р•СЃР»Рё С†РІРµС‚ Р·Р°РІРѕРґСЃРєРѕР№, РїСЂРѕСЃС‚Рѕ РїРѕРєР°Р·С‹РІР°РµРј РѕСЂРёРіРёРЅР°Р»СЊРЅСѓСЋ РєР°СЂС‚РёРЅРєСѓ
  if (colorHex === 'original' || colorHex === 'transparent') {
    return (
      <img 
        src={imageUrl} 
        className={className} 
        style={style} 
        alt="car" 
        draggable={false} 
        onError={(e) => { e.currentTarget.style.opacity = '0'; }}
      />
    );
  }

  // Р•СЃР»Рё С†РІРµС‚ РІС‹Р±СЂР°РЅ, РїРѕРєР°Р·С‹РІР°РµРј РїРѕРєСЂР°С€РµРЅРЅС‹Р№ Canvas
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    />
  );
};
```

### src/components/WorkshopScreen.tsx
```tsx
// src/components/WorkshopScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench, Hammer, X, Check, Timer, Cog, Disc, Cpu,
  TrendingUp, Sparkles, Play
} from 'lucide-react';
import { useGameStore, PartUpgrade } from '../store/gameStore';
import { ITEMS, RARITY_COLORS, ItemSlot } from '../config/items';
import { playSound } from '../utils/sound';
import { useAdsgram } from '../hooks/useAdsgram';
import WebApp from '@twa-dev/sdk';
import '../styles/workshop.css';

const SLOT_ICONS: Record<ItemSlot, any> = {
  engine: Cog,
  tires: Disc,
  ecu: Cpu,
  suspension: Wrench,
};

const AD_REDUCE_MS = 15 * 60 * 1000; // 15 РјРёРЅСѓС‚

type TabId = 'upgrade' | 'craft';

export const WorkshopScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const equipped = useGameStore((s) => s.equipped);
  const inventory = useGameStore((s) => s.inventory);
  const upgradePart = useGameStore((s) => s.upgradePart);
  const claimUpgrade = useGameStore((s) => s.claimUpgrade);
  const craftItem = useGameStore((s) => s.craftItem);
  const skipUpgradeTime = useGameStore((s) => s.skipUpgradeTime);

  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('upgrade');
  const [now, setNow] = useState(Date.now());

  // рџ‘‡ REF РґР»СЏ СЂРµРєР»Р°РјС‹ (РєР°Рє РІ CaseModal)
  const adStateRef = useRef<{ pendingItemId: string | null }>({ pendingItemId: null });

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const partUpgrades: Record<string, PartUpgrade> = user?.partUpgrades || {};

  const itemCounts = inventory.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const craftableIds = Object.keys(itemCounts).filter(id => itemCounts[id] >= 5);

  const handleUpgrade = async (itemId: string, type: 'level' | 'gold' | 'red') => {
    setLoading(`${itemId}_${type}`);
    await upgradePart(itemId, type);
    setLoading(null);
  };

  const handleClaim = async (itemId: string) => {
    setLoading(`${itemId}_claim`);
    await claimUpgrade(itemId);
    setLoading(null);
    playSound('coin');
  };

  const handleCraft = async (itemId: string) => {
    setLoading(`craft_${itemId}`);
    await craftItem(itemId);
    setLoading(null);
    playSound('coin');
  };

  // рџ‘‡ Р РµРєР»Р°РјР° (Р°РЅР°Р»РѕРі CaseModal)
  const showAd = useAdsgram({
    blockId: '55486',
    onReward: async () => {
      const itemId = adStateRef.current.pendingItemId;
      console.log('[Workshop] Ad reward, item:', itemId);

      if (!itemId) {
        console.warn('[Workshop] No pending item!');
        adStateRef.current = { pendingItemId: null };
        return;
      }

      setLoading(`skip_${itemId}`);
      const success = await skipUpgradeTime(itemId, AD_REDUCE_MS);
      setLoading(null);
      adStateRef.current = { pendingItemId: null };

      if (success) {
        playSound('coin');
        WebApp.HapticFeedback?.notificationOccurred('success');
      } else {
        WebApp.showAlert('РќРµ СѓРґР°Р»РѕСЃСЊ СѓСЃРєРѕСЂРёС‚СЊ СѓР»СѓС‡С€РµРЅРёРµ');
      }
    },
    onError: (err) => {
      console.error('[Workshop] Ad error:', err);
      WebApp.showAlert('Р РµРєР»Р°РјР° РЅРµ Р±С‹Р»Р° РїСЂРѕСЃРјРѕС‚СЂРµРЅР° РґРѕ РєРѕРЅС†Р°');
      adStateRef.current = { pendingItemId: null };
    },
  });

  const handleSkipWithAd = (itemId: string) => {
    console.log('[Workshop] Starting ad for:', itemId);
    adStateRef.current = { pendingItemId: itemId };
    showAd();
  };

  const formatTimeLeft = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}С‡ ${m}Рј`;
    if (m > 0) return `${m}Рј ${s}СЃ`;
    return `${s}СЃ`;
  };

  return (
    <div className="workshop-overlay" onClick={onClose}>
      <motion.div
        className="workshop-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* РЁР°РїРєР° */}
        <div className="workshop-header">
          <h2>
            <Wrench size={18} color="var(--accent)" /> РњРђРЎРўР•Р РЎРљРђРЇ
          </h2>
          <button className="workshop-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* РўР°Р±С‹ */}
        <div className="workshop-tabs">
          <button
            className={`workshop-tab ${activeTab === 'upgrade' ? 'active' : ''}`}
            onClick={() => setActiveTab('upgrade')}
            style={activeTab === 'upgrade' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
          >
            <TrendingUp size={14} /> РЈР›РЈР§РЁР•РќРРЇ
          </button>
          <button
            className={`workshop-tab ${activeTab === 'craft' ? 'active' : ''}`}
            onClick={() => setActiveTab('craft')}
            style={activeTab === 'craft' ? { borderColor: 'var(--gold)', color: 'var(--gold)' } : {}}
          >
            <Hammer size={14} /> РљР РђР¤Рў
          </button>
        </div>

        {/* Body */}
        <div className="workshop-body">
          <AnimatePresence mode="wait">
            {activeTab === 'upgrade' && (
              <motion.div
                key="upgrade"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="workshop-list"
              >
                {Object.values(equipped).filter((id): id is string => Boolean(id)).length === 0 && (
                  <div className="workshop-empty">
                    <Cog size={48} color="var(--text-muted)" />
                    <h3>РќРµС‚ РЅР°РґРµС‚С‹С… РґРµС‚Р°Р»РµР№</h3>
                    <p>РќР°РґРµРЅСЊС‚Рµ РґРµС‚Р°Р»Рё РІ РіР°СЂР°Р¶Рµ, С‡С‚РѕР±С‹ РёС… СѓР»СѓС‡С€Р°С‚СЊ</p>
                  </div>
                )}

                {Object.values(equipped)
                  .filter((id): id is string => Boolean(id))
                  .map(itemId => {
                    const item = ITEMS[itemId];
                    if (!item) return null;

                    const upg = partUpgrades[itemId] || {
                      level: 0, goldStars: 0, redStars: 0,
                      upgradingUntil: null, upgradeType: null,
                    };

                    const isUpgrading = !!upg.upgradingUntil && upg.upgradingUntil > now;
                    const canClaim = !!upg.upgradingUntil && upg.upgradingUntil <= now;
                    const timeLeft = isUpgrading ? upg.upgradingUntil! - now : 0;

                    const Icon = SLOT_ICONS[item.slot];
                    const rarityColor = RARITY_COLORS[item.rarity];

                    return (
                      <div
                        key={itemId}
                        className={`workshop-card ${isUpgrading ? 'upgrading' : ''} ${canClaim ? 'claimable' : ''}`}
                      >
                        <div
                          className="workshop-card-icon"
                          style={{ background: `${rarityColor}15`, border: `1px solid ${rarityColor}44` }}
                        >
                          <Icon size={22} color={rarityColor} />
                        </div>

                        <div className="workshop-card-info">
                          <div className="workshop-card-title" style={{ color: rarityColor }}>
                            {item.name}
                          </div>
                          <div className="workshop-card-meta">
                            <span>РЈСЂ: <strong>{upg.level}/50</strong></span>
                            <span style={{ color: 'var(--gold)' }}>в… {upg.goldStars}</span>
                            <span style={{ color: 'var(--danger)' }}>в… {upg.redStars}</span>
                          </div>

                          {isUpgrading && (
                            <div className="workshop-card-timer">
                              <Timer size={12} />
                              <span>РћСЃС‚Р°Р»РѕСЃСЊ: {formatTimeLeft(timeLeft)}</span>
                            </div>
                          )}
                        </div>

                        <div className="workshop-card-actions">
                          {isUpgrading && (
                            <button
                              className="workshop-ad-btn"
                              onClick={() => handleSkipWithAd(itemId)}
                              disabled={loading === `skip_${itemId}`}
                            >
                              <Play size={12} /> -15Рј
                            </button>
                          )}

                          {canClaim && (
                            <button
                              className="workshop-claim-btn"
                              onClick={() => handleClaim(itemId)}
                              disabled={loading === `${itemId}_claim`}
                            >
                              <Check size={14} /> Р—РђР‘Р РђРўР¬
                            </button>
                          )}

                          {!isUpgrading && !canClaim && (
                            <>
                              {upg.level < 50 && (
                                <button
                                  className="workshop-upgrade-btn level"
                                  onClick={() => handleUpgrade(itemId, 'level')}
                                  disabled={loading === `${itemId}_level`}
                                >
                                  +1 РЈР 
                                </button>
                              )}
                              {upg.level >= 50 && upg.goldStars < 5 && (
                                <button
                                  className="workshop-upgrade-btn gold"
                                  onClick={() => handleUpgrade(itemId, 'gold')}
                                  disabled={loading === `${itemId}_gold`}
                                >
                                  +в…
                                </button>
                              )}
                              {upg.goldStars >= 5 && upg.redStars < 5 && (
                                <button
                                  className="workshop-upgrade-btn red"
                                  onClick={() => handleUpgrade(itemId, 'red')}
                                  disabled={loading === `${itemId}_red`}
                                >
                                  +в…
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </motion.div>
            )}

            {activeTab === 'craft' && (
              <motion.div
                key="craft"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="workshop-list"
              >
                <div className="workshop-hint">
                  <Sparkles size={14} color="var(--gold)" />
                  <span>РћР±СЉРµРґРёРЅРёС‚Рµ 5 РѕРґРёРЅР°РєРѕРІС‹С… РґРµС‚Р°Р»РµР№ в†’ РїРѕР»СѓС‡РёС‚Рµ РЅР° СЂР°РЅРі РІС‹С€Рµ</span>
                </div>

                {craftableIds.length === 0 && (
                  <div className="workshop-empty">
                    <Hammer size={48} color="var(--text-muted)" />
                    <h3>РќРµС‚ РґРѕСЃС‚СѓРїРЅС‹С… РґР»СЏ РєСЂР°С„С‚Р°</h3>
                    <p>РЎРѕР±РµСЂРёС‚Рµ 5 РѕРґРёРЅР°РєРѕРІС‹С… РґРµС‚Р°Р»РµР№</p>
                  </div>
                )}

                {craftableIds.map(itemId => {
                  const item = ITEMS[itemId];
                  if (!item) return null;
                  const count = itemCounts[itemId];
                  const rarityColor = RARITY_COLORS[item.rarity];
                  const Icon = SLOT_ICONS[item.slot];

                  return (
                    <div key={itemId} className="workshop-craft-card">
                      <div
                        className="workshop-card-icon"
                        style={{ background: `${rarityColor}15`, border: `1px solid ${rarityColor}44` }}
                      >
                        <Icon size={22} color={rarityColor} />
                      </div>
                      <div className="workshop-card-info">
                        <div className="workshop-card-title" style={{ color: rarityColor }}>
                          {item.name}
                        </div>
                        <div className="workshop-card-meta">
                          <span>Р’ РЅР°Р»РёС‡РёРё: <strong>{count}</strong></span>
                        </div>
                      </div>
                      <button
                        className="workshop-craft-btn"
                        onClick={() => handleCraft(itemId)}
                        disabled={loading === `craft_${itemId}`}
                      >
                        {loading === `craft_${itemId}` ? '...' : 'РЎРљР РђР¤РўРРўР¬'}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
```

### src/config/achievements.ts
```ts
// src/config/achievements.ts

export type AchievementCategory = 'wealth' | 'racer' | 'clicker' | 'collector' | 'legend' | 'level';
export type AchievementTier = 1 | 2 | 3 | 4 | 5;

export interface AchievementConfig {
  id: string;
  category: AchievementCategory;
  tier: AchievementTier;
  name: string;
  description: string;
  icon: string;
  reward: number;
  check: (user: any) => boolean;
}

// ============= РњР•РўРђ-РРќР¤Рћ РљРђРўР•Р“РћР РР™ =============
export const CATEGORY_META: Record<AchievementCategory, { name: string; icon: string; color: string }> = {
  wealth:    { name: 'Р‘РѕРіР°С‚СЃС‚РІРѕ',    icon: 'Coins',            color: '#ffd700' },
  racer:     { name: 'Р“РѕРЅС‰РёРє',       icon: 'Flag',             color: '#00e5ff' },
  clicker:   { name: 'РљР»РёРєРµСЂ',       icon: 'MousePointerClick', color: '#00d97e' },
  collector: { name: 'РљРѕР»Р»РµРєС†РёРѕРЅРµСЂ', icon: 'Car',              color: '#ff8800' },
  legend:    { name: 'Р›РµРіРµРЅРґР°',      icon: 'Star',             color: '#ff00ff' },
  level:     { name: 'РЈСЂРѕРІРµРЅСЊ',      icon: 'TrendingUp',       color: '#00e5ff' }, // рџ‘€ РќРћР’РћР•
};

// ============= TIER META =============
export const TIER_META: Record<AchievementTier, { name: string; color: string }> = {
  1: { name: 'Р‘СЂРѕРЅР·Р°',  color: '#cd7f32' },
  2: { name: 'РЎРµСЂРµР±СЂРѕ', color: '#c0c0c0' },
  3: { name: 'Р—РѕР»РѕС‚Рѕ',  color: '#ffd700' },
  4: { name: 'РџР»Р°С‚РёРЅР°', color: '#00e5ff' },
  5: { name: 'Р›РµРіРµРЅРґР°', color: '#ff00ff' },
};

// РҐРµР»РїРµСЂ: СЂР°СЃС‡С‘С‚ СѓСЂРѕРІРЅСЏ РїРѕ XP
const calcLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;

// ============= Р’РЎР• Р”РћРЎРўРР–Р•РќРРЇ =============
export const ACHIEVEMENTS: AchievementConfig[] = [
  // ========== рџ’° Р‘РћР“РђРўРЎРўР’Рћ ==========
  {
    id: 'wealth_1', category: 'wealth', tier: 1,
    name: 'РџРµСЂРІС‹Рµ С€Р°РіРё', description: 'Р—Р°СЂР°Р±РѕС‚Р°С‚СЊ 10,000 в‚Ѕ',
    icon: 'Coins', reward: 5000,
    check: (user) => (user.totalEarned || 0) >= 10_000,
  },
  {
    id: 'wealth_2', category: 'wealth', tier: 2,
    name: 'РњРёР»Р»РёРѕРЅРµСЂ', description: 'Р—Р°СЂР°Р±РѕС‚Р°С‚СЊ 1,000,000 в‚Ѕ',
    icon: 'Wallet', reward: 100_000,
    check: (user) => (user.totalEarned || 0) >= 1_000_000,
  },
  {
    id: 'wealth_3', category: 'wealth', tier: 3,
    name: 'РњСѓР»СЊС‚РёРјРёР»Р»РёРѕРЅРµСЂ', description: 'Р—Р°СЂР°Р±РѕС‚Р°С‚СЊ 100,000,000 в‚Ѕ',
    icon: 'Gem', reward: 5_000_000,
    check: (user) => (user.totalEarned || 0) >= 100_000_000,
  },
  {
    id: 'wealth_4', category: 'wealth', tier: 4,
    name: 'РњРёР»Р»РёР°СЂРґРµСЂ', description: 'Р—Р°СЂР°Р±РѕС‚Р°С‚СЊ 1,000,000,000 в‚Ѕ',
    icon: 'Crown', reward: 100_000_000,
    check: (user) => (user.totalEarned || 0) >= 1_000_000_000,
  },
  {
    id: 'wealth_5', category: 'wealth', tier: 5,
    name: 'Р¤РёРЅР°РЅСЃРѕРІР°СЏ РёРјРїРµСЂРёСЏ', description: 'Р—Р°СЂР°Р±РѕС‚Р°С‚СЊ 100,000,000,000 в‚Ѕ',
    icon: 'Landmark', reward: 10_000_000_000,
    check: (user) => (user.totalEarned || 0) >= 100_000_000_000,
  },

  // ========== рџ‘† РљР›РРљР•Р  ==========
  {
    id: 'clicker_1', category: 'clicker', tier: 1,
    name: 'РќРѕРІРёС‡РѕРє', description: 'РЎРґРµР»Р°С‚СЊ 1,000 РєР»РёРєРѕРІ',
    icon: 'Pointer', reward: 3_000,
    check: (user) => (user.totalClicks || 0) >= 1_000,
  },
  {
    id: 'clicker_2', category: 'clicker', tier: 2,
    name: 'РњР°СЃС‚РµСЂ РєР»РёРєР°', description: 'РџСЂРѕРєР°С‡Р°С‚СЊ СЃРёР»Сѓ РєР»РёРєР° РґРѕ 25 СѓСЂРѕРІРЅСЏ',
    icon: 'Zap', reward: 25_000,
    check: (user) => (user.clickLevel || 1) >= 25,
  },
  {
    id: 'clicker_3', category: 'clicker', tier: 3,
    name: 'РљР»РёРєРµСЂ-РїСЂРѕС„Рё', description: 'РЎРґРµР»Р°С‚СЊ 100,000 РєР»РёРєРѕРІ',
    icon: 'Flame', reward: 250_000,
    check: (user) => (user.totalClicks || 0) >= 100_000,
  },
  {
    id: 'clicker_4', category: 'clicker', tier: 4,
    name: 'РљР»РёРєРµСЂ-РјР°РЅСЊСЏРє', description: 'РџСЂРѕРєР°С‡Р°С‚СЊ СЃРёР»Сѓ РєР»РёРєР° РґРѕ 100 СѓСЂРѕРІРЅСЏ',
    icon: 'Rocket', reward: 5_000_000,
    check: (user) => (user.clickLevel || 1) >= 100,
  },
  {
    id: 'clicker_5', category: 'clicker', tier: 5,
    name: 'Р‘РѕРі РєР»РёРєРѕРІ', description: 'РЎРґРµР»Р°С‚СЊ 1,000,000 РєР»РёРєРѕРІ',
    icon: 'Sparkles', reward: 50_000_000,
    check: (user) => (user.totalClicks || 0) >= 1_000_000,
  },

  // ========== рџЏЃ Р“РћРќР©РРљ ==========
  {
    id: 'racer_1', category: 'racer', tier: 1,
    name: 'РџРµСЂРІР°СЏ РїРѕР±РµРґР°', description: 'Р’С‹РёРіСЂР°С‚СЊ 1 РіРѕРЅРєСѓ',
    icon: 'Flag', reward: 2_000,
    check: (user) => (user.totalWins || 0) >= 1,
  },
  {
    id: 'racer_2', category: 'racer', tier: 2,
    name: 'РћРїС‹С‚РЅС‹Р№ РіРѕРЅС‰РёРє', description: 'Р”РѕСЃС‚РёС‡СЊ 500 СЂРµР№С‚РёРЅРіР°',
    icon: 'Gauge', reward: 25_000,
    check: (user) => (user.rating || 0) >= 500,
  },
  {
    id: 'racer_3', category: 'racer', tier: 3,
    name: 'Р§РµРјРїРёРѕРЅ', description: 'Р’С‹РёРіСЂР°С‚СЊ 100 РіРѕРЅРѕРє',
    icon: 'Trophy', reward: 500_000,
    check: (user) => (user.totalWins || 0) >= 100,
  },
  {
    id: 'racer_4', category: 'racer', tier: 4,
    name: 'Р›РµРіРµРЅРґР° С‚СЂРµРєР°', description: 'Р”РѕСЃС‚РёС‡СЊ 5,000 СЂРµР№С‚РёРЅРіР°',
    icon: 'Medal', reward: 10_000_000,
    check: (user) => (user.rating || 0) >= 5_000,
  },
  {
    id: 'racer_5', category: 'racer', tier: 5,
    name: 'РљРѕСЂРѕР»СЊ РґРѕСЂРѕРі', description: 'Р’С‹РёРіСЂР°С‚СЊ 1,000 РіРѕРЅРѕРє',
    icon: 'Award', reward: 100_000_000,
    check: (user) => (user.totalWins || 0) >= 1_000,
  },

  // ========== рџљ— РљРћР›Р›Р•РљР¦РРћРќР•Р  ==========
  {
    id: 'collector_1', category: 'collector', tier: 1,
    name: 'РџРµСЂРІС‹Р№ РєРѕРЅСЊ', description: 'РљСѓРїРёС‚СЊ 2 РјР°С€РёРЅС‹',
    icon: 'Car', reward: 5_000,
    check: (user) => (user.ownedCars || []).length >= 2,
  },
  {
    id: 'collector_2', category: 'collector', tier: 2,
    name: 'РљРѕР»Р»РµРєС†РёРѕРЅРµСЂ', description: 'РљСѓРїРёС‚СЊ 5 РјР°С€РёРЅ',
    icon: 'CarFront', reward: 50_000,
    check: (user) => (user.ownedCars || []).length >= 5,
  },
  {
    id: 'collector_3', category: 'collector', tier: 3,
    name: 'РђРІС‚РѕРјР°РіРЅР°С‚', description: 'РљСѓРїРёС‚СЊ 15 РјР°С€РёРЅ',
    icon: 'CarTaxiFront', reward: 500_000,
    check: (user) => (user.ownedCars || []).length >= 15,
  },
  {
    id: 'collector_4', category: 'collector', tier: 4,
    name: 'РђРІС‚РѕРјСѓР·РµР№', description: 'РљСѓРїРёС‚СЊ 30 РјР°С€РёРЅ',
    icon: 'Warehouse', reward: 10_000_000,
    check: (user) => (user.ownedCars || []).length >= 30,
  },
  {
    id: 'collector_5', category: 'collector', tier: 5,
    name: 'РРјРїРµСЂР°С‚РѕСЂ РіР°СЂР°Р¶РµР№', description: 'РљСѓРїРёС‚СЊ Р’РЎР• РјР°С€РёРЅС‹',
    icon: 'Crown', reward: 100_000_000,
    check: (user) => (user.ownedCars || []).length >= 50,
  },

  // ========== в­ђ Р›Р•Р“Р•РќР”Рђ ==========
  {
    id: 'legend_1', category: 'legend', tier: 1,
    name: 'РўСЋРЅРµСЂ', description: 'РџСЂРѕРєР°С‡Р°С‚СЊ Р»СЋР±СѓСЋ РґРµС‚Р°Р»СЊ РґРѕ 10 СѓСЂРѕРІРЅСЏ',
    icon: 'Wrench', reward: 20_000,
    check: (user) => Object.values(user.partUpgrades || {}).some((u: any) => u.level >= 10),
  },
  {
    id: 'legend_2', category: 'legend', tier: 2,
    name: 'РњРµС…Р°РЅРёРє', description: 'РџСЂРѕРєР°С‡Р°С‚СЊ 3 РґРµС‚Р°Р»Рё РґРѕ 20 СѓСЂРѕРІРЅСЏ',
    icon: 'Cog', reward: 250_000,
    check: (user) => Object.values(user.partUpgrades || {}).filter((u: any) => u.level >= 20).length >= 3,
  },
  {
    id: 'legend_3', category: 'legend', tier: 3,
    name: 'РРЅР¶РµРЅРµСЂ', description: 'РџСЂРѕРєР°С‡Р°С‚СЊ Р’РЎР• РґРµС‚Р°Р»Рё РґРѕ 15 СѓСЂРѕРІРЅСЏ',
    icon: 'Hammer', reward: 2_000_000,
    check: (user) => {
      const upgrades = Object.values(user.partUpgrades || {});
      return upgrades.length >= 4 && upgrades.every((u: any) => u.level >= 15);
    },
  },
  {
    id: 'legend_4', category: 'legend', tier: 4,
    name: 'Р’РёС†Рµ-РїСЂРµР·РёРґРµРЅС‚', description: 'Р’РЅРµСЃС‚Рё 1,000,000 в‚Ѕ РІРєР»Р°РґР° РІ РєР»Р°РЅ',
    icon: 'Shield', reward: 15_000_000,
    check: (user) => (user.clanContribution || 0) >= 1_000_000,
  },
  {
    id: 'legend_5', category: 'legend', tier: 5,
    name: 'РРєРѕРЅР° РіРѕРЅРѕРє', description: '1B в‚Ѕ, 10k РєР»РёРєРѕРІ, 100 РїРѕР±РµРґ, 10 РјР°С€РёРЅ',
    icon: 'Star', reward: 500_000_000,
    check: (user) => 
      (user.totalEarned || 0) >= 1_000_000_000 &&
      (user.totalClicks || 0) >= 10_000 &&
      (user.totalWins || 0) >= 100 &&
      (user.ownedCars || []).length >= 10,
  },

  // ========== рџ“€ РЈР РћР’Р•РќР¬ (РќРћР’РћР•) ==========
  {
    id: 'level_1', category: 'level', tier: 1,
    name: 'Р”РµСЃСЏС‚РєР°', description: 'Р”РѕСЃС‚РёС‡СЊ 10 СѓСЂРѕРІРЅСЏ',
    icon: 'TrendingUp', reward: 50_000,
    check: (user) => calcLevel(user.xp || 0) >= 10,
  },
  {
    id: 'level_2', category: 'level', tier: 2,
    name: 'Р”РІР°РґС†Р°С‚РєР°', description: 'Р”РѕСЃС‚РёС‡СЊ 20 СѓСЂРѕРІРЅСЏ',
    icon: 'TrendingUp', reward: 500_000,
    check: (user) => calcLevel(user.xp || 0) >= 20,
  },
  {
    id: 'level_3', category: 'level', tier: 3,
    name: 'РўСЂРёРґС†Р°С‚РєР°', description: 'Р”РѕСЃС‚РёС‡СЊ 30 СѓСЂРѕРІРЅСЏ',
    icon: 'TrendingUp', reward: 5_000_000,
    check: (user) => calcLevel(user.xp || 0) >= 30,
  },
  {
    id: 'level_4', category: 'level', tier: 4,
    name: 'РЎРѕСЂРѕРєРѕРІРєР°', description: 'Р”РѕСЃС‚РёС‡СЊ 40 СѓСЂРѕРІРЅСЏ',
    icon: 'TrendingUp', reward: 50_000_000,
    check: (user) => calcLevel(user.xp || 0) >= 40,
  },
  {
    id: 'level_5', category: 'level', tier: 5,
    name: 'РџРѕР»С‚РёРЅРЅРёРє', description: 'Р”РѕСЃС‚РёС‡СЊ 50 СѓСЂРѕРІРЅСЏ',
    icon: 'TrendingUp', reward: 500_000_000,
    check: (user) => calcLevel(user.xp || 0) >= 50,
  },
];
```

### src/config/businesses.ts
```ts
export interface BusinessConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  baseIncomePerHour: number;
}

export const BUSINESSES: Record<string, BusinessConfig> = {
  coffee: {
    id: 'coffee',
    name: 'РљРѕС„РµР№РЅСЏ',
    description: 'Р‘С‹СЃС‚СЂС‹Р№ РєРѕС„Рµ РґР»СЏ РіРѕРЅС‰РёРєРѕРІ.',
    icon: 'в•',
    baseCost: 10000,
    baseIncomePerHour: 500,
  },
  car_wash: {
    id: 'car_wash',
    name: 'РђРІС‚РѕРјРѕР№РєР°',
    description: 'Р§РёСЃС‚С‹Рµ РјР°С€РёРЅС‹ РµРґСѓС‚ Р±С‹СЃС‚СЂРµРµ.',
    icon: 'рџљї',
    baseCost: 50000,
    baseIncomePerHour: 3000,
  },
  parts_store: {
    id: 'parts_store',
    name: 'РњР°РіР°Р·РёРЅ Р·Р°РїС‡Р°СЃС‚РµР№',
    description: 'РџСЂРѕРґР°Р¶Р° С‚СЋРЅРёРЅРіР°.',
    icon: 'рџ”§',
    baseCost: 250000,
    baseIncomePerHour: 15000,
  },
  gas_station: {
    id: 'gas_station',
    name: 'Р—Р°РїСЂР°РІРєР°',
    description: 'Р‘РµРЅР·РёРЅ РЅСѓР¶РµРЅ РІСЃРµРј.',
    icon: 'в›Ѕ',
    baseCost: 1000000,
    baseIncomePerHour: 80000,
  },
  night_club: {
    id: 'night_club',
    name: 'РќРѕС‡РЅРѕР№ РєР»СѓР±',
    description: 'РћС‚РґС‹С… РїРѕСЃР»Рµ РіРѕРЅРѕРє.',
    icon: 'рџЄ©',
    baseCost: 10000000,
    baseIncomePerHour: 1000000,
  }
};

// Р¤РѕСЂРјСѓР»С‹ РґР»СЏ СЂР°СЃС‡РµС‚РѕРІ
export const getBusinessUpgradeCost = (baseCost: number, currentLevel: number) => {
  return Math.floor(baseCost * Math.pow(1.6, currentLevel));
};

export const getBusinessIncome = (baseIncome: number, level: number) => {
  return Math.floor(baseIncome * level * (1 + (level - 1) * 0.2)); 
};
```

### src/config/cars.ts
```ts
// src/config/cars.ts

export interface CarPerformance {
  topSpeed: number;    // РјР°РєСЃ. СЃРєРѕСЂРѕСЃС‚СЊ, РєРј/С‡
  accel: number;       // РІСЂРµРјСЏ 0-100 РєРј/С‡, СЃРµРє (РјРµРЅСЊС€Рµ = Р±С‹СЃС‚СЂРµРµ)
  power: number;       // Р».СЃ. (РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ)
  grip: number;        // 0-100, СЃС†РµРїР»РµРЅРёРµ СЃ РґРѕСЂРѕРіРѕР№
  weight: number;      // РєРі (РІР»РёСЏРµС‚ РЅР° СЂР°Р·РіРѕРЅ)
  nitro: number;       // 0-100, СЃРёР»Р° NOS
}

export interface CarConfig {
  id: string;
  name: string;
  price: number;
  image: string;
  performance: CarPerformance; // рџ‘€ РЅРѕРІРѕРµ РїРѕР»Рµ РґР»СЏ РіРѕРЅРѕРє
  baseStats: {
    power: number;
    topSpeed: number;
    grip: number;
    handling: number;
  };
  leftHeadlight?: { x: string; y: string; };
  rightHeadlight?: { x: string; y: string; };
}

// РҐРµР»РїРµСЂ РґР»СЏ РєРѕРЅРІРµСЂС‚Р°С†РёРё "СЂРµР°Р»СЊРЅС‹С…" С†РёС„СЂ РІ СЃС‚Р°СЂС‹Рµ baseStats (С‡С‚РѕР±С‹ РіР°СЂР°Р¶ РЅРµ СЃР»РѕРјР°Р»СЃСЏ)
const mkStats = (perf: CarPerformance) => ({
  power: Math.round(perf.power / 10),
  topSpeed: Math.round(perf.topSpeed / 100),
  grip: Math.round(perf.grip),
  handling: Math.round(perf.grip * 1.1),
});

export const CARS: Record<string, CarConfig> = {
  // --- РЎРўРђР Р«Р• РњРђРЁРРќР« ---
  'audi-tt': { 
    id: 'audi-tt', name: 'Audi TT', price: 0, image: '/cars/audi-tt-front.png',
    performance: { topSpeed: 250, accel: 5.6, power: 225, grip: 80, weight: 1280, nitro: 60 },
    baseStats: mkStats({ topSpeed: 250, accel: 5.6, power: 225, grip: 80, weight: 1280, nitro: 60 }),
  },
  'bmw-m3': { 
    id: 'bmw-m3', name: 'BMW M3', price: 50000, image: '/cars/placeholder.png',
    performance: { topSpeed: 280, accel: 4.8, power: 343, grip: 85, weight: 1495, nitro: 65 },
    baseStats: mkStats({ topSpeed: 280, accel: 4.8, power: 343, grip: 85, weight: 1495, nitro: 65 }),
  },
  
  // --- РўРР  1: РљР»Р°СЃСЃРёРєР° Рё Р±СЋРґР¶РµС‚ ---
  'vaz-2107': { 
    id: 'vaz-2107', name: 'Р’РђР— 2107', price: 0, image: '/cars/vaz-2107.png',
    performance: { topSpeed: 150, accel: 16.0, power: 75, grip: 45, weight: 1030, nitro: 20 },
    baseStats: mkStats({ topSpeed: 150, accel: 16.0, power: 75, grip: 45, weight: 1030, nitro: 20 }),
  },
  'moskvich': { 
    id: 'moskvich', name: 'РњРѕСЃРєРІРёС‡ 412', price: 5000, image: '/cars/moskvich.png',
    performance: { topSpeed: 155, accel: 15.0, power: 80, grip: 48, weight: 1045, nitro: 22 },
    baseStats: mkStats({ topSpeed: 155, accel: 15.0, power: 80, grip: 48, weight: 1045, nitro: 22 }),
  },
  'priora': { 
    id: 'priora', name: 'Lada Priora', price: 15000, image: '/cars/priora.png',
    performance: { topSpeed: 185, accel: 11.5, power: 98, grip: 55, weight: 1180, nitro: 30 },
    baseStats: mkStats({ topSpeed: 185, accel: 11.5, power: 98, grip: 55, weight: 1180, nitro: 30 }),
  },
  'vesta': { 
    id: 'vesta', name: 'Lada Vesta Sport', price: 40000, image: '/cars/vesta.png',
    performance: { topSpeed: 195, accel: 9.6, power: 145, grip: 62, weight: 1270, nitro: 40 },
    baseStats: mkStats({ topSpeed: 195, accel: 9.6, power: 145, grip: 62, weight: 1270, nitro: 40 }),
  },

  // --- РўРР  2: РЇРїРѕРЅСЃРєР°СЏ Рё РµРІСЂРѕРїРµР№СЃРєР°СЏ РєР»Р°СЃСЃРёРєР° ---
  'civic': { 
    id: 'civic', name: 'Honda Civic Type R', price: 100000, image: '/cars/civic.png',
    performance: { topSpeed: 272, accel: 5.8, power: 320, grip: 82, weight: 1380, nitro: 60 },
    baseStats: mkStats({ topSpeed: 272, accel: 5.8, power: 320, grip: 82, weight: 1380, nitro: 60 }),
  },
  'rx7': { 
    id: 'rx7', name: 'Mazda RX-7', price: 250000, image: '/cars/rx7.png',
    performance: { topSpeed: 260, accel: 5.3, power: 280, grip: 78, weight: 1270, nitro: 70 },
    baseStats: mkStats({ topSpeed: 260, accel: 5.3, power: 280, grip: 78, weight: 1270, nitro: 70 }),
  },
  'supra': { 
    id: 'supra', name: 'Toyota Supra MK4', price: 500000, image: '/cars/supra.png',
    performance: { topSpeed: 285, accel: 4.9, power: 330, grip: 80, weight: 1560, nitro: 75 },
    baseStats: mkStats({ topSpeed: 285, accel: 4.9, power: 330, grip: 80, weight: 1560, nitro: 75 }),
  },
  'skyline': { 
    id: 'skyline', name: 'Nissan Skyline R34', price: 850000, image: '/cars/skyline.png',
    performance: { topSpeed: 295, accel: 4.7, power: 360, grip: 84, weight: 1560, nitro: 80 },
    baseStats: mkStats({ topSpeed: 295, accel: 4.7, power: 360, grip: 84, weight: 1560, nitro: 80 }),
  },

  // --- РўРР  3: РњР°СЃР»-РєР°СЂС‹ Рё СЃРїРѕСЂС‚ ---
  'mustang': { 
    id: 'mustang', name: 'Ford Mustang GT', price: 2000000, image: '/cars/mustang.png',
    performance: { topSpeed: 310, accel: 4.3, power: 460, grip: 76, weight: 1745, nitro: 85 },
    baseStats: mkStats({ topSpeed: 310, accel: 4.3, power: 460, grip: 76, weight: 1745, nitro: 85 }),
  },
  'camaro': { 
    id: 'camaro', name: 'Chevrolet Camaro SS', price: 3500000, image: '/cars/camaro.png',
    performance: { topSpeed: 318, accel: 4.1, power: 455, grip: 80, weight: 1720, nitro: 88 },
    baseStats: mkStats({ topSpeed: 318, accel: 4.1, power: 455, grip: 80, weight: 1720, nitro: 88 }),
  },
  'm3gtr': { 
    id: 'm3gtr', name: 'BMW M3 GTR', price: 6000000, image: '/cars/m3gtr.png',
    performance: { topSpeed: 320, accel: 3.9, power: 450, grip: 88, weight: 1120, nitro: 90 },
    baseStats: mkStats({ topSpeed: 320, accel: 3.9, power: 450, grip: 88, weight: 1120, nitro: 90 }),
  },
  'rs6': { 
    id: 'rs6', name: 'Audi RS6', price: 10000000, image: '/cars/rs6.png',
    performance: { topSpeed: 305, accel: 3.6, power: 600, grip: 82, weight: 2075, nitro: 92 },
    baseStats: mkStats({ topSpeed: 305, accel: 3.6, power: 600, grip: 82, weight: 2075, nitro: 92 }),
  },

  // --- РўРР  4: РЎСѓРїРµСЂРєР°СЂС‹ ---
  'gtr': { 
    id: 'gtr', name: 'Nissan GT-R R35', price: 25000000, image: '/cars/gtr.png',
    performance: { topSpeed: 330, accel: 2.9, power: 600, grip: 92, weight: 1752, nitro: 95 },
    baseStats: mkStats({ topSpeed: 330, accel: 2.9, power: 600, grip: 92, weight: 1752, nitro: 95 }),
  },
  'porsche911': { 
    id: 'porsche911', name: 'Porsche 911 Turbo S', price: 40000000, image: '/cars/porsche911.png',
    performance: { topSpeed: 330, accel: 2.7, power: 650, grip: 94, weight: 1640, nitro: 96 },
    baseStats: mkStats({ topSpeed: 330, accel: 2.7, power: 650, grip: 94, weight: 1640, nitro: 96 }),
  },
  'r8': { 
    id: 'r8', name: 'Audi R8 V10', price: 60000000, image: '/cars/r8.png',
    performance: { topSpeed: 335, accel: 3.1, power: 620, grip: 93, weight: 1595, nitro: 96 },
    baseStats: mkStats({ topSpeed: 335, accel: 3.1, power: 620, grip: 93, weight: 1595, nitro: 96 }),
  },
  'amggt': { 
    id: 'amggt', name: 'Mercedes-AMG GT', price: 85000000, image: '/cars/amggt.png',
    performance: { topSpeed: 325, accel: 3.2, power: 585, grip: 91, weight: 1645, nitro: 95 },
    baseStats: mkStats({ topSpeed: 325, accel: 3.2, power: 585, grip: 91, weight: 1645, nitro: 95 }),
  },

  // --- РўРР  5: РўРѕРїРѕРІС‹Рµ СЃСѓРїРµСЂРєР°СЂС‹ ---
  'ferrari458': { 
    id: 'ferrari458', name: 'Ferrari 458 Italia', price: 150000000, image: '/cars/ferrari458.png',
    performance: { topSpeed: 325, accel: 3.4, power: 570, grip: 94, weight: 1380, nitro: 96 },
    baseStats: mkStats({ topSpeed: 325, accel: 3.4, power: 570, grip: 94, weight: 1380, nitro: 96 }),
  },
  'huracan': { 
    id: 'huracan', name: 'Lamborghini Huracan', price: 250000000, image: '/cars/huracan.png',
    performance: { topSpeed: 325, accel: 3.2, power: 610, grip: 95, weight: 1422, nitro: 97 },
    baseStats: mkStats({ topSpeed: 325, accel: 3.2, power: 610, grip: 95, weight: 1422, nitro: 97 }),
  },
  'mclaren720': { 
    id: 'mclaren720', name: 'McLaren 720S', price: 350000000, image: '/cars/mclaren720.png',
    performance: { topSpeed: 341, accel: 2.9, power: 720, grip: 96, weight: 1419, nitro: 98 },
    baseStats: mkStats({ topSpeed: 341, accel: 2.9, power: 720, grip: 96, weight: 1419, nitro: 98 }),
  },
  'aventador': { 
    id: 'aventador', name: 'Lamborghini Aventador', price: 500000000, image: '/cars/aventador.png',
    performance: { topSpeed: 350, accel: 2.9, power: 740, grip: 95, weight: 1575, nitro: 98 },
    baseStats: mkStats({ topSpeed: 350, accel: 2.9, power: 740, grip: 95, weight: 1575, nitro: 98 }),
  },

  // --- РўРР  6: Р“РёРїРµСЂРєР°СЂС‹ ---
  'sf90': { 
    id: 'sf90', name: 'Ferrari SF90', price: 1000000000, image: '/cars/sf90.png',
    performance: { topSpeed: 340, accel: 2.5, power: 1000, grip: 98, weight: 1570, nitro: 99 },
    baseStats: mkStats({ topSpeed: 340, accel: 2.5, power: 1000, grip: 98, weight: 1570, nitro: 99 }),
  },
  'veyron': { 
    id: 'veyron', name: 'Bugatti Veyron', price: 1500000000, image: '/cars/veyron.png',
    performance: { topSpeed: 407, accel: 2.5, power: 1001, grip: 96, weight: 1888, nitro: 99 },
    baseStats: mkStats({ topSpeed: 407, accel: 2.5, power: 1001, grip: 96, weight: 1888, nitro: 99 }),
  },
  'chiron': { 
    id: 'chiron', name: 'Bugatti Chiron', price: 2500000000, image: '/cars/chiron.png',
    performance: { topSpeed: 420, accel: 2.4, power: 1500, grip: 97, weight: 1995, nitro: 100 },
    baseStats: mkStats({ topSpeed: 420, accel: 2.4, power: 1500, grip: 97, weight: 1995, nitro: 100 }),
  },
  'speedtail': { 
    id: 'speedtail', name: 'McLaren Speedtail', price: 4000000000, image: '/cars/speedtail.png',
    performance: { topSpeed: 403, accel: 2.5, power: 1050, grip: 97, weight: 1430, nitro: 100 },
    baseStats: mkStats({ topSpeed: 403, accel: 2.5, power: 1050, grip: 97, weight: 1430, nitro: 100 }),
  },
  'jesko': { 
    id: 'jesko', name: 'Koenigsegg Jesko', price: 6000000000, image: '/cars/jesko.png',
    performance: { topSpeed: 480, accel: 2.5, power: 1600, grip: 99, weight: 1420, nitro: 100 },
    baseStats: mkStats({ topSpeed: 480, accel: 2.5, power: 1600, grip: 99, weight: 1420, nitro: 100 }),
  },
  'solus': { 
    id: 'solus', name: 'McLaren Solus GT', price: 10000000000, image: '/cars/placeholder.png',
    performance: { topSpeed: 400, accel: 2.1, power: 840, grip: 100, weight: 1000, nitro: 100 },
    baseStats: mkStats({ topSpeed: 400, accel: 2.1, power: 840, grip: 100, weight: 1000, nitro: 100 }),
  },
};
```

### src/config/clans.ts
```ts
export const CLAN_CREATE_COST = 100000;

export const CLAN_LEVELS = [
  { level: 1, upgradeCost: 0, maxMembers: 5, clickBonus: 0 },
  { level: 2, upgradeCost: 500000, maxMembers: 7, clickBonus: 1 },
  { level: 3, upgradeCost: 1500000, maxMembers: 10, clickBonus: 2 },
  { level: 4, upgradeCost: 4000000, maxMembers: 15, clickBonus: 3 },
  { level: 5, upgradeCost: 10000000, maxMembers: 20, clickBonus: 5 },
  { level: 6, upgradeCost: 25000000, maxMembers: 30, clickBonus: 7 },
  { level: 7, upgradeCost: 50000000, maxMembers: 40, clickBonus: 10 },
  { level: 8, upgradeCost: 100000000, maxMembers: 50, clickBonus: 15 },
];

export function getClanStats(level: number) {
  return CLAN_LEVELS.find(l => l.level === level) || CLAN_LEVELS[0];
}
```

### src/config/garage.ts
```ts
// src/config/garage.ts

export type UpgradeType = 'engine' | 'tires' | 'suspension' | 'ecu' | 'paint';

export const PAINT_COLORS = [
  { id: 'original', label: 'Р—Р°РІРѕРґСЃРєРѕР№',  hex: 'transparent' },
  { id: 'red',      label: 'РљСЂР°СЃРЅС‹Р№',    hex: '#ff0000' },
  { id: 'blue',     label: 'РЎРёРЅРёР№',      hex: '#0055ff' },
  { id: 'green',    label: 'Р—РµР»РµРЅС‹Р№',    hex: '#00d97e' },
  { id: 'yellow',   label: 'Р–РµР»С‚С‹Р№',     hex: '#ffcc00' },
  { id: 'purple',   label: 'Р¤РёРѕР»РµС‚РѕРІС‹Р№', hex: '#b000ff' },
  { id: 'matte',    label: 'РњР°С‚РѕРІС‹Р№',    hex: '#333333' },
  { id: 'white',    label: 'Р‘РµР»С‹Р№',      hex: '#ffffff' },
];
```

### src/config/items.ts
```ts
// src/config/items.ts
import { CARS } from './cars';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemSlot = 'engine' | 'tires' | 'suspension' | 'ecu';

export interface ItemConfig {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: ItemRarity;
  stats: { power: number; topSpeed: number; grip: number; handling: number; };
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#aaaaaa',
  uncommon: '#00d97e',
  rare: '#00bfff',
  epic: '#b000ff',
  legendary: '#ffcc00',
};

export const ITEMS: Record<string, ItemConfig> = {
  'engine_1': { id: 'engine_1', name: 'РЎС‚РѕРєРѕРІС‹Р№ РјРѕС‚РѕСЂ', slot: 'engine', rarity: 'common', stats: { power: 20, topSpeed: 5, grip: 0, handling: 0 } },
  'engine_2': { id: 'engine_2', name: 'РўСѓСЂР±Рѕ-РєРёС‚ Stage 1', slot: 'engine', rarity: 'uncommon', stats: { power: 50, topSpeed: 10, grip: 0, handling: 0 } },
  'engine_3': { id: 'engine_3', name: 'V8 Р‘РёС‚СѓСЂР±Рѕ', slot: 'engine', rarity: 'rare', stats: { power: 120, topSpeed: 25, grip: 0, handling: 0 } },
  'engine_4': { id: 'engine_4', name: 'Р”РІРёРіР°С‚РµР»СЊ РѕС‚ Р“РўР ', slot: 'engine', rarity: 'epic', stats: { power: 250, topSpeed: 50, grip: 5, handling: 0 } },
  'engine_5': { id: 'engine_5', name: 'РџСЂРѕС‚РѕС‚РёРї F1', slot: 'engine', rarity: 'legendary', stats: { power: 500, topSpeed: 100, grip: 10, handling: 10 } },
  
  'tires_1': { id: 'tires_1', name: 'РЈР»РёС‡РЅР°СЏ СЂРµР·РёРЅР°', slot: 'tires', rarity: 'common', stats: { power: 0, topSpeed: 0, grip: 15, handling: 5 } },
  'tires_2': { id: 'tires_2', name: 'РџРѕР»СѓСЃР»РёРє', slot: 'tires', rarity: 'uncommon', stats: { power: 0, topSpeed: 2, grip: 35, handling: 10 } },
  'tires_3': { id: 'tires_3', name: 'РЎР»РёРє Michelin', slot: 'tires', rarity: 'rare', stats: { power: 0, topSpeed: 5, grip: 60, handling: 20 } },
  'tires_4': { id: 'tires_4', name: 'Р”СЂРёС„С‚-СЂРµР·РёРЅР°', slot: 'tires', rarity: 'epic', stats: { power: 0, topSpeed: 10, grip: 90, handling: 40 } },
  'tires_5': { id: 'tires_5', name: 'РќР°РЅРѕ-СЂРµР·РёРЅР°', slot: 'tires', rarity: 'legendary', stats: { power: 10, topSpeed: 20, grip: 150, handling: 80 } },
  
  'ecu_1': { id: 'ecu_1', name: 'Р—Р°РІРѕРґСЃРєР°СЏ РїСЂРѕС€РёРІРєР°', slot: 'ecu', rarity: 'common', stats: { power: 5, topSpeed: 5, grip: 0, handling: 10 } },
  'ecu_2': { id: 'ecu_2', name: 'Р§РёРї-С‚СЋРЅРёРЅРі', slot: 'ecu', rarity: 'uncommon', stats: { power: 15, topSpeed: 10, grip: 0, handling: 20 } },
  'ecu_3': { id: 'ecu_3', name: 'Р“РѕРЅРѕС‡РЅС‹Р№ ECU', slot: 'ecu', rarity: 'rare', stats: { power: 30, topSpeed: 20, grip: 5, handling: 40 } },
  'ecu_4': { id: 'ecu_4', name: 'РҐР°РєРµСЂСЃРєРёР№ Р±Р»РѕРє', slot: 'ecu', rarity: 'epic', stats: { power: 60, topSpeed: 40, grip: 10, handling: 70 } },
  'ecu_5': { id: 'ecu_5', name: 'РР-РЈРїСЂР°РІР»РµРЅРёРµ', slot: 'ecu', rarity: 'legendary', stats: { power: 100, topSpeed: 60, grip: 20, handling: 100 } },
  
  'susp_1': { id: 'susp_1', name: 'РЎС‚РѕРєРѕРІР°СЏ РїРѕРґРІРµСЃРєР°', slot: 'suspension', rarity: 'common', stats: { power: 0, topSpeed: 0, grip: 5, handling: 15 } },
  'susp_2': { id: 'susp_2', name: 'РЎРїРѕСЂС‚-РїСЂСѓР¶РёРЅС‹', slot: 'suspension', rarity: 'uncommon', stats: { power: 0, topSpeed: 0, grip: 10, handling: 35 } },
  'susp_3': { id: 'susp_3', name: 'Р’РёРЅС‚РѕРІР°СЏ РїРѕРґРІРµСЃРєР°', slot: 'suspension', rarity: 'rare', stats: { power: 0, topSpeed: 2, grip: 20, handling: 60 } },
  'susp_4': { id: 'susp_4', name: 'РџРЅРµРІРјРѕ-РїРѕРґРІРµСЃРєР°', slot: 'suspension', rarity: 'epic', stats: { power: 0, topSpeed: 5, grip: 40, handling: 90 } },
  'susp_5': { id: 'susp_5', name: 'РњР°РіРЅРёС‚РЅР°СЏ РїРѕРґРІРµСЃРєР° F1', slot: 'suspension', rarity: 'legendary', stats: { power: 10, topSpeed: 10, grip: 80, handling: 150 } },
};

export const ALL_ITEM_IDS = Object.keys(ITEMS);
export const RARITY_DROP_CHANCE: Record<string, number> = {
  common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1,
};

// РљРѕРЅСЃС‚Р°РЅС‚С‹ РєР°РїРѕРІ Рё РјРЅРѕР¶РёС‚РµР»РµР№
const MAX_POWER = 1800;
const MAX_TOP_SPEED = 500;
const MAX_POWER_BONUS = 1.5;
const MAX_SPEED_BONUS = 1.0;
const MIN_ACCEL = 1.2;

const diminishing = (raw: number) => 1 - Math.pow(2, -raw);

export function calculateStats(
  equipped: Record<string, string | null>, 
  partUpgrades: Record<string, any> = {},
  activeCarId: string = 'vaz-2107'
) {
  const carConfig = CARS[activeCarId] || CARS['vaz-2107'];
  const perf = carConfig.performance;

  let rawPowerPct = 0;
  let rawSpeedPct = 0;
  let rawGripFlat = 0;
  let rawAccelPct = 0;

  Object.values(equipped).forEach((itemId) => {
    if (!itemId || !ITEMS[itemId]) return;
    const item = ITEMS[itemId];
    const upg = partUpgrades[itemId] || { level: 0, goldStars: 0, redStars: 0 };

    const levelMulti = 1 + (upg.level || 0) * 0.02;
    const goldMulti = 1 + (upg.goldStars || 0) * 0.10;
    const redMulti = 1 + (upg.redStars || 0) * 0.25;
    const finalMulti = levelMulti * goldMulti * redMulti;

    rawPowerPct += (item.stats.power / 100) * finalMulti;
    rawSpeedPct += (item.stats.topSpeed / 100) * finalMulti;
    rawGripFlat += (item.stats.grip / 100) * finalMulti * 50;
    rawAccelPct += ((item.stats.grip + item.stats.handling) / 100) * finalMulti;
  });

  const powerMultiplier = 1 + diminishing(rawPowerPct) * MAX_POWER_BONUS;
  const speedMultiplier = 1 + diminishing(rawSpeedPct) * MAX_SPEED_BONUS;

  let totalPower = perf.power * powerMultiplier;
  let totalTopSpeed = perf.topSpeed * speedMultiplier;
  let totalGrip = Math.min(100, perf.grip + rawGripFlat);

  const accelBonus = Math.min(0.6, diminishing(rawAccelPct) * 0.6);
  let totalAccel = Math.max(MIN_ACCEL, perf.accel * (1 - accelBonus));

  totalPower = Math.min(totalPower, MAX_POWER);
  totalTopSpeed = Math.min(totalTopSpeed, MAX_TOP_SPEED);

  const rating = Math.round(
    totalPower * 0.3 + totalTopSpeed * 2 + (10 - totalAccel) * 50 + totalGrip * 3
  );

  return {
    power: Math.round(totalPower),
    topSpeed: Math.round(totalTopSpeed),
    grip: Math.round(totalGrip),
    handling: Math.round(totalGrip * 1.05),
    accel: Math.round(totalAccel * 100) / 100,
    rating,
  };
}

export const SELL_PRICES: Record<ItemRarity, number> = {
  common: 100, uncommon: 500, rare: 2500, epic: 15000, legendary: 75000,
};
```

### src/config/leagues.ts
```ts
// src/config/leagues.ts
export type LeagueId = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface League {
  id: LeagueId;
  name: string;
  color: string;
  gradient: string;
  icon: string;
  minPoints: number;
  maxPoints: number;
  winPoints: number;
  losePoints: number;
}

export const LEAGUES: League[] = [
  {
    id: 'bronze',
    name: 'Р‘СЂРѕРЅР·Р°',
    color: '#cd7f32',
    gradient: 'linear-gradient(135deg, #cd7f32, #8b5a2b)',
    icon: 'рџҐ‰',
    minPoints: 0,
    maxPoints: 499,
    winPoints: 15,
    losePoints: -5,
  },
  {
    id: 'silver',
    name: 'РЎРµСЂРµР±СЂРѕ',
    color: '#c0c0c0',
    gradient: 'linear-gradient(135deg, #e0e0e0, #a0a0a0)',
    icon: 'рџҐ€',
    minPoints: 500,
    maxPoints: 1499,
    winPoints: 20,
    losePoints: -8,
  },
  {
    id: 'gold',
    name: 'Р—РѕР»РѕС‚Рѕ',
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700, #b8860b)',
    icon: 'рџҐ‡',
    minPoints: 1500,
    maxPoints: 2999,
    winPoints: 25,
    losePoints: -10,
  },
  {
    id: 'platinum',
    name: 'РџР»Р°С‚РёРЅР°',
    color: '#5ce1e6',
    gradient: 'linear-gradient(135deg, #5ce1e6, #1f7c8a)',
    icon: 'в‚Ѕ',
    minPoints: 3000,
    maxPoints: 4999,
    winPoints: 30,
    losePoints: -12,
  },
  {
    id: 'diamond',
    name: 'РђР»РјР°Р·',
    color: '#b9a4ff',
    gradient: 'linear-gradient(135deg, #b9a4ff, #5a3ec8)',
    icon: 'рџ’ ',
    minPoints: 5000,
    maxPoints: Infinity,
    winPoints: 40,
    losePoints: -15,
  },
];

export const getLeagueByPoints = (points: number): League => {
  return LEAGUES.find(l => points >= l.minPoints && points <= l.maxPoints) || LEAGUES[0];
};

export const getLeagueById = (id: LeagueId): League => {
  return LEAGUES.find(l => l.id === id) || LEAGUES[0];
};

export const getLeagueProgress = (points: number): number => {
  const league = getLeagueByPoints(points);
  if (league.id === 'diamond') return 100;
  const range = league.maxPoints - league.minPoints;
  const current = points - league.minPoints;
  return Math.min(100, Math.max(0, (current / range) * 100));
};

export const getNextLeague = (currentId: LeagueId): League | null => {
  const idx = LEAGUES.findIndex(l => l.id === currentId);
  return idx >= 0 && idx < LEAGUES.length - 1 ? LEAGUES[idx + 1] : null;
};
```

### src/config/levelRewards.ts
```ts
// src/config/levelRewards.ts

export interface LevelReward {
  level: number;
  rubles?: number;
  stars?: number;
  caseType?: string; // 'hourly' | 'rare' | 'legendary'
}

export const LEVEL_REWARDS: LevelReward[] = [
  // 1-5: СЃС‚Р°СЂС‚РѕРІС‹Рµ
  { level: 2,  rubles: 1000 },
  { level: 3,  rubles: 2500 },
  { level: 4,  rubles: 5000 },
  { level: 5,  rubles: 10000 },

  // 6-10: Р·РІС‘Р·РґС‹ РЅР°С‡РёРЅР°СЋС‚СЃСЏ
  { level: 6,  rubles: 25000,  stars: 1 },
  { level: 7,  rubles: 50000,  stars: 1 },
  { level: 8,  rubles: 100000, stars: 1 },
  { level: 9,  rubles: 200000, stars: 2 },
  { level: 10, rubles: 500000, stars: 2 },

  // 11-20: РєРµР№СЃС‹
  { level: 11, rubles: 1000000,  stars: 2 },
  { level: 12, rubles: 1500000,  stars: 2 },
  { level: 13, rubles: 2000000,  stars: 3 },
  { level: 14, rubles: 3000000,  stars: 3, caseType: 'hourly' },
  { level: 15, rubles: 5000000,  stars: 3, caseType: 'hourly' },
  { level: 16, rubles: 7500000,  stars: 4 },
  { level: 17, rubles: 10000000, stars: 4 },
  { level: 18, rubles: 15000000, stars: 4 },
  { level: 19, rubles: 20000000, stars: 5 },
  { level: 20, rubles: 30000000, stars: 5, caseType: 'rare' },

  // 21-30: РєСЂСѓРїРЅСЏРє
  { level: 21, rubles: 40000000,  stars: 5 },
  { level: 22, rubles: 50000000,  stars: 6 },
  { level: 23, rubles: 60000000,  stars: 6 },
  { level: 24, rubles: 70000000,  stars: 6 },
  { level: 25, rubles: 100000000, stars: 10, caseType: 'rare' },

  // 26-50: Р»РµРіРµРЅРґР°СЂРЅС‹Рµ
  { level: 30, rubles: 250000000, stars: 15, caseType: 'legendary' },
  { level: 35, rubles: 500000000, stars: 20, caseType: 'legendary' },
  { level: 40, rubles: 1000000000, stars: 25, caseType: 'legendary' },
  { level: 45, rubles: 2000000000, stars: 30, caseType: 'legendary' },
  { level: 50, rubles: 5000000000, stars: 50, caseType: 'legendary' },
];

// РҐРµР»РїРµСЂ: РїРѕР»СѓС‡РёС‚СЊ РЅР°РіСЂР°РґСѓ РїРѕ СѓСЂРѕРІРЅСЋ
export function getLevelReward(level: number): LevelReward | null {
  return LEVEL_REWARDS.find(r => r.level === level) || null;
}

// РҐРµР»РїРµСЂ: РїРѕР»СѓС‡РёС‚СЊ РјР°РєСЃРёРјР°Р»СЊРЅС‹Р№ СѓСЂРѕРІРµРЅСЊ, РґРѕ РєРѕС‚РѕСЂРѕРіРѕ РµСЃС‚СЊ РЅР°РіСЂР°РґС‹
export function getMaxRewardLevel(): number {
  return Math.max(...LEVEL_REWARDS.map(r => r.level));
}

// РҐРµР»РїРµСЂ: СѓСЂРѕРІРµРЅСЊ РїРѕ XP
export function calcLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}
```

### src/config/pass.ts
```ts
export interface PassLevel {
  level: number;
  xpReq: number;
  reward: number;
}

export const PASS_LEVELS: PassLevel[] = [
  { level: 1, xpReq: 1000, reward: 5000 },
  { level: 2, xpReq: 5000, reward: 15000 },
  { level: 3, xpReq: 15000, reward: 30000 },
  { level: 4, xpReq: 35000, reward: 50000 },
  { level: 5, xpReq: 70000, reward: 100000 },
  { level: 6, xpReq: 120000, reward: 150000 },
  { level: 7, xpReq: 200000, reward: 250000 },
  { level: 8, xpReq: 350000, reward: 400000 },
  { level: 9, xpReq: 500000, reward: 700000 },
  { level: 10, xpReq: 750000, reward: 1000000 },
];
```

### src/config/racing.ts
```ts
export interface UpgradeLevels {
  engine: number;
  tires: number;
  suspension: number;
  diagnostics: number;
}

export interface RacingStats {
  power: number;
  topSpeed: number;
  accel: number;
  grip: number;
  handling: number;
  rating: number;
}

/** Р”РѕР»Р¶РЅРѕ СЃРѕРІРїР°РґР°С‚СЊ СЃ api/lib/upgrades.ts:getRacingStats */
export function getRacingStats(levels: UpgradeLevels): RacingStats {
  const { engine, tires, suspension, diagnostics } = levels;

  const power = 200 + engine * 35;
  const topSpeed = 220 + engine * 12 + tires * 2;
  const accel = Math.max(
    2.0,
    6.5 - engine * 0.15 - tires * 0.08 - suspension * 0.02,
  );
  const grip = Math.min(100, tires * 4 + suspension * 2);
  const handling = Math.min(100, suspension * 4 + diagnostics * 1.5);

  const rating = Math.round(
    engine * 10 + tires * 8 + suspension * 8 + diagnostics * 6,
  );

  return {
    power,
    topSpeed,
    accel: Math.round(accel * 100) / 100,
    grip,
    handling,
    rating,
  };
}
```

### src/hooks/useAdsgram.ts
```ts
import { useCallback, useEffect, useRef } from 'react';
import WebApp from '@twa-dev/sdk';

export function useAdsgram({ blockId, onReward, onError }: { blockId: string; onReward: () => void; onError: (err: any) => void; }) {
  const adControllerRef = useRef<any>(null);

  useEffect(() => {
    if (window.Adsgram) {
      adControllerRef.current = window.Adsgram.init({ blockId });
    }
  }, [blockId]);

  return useCallback(async () => {
    if (!adControllerRef.current) {
      onError('Adsgram РЅРµ Р·Р°РіСЂСѓР¶РµРЅ');
      return;
    }
    try {
      const result = await adControllerRef.current.show();
      if (result.done) {
        onReward(); // РРіСЂРѕРє РґРѕСЃРјРѕС‚СЂРµР»
      } else {
        onError('Р РµРєР»Р°РјР° Р·Р°РєСЂС‹С‚Р°'); // РџСЂРѕРїСѓСЃС‚РёР»
      }
    } catch (error) {
      onError(error);
    }
  }, [onReward, onError]);
}
```

### src/lib/telegram.ts
```ts
import WebApp from '@twa-dev/sdk';

export const tg = WebApp;

// Р¤Р»Р°Рі, С‡С‚Рѕ РјС‹ РІ Р»РѕРєР°Р»СЊРЅРѕР№ СЂР°Р·СЂР°Р±РѕС‚РєРµ (Vite)
export const isDev = import.meta.env.DEV;

// Р¤РµР№РєРѕРІС‹Р№ ID (РјРѕР¶РµС€СЊ РїРѕСЃС‚Р°РІРёС‚СЊ СЃРІРѕР№ СЂРµР°Р»СЊРЅС‹Р№ TG ID, С‡С‚РѕР±С‹ РІРёРґРµС‚СЊ СЃРІРѕРё РґР°РЅРЅС‹Рµ)
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
```

### src/main.tsx
```tsx
// src/main.tsx
import './styles/loading.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/races.css';   
import './styles/case.css';   
import './styles/variables.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/race.css';
import './styles/garage.css';
import './styles/profile.css';
import './styles/referral.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### src/store/gameStore.ts
```ts
// src/store/gameStore.ts
import { create } from 'zustand';
import { calculateStats, ITEMS, SELL_PRICES } from '../config/items';
import { getInitData } from '../lib/telegram';

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData: string; }; };
  }
}

export interface PartUpgrade {
  level: number;
  goldStars: number;
  redStars: number;
  upgradingUntil: number | null;
  upgradeType: 'level' | 'gold' | 'red' | null;
}

export interface UserData {
  id: number; username: string | null; firstName: string | null; lastName: string | null;
  photoUrl: string | null; balance: number; totalEarned: number; starsBalance: number;
  level: number; xp: number; activeCarId: string; createdAt: string;
  referredBy: number | null; referralEarnings: number; rating: number;
  ownedCars?: string[]; 
  clickLevel?: number;      
  offlineLevel?: number;
  dailyStreak?: number;
  lastDailyClaim?: string | null;
  lastAdCaseAt?: string | null;
  businesses?: Record<string, { level: number; lastCollected: number }>;
  partUpgrades?: Record<string, PartUpgrade>;
  features?: Record<string, boolean>;
  leaguePoints?: number;
  weeklyPass?: { 
    weekId: number; 
    xp: number; 
    isPremium?: boolean; 
    claimed: number[]; 
    claimedPremium?: number[]; 
  };
  isAdmin?: boolean;
  lastClaimedLevel?: number; // рџ‘€ РќРћР’РћР•

  // рџ‘‡ РџРћР›РЇ РЎРўРђРўРРЎРўРРљР
  totalClicks?: number;
  totalRaces?: number;
  totalWins?: number;
  totalLosses?: number;
  earnedFromClicks?: number;
  earnedFromRaces?: number;
  earnedFromBusiness?: number;
}

interface GameState {
  user: UserData | null;
  balance: number;
  unsyncedTaps: number;
  unsyncedClicks: number;
  isSyncing: boolean;
  tapCountInSecond: number;
  lastTapSecond: number;
  carColor: string;
  inventory: string[];
  equipped: Record<string, string | null>;
  lastDroppedItem: any | null;
  history: any[];
  achievementsList: any[];
  
  clanInfo: any | null;
  clanMembers: any[];
  clansList: any[];
  clanMessages: any[];
  hasUnreadClanMessages: boolean;
  lastReadClanMessageId: string | null;
  clanBoss: any | null;
  bossDamageStats: any[];
  referrals: any[];

  // рџ‘‡ РњР•РўРћР”: Р·Р°Р±СЂР°С‚СЊ РЅР°РіСЂР°РґСѓ Р·Р° СѓСЂРѕРІРµРЅСЊ
  claimLevelReward: () => Promise<{
    success: boolean;
    claimed?: any[];
    totalRubles?: number;
    totalStars?: number;
    caseType?: string | null;
    error?: string;
  }>;

  upgradePart: (itemId: string, type: 'level' | 'gold' | 'red') => Promise<boolean>;
  claimUpgrade: (itemId: string) => Promise<boolean>;
  craftItem: (itemId: string) => Promise<boolean>;
  buyBusiness: (businessId: string) => Promise<boolean>;
  upgradeBusiness: (businessId: string) => Promise<boolean>;
  collectIncome: () => Promise<{ success: boolean; collected?: number }>;
  adminGetData: () => Promise<{ flags: any[], users: any[] } | null>;
  adminAction: (action: string, payload: any) => Promise<boolean>;
  playCoinFlip: (betAmount: number, choice: 'heads' | 'tails') => Promise<{ success: boolean; isWin?: boolean; result?: string; payout?: number; error?: string }>;
  
  fetchClans: () => Promise<void>;
  fetchClanMessages: () => Promise<void>;
  sendClanMessage: (message: string) => Promise<boolean>;
  markClanChatAsRead: () => void;
  fetchReferrals: () => Promise<void>;
  skipUpgradeTime: (itemId: string, reduceMs?: number) => Promise<boolean>;
  
  setUser: (user: UserData, inventory: string[], equipped: Record<string, string | null>) => void;
  tap: () => void;
  syncTaps: () => Promise<void>;
  setCarColor: (color: string) => void;
  equipItem: (slot: string, itemId: string) => Promise<boolean>;
  setLastDroppedItem: (item: any) => void;
  openCase: (caseType: string) => Promise<{ success: boolean; wonItem?: any; error?: string }>;
  
  fetchClan: () => Promise<void>;
  createClan: (name: string) => Promise<boolean>;
  fetchHistory: () => Promise<void>;
  joinClan: (clanName: string) => Promise<boolean>;
  clanAction: (action: string, amount?: number, targetId?: number, role?: string) => Promise<boolean>;
  fetchClanBoss: () => Promise<void>;
  attackClanBoss: () => Promise<{ success: boolean; damage?: number; isDefeated?: boolean; reward?: number; playerCoins?: number }>;
  
  startBotRace: () => Promise<{ success: boolean; result?: any }>;
  switchCar: (carId: string) => Promise<void>;
  
  reportPvpResult: (data: { 
    won: boolean; 
    ratingDelta: number; 
    coinsDelta: number; 
    playerStats?: any 
  }) => Promise<void>;
  
  buyCar: (carId: string, price: number) => Promise<boolean>;
  sellItem: (itemId: string) => Promise<boolean>;
  upgradeClicker: () => Promise<void>;
  upgradeOffline: () => Promise<void>;
  claimDaily: () => Promise<boolean>;
  claimQuest: (questId: string) => Promise<any>;
  getPass: () => Promise<void>;
  getAchievements: () => Promise<void>;
  claimAchievement: (id: string) => Promise<boolean>;
  claimPassReward: (level: number, track: 'free' | 'premium') => Promise<boolean>;
  buyPremiumPass: () => Promise<{ success: boolean; error?: string }>;
  addLeaguePoints: (points: number) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null, balance: 0, unsyncedTaps: 0, unsyncedClicks: 0, isSyncing: false,
  tapCountInSecond: 0, lastTapSecond: 0, carColor: 'original',
  inventory: [], 
  equipped: { engine: null, tires: null, ecu: null, suspension: null }, 
  lastDroppedItem: null,
  history: [],
  achievementsList: [],
  
  clanInfo: null,
  clanMembers: [],
  clansList: [],
  clanMessages: [],
  hasUnreadClanMessages: false,
  lastReadClanMessageId: null,
  clanBoss: null,
  bossDamageStats: [],
  referrals: [],

  setUser: (user, inventory, equipped) => set({ user, balance: user.balance, inventory, equipped }),

  tap: () => {
    const state = get(); const now = Date.now();
    const tapPower = state.user?.clickLevel || 1; 
    
    let newTapCount = state.tapCountInSecond; let lastSecond = state.lastTapSecond;
    if (now - lastSecond > 1000) { newTapCount = 1; lastSecond = now; } 
    else { if (newTapCount >= 15) return; newTapCount += 1; }
    
    set((s) => ({
      tapCountInSecond: newTapCount, lastTapSecond: lastSecond,
      balance: s.balance + tapPower,
      user: s.user ? { 
        ...s.user, 
        totalEarned: s.user.totalEarned + tapPower,
        totalClicks: (s.user.totalClicks || 0) + 1,
        earnedFromClicks: (s.user.earnedFromClicks || 0) + tapPower,
        xp: (s.user.xp || 0) + 1,
      } : null,
      unsyncedTaps: s.unsyncedTaps + tapPower,
      unsyncedClicks: s.unsyncedClicks + 1,
    }));
  },

  openCase: async (caseType) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=openCase', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, caseType }),
      });
      const data = await res.json();
      
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { 
            ...s.user, 
            balance: data.newBalance, 
            starsBalance: data.newStars ?? s.user.starsBalance,
            lastAdCaseAt: data.lastAdCaseAt ?? s.user.lastAdCaseAt
          } : null,
          inventory: data.wonItem.id.startsWith('coins_') ? s.inventory : [...s.inventory, data.wonItem.id] 
        }));
        return { success: true, wonItem: data.wonItem };
      }
      return { success: false, error: data.error };
    } catch (e) {
      return { success: false, error: 'РћС€РёР±РєР° СЃРµС‚Рё' };
    }
  },

  fetchHistory: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getHistory', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ history: data.history });
    } catch (e) { console.error(e); }
  },

  fetchReferrals: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getReferrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ referrals: data.referrals });
    } catch (e) {
      console.error('[fetchReferrals]', e);
    }
  },

  fetchClan: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getClan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ clanInfo: data.clan, clanMembers: data.members });
    } catch {}
  },

  fetchClans: async () => {
    const initData = getInitData(); 
    try {
      const res = await fetch('/api/game?action=getClans', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ clansList: data.clans });
    } catch (e) { console.error(e); }
  },

  addLeaguePoints: async (points: number) => {
    const { user } = get();
    if (!user) return;

    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=addLeaguePoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, points }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          user: s.user ? { ...s.user, leaguePoints: data.newLeaguePoints } : null,
        }));
      }
    } catch (e) {
      console.error('[addLeaguePoints]', e);
    }
  },

  fetchClanMessages: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getClanMessages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => {
          const msgs = data.messages;
          const newestMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
          const isNew = newestMsg && newestMsg.id !== state.lastReadClanMessageId;
          return {
            clanMessages: msgs,
            hasUnreadClanMessages: isNew ? true : state.hasUnreadClanMessages
          };
        });
      }
    } catch (e) { console.error(e); }
  },

  markClanChatAsRead: () => {
    const msgs = get().clanMessages;
    const newest = msgs.length > 0 ? msgs[msgs.length - 1] : null;
    set({ 
      hasUnreadClanMessages: false, 
      lastReadClanMessageId: newest ? newest.id : null 
    });
  },

  sendClanMessage: async (message) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=sendClanMessage', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, message }),
      });
      const data = await res.json();
      return data.success;
    } catch { return false; }
  },

  adminGetData: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=admin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action: 'getData' }),
      });
      const data = await res.json();
      if (data.success) return { flags: data.flags, users: data.users };
      return null;
    } catch { return null; }
  },

  adminAction: async (action, payload) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=admin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action, payload }),
      });
      const data = await res.json();
      return data.success;
    } catch { return false; }
  },

  createClan: async (name) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=createClan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, name }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({ balance: data.newBalance, user: s.user ? { ...s.user, balance: data.newBalance } : null }));
        await get().fetchClan();
        return true;
      }
      return false;
    } catch { return false; }
  },

  joinClan: async (clanName) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=joinClan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, clanName }),
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchClan();
        return true;
      }
      return false;
    } catch { return false; }
  },

  clanAction: async (action, amount = 0, targetId, role) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=clanAction', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action, amount, targetId, role }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.newBalance !== undefined) {
          set((s) => ({ balance: data.newBalance, user: s.user ? { ...s.user, balance: data.newBalance } : null }));
        }
        await get().fetchClan(); 
        return true;
      }
      return false;
    } catch { return false; }
  },

  fetchClanBoss: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getClanBoss', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ clanBoss: data.boss, bossDamageStats: data.damageStats }); 
    } catch (e) { console.error(e); }
  },

  attackClanBoss: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=attackClanBoss', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          clanBoss: state.clanBoss ? { ...state.clanBoss, currentHp: data.newHp } : null,
          balance: data.newBalance,
          user: state.user ? { ...state.user, balance: data.newBalance } : null
        }));
        if (data.isDefeated) {
          get().fetchClanBoss();
          get().fetchClan();
        }
        return { success: true, damage: data.damage, isDefeated: data.isDefeated, reward: data.reward, playerCoins: data.playerCoins };
      }
      return { success: false };
    } catch { return { success: false }; }
  },

  buyBusiness: async (businessId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=buyBusiness', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, businessId }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance, businesses: data.businesses } : null
        }));
        return true;
      }
      return false;
    } catch { return false; }
  },

  playCoinFlip: async (betAmount, choice) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=flipCoin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, betAmount, choice }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance } : null
        }));
        return { success: true, isWin: data.isWin, result: data.result, payout: data.payout };
      }
      return { success: false, error: data.error || 'РћС€РёР±РєР° СЃРµСЂРІРµСЂР°' };
    } catch (e) {
      return { success: false, error: 'РћС€РёР±РєР° СЃРµС‚Рё' };
    }
  },

  upgradeBusiness: async (businessId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=upgradeBusiness', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, businessId }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance, businesses: data.businesses } : null
        }));
        return true;
      }
      return false;
    } catch { return false; }
  },

  collectIncome: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=collectIncome', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { 
            ...s.user, 
            balance: data.newBalance, 
            businesses: data.businesses,
            earnedFromBusiness: data.earnedFromBusiness ?? s.user.earnedFromBusiness,
          } : null
        }));
        return { success: true, collected: data.collected };
      }
      return { success: false };
    } catch { return { success: false }; }
  },

  upgradePart: async (itemId, type) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=upgradePart', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId, type }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance, partUpgrades: data.partUpgrades } : null
        }));
        return true;
      }
      return false;
    } catch { return false; }
  },

  getPass: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getPass', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({ user: s.user ? { ...s.user, weeklyPass: data.pass } : null }));
      }
    } catch {}
  },

  claimPassReward: async (level: number, track: 'free' | 'premium') => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=claimPassReward', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, level, track }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance, weeklyPass: data.pass } : null
        }));
        return true;
      }
      return false;
    } catch { return false; }
  },

  buyPremiumPass: async (): Promise<{ success: boolean; error?: string }> => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=buyPremium', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance, weeklyPass: data.pass } : null
        }));
        return { success: true };
      }
      return { success: false, error: data.error || 'РћС€РёР±РєР° СЃРµСЂРІРµСЂР°' };
    } catch (e) {
      return { success: false, error: 'РћС€РёР±РєР° СЃРµС‚Рё' };
    }
  },

  claimUpgrade: async (itemId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=claimUpgrade', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({ user: s.user ? { ...s.user, partUpgrades: data.partUpgrades } : null }));
        return true;
      }
      return false;
    } catch { return false; }
  },

  craftItem: async (itemId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=craftItem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => {
          const inv = [...s.inventory];
          let removed = 0;
          const newInv = inv.filter(id => {
            if (id === itemId && removed < 5) { removed++; return false; }
            return true;
          });
          newInv.push(data.newItemId);
          return { inventory: newInv };
        });
        return true;
      }
      return false;
    } catch { return false; }
  },

  syncTaps: async () => {
    const { unsyncedTaps, unsyncedClicks, isSyncing } = get();
    if (unsyncedTaps === 0 || isSyncing) return;
    const tapsToSend = unsyncedTaps;
    const clicksToSend = unsyncedClicks;
    set({ unsyncedTaps: 0, unsyncedClicks: 0, isSyncing: true });
    try {
      const initData = getInitData();
      const res = await fetch('/api/game?action=tap', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, amount: tapsToSend, clicks: clicksToSend }),
      });
      if (!res.ok) throw new Error('РћС€РёР±РєР° СЃРµСЂРІРµСЂР°');
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance + s.unsyncedTaps,
          user: s.user ? { 
            ...s.user, 
            totalEarned: data.newTotalEarned + s.unsyncedTaps,
            totalClicks: data.totalClicks ?? s.user.totalClicks,
            earnedFromClicks: data.earnedFromClicks ?? s.user.earnedFromClicks,
            xp: data.xp ?? s.user.xp,
          } : null
        }));
        if (data.droppedItem) {
          set((s) => ({ inventory: [...s.inventory, data.droppedItem.id], lastDroppedItem: data.droppedItem }));
        }
      }
    } catch (error) {
      set((state) => ({ 
        unsyncedTaps: state.unsyncedTaps + tapsToSend,
        unsyncedClicks: state.unsyncedClicks + clicksToSend,
      }));
    } finally { set({ isSyncing: false }); }
  },

  setCarColor: (color) => set({ carColor: color }),
  setLastDroppedItem: (item) => set({ lastDroppedItem: item }),

  equipItem: async (slot: string, itemId: string) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=equip', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, slot, itemId }),
      });
      if (res.ok) {
        set((state) => ({ equipped: { ...state.equipped, [slot]: itemId } }));
        return true;
      }
    } catch (e) {}
    return false;
  },

  startBotRace: async () => {
    const { user, equipped } = get();
    if (!user) return { success: false };
    const playerStats = calculateStats(equipped, user.partUpgrades, user.activeCarId);
    const deviation = () => 0.80 + Math.random() * 0.10;
    const botStats = {
      power: playerStats.power * deviation(), topSpeed: playerStats.topSpeed * deviation(),
      grip: playerStats.grip * deviation(), handling: playerStats.handling * deviation(),
      accel: playerStats.accel * deviation(), rating: playerStats.rating * deviation()
    };
    const calcTime = (stats: any, isBot: boolean = false) => {
      const baseTime = (1000 / stats.topSpeed) * 3600; 
      const penalty = isBot ? (Math.random() * 2.5) : (Math.random() * 1.0);
      return baseTime - (stats.accel * 0.5) - (stats.grip * 0.05) - (stats.handling * 0.05) + penalty;
    };
    const pTime = calcTime(playerStats, false);
    const oTime = calcTime(botStats, true);
    const winner = pTime < oTime ? 'player' : 'opponent';
    const log = [
      `рџЏЃ РЎС‚Р°СЂС‚! РЎРѕРїРµСЂРЅРёРє: Р‘РѕС‚ (Р РµР№С‚РёРЅРі: ${botStats.rating.toFixed(0)})`,
      `Р’С‹ РїСЂРѕРµС…Р°Р»Рё 1000Рј Р·Р° ${pTime.toFixed(2)} СЃРµРє.`,
      `Р‘РѕС‚ РїСЂРѕРµС…Р°Р» Р·Р° ${oTime.toFixed(2)} СЃРµРє.`,
      winner === 'player' ? `рџЏ† РџРѕР±РµРґР°! +1 СЂРµР№С‚РёРЅРі.` : `рџ’Ё РџРѕСЂР°Р¶РµРЅРёРµ...`
    ];
    const reward = winner === 'player' ? (1000 + playerStats.rating * 10) : 0;
    return { success: true, result: { winner, log, playerTime: pTime, opponentTime: oTime, ratingChange: winner === 'player' ? 1 : -1, reward } };
  },

  switchCar: async (carId: string) => {
    const { user } = get();
    if (!user) return;
    const prevCarId = user.activeCarId;
    set({ user: { ...user, activeCarId: carId } });
    try {
      const initData = getInitData();
      const res = await fetch('/api/game?action=switchCar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, carId }),
      });
      if (!res.ok) throw new Error('Failed to switch car');
    } catch (e) {
      console.error(e);
      set((state) => ({ user: state.user ? { ...state.user, activeCarId: prevCarId } : null }));
    }
  },

  reportPvpResult: async ({ won, ratingDelta, coinsDelta, playerStats }) => {
    const { user } = get();
    if (!user) return;
    
    console.log('[PVP] Sending:', { won, ratingDelta, coinsDelta, playerStats });

    const prevBalance = user.balance;
    const prevRating = user.rating;

    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=pvpResult', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, won, ratingDelta, coinsDelta, playerStats }),
      });

      console.log('[PVP] Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[PVP] Server error:', errorText);
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log('[PVP] Response data:', data);
      
      set((state) => ({
        balance: data.newBalance ?? state.balance,
        user: state.user ? { 
          ...state.user, 
          balance: data.newBalance ?? state.user.balance, 
          rating: data.newRating ?? state.user.rating,
          totalRaces: data.totalRaces ?? state.user.totalRaces,
          totalWins: data.totalWins ?? state.user.totalWins,
          totalLosses: data.totalLosses ?? state.user.totalLosses,
          earnedFromRaces: data.earnedFromRaces ?? state.user.earnedFromRaces,
          xp: data.xp ?? state.user.xp,
        } : null
      }));
    } catch (e) {
      console.error('[PVP] Fetch error:', e);
      set((state) => ({
        balance: prevBalance,
        user: state.user ? { ...state.user, balance: prevBalance, rating: prevRating } : null
      }));
    }
  },

  buyCar: async (carId, price) => {
    const { user } = get();
    if (!user) return false;
    if (user.balance < price) return false;
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=buyCar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, carId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((state) => ({
          balance: data.newBalance,
          user: state.user ? { ...state.user, balance: data.newBalance, ownedCars: data.ownedCars } : null
        }));
        return true;
      }
      return false;
    } catch (e) { return false; }
  },

  upgradeClicker: async () => {
  const initData = getInitData();
  try {
    const res = await fetch('/api/game?action=upgradeClicker', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });
    const data = await res.json();
    if (data.success) {
      set((s) => ({
        balance: data.newBalance,
        user: s.user ? { 
          ...s.user, 
          balance: data.newBalance, 
          clickLevel: data.newClickLevel, // рџ‘€ РѕР±РЅРѕРІР»СЏРµРј СѓСЂРѕРІРµРЅСЊ
        } : null,
      }));
    }
  } catch (e) { console.error(e); }
},

  getAchievements: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getAchievements', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ achievementsList: data.achievements });
    } catch {}
  },

  claimAchievement: async (id) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=claimAchievement', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, achievementId: id }),
      });
      const data = await res.json();
      if (data.success) {
        const currentUser = get().user;
        set((s) => ({
          balance: data.newBalance,
          user: currentUser
            ? {
                ...currentUser,
                balance: data.newBalance,
                totalEarned: data.newTotalEarned ?? currentUser.totalEarned,
                xp: data.xp ?? currentUser.xp,
              }
            : null,
          achievementsList: s.achievementsList.map(a => a.id === id ? { ...a, isUnlocked: true } : a),
        }));
        return true;
      }
      return false;
    } catch { return false; }
  },
  
  upgradeOffline: async () => {
  const initData = getInitData();
  try {
    const res = await fetch('/api/game?action=upgradeOffline', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });
    const data = await res.json();
    if (data.success) {
      set((s) => ({
        balance: data.newBalance,
        user: s.user ? { 
          ...s.user, 
          balance: data.newBalance, 
          offlineLevel: data.newOfflineLevel, // рџ‘€ РѕР±РЅРѕРІР»СЏРµРј СѓСЂРѕРІРµРЅСЊ
        } : null,
      }));
    }
  } catch (e) { console.error(e); }
},

  sellItem: async (itemId) => {
    const state = get();
    const user = state.user;
    if (!user) return false;
    const item = ITEMS[itemId];
    if (!item) return false;
    const price = SELL_PRICES[item.rarity] || 100;
    const newInventory = [...state.inventory];
    const index = newInventory.indexOf(itemId);
    if (index === -1) return false;
    newInventory.splice(index, 1); 
    const newBalance = state.balance + price;
    set({ balance: newBalance, inventory: newInventory, user: { ...user, balance: newBalance } });
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=sellItem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      set((s) => ({ balance: data.newBalance, user: s.user ? { ...s.user, balance: data.newBalance } : null }));
      return true;
    } catch (e) {
      set({ balance: state.balance, inventory: state.inventory, user: state.user });
      return false;
    }
  },

  skipUpgradeTime: async (itemId: string, reduceMs = 15 * 60 * 1000) => {
  const initData = getInitData();
  try {
    const res = await fetch('/api/game?action=skipUpgradeTime', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, itemId, reduceMs }),
    });
    const data = await res.json();
    if (data.success) {
      set((s) => ({
        user: s.user ? { ...s.user, partUpgrades: data.partUpgrades } : null,
      }));
      return true;
    }
    return false;
  } catch (e) {
    console.error('[skipUpgradeTime]', e);
    return false;
  }
  },

  claimDaily: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=claimDaily', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((state) => ({
          balance: data.newBalance,
          user: state.user ? { ...state.user, balance: data.newBalance, dailyStreak: data.dailyStreak, xp: data.xp ?? state.user.xp, lastDailyClaim: data.lastDailyClaim } : null
        }));
        return true;
      }
      return false;
    } catch (e) { return false; }
  },

  claimLevelReward: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=claimLevelReward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? {
            ...s.user,
            balance: data.newBalance,
            starsBalance: data.newStars ?? s.user.starsBalance,
            totalEarned: data.newTotalEarned ?? s.user.totalEarned,
            lastClaimedLevel: data.newLastClaimedLevel ?? s.user.lastClaimedLevel,
          } : null,
        }));
        return data;
      }
      return { success: false, error: data.error };
    } catch (e) {
      return { success: false, error: 'РћС€РёР±РєР° СЃРµС‚Рё' };
    }
  },

  claimQuest: async (questId) => {
  const initData = getInitData();
  try {
    const res = await fetch('/api/game?action=claimQuest', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, questId }),
    });
    const data = await res.json();
    if (data.success) {
      set((state) => ({
        balance: data.newBalance,
        user: state.user ? {
          ...state.user,
          balance: data.newBalance,
          totalEarned: data.newTotalEarned ?? state.user.totalEarned,
          xp: data.xp ?? state.user.xp, // рџ‘€ XP
        } : null,
      }));
      return data.quests;
    }
    return null;
  } catch (e) { return null; }
},
}));
```

### src/styles/achievements.css
```css
/* src/styles/achievements.css */

.achievements-screen {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 10000;
  display: flex;
  align-items: center;        /* рџ‘€ С†РµРЅС‚СЂ */
  justify-content: center;
  padding: 16px;              /* рџ‘€ РѕС‚СЃС‚СѓРї РѕС‚ РєСЂР°С‘РІ */
  animation: achFadeIn 0.2s ease-out;
}

@keyframes achFadeIn { from { opacity: 0; } to { opacity: 1; } }

.achievements-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 215, 0, 0.3); /* рџ‘€ СЃРѕ РІСЃРµС… СЃС‚РѕСЂРѕРЅ */
  border-radius: 24px;                       /* рџ‘€ РІСЃРµ 4 СѓРіР»Р° */
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 32px);            /* рџ‘€ РЅРµ Р±РѕР»СЊС€Рµ СЌРєСЂР°РЅР° */
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
   padding: 20px 24px 20px; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  position: relative;
}

.achievements-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
}

.achievements-header h2 {
  margin: 0;
  color: #ffd700;
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  font-family: Impact, Arial Black, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
}

.achievements-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.achievements-close:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.5);
  color: #ff4444;
}

/* рџ‘‡ BODY вЂ” СЃРєСЂРѕР»Р» РІРЅСѓС‚СЂРё, Р±РµР· РіРёРіР°РЅС‚СЃРєРѕРіРѕ padding-bottom */
.achievements-body {
  padding: 16px 20px 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.achievements-body::-webkit-scrollbar {
  display: none;
}

/* ========== TIER-РЎР•РљР¦РР ========== */
.tier-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.tier-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  margin-bottom: 4px;
}

.tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 12px;
  font-family: Impact, Arial Black, sans-serif;
}

.tier-badge.tier-1 { background: linear-gradient(135deg, #cd7f32, #8b4513); color: #fff; box-shadow: 0 0 10px rgba(205, 127, 50, 0.4); }
.tier-badge.tier-2 { background: linear-gradient(135deg, #c0c0c0, #808080); color: #000; box-shadow: 0 0 10px rgba(192, 192, 192, 0.4); }
.tier-badge.tier-3 { background: linear-gradient(135deg, #ffd700, #ff8800); color: #000; box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
.tier-badge.tier-4 { background: linear-gradient(135deg, #00e5ff, #00b8cc); color: #000; box-shadow: 0 0 10px rgba(0, 229, 255, 0.5); }
.tier-badge.tier-5 { background: linear-gradient(135deg, #ff00ff, #8800aa); color: #fff; box-shadow: 0 0 15px rgba(255, 0, 255, 0.6); }

.tier-title {
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: Impact, Arial Black, sans-serif;
}

.tier-subtitle {
  color: var(--text-secondary, #888);
  font-size: 9px;
  font-weight: 600;
  margin-left: auto;
}

/* ========== РљРђР РўРћР§РљР Р”РћРЎРўРР–Р•РќРР™ ========== */
.achievement-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.achievement-card.unlocked {
  background: linear-gradient(135deg, rgba(0, 217, 126, 0.08), rgba(0, 217, 126, 0.02));
  border-color: rgba(0, 217, 126, 0.3);
}

.achievement-card.claimable {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.02));
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
}

.achievement-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.achievement-icon-wrapper.unlocked {
  background: linear-gradient(135deg, rgba(0, 217, 126, 0.2), rgba(0, 217, 126, 0.05));
  border-color: rgba(0, 217, 126, 0.5);
  box-shadow: 0 0 15px rgba(0, 217, 126, 0.3);
}

.achievement-icon-wrapper.claimable {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 215, 0, 0.05));
  border-color: rgba(255, 215, 0, 0.6);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  animation: claimPulse 2s ease-in-out infinite;
}

@keyframes claimPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.7); }
}

.achievement-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.achievement-name {
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.achievement-desc {
  color: var(--text-secondary, #888);
  font-size: 11px;
  font-weight: 500;
}

.achievement-reward {
  color: #ffd700;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
}

.achievement-status {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

.achievement-status.done { color: #00d97e; }
.achievement-status.progress { color: #666; }

.achievement-claim-btn {
  padding: 8px 14px;
  background: linear-gradient(90deg, #ffd700, #ff8800);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 900;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-family: Impact, Arial Black, sans-serif;
}

.achievement-claim-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}

/* ========== РўРђР‘Р« РљРђРўР•Р“РћР РР™ ========== */
.achievements-tabs {
  display: flex;
  gap: 6px;
  padding: 12px 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.achievements-tabs::-webkit-scrollbar { display: none; }

.achievement-tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 12px;
  min-width: 72px;
  flex-shrink: 0;
  scroll-snap-align: start;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.achievement-tab.active {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}

.achievement-tab:hover {
  background: rgba(255, 255, 255, 0.06);
}

.achievement-tab span:nth-child(2) {
  font-size: 8px !important;
  letter-spacing: 0.3px !important;
  line-height: 1;
  white-space: nowrap;
}

/* ========== РџР РћР“Р Р•РЎРЎ-Р‘РђР  РљРђРўР•Р“РћР РР ========== */
.achievements-progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  margin: 6px 16px 0;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
}

.achievements-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease, background 0.3s ease;
  min-width: 4px;
}
```

### src/styles/admin.css
```css
/* src/styles/admin.css */

/* ========== Р‘РђР—Рђ ========== */
.admin-screen {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: 
    radial-gradient(circle at 50% 0%, #101524 0%, #050608 100%),
    repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px);
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  padding-top: calc(16px + var(--tg-safe-top, 0px));
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  z-index: 10;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
  /* РЈР±СЂР°РЅР° РїРѕР»РѕСЃРєР° СЃРєСЂРѕР»Р»Р° */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.admin-screen::-webkit-scrollbar {
  display: none;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.admin-header h2 {
  margin: 0;
  color: #fff;
  font-size: 24px;
  font-family: Impact, Arial Black, sans-serif;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 0 15px rgba(255, 68, 68, 0.4);
  flex-shrink: 0;
}

.admin-header .admin-badge {
  background: rgba(255, 68, 68, 0.15);
  border: 1px solid rgba(255, 68, 68, 0.4);
  border-radius: 12px;
  padding: 4px 10px;
  color: #ff4444;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-right: auto;
}

.admin-close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.admin-close-btn:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.4);
  color: var(--danger);
}

/* ========== Р’РљР›РђР”РљР ========== */
.admin-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-shrink: 0;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.admin-tabs::-webkit-scrollbar { display: none; }

.admin-tab {
  padding: 10px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #888;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.admin-tab:hover {
  color: #fff;
  border-color: rgba(0, 229, 255, 0.3);
}

.admin-tab.active {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(0, 136, 255, 0.05));
  border-color: #00e5ff;
  color: #00e5ff;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.15);
}

/* ========== РљРђР РўРћР§РљР ========== */
.admin-card {
  background: linear-gradient(135deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.admin-card h3 {
  margin: 0 0 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ========== Р¤Р›РђР“Р ========== */
.admin-flag-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.admin-flag-row:last-child {
  border-bottom: none;
}

.admin-flag-name {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.admin-flag-desc {
  color: #666;
  font-size: 11px;
  margin-top: 2px;
}

/* РўСѓРјР±Р»РµСЂ */
.admin-toggle {
  position: relative;
  width: 48px;
  height: 26px;
  background: rgba(255,255,255,0.1);
  border-radius: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.1);
}

.admin-toggle.on {
  background: linear-gradient(90deg, #00e5ff, #0088ff);
  border-color: #00e5ff;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
}

.admin-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.admin-toggle.on::after {
  transform: translateX(22px);
}

/* ========== РџРћР›Р¬Р—РћР’РђРўР•Р›Р ========== */
.admin-user-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.admin-user-row:hover {
  background: rgba(0, 229, 255, 0.05);
  border-color: rgba(0, 229, 255, 0.3);
}

.admin-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #222 center/cover;
  border: 1px solid #444;
  flex-shrink: 0;
}

.admin-user-info {
  flex: 1;
  min-width: 0;
}

.admin-user-name {
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-user-id {
  color: #666;
  font-size: 11px;
  font-family: monospace;
  margin-top: 2px;
}

.admin-user-balance {
  color: var(--gold);
  font-weight: 900;
  font-size: 12px;
  font-family: monospace;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}

.admin-user-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.admin-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  color: #888;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.admin-icon-btn:hover {
  background: rgba(0, 229, 255, 0.1);
  border-color: #00e5ff;
  color: #00e5ff;
}

.admin-icon-btn.danger:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: #ff4444;
  color: #ff4444;
}

/* ========== РРќРџРЈРўР« ========== */
.admin-input {
  width: 100%;
  padding: 12px 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.admin-input:focus {
  border-color: #00e5ff;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.15);
}

.admin-input::placeholder {
  color: #555;
}

/* ========== РљРќРћРџРљР ========== */
.admin-btn {
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  font-weight: 900;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.admin-btn.primary {
  background: linear-gradient(90deg, #00e5ff, #0088ff);
  color: #000;
  box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
}

.admin-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 229, 255, 0.5);
}

.admin-btn.danger {
  background: rgba(255, 68, 68, 0.15);
  border: 1px solid rgba(255, 68, 68, 0.5);
  color: #ff4444;
}

.admin-btn.danger:hover {
  background: rgba(255, 68, 68, 0.25);
}

.admin-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

/* ========== РђР”РђРџРўРђР¦РРЇ ========== */
@media (max-width: 380px) {
  .admin-header h2 { font-size: 20px; letter-spacing: 2px; }
  .admin-tab { padding: 8px 12px; font-size: 11px; }
}

/* ========== РЎРўРђРўРРЎРўРРљРђ ========== */
.admin-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.admin-stat-card {
  background: linear-gradient(135deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  overflow: hidden;
}

.admin-stat-card::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.admin-stat-label {
  color: #666;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.admin-stat-value {
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  font-family: Impact, Arial Black, sans-serif;
  letter-spacing: 1px;
}

.admin-stat-value.cyan { color: #00e5ff; text-shadow: 0 0 15px rgba(0, 229, 255, 0.4); }
.admin-stat-value.green { color: #00d97e; text-shadow: 0 0 15px rgba(0, 217, 126, 0.4); }
.admin-stat-value.gold { color: #ffcc00; text-shadow: 0 0 15px rgba(255, 204, 0, 0.4); }
.admin-stat-value.red { color: #ff4444; text-shadow: 0 0 15px rgba(255, 68, 68, 0.4); }

/* ========== Р¤РћР РњРђ Р’Р«Р”РђР§Р ========== */
.admin-form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.admin-form-label {
  color: #888;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.admin-currency-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.admin-currency-option {
  padding: 10px 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: #888;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.admin-currency-option:hover {
  border-color: rgba(0, 229, 255, 0.4);
}

.admin-currency-option.active {
  background: rgba(0, 229, 255, 0.1);
  border-color: #00e5ff;
  color: #00e5ff;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.15);
}

.admin-quick-amounts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.admin-quick-btn {
  padding: 8px 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #aaa;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: monospace;
}

.admin-quick-btn:hover {
  background: rgba(0, 229, 255, 0.08);
  border-color: #00e5ff;
  color: #00e5ff;
}

.admin-form-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.admin-form-actions .admin-btn {
  flex: 1;
}

/* ========== РЈР’Р•Р”РћРњР›Р•РќРР• РћР‘ РЈРЎРџР•РҐР• ========== */
.admin-toast {
  position: fixed;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 229, 255, 0.15);
  border: 1px solid #00e5ff;
  border-radius: 12px;
  padding: 12px 20px;
  color: #00e5ff;
  font-size: 13px;
  font-weight: 800;
  z-index: 10001;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 229, 255, 0.2);
  backdrop-filter: blur(10px);
  white-space: nowrap;
}

.admin-toast.error {
  background: rgba(255, 68, 68, 0.15);
  border-color: #ff4444;
  color: #ff4444;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 68, 68, 0.2);
}
```

### src/styles/animations.css
```css
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes floatCar {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes car-reject {
  0%   { transform: translateX(0); }
  25%  { transform: translateX(-3px); }
  50%  { transform: translateX(3px); }
  75%  { transform: translateX(-1px); }
  100% { transform: translateX(0); }
}

@keyframes blink {
  0% { opacity: 0.2; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
```

### src/styles/base.css
```css
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #090A0C;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 0;
  overscroll-behavior: none;
}

button {
  font: inherit;
  -webkit-tap-highlight-color: transparent;
}

/* ============================================================
   РћРЎРќРћР’РќРћР™ Р­РљР РђРќ
   ============================================================ */
.game-wrapper {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  min-width: 0;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
  overflow: hidden;
  background: #090A0C;
  z-index: 10;
}

.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #090A0C;
  isolation: isolate;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* РРіСЂРѕРІР°СЏ РѕР±Р»Р°СЃС‚СЊ РЅР°Рґ РЅРёР¶РЅРёРј РјРµРЅСЋ */
.main-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: var(--nav-height);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

/* ============================================================
   РќРР–РќРЇРЇ РќРђР’РР“РђР¦РРЇ
   ============================================================ */
.bottom-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  min-height: var(--nav-height);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: #111;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
}

.nav-btn {
  flex: 1;
  min-width: 0;
  max-width: 100px;
  height: 100%;
  position: relative;
  background: transparent;
  border: none;
  color: var(--text-muted, #888);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-btn.active {
  color: var(--accent, #00e5ff);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.nav-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ============================================================
   РћРЁРР‘РљРђ Р—РђР“Р РЈР—РљР
   ============================================================ */
.app-error {
  position: fixed;
  inset: 0;
  z-index: 20000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background: #111;
  color: #fff;
}

.app-error h2 { color: #ff4444; margin-bottom: 10px; }
.app-error p { color: #aaa; margin-bottom: 20px; }
.app-error button {
  padding: 12px 24px;
  background: #00d97e;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

/* ============================================================
   РћРљРќРћ РќРђР“Р РђР”Р« Р—Рђ РћРўРЎРЈРўРЎРўР’РР•
   ============================================================ */
.offline-overlay {
  position: absolute;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.85);
  isolation: isolate;
}

.offline-card {
  width: 100%;
  max-width: 340px;
  padding: 30px;
  text-align: center;
  background: #1a1a1a;
  border: 1px solid #ffd700;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
}

.offline-card h2 { color: #ffd700; margin: 0 0 10px; }
.offline-card p { color: #ccc; margin-bottom: 20px; }
.offline-amount {
  margin-bottom: 25px;
  color: #00d97e;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 217, 126, 0.5);
}
.offline-card button {
  width: 100%;
  padding: 14px 40px;
  background: #00d97e;
  color: #000;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

/* ============================================================
   РљРћРњРџРђРљРўРќРћР• РР“Р РћР’РћР• РћРљРќРћ РќРђ РџРљ
   ============================================================ */
@media (min-width: 500px) {
  .game-wrapper {
    align-items: center;
  }
  .app-container {
    flex: 0 0 auto;
    width: 420px;
    height: 746px;
    min-width: 420px;
    min-height: 746px;
    max-width: none;
    max-height: none;
    aspect-ratio: 9 / 16;
    border: 4px solid #222;
    border-radius: 20px;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
  }
  .main-content {
    padding-top: 0;
  }
}
```

### src/styles/cardealership.css
```css
/* src/styles/cardealership.css */

.cardealer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  padding-top: calc(16px + var(--tg-safe-top, 0px));
}

.cardealer-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 32px - var(--tg-safe-top, 0px));
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.1);
  overflow: hidden;
}

.cardealer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  position: relative;
}

.cardealer-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
}

.cardealer-header h2 {
  margin: 0;
  color: var(--gold);
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  font-family: Impact, Arial Black, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.cardealer-balance {
  color: var(--success);
  font-family: Impact, Arial Black, sans-serif;
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
  text-shadow: 0 0 8px var(--success-glow);
  display: flex;
  align-items: center;
}

.cardealer-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.cardealer-close:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.4);
  color: var(--danger);
}

/* РўР°Р±С‹ */
.cardealer-tabs {
  display: flex;
  gap: 6px;
  padding: 12px 16px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.cardealer-tabs::-webkit-scrollbar { display: none; }

.cardealer-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #888;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
}

.cardealer-tab.active {
  background: rgba(255, 215, 0, 0.1);
  border-color: var(--gold);
  color: var(--gold);
  transform: translateY(-1px);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.15);
}

.cardealer-tab-count {
  background: rgba(255, 215, 0, 0.2);
  color: var(--gold);
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 6px;
  font-family: Impact, sans-serif;
}

/* Body */
.cardealer-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.cardealer-body::-webkit-scrollbar { display: none; }

.cardealer-list {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cardealer-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.cardealer-empty h3 {
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 16px;
  margin: 16px 0 8px;
  letter-spacing: 1px;
}

.cardealer-empty p {
  font-size: 12px;
  margin: 0;
}

/* РљР°СЂС‚РѕС‡РєР° РјР°С€РёРЅС‹ */
.cardealer-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.cardealer-card.affordable {
  border-color: rgba(255, 215, 0, 0.2);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.04), rgba(255, 215, 0, 0.01));
}

.cardealer-image {
  position: relative;
  width: 100%;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, #1f2229, #2a2e38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cardealer-image-fallback {
  position: absolute;
  font-size: 48px;
}

.cardealer-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
  padding: 4px;
}

.cardealer-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cardealer-name {
  color: #fff;
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  font-family: Impact, Arial Black, sans-serif;
  letter-spacing: 0.5px;
}

.cardealer-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cardealer-stat {
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 700;
}

.cardealer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.cardealer-price {
  font-family: Impact, Arial Black, sans-serif;
  font-size: 15px;
  font-weight: 900;
  display: flex;
  align-items: center;
}

.cardealer-buy {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #666;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: not-allowed;
  transition: all 0.2s;
  flex-shrink: 0;
}

.cardealer-buy.ready {
  background: linear-gradient(90deg, var(--success), var(--success-dim));
  border: none;
  color: #000;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--success-glow);
}

.cardealer-buy.ready:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--success-glow-strong);
}
```

### src/styles/case.css
```css
/* src/styles/case.css */

/* Р—Р°С‚РµРјРЅРµРЅРЅС‹Р№ С„РѕРЅ СЃ СЂР°Р·РјС‹С‚РёРµРј */
.case-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  transform: translateZ(0);
}

/* РЎС‚РµРєР»СЏРЅРЅС‹Р№ РєРѕРЅС‚РµР№РЅРµСЂ РјРѕРґР°Р»РєРё */
.case-modal {
  width: 100%;
  max-width: 550px;
  background: linear-gradient(180deg, rgba(20, 25, 33, 0.95) 0%, rgba(10, 12, 16, 0.98) 100%);
  border: 1px solid rgba(0, 229, 255, 0.2); /* рџ‘€ Р“РѕР»СѓР±Р°СЏ СЂР°РјРєР° */
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* РљСЂР°СЃРёРІР°СЏ С€Р°РїРєР° */
.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.case-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #fff, #00e5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.3));
}

.case-close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #aaa;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.case-close-btn:hover {
  background: rgba(255, 68, 68, 0.2);
  color: #ff4444;
  border-color: rgba(255, 68, 68, 0.4);
}

/* Р’РєР»Р°РґРєРё РєРµР№СЃРѕРІ */
.case-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 15px;
  scrollbar-width: none;
}

.case-tabs::-webkit-scrollbar { display: none; }

.case-tab {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #888;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.case-tab:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ccc;
}

.case-tab.active {
  background: rgba(0, 229, 255, 0.1);
  border-color: rgba(0, 229, 255, 0.4);
  color: #00e5ff;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
  transform: translateY(-2px);
}

.case-tab.ad-tab.active {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.4);
  color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
}

/* Р СѓР»РµС‚РєР° */
.case-reel-container {
  position: relative;
  width: 100%;
  height: 140px; /* рџ‘€ Р§СѓС‚СЊ РІС‹С€Рµ */
  background: #05070a;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 229, 255, 0.2);
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 229, 255, 0.05);
  display: flex;
  align-items: center;
  isolation: isolate;
}

/* РЎРµС‚РєР° РЅР° С„РѕРЅРµ СЂСѓР»РµС‚РєРё РґР»СЏ "РїСЂРµРјРёР°Р»СЊРЅРѕСЃС‚Рё" */
.case-reel-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
  pointer-events: none;
}

/* Р“СЂР°РґРёРµРЅС‚РЅС‹Рµ С‚РµРЅРё РїРѕ РєСЂР°СЏРј */
.case-reel-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #05070a 0%, transparent 15%, transparent 85%, #05070a 100%);
  z-index: 5;
  pointer-events: none;
}

/* РЈРєР°Р·Р°С‚РµР»СЊ РїРѕ С†РµРЅС‚СЂСѓ */
.case-reel-pointer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: #00e5ff;
  transform: translateX(-50%);
  z-index: 10;
  box-shadow: 0 0 15px #00e5ff, 0 0 30px #00e5ff;
}

.case-reel-pointer::before {
  content: 'в–ј';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  color: #00e5ff;
  font-size: 12px;
  text-shadow: 0 0 10px #00e5ff;
}

/* РЎР°РјР° Р»РµРЅС‚Р° */
.case-reel {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  will-change: transform;
  position: relative;
  z-index: 2;
}

/* Р­Р»РµРјРµРЅС‚ СЂСѓР»РµС‚РєРё */
.case-reel-item {
  flex-shrink: 0;
  width: 90px;
  height: 110px;
  background: linear-gradient(180deg, #1f232b 0%, #15171a 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
}

.case-reel-item .item-icon {
  font-size: 38px;
  filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5));
}

.case-reel-item .item-name {
  font-size: 10px;
  font-weight: 700;
  color: #aaa;
  text-align: center;
  padding: 0 4px;
  line-height: 1.2;
}

/* Р¦РІРµС‚РѕРІС‹Рµ СЂР°РјРєРё РґР»СЏ СЂРµРґРєРѕСЃС‚РµР№ */
.case-reel-item.rarity-common { border-color: rgba(170, 170, 170, 0.3); }
.case-reel-item.rarity-epic { border-color: rgba(176, 0, 255, 0.6); box-shadow: inset 0 0 15px rgba(176, 0, 255, 0.2); }
.case-reel-item.rarity-legendary { border-color: rgba(255, 204, 0, 0.8); box-shadow: inset 0 0 20px rgba(255, 204, 0, 0.3), 0 0 10px rgba(255, 204, 0, 0.2); }

/* РџР»РµР№СЃС…РѕР»РґРµСЂ (РєРѕРіРґР° РєРµР№СЃ РЅРµ РєСЂСѓС‚РёС‚СЃСЏ) */
.case-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #00e5ff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  z-index: 2;
  text-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
  gap: 10px;
}

.case-placeholder-icon {
  font-size: 40px;
  animation: float 2s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Р‘Р»РѕРє СЂРµР·СѓР»СЊС‚Р°С‚Р° */
.case-result {
  text-align: center;
  margin-bottom: 20px;
}

.case-result h3 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.result-item-name {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #00e5ff, #0055ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.4));
}

/* РљРЅРѕРїРєРё РґРµР№СЃС‚РІРёР№ */
.case-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.case-btn-primary {
  width: 100%;
  max-width: 320px;
  padding: 16px;
  border-radius: 14px;
  border: none;
  font-weight: 900;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(135deg, #00e5ff, #0055ff); /* рџ‘€ Р“РѕР»СѓР±РѕР№ РіСЂР°РґРёРµРЅС‚ */
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 229, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.3);
}

.case-btn-primary:active:not(:disabled) {
  transform: scale(0.97);
}

.case-btn-primary:disabled {
  background: #222;
  color: #555;
  box-shadow: none;
  cursor: not-allowed;
  border: 1px solid rgba(255,255,255,0.05);
}

/* РђРЅРёРјР°С†РёСЏ РїСѓР»СЊСЃР°С†РёРё РґР»СЏ РєРЅРѕРїРєРё */
@keyframes pulse-glow {
  0% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.4); }
  50% { box-shadow: 0 0 40px rgba(0, 229, 255, 0.8); }
  100% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.4); }
}

.case-btn-primary.ready {
  animation: pulse-glow 2s infinite;
}
```

### src/styles/city.css
```css
/* src/styles/city.css */

.city-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.city-hub {
  padding: 16px;
  padding-top: calc(16px + var(--tg-safe-top, 0px));
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px) + 100px);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
}

.city-hub::-webkit-scrollbar { display: none; }

.city-title {
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 22px;
  letter-spacing: 2px;
  text-align: center;
  margin: 0 0 20px;
  text-shadow: 0 0 12px var(--accent-glow);
}

/* рџ‘‡ 2 РєРѕР»РѕРЅРєРё РІРјРµСЃС‚Рѕ 3 вЂ” РєСЂСѓРїРЅРµРµ Рё С‡РёС‚Р°Р±РµР»СЊРЅРµРµ */
.city-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.city-card {
  background: linear-gradient(135deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.city-card:active {
  transform: scale(0.97);
  border-color: var(--accent);
}

.city-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.city-card.highlight {
  border-color: var(--gold);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
}

.city-card.admin {
  border-color: rgba(255, 68, 68, 0.4);
  background: linear-gradient(135deg, rgba(255, 68, 68, 0.08), #0a0a0a);
}

/* рџ‘‡ РРєРѕРЅРєР° С‚РµРїРµСЂСЊ РІ СЃС‚РёР»РёР·РѕРІР°РЅРЅРѕРј РєРѕРЅС‚РµР№РЅРµСЂРµ */
.city-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.city-card h3 {
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  font-family: Impact, Arial Black, sans-serif;
  line-height: 1.1;
}

.city-card p {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

/* РљРѕРЅС‚РµР№РЅРµСЂ РґР»СЏ РІР»РѕР¶РµРЅРЅС‹С… СЌРєСЂР°РЅРѕРІ (РЅР°РїСЂРёРјРµСЂ, РўСЂРµРє) */
.city-location {
  position: absolute;
  inset: 0;
  background: var(--bg-base);
  z-index: 50;
  display: flex;
  flex-direction: column;
}

/* РљРЅРѕРїРєР° "РќР°Р·Р°Рґ" */
.back-to-city {
  position: absolute;
  top: calc(20px + var(--tg-safe-top));
  left: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  backdrop-filter: blur(8px);
}

.back-to-city:active {
  background: rgba(255, 255, 255, 0.15);
}

.city-location .races-screen {
  padding-top: calc(70px + var(--tg-safe-top));
}

@media (max-height: 700px) {
  .city-card p {
    display: none;
  }
}
```

### src/styles/clan.css
```css
/* src/styles/clan.css */
.clan-screen-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at top, rgba(10, 20, 35, 0.95) 0%, rgba(5, 7, 10, 0.98) 100%); 
  backdrop-filter: blur(10px); z-index: 1000;
  display: flex; justify-content: center; align-items: flex-start;
  padding: 15px; padding-top: calc(20px + var(--tg-safe-top, 0px)); 
  overflow: hidden;
  font-family: 'Rajdhani', sans-serif;
}

.clan-container {
  width: 100%; max-width: 500px;
  background: rgba(15, 22, 35, 0.6); 
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 191, 255, 0.2); border-radius: 24px;
  padding: 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
}

/* РЁР°РїРєР° */
.clan-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.clan-title-wrap { display: flex; align-items: center; gap: 8px; }
.clan-badge { font-size: 22px; filter: drop-shadow(0 0 8px rgba(0,191,255,0.6)); }
.clan-header h2 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; color: #fff; text-shadow: 0 0 10px rgba(0,191,255,0.3); }
.clan-level-badge { background: rgba(0, 191, 255, 0.15); border: 1px solid #00bfff; color: #00bfff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; letter-spacing: 0.5px; box-shadow: 0 0 10px rgba(0,191,255,0.2); line-height: 1; }
.btn-close { background: rgba(255,255,255,0.05); border: none; color: #8892b0; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-close:hover { background: rgba(255, 0, 85, 0.15); color: #ff0055; }

/* РўР°Р±С‹ */
.clan-tabs { display: flex; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0; flex-shrink: 0; }
.clan-tabs button { background: transparent; border: none; color: #5c6a80; padding: 10px 5px; font-size: 13px; font-weight: 700; text-transform: uppercase; cursor: pointer; position: relative; transition: 0.3s; font-family: inherit; letter-spacing: 1px; }
.clan-tabs button:hover { color: #fff; }
.clan-tabs button.active { color: #00bfff; text-shadow: 0 0 12px rgba(0,191,255,0.5); }
.clan-tabs button.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #00bfff; box-shadow: 0 0 15px #00bfff; border-radius: 2px 2px 0 0; }

/* Р“Р»Р°РІРЅР°СЏ / РЈС‡Р°СЃС‚РЅРёРєРё */
.clan-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.clan-stat-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.2); }
.clan-stat-box.full-width { grid-column: span 2; }
.treasury-box { border-color: rgba(255, 215, 0, 0.25); background: linear-gradient(180deg, rgba(255, 215, 0, 0.08), rgba(0,0,0,0)); box-shadow: inset 0 0 30px rgba(255, 215, 0, 0.05); }
.stat-label { font-size: 11px; color: #8892b0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 4px; }
.stat-value { font-size: 26px; font-weight: 700; color: #fff; line-height: 1; }
.stat-value.gold { color: #ffd700; text-shadow: 0 0 20px rgba(255,215,0,0.4); font-size: 28px; }
.stat-max { font-size: 16px; color: #5c6a80; font-weight: 600; }
.currency-icon { font-size: 22px; color: #ffd700; margin-left: 4px; }
.upgrade-section { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 215, 0, 0.15); padding: 16px; border-radius: 16px; margin-bottom: 15px; }
.upgrade-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.upgrade-title { color: #fff; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; }
.upgrade-cost { color: #8892b0; font-weight: 700; font-size: 14px; transition: 0.3s; }
.upgrade-cost.can-afford { color: #ffd700; text-shadow: 0 0 10px rgba(255,215,0,0.4); }
.upgrade-progress-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.upgrade-progress-bar { flex: 1; height: 6px; background: rgba(0,0,0,0.6); border-radius: 3px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
.upgrade-progress-fill { height: 100%; background: linear-gradient(90deg, #ffd700, #ff8c00); box-shadow: 0 0 12px rgba(255,215,0,0.6); border-radius: 3px; }
.upgrade-progress-text { font-size: 12px; font-weight: 700; color: #ffd700; min-width: 30px; text-align: right; }
.upgrade-bonus { color: #00d97e; font-size: 12px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 5px; }
.bonus-icon { font-size: 14px; }
.btn-neon-gold, .btn-neon-green, .btn-neon-cyan, .btn-neon-red { width: 100%; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.2s; text-transform: uppercase; letter-spacing: 0.5px; font-family: inherit; }
.btn-neon-gold { background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.15)); border: 1px solid #ffd700; color: #ffd700; box-shadow: 0 0 15px rgba(255,215,0,0.1); }
.btn-neon-gold:hover:not(.disabled) { background: linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 140, 0, 0.25)); box-shadow: 0 0 25px rgba(255,215,0,0.3); }
.btn-neon-gold.disabled { opacity: 0.4; cursor: not-allowed; filter: grayscale(100%); box-shadow: none; }
.btn-neon-cyan { background: rgba(0, 191, 255, 0.1); border: 1px solid #00bfff; color: #00bfff; }
.btn-neon-cyan:hover:not(.disabled) { background: rgba(0, 191, 255, 0.2); }
.btn-neon-cyan.disabled { opacity: 0.4; cursor: not-allowed; filter: grayscale(100%); }
.btn-neon-green { background: rgba(0, 217, 126, 0.1); border: 1px solid #00d97e; color: #00d97e; }
.btn-neon-green:hover:not(:disabled) { background: rgba(0, 217, 126, 0.2); box-shadow: 0 0 20px rgba(0,217,126,0.3); }
.btn-neon-red { background: rgba(255, 0, 85, 0.1); border: 1px solid #ff0055; color: #ff0055; }
.full-width { width: 100%; }
.clan-donate-box { background: rgba(0,0,0,0.2); padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
.clan-donate-box h4 { margin: 0 0 12px 0; color: #8892b0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.quick-donate { display: flex; gap: 8px; margin-bottom: 12px; }
.quick-donate button { flex: 1; padding: 8px 0; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; cursor: pointer; font-weight: 700; font-family: inherit; font-size: 12px; transition: 0.2s; }
.quick-donate button:hover { background: rgba(0, 191, 255, 0.15); border-color: #00bfff; color: #00bfff; }
.donate-inputs { display: flex; gap: 10px; }
.clan-input { flex: 1; padding: 12px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 16px; font-family: inherit; font-weight: 700; transition: 0.2s; }
.clan-input:focus { outline: none; border-color: #00bfff; box-shadow: 0 0 10px rgba(0,191,255,0.2); }
.donate-inputs button { width: auto; padding: 0 20px; white-space: nowrap; }
.members-list { display: flex; flex-direction: column; gap: 8px; }
.member-row { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); }
.member-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #00bfff, #0055ff); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 16px; box-shadow: 0 0 10px rgba(0,191,255,0.3); }
.member-info { display: flex; flex-direction: column; flex: 1; }
.member-name { color: #fff; font-weight: 600; font-size: 15px; }
.member-donate { font-size: 12px; color: #00d97e; font-weight: 600; }
.member-role { font-size: 10px; color: #8892b0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
.member-actions { display: flex; gap: 6px; }
.btn-sm { padding: 6px 10px; border-radius: 8px; font-size: 12px; cursor: pointer; background: transparent; border: 1px solid currentColor; font-family: inherit; transition: 0.2s; }
.btn-sm:hover { background: rgba(255,255,255,0.1); }

/* РЎРїРёСЃРѕРє РєР»Р°РЅРѕРІ (РїРѕРёСЃРє) */
.clan-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 16px; margin-bottom: 15px; }
.clan-card h3 { font-size: 18px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 8px; color: #fff; }
.clan-desc { color: #8892b0; font-size: 13px; margin-bottom: 12px; font-weight: 500; }
.clan-search-section { margin-top: 15px; }
.clans-list { display: flex; flex-direction: column; gap: 10px; }
.clan-search-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 12px 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); transition: 0.2s; gap: 10px; }
.clan-search-row:hover { background: rgba(0, 191, 255, 0.05); border-color: rgba(0, 191, 255, 0.2); }
.clan-info { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.clan-name-s { color: #fff; font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.clan-members-count { color: #8892b0; font-size: 12px; font-weight: 600; }
.clan-search-row .btn-sm { width: auto; padding: 8px 14px; white-space: nowrap; font-size: 12px; flex-shrink: 0; }
.clan-stat-box.clickable { cursor: pointer; transition: all 0.2s ease; }
.clan-stat-box.clickable:hover { background: rgba(0, 191, 255, 0.1); border-color: #00bfff; box-shadow: 0 0 15px rgba(0, 191, 255, 0.2); transform: translateY(-2px); }

/* Р§РђРў */
.chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 5px; margin-bottom: 15px; }
.chat-bubble-wrap { display: flex; flex-direction: column; align-items: flex-start; max-width: 85%; }
.chat-bubble-wrap.me { align-self: flex-end; align-items: flex-end; }
.chat-author { font-size: 11px; color: #8892b0; margin-bottom: 4px; margin-left: 4px; font-weight: 600; }
.chat-bubble { background: rgba(255, 255, 255, 0.08); color: #fff; padding: 10px 14px; border-radius: 14px; border-bottom-left-radius: 4px; font-size: 14px; line-height: 1.4; word-break: break-word; }
.chat-bubble.me { background: linear-gradient(135deg, rgba(0, 191, 255, 0.2), rgba(0, 127, 255, 0.2)); border: 1px solid rgba(0, 191, 255, 0.3); border-radius: 14px; border-bottom-right-radius: 4px; color: #fff; }
.chat-input-area { display: flex; gap: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.05); }

/* РЈС‚РёР»РёС‚С‹ */
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.clan-tab-content { height: 100%; overflow-y: auto; padding-bottom: 20px; }
.unread-badge { position: absolute; top: 8px; right: -4px; width: 8px; height: 8px; background: #ff0055; border-radius: 50%; box-shadow: 0 0 8px #ff0055; animation: pulse-badge 1.5s infinite; }
@keyframes pulse-badge { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }

/* рџ‘‡ Р‘РћРЎРЎ (Р¤РРќРђР›Р¬РќР«Р™ Р¤РРљРЎ РЎРљР РћР›Р›Рђ) рџ‘‡ */
.boss-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: auto; /* Р’РєР»СЋС‡Р°РµРј СЃРєСЂРѕР»Р» */
  padding-bottom: 50px; /* РњРµСЃС‚Рѕ РїРѕРґ РЅРёР· */
}

.boss-arena {
  background: radial-gradient(circle at center, #1a0b12 0%, #050508 100%);
  border: 1px solid rgba(255, 0, 85, 0.4);
  border-radius: 20px;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 80px rgba(255, 0, 85, 0.15), 0 10px 30px rgba(0,0,0,0.8);
  flex-shrink: 0; /* рџ‘€ РљР РРўРР§Р•РЎРљР Р’РђР–РќРћ: Р—Р°РїСЂРµС‰Р°РµРј СЃР¶РёРјР°С‚СЊСЃСЏ, С‡С‚РѕР±С‹ РїРѕСЏРІР»СЏР»СЃСЏ СЃРєСЂРѕР»Р» */
  width: 100%;
  margin-top: 10px;
}

.boss-scanlines {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(255, 0, 85, 0.05) 50%, rgba(255, 0, 85, 0.05));
  background-size: 100% 4px;
  pointer-events: none; z-index: 1; opacity: 0.3;
}

.boss-header { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; z-index: 2; }
.boss-title-wrap { display: flex; align-items: center; gap: 10px; }
.boss-warning { font-size: 22px; animation: blink 1s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; text-shadow: 0 0 10px red; } 50% { opacity: 0.3; text-shadow: none; } }
.boss-title { color: #ff0055; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 20px rgba(255, 0, 85, 0.8); }
.boss-level-badge { background: rgba(255, 0, 85, 0.2); border: 1px solid #ff0055; color: #ff0055; padding: 4px 12px; border-radius: 4px; font-weight: 700; font-size: 14px; box-shadow: 0 0 10px rgba(255, 0, 85, 0.5); clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%); }

.boss-visual-container { position: relative; margin: 15px 0 35px 0; display: flex; justify-content: center; align-items: center; width: 100%; height: 180px; z-index: 2; }
.boss-visual-container::before { content: ''; position: absolute; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 0, 85, 0.3) 0%, transparent 70%); border-radius: 50%; animation: pulse-aura 2s infinite alternate; z-index: 0; }
@keyframes pulse-aura { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.2); opacity: 1; } }
.boss-tech-ring { position: absolute; border-radius: 50%; pointer-events: none; }
.boss-tech-ring.outer { width: 180px; height: 180px; border: 2px dashed rgba(255, 0, 85, 0.5); animation: spin 12s linear infinite; }
.boss-tech-ring.inner { width: 140px; height: 140px; border: 1px solid rgba(255, 0, 85, 0.8); border-top-color: transparent; border-bottom-color: transparent; animation: spin 6s linear infinite reverse; box-shadow: 0 0 25px rgba(255, 0, 85, 0.3); }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* РљР°СЂС‚РёРЅРєР° Р±РѕСЃСЃР° */
.boss-avatar { font-size: 100px; filter: drop-shadow(0 0 35px rgba(255, 0, 85, 0.9)); user-select: none; z-index: 3; display: flex; justify-content: center; align-items: center; }
.boss-avatar img.boss-img { width: 210px; height: auto; object-fit: contain; position: relative; z-index: 3; }
.boss-shadow { position: absolute; bottom: -5px; width: 140px; height: 20px; background: radial-gradient(ellipse at center, rgba(255, 0, 85, 0.5) 0%, transparent 70%); border-radius: 50%; z-index: 1; animation: pulse-shadow 2s infinite alternate; }
@keyframes pulse-shadow { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1.1); opacity: 1; } }
.hit { animation: hit-anim 0.3s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes hit-anim { 10%, 90% { transform: translate3d(-2px, 0, 0); } 20%, 80% { transform: translate3d(4px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-6px, 0, 0); } 40%, 60% { transform: translate3d(6px, 0, 0); } }
.damage-popup { position: absolute; top: 0; color: #fff; font-size: 52px; font-weight: 900; text-shadow: 0 0 20px #ff0055, 0 0 40px #ff0055, 3px 3px 0 #000; pointer-events: none; z-index: 10; -webkit-text-stroke: 2px #ff0055; }

/* РСЃРєСЂС‹ */
.spark { position: absolute; width: 4px; height: 4px; background: #ff0055; border-radius: 50%; box-shadow: 0 0 10px #ff0055; pointer-events: none; z-index: 1; }
.spark.s1 { animation: float-spark 2s infinite linear; top: 20%; left: 20%; }
.spark.s2 { animation: float-spark 2.5s infinite linear 0.5s; top: 80%; left: 80%; }
.spark.s3 { animation: float-spark 1.8s infinite linear 1s; top: 20%; left: 80%; }
.spark.s4 { animation: float-spark 3s infinite linear 1.5s; top: 90%; left: 30%; }
@keyframes float-spark { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-80px) scale(0); opacity: 0; } }

/* HP Bar */
.boss-hp-wrap { width: 100%; margin-bottom: 25px; z-index: 2; }
.boss-hp-bar { width: 100%; height: 28px; background: #000; border: 2px solid #333; overflow: hidden; margin-bottom: 12px; position: relative; transform: skewX(-15deg); box-shadow: 0 0 20px rgba(0,0,0,0.8), inset 0 0 10px #000; border-radius: 4px; padding: 2px; }
.boss-hp-markers { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: linear-gradient(90deg, transparent 24px, #000 25px); background-size: 25px 100%; z-index: 5; pointer-events: none; }
.boss-hp-fill { height: 100%; transition: width 0.3s ease-out, background 0.3s; position: relative; border-radius: 2px; }
.boss-hp-gloss { position: absolute; top: 0; left: 0; right: 0; height: 50%; background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%); }
.pulse-danger { animation: pulse-danger 0.5s infinite; }
@keyframes pulse-danger { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
.boss-hp-text { display: flex; justify-content: center; align-items: baseline; gap: 8px; text-shadow: 0 2px 4px #000; }
.hp-current { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: 1px; }
.hp-max { font-size: 14px; font-weight: 700; color: #8892b0; }

/* РЎС‚Р°С‚С‹ */
.boss-stats-grid { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; z-index: 2; }
.boss-stat-card { background: rgba(10, 5, 8, 0.8); border: 1px solid rgba(255, 0, 85, 0.3); border-left: 4px solid #ff0055; padding: 12px 15px; display: flex; flex-direction: column; gap: 6px; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%); }
.b-stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
.b-icon { font-size: 16px; filter: drop-shadow(0 0 5px currentColor); }
.b-stat-label { font-size: 10px; color: #8892b0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
.b-stat-value { font-size: 20px; font-weight: 800; }
.b-stat-value.gold { color: #ffd700; text-shadow: 0 0 15px rgba(255,215,0,0.5); }
.b-stat-value.green { color: #00d97e; text-shadow: 0 0 15px rgba(0,217,126,0.5); }

/* РљРЅРѕРїРєР° РђС‚Р°РєРё */
.boss-attack-btn { position: relative; width: 100%; padding: 20px !important; border: none !important; background: transparent !important; cursor: pointer; z-index: 2; outline: none; }
.boss-attack-btn .btn-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, #d60045, #7a0027); transform: skewX(-15deg); border: 2px solid #ff4d88; border-radius: 6px; transition: all 0.1s; box-shadow: 0 8px 0 #4a0018, 0 15px 25px rgba(255, 0, 85, 0.4); animation: btn-pulse 2s infinite alternate; }
@keyframes btn-pulse { 0% { box-shadow: 0 8px 0 #4a0018, 0 10px 20px rgba(255, 0, 85, 0.3); border-color: #ff4d88; } 100% { box-shadow: 0 8px 0 #4a0018, 0 20px 40px rgba(255, 0, 85, 0.7); border-color: #fff; } }
.boss-attack-btn .btn-content { position: relative; z-index: 2; color: #fff; font-size: 24px; font-weight: 900; letter-spacing: 4px; text-shadow: 0 2px 5px rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; font-family: 'Rajdhani', sans-serif; }
.boss-attack-btn:hover:not(:disabled) .btn-bg { background: linear-gradient(180deg, #ff1a66, #a30036); box-shadow: 0 8px 0 #5c001e, 0 20px 40px rgba(255, 0, 85, 0.8); animation: none; transform: skewX(-15deg) scale(1.02); }
.boss-attack-btn:active:not(:disabled) .btn-bg { transform: skewX(-15deg) translateY(8px); box-shadow: 0 0px 0 #5c001e, 0 5px 10px rgba(255, 0, 85, 0.3); }
.boss-attack-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.boss-attack-btn:disabled .btn-bg { filter: grayscale(100%); box-shadow: none; animation: none; }
.screen-shake { animation: screen-shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes screen-shake { 0% { transform: translate(0, 0); } 25% { transform: translate(-4px, 4px); } 50% { transform: translate(4px, -4px); } 75% { transform: translate(-4px, -4px); } 100% { transform: translate(0, 0); } }

/* РўРћРџ РЈР РћРќРђ */
.boss-damage-list { width: 100%; margin-top: 20px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 12px; z-index: 2; }
.b-damage-title { font-size: 12px; color: #ff0055; font-weight: 800; letter-spacing: 1px; margin-bottom: 10px; text-align: center; text-transform: uppercase; text-shadow: 0 0 10px rgba(255, 0, 85, 0.4); }
.b-damage-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; background: rgba(255, 255, 255, 0.02); margin-bottom: 4px; font-size: 13px; }
.b-damage-row.is-me { background: rgba(0, 191, 255, 0.1); border: 1px solid rgba(0, 191, 255, 0.3); }
.b-damage-rank { width: 20px; color: #8892b0; font-weight: 700; }
.b-damage-row:nth-child(2) .b-damage-rank { color: #ffd700; }
.b-damage-row:nth-child(3) .b-damage-rank { color: #c0c0c0; }
.b-damage-row:nth-child(4) .b-damage-rank { color: #cd7f32; }
.b-damage-name { flex: 1; color: #fff; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 10px; }
.b-damage-val { color: #00d97e; font-weight: 700; text-shadow: 0 0 5px rgba(0, 217, 126, 0.3); }

/* ============================================================
   RATING TAB
   ============================================================ */
.rating-section {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 15px;
}

.rating-title {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.rating-row.is-me {
  background: rgba(0, 229, 255, 0.08);
  border-color: rgba(0, 229, 255, 0.3);
}

.rating-rank {
  width: 22px;
  text-align: center;
  font-weight: 800;
  font-size: 13px;
  color: #8892b0;
  flex-shrink: 0;
}

.rating-rank.rank-1 { color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
.rating-rank.rank-2 { color: #c0c0c0; }
.rating-rank.rank-3 { color: #cd7f32; }

.rating-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00bfff, #0055ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
}

.rating-name {
  flex: 1;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-value {
  font-weight: 800;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.rating-value.gold { color: var(--gold); text-shadow: 0 0 8px rgba(255, 215, 0, 0.3); }
.rating-value.green { color: var(--success); text-shadow: 0 0 8px rgba(0, 217, 126, 0.3); }

.rating-empty {
  text-align: center;
  color: #8892b0;
  font-size: 12px;
  padding: 20px 0;
}

/* ============================================================
   INVITE BOX
   ============================================================ */
.clan-invite-box {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(0, 85, 255, 0.05));
  border: 1px solid rgba(0, 229, 255, 0.25);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.clan-invite-box h4 {
  margin: 0 0 6px 0;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.clan-invite-desc {
  margin: 0 0 12px 0;
  color: #8892b0;
  font-size: 12px;
  line-height: 1.4;
}

/* ============================================================
   TABS вЂ” РіРѕСЂРёР·РѕРЅС‚Р°Р»СЊРЅС‹Р№ СЃРєСЂРѕР»Р» РЅР° РјРѕР±РёР»РєРµ
   ============================================================ */
.clan-tabs {
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.clan-tabs::-webkit-scrollbar { display: none; }

.clan-tabs button {
  white-space: nowrap;
  flex-shrink: 0;
}

/* ============================================================
   РњРµР»РєРёРµ С„РёРєСЃС‹
   ============================================================ */
.boss-stat-card .b-stat-label { font-size: 10px; }
.clan-tab-content { padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px)); }
```

### src/styles/engine.css
```css
.engine-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.engine-rating {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 6px 10px;
  border-radius: 12px;
  background: rgba(255, 200, 0, 0.08);
  border: 1px solid rgba(255, 200, 0, 0.25);
}

.engine-rating-value {
  font-size: 18px;
  font-weight: 800;
  color: #ffcf4a;
  line-height: 1;
}

.engine-rating-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  margin-top: 2px;
}

.engine-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 16px 0;
}

.engine-stat {
  padding: 12px 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.engine-stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #888;
}

.engine-stat-value {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
}

.engine-stat-value small {
  font-size: 11px;
  color: #888;
  font-weight: 500;
}

.engine-stat-delta {
  font-size: 11px;
  font-weight: 600;
  color: #ffb088;
}

.engine-stat-delta.good {
  color: #7fe08a;
}
```

### src/styles/garage.css
```css
/* ============================================ */
/* Р­РљР РђРќ Р“РђР РђР–Рђ                                  */
/* ============================================ */

.garage-screen {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: #090a0c;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.garage-scene {
  position: relative;
  flex: 0 0 auto;
  height: 100%;
  aspect-ratio: 941 / 1672;
  max-height: 100%;
  overflow: hidden;
  isolation: isolate;
}

.garage-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/bg-garage.jpg');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  pointer-events: none;
}

/* --- РњР°С€РёРЅР° --- */
.garage-car-container {
  position: absolute;
  cursor: pointer;
  z-index: 5;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.garage-car-container:hover {
  transform: scale(1.02);
}

.car-shadow {
  position: absolute;
  bottom: -2%;
  width: 90%;
  height: 25px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  z-index: 1;
  filter: blur(4px);
}

.garage-car-img {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.6));
  transition: filter 0.4s ease;
  position: relative;
  z-index: 2;
}

.car-image-wrapper {
  position: relative;
  width: 100%;
  isolation: isolate;
}

/* --- РџРѕРґСЃРєР°Р·РєР° РЅР°Рґ РјР°С€РёРЅРѕР№ --- */
.car-tooltip {
  position: absolute;
  left: 50%;
  top: -15%;
  transform: translateX(-50%) translateY(-10px);
  background: rgba(15, 20, 25, 0.9);
  border: 1px solid rgba(0, 229, 255, 0.4);
  border-radius: 12px;
  padding: 6px 14px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.7),
    0 0 10px rgba(0, 229, 255, 0.1);
  z-index: 20;
}

.car-tooltip::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 100%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent rgba(15, 20, 25, 0.9) transparent;
}

.garage-car-container:hover .car-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* --- РРЅС‚РµСЂР°РєС‚РёРІРЅС‹Рµ РїСЂРµРґРјРµС‚С‹ РІ РіР°СЂР°Р¶Рµ --- */
.interactive-object {
  position: absolute;
  z-index: 15;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  filter:
    drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))
    drop-shadow(0 0 8px rgba(0, 229, 255, 0.6));
  animation: neon-pulse 2s infinite alternate ease-in-out;
  transition: transform 0.2s ease;
}

@keyframes neon-pulse {
  0% {
    filter:
      drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))
      drop-shadow(0 0 5px rgba(0, 229, 255, 0.4));
  }
  100% {
    filter:
      drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))
      drop-shadow(0 0 15px rgba(0, 229, 255, 0.9));
  }
}

.interactive-object:hover {
  filter:
    drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))
    drop-shadow(0 0 25px rgba(0, 229, 255, 1))
    brightness(1.15);
  animation: none;
}

/* ============================================ */
/* РљРќРћРџРљРђ РЎРњР•РќР« РњРђРЁРРќР« (СЃС‚РёР»СЊ "Р‘С‹СЃС‚СЂР°СЏ РіРѕРЅРєР°")  */
/* ============================================ */

/* РќРѕРІС‹Р№ РєРѕРЅС‚РµР№РЅРµСЂ РґР»СЏ С†РµРЅС‚СЂРёСЂРѕРІР°РЅРёСЏ, С‡С‚РѕР±С‹ Framer Motion РЅРµ Р»РѕРјР°Р» РїРѕР·РёС†РёСЋ */
.garage-car-switch-wrapper {
  position: absolute;
  top: calc(20px + var(--tg-safe-top, 0px));
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 50;
  pointer-events: none; /* РџСЂРѕРїСѓСЃРєР°РµРј РєР»РёРєРё СЃРєРІРѕР·СЊ РїСѓСЃС‚РѕРµ РјРµСЃС‚Рѕ */
}

.garage-car-switch-btn {
  /* РЈР±СЂР°Р»Рё position: absolute Рё transform: translateX(-50%) */
  padding: 10px 20px;
  border-radius: 24px;
  background: linear-gradient(135deg, #141a2e 0%, #050608 100%);
  border: 1px solid rgba(0, 229, 255, 0.3);
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-transform: uppercase;
  pointer-events: auto; /* Р’РѕР·РІСЂР°С‰Р°РµРј РєР»РёРєР°Р±РµР»СЊРЅРѕСЃС‚СЊ СЃР°РјРѕР№ РєРЅРѕРїРєРµ */
}

.garage-car-switch-btn:hover,
.garage-car-switch-btn:active {
  border-color: #00e5ff;
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.2), inset 0 0 20px rgba(0, 229, 255, 0.05);
}

/* ============================================ */
/* РџР Р•РњРРђР›Р¬РќР«Р• РњРћР”РђР›РљР (РІ СЃС‚РёР»Рµ races.css)      */
/* ============================================ */

.garage-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 10000;
  animation: garageFadeIn 0.2s ease-out;
}

@keyframes garageFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.garage-modal-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  width: 100%;
  max-width: 500px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-sizing: border-box;
}

.garage-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  position: relative;
}

.garage-modal-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent);
}

.garage-modal-header h2 {
  margin: 0;
  color: #fff;
  font-size: 20px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
  font-family: Impact, Arial Black, sans-serif;
}

.close-btn {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover,
.close-btn:active {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.5);
  color: #ff4444;
  transform: scale(1.05);
}

.garage-modal-body {
  padding: 16px 20px 24px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  color: #aaa;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.garage-modal-body::-webkit-scrollbar {
  width: 4px;
}

.garage-modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.garage-modal-body::-webkit-scrollbar-thumb {
  background: rgba(0, 229, 255, 0.3);
  border-radius: 2px;
}

.garage-modal-body > p {
  color: #8892b0;
  font-size: 13px;
  margin: 0 0 14px;
  text-align: center;
}

/* --- РџРѕРєСЂР°СЃРєР° --- */
.paint-section .paint-desc {
  color: #8892b0;
  font-size: 13px;
  margin: 0 0 14px;
  text-align: center;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.color-btn {
  min-width: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 12px 5px;
  color: #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.color-btn:hover,
.color-btn:active {
  border-color: rgba(0, 229, 255, 0.4);
  background: rgba(0, 229, 255, 0.05);
}

.color-btn.active {
  border-color: #00e5ff;
  background: rgba(0, 229, 255, 0.1);
  color: #fff;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
  transform: translateY(-2px);
}

.color-swatch {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow:
    inset 0 3px 6px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* --- РЎРїРёСЃРѕРє РґРµС‚Р°Р»РµР№ --- */
.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  max-height: none;
  min-height: min-content;
  overflow: visible;
  padding-bottom: 20px;
}

.inventory-list > p:first-child {
  color: #8892b0 !important;
  text-align: center;
  font-size: 12px !important;
  margin-bottom: 14px !important;
}

.inventory-item {
  box-sizing: border-box;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.inventory-item:active {
  transform: scale(0.97);
}

.inventory-item:not(.equipped):hover {
  background: rgba(0, 229, 255, 0.05) !important;
  border-color: rgba(0, 229, 255, 0.5) !important;
  transform: translateX(2px);
}

.inventory-item.equipped {
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0.02) 100%) !important;
  border-color: #00e5ff !important;
  border-width: 2px;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.15);
}

.item-name {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 6px;
}

.item-stats {
  font-size: 12px;
  color: #ccc;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.inventory-item button {
  transition: all 0.2s ease;
}

.inventory-item button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(255, 68, 68, 0.3);
}

/* ============================================ */
/* РњРћР”РђР›РљРђ Р’Р«Р‘РћР Рђ РњРђРЁРРќР«                        */
/* ============================================ */

.car-option-card {
  transition: all 0.2s ease;
  position: relative;
}

.car-option-card:not(.active):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.car-option-card.active {
  animation: carActivePulse 3s ease-in-out infinite;
}

@keyframes carActivePulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.2); }
  50% { box-shadow: 0 0 30px rgba(0, 229, 255, 0.4); }
}

/* ============================================ */
/* РђР”РђРџРўРђР¦РРЇ                                    */
/* ============================================ */

@media (max-width: 380px) {
  .garage-modal-header {
    padding: 16px 18px 12px;
  }
  .garage-modal-header h2 {
    font-size: 17px;
    letter-spacing: 1px;
  }
  .garage-modal-body {
    padding: 12px 14px 20px;
  }
}
```

### src/styles/history.css
```css
/* src/styles/history.css */

.history-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.history-container {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 229, 255, 0.1);
  overflow: hidden;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  flex-shrink: 0;
}

.history-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent);
}

.history-header h2 {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: Impact, Arial Black, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.history-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.history-close:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.5);
  color: #ff4444;
}

.history-body {
  padding: 12px 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: none;
}

.history-body::-webkit-scrollbar { display: none; }

.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 10px;
  color: #666;
}

.history-empty p {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border-left: 3px solid;
  transition: all 0.2s;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.history-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.history-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-desc {
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-date {
  color: #666;
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.history-amount {
  font-family: Impact, Arial Black, sans-serif;
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.history-footer {
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: #666;
  font-size: 10px;
  text-align: center;
  font-weight: 600;
  flex-shrink: 0;
}
```

### src/styles/leaderboard.css
```css
/* src/styles/leaderboard.css */

.leaderboard-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.leaderboard-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.1);
  overflow: hidden;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 56px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  position: relative;
}

.leaderboard-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
}

.leaderboard-header h2 {
  margin: 0;
  color: var(--gold);
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  font-family: Impact, Arial Black, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
}

.leaderboard-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.leaderboard-close:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.4);
  color: var(--danger);
}

/* РўР°Р±С‹ */
.leaderboard-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px 20px 8px;
  flex-shrink: 0;
}

.leaderboard-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #888;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
}

.leaderboard-tab.active {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}

/* РЎРїРёСЃРѕРє */
.leaderboard-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 8px 20px 120px;
  padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
  scrollbar-width: none;
}

.leaderboard-body::-webkit-scrollbar { display: none; }

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leaderboard-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.2s;
}

.leaderboard-row.top-3 {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.06), rgba(255, 215, 0, 0.02));
  border-color: rgba(255, 215, 0, 0.2);
}

.lb-rank {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
  flex-shrink: 0;
}

.lb-avatar, .lb-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1.5px solid var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

.lb-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2035 0%, #0a0a0a 100%);
  color: var(--accent);
  font-weight: 900;
  font-size: 14px;
  font-family: Impact, sans-serif;
}

.lb-info {
  flex: 1;
  min-width: 0;
}

.lb-name {
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lb-username {
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 600;
  margin-top: 1px;
}

.lb-value {
  font-family: Impact, Arial Black, sans-serif;
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
```

### src/styles/levelReward.css
```css
/* src/styles/levelReward.css */

.level-reward-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.level-reward-content {
  position: relative;
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 24px;
  padding: 32px 24px 24px;
  width: 100%;
  max-width: 380px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.9), 
    0 0 40px rgba(255, 215, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-align: center;
  overflow: hidden;
}

/* Р”РµРєРѕСЂР°С‚РёРІРЅРѕРµ СЃРІРµС‡РµРЅРёРµ СЃРІРµСЂС…Сѓ */
.level-reward-content::before {
  content: '';
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  pointer-events: none;
}

/* РСЃРєСЂС‹ */
.sparkle {
  position: absolute;
  pointer-events: none;
}
.sparkle-1 { top: 20px; left: 20px; }
.sparkle-2 { top: 40px; right: 24px; }

.level-reward-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.level-reward-header h2 {
  margin: 0;
  color: #ffd700;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 22px;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.level-badge-big {
  background: linear-gradient(90deg, #ffd700, #ff8800);
  color: #000;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 14px;
  font-weight: 900;
  padding: 6px 18px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  letter-spacing: 1px;
}

.level-reward-subtitle {
  color: var(--text-secondary, #8E929D);
  font-size: 13px;
  margin: 0 0 20px;
  position: relative;
  z-index: 1;
}

.level-rewards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.level-reward-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 16px;
}

.reward-item-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reward-item-value {
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 16px;
  font-weight: 900;
  display: flex;
  align-items: center;
  flex: 1;
}

.reward-item-value strong {
  color: #ffd700;
  margin-left: 4px;
}

.level-reward-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #ffd700, #ff8800);
  border: none;
  border-radius: 14px;
  color: #000;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
  transition: transform 0.15s;
  position: relative;
  z-index: 1;
}

.level-reward-btn:active {
  transform: scale(0.97);
}

.level-reward-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.level-reward-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 2;
}

.level-reward-close:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.4);
  color: #ff4444;
}
```

### src/styles/loading.css
```css
/* src/styles/loading.css */
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999; /* РџРѕРІРµСЂС… РІСЃРµРіРѕ */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #050505;
  overflow: hidden;
}

/* РЎР»РѕР№ СЃ РєР°СЂС‚РёРЅРєРѕР№ */
.loading-bg {
  position: absolute;
  inset: 0;
  /* Р—РђРњР•РќР Р­РўРЈ РљРђР РўРРќРљРЈ РќРђ РЎР’РћР® (РЅР°РїСЂРёРјРµСЂ, РєСЂР°СЃРёРІС‹Р№ РІРёРґ РіР°СЂР°Р¶Р° РёР»Рё РЅРѕС‡РЅРѕРіРѕ РіРѕСЂРѕРґР°) */
  background-image: url('/images/bg-night-city.jpg'); 
  background-size: cover;
  background-position: center;
  filter: blur(4px) brightness(0.4); /* Р Р°Р·РјС‹РІР°РµРј Рё Р·Р°С‚РµРјРЅСЏРµРј С„РѕРЅ */
  z-index: 1;
}

/* Р“СЂР°РґРёРµРЅС‚, С‡С‚РѕР±С‹ С‚РµРєСЃС‚ С‡РёС‚Р°Р»СЃСЏ Р»СѓС‡С€Рµ */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(9,10,12,0.3) 0%, #090A0C 100%);
  z-index: 2;
}

/* РљРѕРЅС‚РµРЅС‚ РїРѕ С†РµРЅС‚СЂСѓ */
.loading-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 320px;
  padding: 20px;
}

/* Р›РѕРіРѕС‚РёРї */
.loading-logo {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 40px;
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
}

.loading-logo span {
  color: var(--accent);
  text-shadow: 0 0 20px var(--accent-glow-strong);
}

/* РџРѕР»РѕСЃР° Р·Р°РіСЂСѓР·РєРё */
.loading-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
}

.loading-bar-fill {
  height: 100%;
  background: var(--accent);
  box-shadow: 0 0 15px var(--accent);
  border-radius: 10px;
  transition: width 0.1s linear;
}

/* РўРµРєСЃС‚ Рё РїСЂРѕС†РµРЅС‚С‹ */
.loading-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.loading-text {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.loading-percent {
  font-size: 14px;
  font-weight: 900;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
```

### src/styles/pass.css
```css
/* src/styles/pass.css */

/* ============================================================
   OVERLAY вЂ” С†РµРЅС‚СЂРёСЂРѕРІР°РЅРёРµ + Telegram-С…РµРґРµСЂ + РѕС‚СЃС‚СѓРї РїРѕРґ РјРµРЅСЋ
   ============================================================ */
.pass-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  /* рџ‘‡ СЃРІРµСЂС…Сѓ вЂ” Р·РѕРЅР° Telegram-С…РµРґРµСЂР° (85px), СЃРЅРёР·Сѓ вЂ” home-РёРЅРґРёРєР°С‚РѕСЂ + РјРµРЅСЋ */
  padding-top: calc(16px + var(--tg-safe-top, 0px));
  padding-bottom: calc(
    16px + env(safe-area-inset-bottom, 0px) + var(--nav-height, 76px)
  );
}

/* ============================================================
   CONTENT вЂ” 24px СЃРѕ РІСЃРµС… СѓРіР»РѕРІ, overflow hidden, flex-РєРѕР»РѕРЅРєР°
   ============================================================ */
.pass-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  /* рџ‘‡ РІС‹С‡РёС‚Р°РµРј: safe-top (Telegram-С…РµРґРµСЂ) + safe-bottom + РјРµРЅСЋ */
  max-height: calc(
    100vh - 32px - var(--tg-safe-top, 0px) - env(safe-area-inset-bottom, 0px) - var(--nav-height, 76px)
  );
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 229, 255, 0.1);
  overflow: hidden;
}

/* Р¤РёРєСЃРёСЂРѕРІР°РЅРЅС‹Рµ СЃРµРєС†РёРё РЅРµ СЃР¶РёРјР°СЋС‚СЃСЏ РїСЂРё РґР»РёРЅРЅРѕРј body */
.pass-header,
.pass-progress-section,
.pass-premium-active,
.pass-buy-premium,
.pass-tabs {
  flex-shrink: 0;
}

/* ============================================================
   HEADER
   ============================================================ */
.pass-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.pass-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent);
}

.pass-header h2 {
  margin: 0;
  color: var(--accent);
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 15px var(--accent-glow);
  font-family: Impact, Arial Black, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pass-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pass-close:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.4);
  color: var(--danger);
}

/* ============================================================
   РџР РћР“Р Р•РЎРЎ
   ============================================================ */
.pass-progress-section {
  padding: 16px 20px 12px;
}

.pass-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.pass-progress-level {
  color: var(--accent);
  font-family: Impact, Arial Black, sans-serif;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.pass-progress-xp {
  color: #fff;
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
}

.pass-progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.pass-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
  box-shadow: 0 0 10px currentColor;
}

/* ============================================================
   РџР Р•РњРРЈРњ-РЎРўРђРўРЈРЎ / РљРќРћРџРљРђ РџРћРљРЈРџРљР
   ============================================================ */
.pass-premium-active {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  padding: 12px;
  margin: 0 20px 12px;
  color: var(--gold);
  font-family: Impact, Arial Black, sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
}

.pass-buy-premium {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, var(--gold), var(--gold-dim));
  border: none;
  border-radius: 12px;
  padding: 14px;
  margin: 0 20px 12px;
  color: #000;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
  transition: transform 0.15s, opacity 0.15s;
}

.pass-buy-premium:active { transform: scale(0.97); }
.pass-buy-premium:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ============================================================
   РўРђР‘Р«
   ============================================================ */
.pass-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 0 20px 12px;
}

.pass-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #888;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.pass-tab.active {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}

.pass-tab.active.free {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.15);
}

.pass-tab.active.premium {
  border-color: var(--gold);
  color: var(--gold);
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.15);
}

/* ============================================================
   BODY вЂ” СЃРєСЂРѕР»Р» + safe-area СЃРЅРёР·Сѓ + min-height:0
   ============================================================ */
.pass-body {
  padding: 16px 20px 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: none;
}

.pass-body::-webkit-scrollbar { display: none; }

/* ============================================================
   РЈР РћР’РќР
   ============================================================ */
.pass-level {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.pass-level.unlocked {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(0, 229, 255, 0.02));
  border-color: rgba(0, 229, 255, 0.2);
}

.pass-level.premium.unlocked {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.02));
  border-color: rgba(255, 215, 0, 0.2);
}

.pass-level-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.pass-level-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #666;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pass-level-badge.unlocked {
  background: linear-gradient(135deg, var(--accent), var(--accent-dim));
  color: #000;
  border-color: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow);
}

.pass-level-title {
  flex: 1;
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.pass-level-req {
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ============================================================
   РќРђР“Р РђР”Р«
   ============================================================ */
.pass-reward {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
}

.pass-reward.free {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.15);
}

.pass-reward.premium {
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.pass-reward-info {
  flex: 1;
  min-width: 0;
}

.pass-reward-label {
  color: var(--text-secondary);
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pass-reward-value {
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 14px;
  font-weight: 900;
  margin-top: 2px;
  display: flex;
  align-items: center;
}

.pass-reward-value.gold {
  color: var(--gold);
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

/* ============================================================
   РљРќРћРџРљР Р—РђР‘Р РђРўР¬
   ============================================================ */
.pass-claim-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  color: #666;
  flex-shrink: 0;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pass-claim-btn.ready {
  background: linear-gradient(90deg, var(--success), var(--success-dim));
  color: #000;
  box-shadow: 0 4px 12px var(--success-glow);
}

.pass-claim-btn.ready-premium {
  background: linear-gradient(90deg, var(--gold), var(--gold-dim));
  color: #000;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.pass-claim-btn.claimed {
  background: transparent;
  color: var(--success);
  border: 1px solid rgba(0, 217, 126, 0.4);
}

.pass-claim-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.pass-claim-btn:disabled:not(.claimed):not(.ready):not(.ready-premium) {
  background: rgba(255, 255, 255, 0.03);
  color: #555;
}

/* ============================================================
   РњРћР”РђР›РљРђ РџРћР”РўР’Р•Р Р–Р”Р•РќРРЇ вЂ” safe-area + РѕС‚СЃС‚СѓРї РјРµРЅСЋ
   ============================================================ */
.pass-confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  /* рџ‘‡ С‚Р° Р¶Рµ Р»РѕРіРёРєР° вЂ” Telegram-С…РµРґРµСЂ СЃРІРµСЂС…Сѓ */
  padding-top: calc(16px + var(--tg-safe-top, 0px));
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

.pass-confirm-box {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 24px;
  padding: 32px 24px 24px;
  text-align: center;
  max-width: 340px;
  width: 100%;
  max-height: calc(
    100vh - 32px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)
  );
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.2);
}

.pass-confirm-box h3 {
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 18px;
  letter-spacing: 1.5px;
  margin: 16px 0 8px;
}

.pass-confirm-box p {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0 0 24px;
}

.pass-confirm-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.pass-confirm-cancel,
.pass-confirm-buy {
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.pass-confirm-cancel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
}

.pass-confirm-buy {
  background: linear-gradient(90deg, var(--gold), var(--gold-dim));
  color: #000;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
}

.pass-confirm-cancel:active,
.pass-confirm-buy:active {
  transform: scale(0.97);
}

.pass-confirm-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### src/styles/profile.css
```css
/* src/styles/profile.css */

.profile-screen {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: radial-gradient(circle at 50% 0%, #101524 0%, #050608 100%),
              repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px);
  padding: 12px 14px;
  padding-top: calc(12px + var(--tg-safe-top, 0px));
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px) + 100px);
  z-index: 10;
  font-family: var(--font-main);
  scrollbar-width: none; /* РЎРєСЂС‹РІР°РµРј РїРѕР»РѕСЃРєСѓ СЃРєСЂРѕР»Р»Р° */
}

.profile-screen::-webkit-scrollbar {
  display: none;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

/* ========== РЁРђРџРљРђ ========== */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 20px;
  padding: 24px 16px 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(0, 229, 255, 0.03);
  position: relative;
  overflow: hidden;
}

/* Р”РµРєРѕСЂР°С‚РёРІРЅРѕРµ СЃРІРµС‡РµРЅРёРµ РІ СѓРіР»Сѓ */
.profile-header::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.4;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 12px;
  z-index: 1;
}

.profile-avatar, .profile-avatar-placeholder {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid var(--accent);
  box-shadow: 0 0 24px var(--accent-glow-strong);
  object-fit: cover;
  display: block;
}

.profile-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2035 0%, #0a0a0a 100%);
  font-size: 36px;
  font-weight: 900;
  color: var(--accent);
  font-family: Impact, sans-serif;
}

.level-badge {
  position: absolute;
  bottom: 0;
  right: -10px;
  background: linear-gradient(90deg, var(--accent), var(--accent-dim));
  color: #000;
  font-weight: 900;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 10px;
  border: 2px solid #0a0a0a;
  box-shadow: 0 0 14px var(--accent-glow);
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.profile-name {
  color: #fff;
  font-size: 24px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 4px;
  text-shadow: 0 0 15px var(--accent-glow);
  text-align: center;
  z-index: 1;
  line-height: 1.1;
}

.profile-username {
  color: var(--accent);
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  z-index: 1;
}

/* ========== XP-Р‘РђР  ========== */
.xp-section {
  background: linear-gradient(135deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 10px 14px;
}

.xp-labels {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.xp-label-title {
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
}

.xp-label-value {
  color: var(--accent);
  font-size: 11px;
  font-weight: 900;
  font-family: monospace;
}

.xp-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-dim), var(--accent));
  box-shadow: 0 0 8px var(--accent-glow);
  border-radius: 3px;
  transition: width 0.4s ease;
}

/* ========== РљРђР РўРћР§РљР ========== */
.profile-card {
  background: linear-gradient(135deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
}

.profile-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mini-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.mini-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mini-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mini-label {
  color: var(--text-secondary);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.mini-value {
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  font-family: Impact, sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}

/* ========== РЎРўРђРўРРЎРўРРљРђ Р”РћРҐРћР”Рђ ========== */
.income-card {
  padding: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.card-action {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
}

.income-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.income-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.income-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.income-label {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.income-value {
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  font-family: Impact, sans-serif;
  display: flex;
  align-items: center;
}

/* ========== РР“Р РћР’РђРЇ РЎРўРђРўРРЎРўРРљРђ ========== */
.game-stats-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 12px 8px;
  gap: 4px;
}

.game-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4px;
  position: relative;
}

.game-stat:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  bottom: 20%;
  width: 1px;
  background: rgba(255, 255, 255, 0.05);
}

.game-stat-icon {
  margin-bottom: 4px;
}

.game-stat-value {
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  font-family: Impact, sans-serif;
}

.game-stat-label {
  color: var(--text-secondary);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* ========== WINRATE ========== */
.winrate-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.winrate-label {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.5px;
}

.winrate-value {
  font-size: 18px;
  font-weight: 900;
  font-family: Impact, sans-serif;
}

/* ========== РљРќРћРџРљР РњР•РќР® ========== */
.profile-menu-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: linear-gradient(135deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.profile-menu-btn:hover {
  transform: translateX(2px);
  border-color: rgba(255, 255, 255, 0.15);
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-title {
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.5px;
  flex: 1;
}

.menu-sub {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.menu-badge {
  background: var(--danger);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 10px;
  box-shadow: 0 0 10px var(--danger-glow);
}

.menu-arrow {
  color: var(--accent);
  font-size: 20px;
  font-weight: 900;
}

/* ========== РРќР¤Рћ ========== */
.info-card {
  padding: 4px 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.info-value {
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  font-family: monospace;
}

/* РџСѓР»СЊСЃР°С†РёСЏ Р±РµР№РґР¶Р° "!" */
@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px var(--gold); }
  50% { transform: scale(1.2); box-shadow: 0 0 20px var(--gold); }
}

/* РџСѓР»СЊСЃР°С†РёСЏ РєРЅРѕРїРєРё "РќР°РіСЂР°РґР° Р·Р° СѓСЂРѕРІРµРЅСЊ" */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.4); }
}

/* ========== РџРћРЎР›Р•Р”РќРР• Р”РћРЎРўРР–Р•РќРРЇ ========== */
.recent-achievements-card {
  padding: 14px;
}

.recent-achievements-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.recent-ach-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
}

.recent-ach-item.unlocked {
  background: linear-gradient(135deg, rgba(0, 217, 126, 0.08), rgba(0, 217, 126, 0.02));
  border-color: rgba(0, 217, 126, 0.3);
}

.recent-ach-item.claimable {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.02));
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);
}

.recent-ach-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recent-ach-info {
  flex: 1;
  min-width: 0;
}

.recent-ach-name {
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.recent-ach-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recent-ach-tier {
  font-size: 8px;
  font-weight: 900;
  padding: 1px 6px;
  border: 1px solid;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.recent-ach-reward {
  color: var(--gold);
  font-family: Impact, Arial Black, sans-serif;
  font-size: 10px;
  font-weight: 900;
  display: flex;
  align-items: center;
}

.recent-ach-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--gold);
  color: #000;
  font-size: 11px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px var(--gold);
  animation: pulse 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

/* РђРЅРёРјР°С†РёРё (РµСЃР»Рё РµС‰С‘ РЅРµС‚) */
@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px var(--gold); }
  50% { transform: scale(1.2); box-shadow: 0 0 20px var(--gold); }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.4); }
}
```

### src/styles/quests.css
```css
/* src/styles/quests.css */

.quest-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.quest-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.1);
  overflow: hidden;
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  position: relative;
}

.quest-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
}

.quest-header h2 {
  margin: 0;
  color: var(--gold);
  font-family: Impact, Arial Black, sans-serif;
  font-size: 18px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

.quest-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quest-close:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.4);
  color: var(--danger);
}

.quest-body {
  padding: 16px 20px 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: none;
}

.quest-body::-webkit-scrollbar { display: none; }

.quest-card {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.quest-card.completed {
  border-color: rgba(0, 217, 126, 0.4);
  background: linear-gradient(135deg, rgba(0, 217, 126, 0.08), rgba(0, 217, 126, 0.02));
}

.quest-card.claimed {
  opacity: 0.7;
}

.quest-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quest-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quest-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.quest-title {
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.quest-reward {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--gold);
  font-family: Impact, Arial Black, sans-serif;
  font-size: 12px;
  font-weight: 900;
}

.quest-reward-xp {
  color: var(--accent);
  font-family: Impact, sans-serif;
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 6px;
}

.quest-desc {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
}

.quest-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
  margin: 4px 0;
}

.quest-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.quest-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quest-progress-text {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  font-family: monospace;
}

.quest-status {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quest-status.done { color: var(--success); }
.quest-status.progress { color: var(--text-muted); }

.quest-claim-btn {
  padding: 6px 14px;
  background: linear-gradient(90deg, var(--success), var(--success-dim));
  border: none;
  border-radius: 8px;
  color: #000;
  font-family: Impact, sans-serif;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--success-glow);
  transition: all 0.2s;
}

.quest-claim-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--success-glow-strong);
}

.quest-claim-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### src/styles/race.css
```css
/* src/styles/race.css */

/* --- Р­РљР РђРќ РљР›РРљР•Р Рђ --- */
.race-screen {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: #090a0c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.race-scene {
  position: relative;
  flex: 0 0 auto;
  height: 100%;
  aspect-ratio: 9 / 16;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  isolation: isolate;
}

/* --- Р¤РћРќ --- */
.race-background {
  position: absolute;
  inset: 0;
  background-image: url('/images/bg-night-city.jpg');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.race-background-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(9, 10, 12, 0.7) 0%,
    rgba(9, 10, 12, 0.4) 40%,
    rgba(9, 10, 12, 0.8) 80%,
    #090A0C 100%
  );
  z-index: 1;
}

/* --- Р’Р•Р РҐРќРР™ HUD --- */
.race-top-ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 2;
  position: absolute;
  top: calc(30px + var(--tg-safe-top, 0px));
  width: 100%;
  max-width: 300px;
  left: 50%;
  transform: translateX(-50%);
}

.race-hud {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 12px;
  font-variant-numeric: tabular-nums;
  position: relative;
  z-index: 2;
}

.race-hud-coins {
  font-size: 34px;
  font-weight: 900;
  font-family: Impact, Arial Black, sans-serif;
  color: var(--gold);
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
  line-height: 1;
}

.race-level-bar-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.race-level-text {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.race-level-text span:last-child {
  color: var(--accent);
}

.race-xp-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.race-xp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-dim), var(--accent));
  box-shadow: 0 0 10px var(--accent-glow);
  border-radius: 10px;
  transition: width 0.3s ease-out;
}

/* --- РљРћРќРўР•Р™РќР•Р  РњРђРЁРРќР« --- */
.race-car-container {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 90%;
  max-width: 350px;
  max-height: 45%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  z-index: 2;
}

.race-car-container.rejected {
  animation: car-reject 160ms ease-out;
}

@keyframes car-reject {
  0%   { transform: translateX(-50%) translateX(0); }
  25%  { transform: translateX(-50%) translateX(-3px); }
  50%  { transform: translateX(-50%) translateX(3px); }
  75%  { transform: translateX(-50%) translateX(-1px); }
  100% { transform: translateX(-50%) translateX(0); }
}

.race-car-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  pointer-events: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6));
}

.race-car-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
}

/* --- РњРћР”РђР›РљРђ RACES (РµРґРёРЅР°СЏ, С†РµРЅС‚СЂРёСЂРѕРІР°РЅРЅР°СЏ) --- */
.race-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.race-modal-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 32px);
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.race-modal-content::-webkit-scrollbar { display: none; }

.race-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.race-modal-header h2 {
  margin: 0;
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 16px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.race-modal-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.race-modal-close:hover {
  background: rgba(255, 68, 68, 0.15);
  color: var(--danger);
  border-color: rgba(255, 68, 68, 0.4);
}

/* --- РљРђР РўРћР§РљР РЈР›РЈР§РЁР•РќРР™ --- */
.race-upgrade-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 10px;
}

.race-upgrade-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.race-upgrade-info {
  flex: 1;
  min-width: 0;
}

.race-upgrade-title {
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.race-upgrade-desc {
  color: var(--text-secondary);
  font-size: 11px;
  margin-top: 2px;
}

.race-upgrade-level {
  font-size: 11px;
  font-weight: 800;
  margin-top: 4px;
}

.race-upgrade-buy {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 900;
  font-size: 12px;
  font-family: Impact, sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;
}

.race-upgrade-buy:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 217, 126, 0.4);
}

/* --- Р›РР”Р•Р Р‘РћР Р” --- */
.race-leaderboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
}

.race-lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 12px;
}

.race-lb-rank {
  font-family: Impact, sans-serif;
  font-size: 14px;
  font-weight: 900;
  width: 36px;
}

.race-lb-name {
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.race-lb-value {
  color: var(--gold);
  font-family: Impact, sans-serif;
  font-size: 13px;
  font-weight: 900;
  display: flex;
  align-items: center;
}

/* --- РџРђРќР•Р›Р¬ Р”Р•Р™РЎРўР’РР™ --- */
.race-action-panel {
  position: absolute;
  bottom: 50%;
  left: 5%;
  transform: translateY(50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.race-action-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.6));
  color: var(--btn-color, var(--accent));
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  transition: all 0.2s;
}

.race-action-btn:active { transform: scale(0.92); }

.race-action-btn:hover {
  border-color: var(--btn-color, var(--accent));
  box-shadow: 0 4px 20px var(--btn-color, var(--accent-glow));
}

.race-action-label {
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.race-action-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--danger);
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0a0a0a;
  box-shadow: 0 0 10px var(--danger-glow);
}

.race-action-badge.dot {
  width: 10px;
  height: 10px;
  background: var(--success);
  box-shadow: 0 0 8px var(--success-glow);
  border-width: 0;
}
```

### src/styles/races.css
```css
/* src/styles/races.css */

/* ========== Р‘РђР—Рђ ========== */
.races-screen { 
  position: absolute; 
  inset: 0; 
  /* РЈР±РёСЂР°РµРј РѕР±С‰РёР№ СЃРєСЂРѕР»Р», С‡С‚РѕР±С‹ РѕРЅ РЅРµ Р»РѕРјР°Р» СЌРєСЂР°РЅ РіРѕРЅРєРё */
  overflow: hidden; 
  background: 
    radial-gradient(circle at 50% 0%, #101524 0%, #050608 100%),
    repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px);
  display: flex; 
  flex-direction: column; 
  padding: 16px 20px; 
  padding-top: calc(16px + var(--tg-safe-top, 0px)); 
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); 
  z-index: 10;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.races-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 16px; 
  flex-shrink: 0;
}
.races-header h2 { 
  margin: 0; 
  color: #fff; 
  font-size: 24px; 
  font-family: Impact, Arial Black, sans-serif;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
}

/* ========== РњР•РќР® ========== */
.race-hub { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
  flex: 1;
  min-height: 0;
  overflow-y: auto; /* РЎРєСЂРѕР»Р» С‚РѕР»СЊРєРѕ РґР»СЏ РјРµРЅСЋ */
  overflow-x: hidden;
  padding-bottom: 20px; 
}
.race-hub-heading h1 { 
  margin: 0 0 6px 0; 
  color: #fff; 
  font-size: 26px; 
  font-weight: 900;
  letter-spacing: -0.5px;
}
.race-hub-heading p { 
  margin: 0; 
  color: #8892b0; 
  font-size: 14px; 
}

/* РљРЅРѕРїРєР° Р»РёРіРё */
.league-badge-button {
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  cursor: pointer;
  border-radius: 14px;
  transition: filter 0.2s ease;
}
.league-badge-button:hover {
  filter: brightness(1.15);
}

/* Р–Р•РЎРўРљРР™ Р¤РРљРЎ Р›РР“Р РќРђ РњРћР‘РР›РљРђРҐ */
.league-badge {
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.1) 0%, rgba(10, 12, 20, 0.9) 100%) !important;
  border: 1px solid rgba(0, 229, 255, 0.3) !important;
  border-radius: 14px !important;
  padding: 12px 16px !important;
  flex-shrink: 0 !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  text-align: left !important;
  width: 100% !important;
  box-sizing: border-box !important;
}
.league-badge > * {
  text-align: left !important;
}
.league-badge-icon { 
  font-size: 24px !important; 
  flex-shrink: 0 !important; 
  margin-right: 12px !important; 
}
.league-badge-info, .league-badge-top { 
  display: flex !important; 
  flex-direction: column !important; 
  align-items: flex-start !important; 
  justify-content: center !important;
}
.league-badge-name { 
  font-size: 14px !important; 
  font-weight: 900 !important; 
  color: #fff !important; 
  text-transform: uppercase !important; 
}
.league-badge-points { 
  font-size: 11px !important; 
  color: #00e5ff !important; 
  font-weight: 700 !important; 
}

/* Р“Р»Р°РІРЅР°СЏ РєР°СЂС‚РѕС‡РєР° "Р‘С‹СЃС‚СЂР°СЏ РіРѕРЅРєР°" */
.race-mode-primary { 
  position: relative;
  display: flex; 
  flex-direction: column; 
  align-items: flex-start; 
  background: linear-gradient(135deg, #141a2e 0%, #050608 100%); 
  border: 1px solid rgba(0, 229, 255, 0.3); 
  border-radius: 20px; 
  padding: 24px 20px; 
  cursor: pointer; 
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
  text-align: left; 
  width: 100%; 
  color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  box-sizing: border-box;
  z-index: 1;
}
.race-mode-primary:hover { 
  border-color: #00e5ff; 
  box-shadow: 0 0 40px rgba(0, 229, 255, 0.15), inset 0 0 20px rgba(0, 229, 255, 0.05); 
  transform: translateY(-3px);
}
.race-mode-bg-glow {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 20px;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.race-mode-bg-glow::after {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}
.race-mode-primary .race-icon { 
  font-size: 44px; 
  margin-bottom: 16px; 
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8)); 
  z-index: 1;
}
.race-mode-info { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
  margin-bottom: 24px; 
  z-index: 1; 
}
.race-mode-info strong { 
  color: #fff; 
  font-size: 24px; 
  font-weight: 900;
  text-transform: uppercase; 
  letter-spacing: 1px;
}
.race-mode-info small { 
  color: #a0aec0; 
  font-size: 13px; 
  font-weight: 500;
}
.race-mode-action { 
  color: #00e5ff; 
  font-weight: 900; 
  font-size: 14px; 
  letter-spacing: 1.5px; 
  text-transform: uppercase; 
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
  white-space: nowrap;
  margin-top: auto;
}
.race-mode-action::after {
  content: 'в†’';
  margin-left: 8px;
  transition: transform 0.2s ease;
}
.race-mode-primary:hover .race-mode-action::after {
  transform: translateX(5px);
}

/* Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ РєР°СЂС‚РѕС‡РєРё */
.race-extra-modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.race-extra-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #1a1a24 0%, #0a0a10 100%); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  opacity: 0.8;
  cursor: not-allowed;
  transition: all 0.2s ease;
}
.race-extra-card:hover {
  opacity: 1;
  border-color: rgba(0, 229, 255, 0.3);
}
.extra-icon {
  font-size: 26px;
  opacity: 0.9;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}
.race-extra-card div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.race-extra-card strong {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 700;
}
.race-extra-card small {
  color: #64748b;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.5px;
}

/* ========== РљРћРќРўР•Р™РќР•Р  Р“РћРќРљР ========== */
.premium-race-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #222;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.9);
}

/* РќР° Р±РѕР»СЊС€РёС… СЌРєСЂР°РЅР°С… РџРљ С†РµРЅС‚СЂРёСЂСѓРµРј Рё РѕРіСЂР°РЅРёС‡РёРІР°РµРј РіРѕРЅРєСѓ */
@media (min-width: 600px) {
  .premium-race-container {
    max-width: 480px;
    margin: 0 auto;
    max-height: 100%;
  }
}

/* ========== РљРђР РўРћР§РљР РР“Р РћРљРћР’ ========== */
.online-versus-card {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 12px 16px;
  background: #050505;
  border-bottom: 1px solid #222;
  z-index: 5;
  flex-shrink: 0;
}
.racer-profile { display: flex; align-items: center; gap: 8px; }
.racer-avatar { 
  width: 40px; height: 40px; border-radius: 12px; 
  background: #222 center/cover; border: 1px solid #444; 
  overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; 
}
.racer-avatar img { width: 100%; height: 100%; object-fit: cover; }
.racer-avatar.enemy { background: #400; color: #f44; border-color: #f00; font-weight: 900; font-size: 14px; }
.racer-meta { display: flex; flex-direction: column; min-width: 0; }
.racer-meta small { color: #666; font-size: 9px; font-weight: 800; text-transform: uppercase; }
.racer-meta strong { color: #fff; font-weight: 900; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.racer-meta span { color: #888; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.racer-meta em { color: #00e5ff; font-size: 10px; font-style: normal; font-weight: 900; }
.enemy-profile .racer-meta em { color: #ff3333; }
.enemy-profile .racer-meta { text-align: right; }
.versus-badge { 
  background: #fff; color: #000; width: 32px; height: 32px; border-radius: 8px; 
  display: flex; justify-content: center; align-items: center; font-weight: 900; font-size: 15px; 
  margin: 0 8px; transform: skewX(-10deg); flex-shrink: 0; 
  box-shadow: 0 0 15px rgba(255,255,255,0.2);
}

/* ========== РўР РђРЎРЎРђ ========== */
.race-stage { 
  flex: 1 1 auto;
  min-height: 200px; /* РњРёРЅРёРјР°Р»СЊРЅР°СЏ РІС‹СЃРѕС‚Р° РґР»СЏ С‚СЂР°СЃСЃС‹, С‡С‚РѕР±С‹ РЅРµ СЃС…Р»РѕРїС‹РІР°Р»Р°СЃСЊ РЅР° РџРљ */
  position: relative; 
  overflow: hidden; 
  background: #000; 
  z-index: 1; 
  margin: 0; 
  border-radius: 0;
}

/* РќРµР±Рѕ, Р·Р°РєР°С‚, РіРѕСЂРѕРґ */
.race-sky { 
  position: absolute; top: 0; left: 0; right: 0; height: 45%; 
  background: linear-gradient(180deg, #0a0a14 0%, #2a1215 40%, #4a1c1c 100%);
  overflow: hidden; z-index: 1;
}
.race-sun {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #ffcc00 0%, #ff5500 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.9;
}
.race-city { 
  position: absolute; bottom: 0; left: 0; right: 0; height: 40px; 
  background: #000;
  opacity: .9; 
  clip-path: polygon(0 100%,0 48%,3% 48%,3% 18%,5% 18%,5% 64%,8% 64%,8% 35%,11% 35%,11% 72%,15% 72%,15% 26%,18% 26%,18% 100%, 22% 100%, 22% 40%, 25% 40%, 25% 80%, 28% 80%, 28% 20%, 32% 20%, 32% 100%);
}

.race-horizon { 
  position: absolute; top: 45%; left: 0; right: 0; height: 2px; 
  background: #ff3333; 
  box-shadow: 0 0 15px rgba(255, 50, 50, 0.6); z-index: 2; 
}

/* Р”РѕСЂРѕРіР° (Р°СЃС„Р°Р»СЊС‚) */
.race-road-bg {
  position: absolute;
  top: 45%;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #1a1a1a 0%, #050505 100%);
  z-index: 1;
}
.race-road-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px);
  opacity: 0.5;
}

/* Р‘РѕРєРѕРІС‹Рµ Р±Р°СЂСЊРµСЂС‹ */
.race-side-barrier {
  position: absolute;
  top: 45%;
  bottom: 0;
  width: 8px;
  background: #222;
  z-index: 3;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.8);
}
.race-side-barrier.left { left: 0; border-right: 1px solid #333; }
.race-side-barrier.right { right: 0; border-left: 1px solid #333; }

.race-track-hud { 
  position: absolute; top: 8px; left: 16px; right: 16px; 
  display: flex; justify-content: space-between; 
  color: #fff; font-size: 10px; font-weight: 700; 
  font-family: monospace; z-index: 10; letter-spacing: 1px; 
  text-shadow: 1px 1px 2px #000;
}
.race-track-hud strong { color: #00e5ff; }

.race-lane { 
  position: absolute; left: 0; right: 0; height: 25%;
  background: transparent;
  z-index: 2; overflow: hidden;
}
.lane-one { top: 45%; border-bottom: 1px dashed rgba(255,255,255,0.1); } 
.lane-two { top: 70%; }

.lane-label { 
  position: absolute; left: 12px; top: 8px; display: flex; align-items: center; gap: 6px; 
  padding: 2px 6px; background: rgba(0,0,0,0.6); border: 1px solid #333; border-radius: 4px; 
  font-size: 7px; z-index: 10; color: #888; font-weight: 900; 
}
.lane-label span { color: #ccc; font-size: 6px; }
.lane-two .lane-label span { color: #ff6666; }

.road-marks-inner { 
  position: absolute; left: 0; right: 0; top: 50%; height: 2px;
  background: repeating-linear-gradient(90deg, transparent 0 20px, rgba(255,255,255,0.3) 20px 60px, transparent 60px 80px); 
  opacity: .8; z-index: 2; display: block;
}
.race-stage.is-racing .road-marks-inner { animation: quickRoadRush .3s linear infinite; }
@keyframes quickRoadRush { to { transform: translate3d(50%, 0, 0); } }

.finish-line-inner { 
  position: absolute; z-index: 3; right: 40px; top: 0; bottom: 0; width: 20px; 
  background: repeating-linear-gradient(0deg, #fff 0 10px, #111 10px 20px); 
  box-shadow: 0 0 20px rgba(255,255,255,.3); 
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
}

.race-car { 
  position: absolute; bottom: 2px; width: 120px; height: 60px; 
  display: flex; justify-content: center; align-items: flex-end; 
  z-index: 10; will-change: transform; 
  transform: translateZ(0); /* РђРїРїР°СЂР°С‚РЅРѕРµ СѓСЃРєРѕСЂРµРЅРёРµ */
}

.race-car::before {
  content: ''; position: absolute; bottom: -10px; left: 5%; width: 90%; height: 20px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, transparent 60%);
  border-radius: 50%; z-index: -1; filter: blur(3px);
}

.race-car::after {
  content: ''; position: absolute; bottom: 5px; right: 5px; width: 30px; height: 20px;
  background: radial-gradient(circle, rgba(150,150,150,0.4) 0%, transparent 70%);
  border-radius: 50%; opacity: 0; transition: opacity 0.2s; pointer-events: none;
}
.race-stage.is-racing .race-car::after { opacity: 0.8; animation: smokePuff 0.3s infinite alternate; }
@keyframes smokePuff { from { transform: scale(0.8) translateX(0); opacity: 0.4; } to { transform: scale(1.2) translateX(-10px); opacity: 0.7; } }

.race-car img { 
  display: block; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; 
  filter: drop-shadow(0 15px 10px rgba(0,0,0,1)) drop-shadow(0 0 10px rgba(0, 229, 255, 0.6));
}

.enemy-car-sprite img { 
  filter: drop-shadow(0 15px 10px rgba(0,0,0,1)) drop-shadow(0 0 10px rgba(255, 50, 50, 0.6));
}

.race-car.max-speed-glow img { 
  filter: drop-shadow(0 15px 10px rgba(0,0,0,1)) drop-shadow(0 0 25px rgba(0, 229, 255, 1)); 
}
.race-car.max-speed-glow::after {
  content: ''; position: absolute; left: -30px; bottom: 15px; width: 50px; height: 15px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 1), transparent);
  border-radius: 50%; filter: blur(4px); animation: nosFlame 0.05s infinite alternate;
}

.enemy-car-sprite.max-speed-glow::after {
  background: linear-gradient(90deg, transparent, rgba(255, 50, 50, 1), transparent);
}
@keyframes nosFlame { from { transform: scaleX(0.8); opacity: 0.7; } to { transform: scaleX(1.3); opacity: 1; } }

.skid-marks { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
.skid-marks span {
  position: absolute; bottom: 2px; width: 24px; height: 3px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.9), transparent);
  border-radius: 2px; opacity: 0; animation: skidFade 2s ease-out forwards;
}
@keyframes skidFade { 0% { opacity: 0.8; } 100% { opacity: 0; } }

.race-guardrail { 
  position: absolute; left: 0; right: 0; bottom: 0; height: 6px; 
  background: linear-gradient(180deg, #444, #111); 
  box-shadow: 0 -1px rgba(255,255,255,.1); z-index: 4; 
}

.race-stage.is-finishing { animation: finishPulse 0.6s ease-out; }
@keyframes finishPulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }

.speed-lines-container { position: absolute; inset: 0; z-index: 20; pointer-events: none; overflow: hidden; }
.speed-line { position: absolute; height: 2px; width: 80px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); opacity: 0; }
.race-stage.is-racing .speed-line { animation: speedLine 0.2s linear infinite; }
.race-stage.is-racing .speed-line:nth-child(1) { top: 20%; animation-delay: 0s; }
.race-stage.is-racing .speed-line:nth-child(2) { top: 40%; animation-delay: 0.05s; }
.race-stage.is-racing .speed-line:nth-child(3) { top: 60%; animation-delay: 0.1s; }
.race-stage.is-racing .speed-line:nth-child(4) { top: 80%; animation-delay: 0.15s; }
.race-stage.is-racing .speed-line:nth-child(5) { top: 90%; animation-delay: 0.02s; }

@keyframes speedLine { 0% { transform: translate3d(100vw, 0, 0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translate3d(-100px, 0, 0); opacity: 0; } }

.speed-lines-container.is-max .speed-line { background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.8), transparent); }

.race-vignette {
  position: absolute; inset: 0; z-index: 21; pointer-events: none;
  background: radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.6) 100%);
  transition: background 0.3s ease;
}
.race-vignette.is-max {
  background: radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.95) 100%);
}

/* ========== РЎРџРР”РћРњР•РўР  ========== */
.speedometer {
  position: absolute; bottom: 16px; right: 16px; width: 70px; height: 70px; z-index: 20;
  display: flex; justify-content: center; align-items: center;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.8)); transition: all 0.3s ease;
}
.speedometer-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.speedometer-track { fill: rgba(0, 0, 0, 0.8); stroke: #222; stroke-width: 8; }
.speedometer-fill { fill: none; stroke: #fff; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.1s linear, stroke 0.3s ease; }
.speedometer.is-max .speedometer-fill { stroke: #00e5ff; filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.8)); }
.speedometer.is-max .speedometer-value { color: #00e5ff; }
.speedometer-content { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; }
.speedometer-value { color: #fff; font-size: 18px; font-weight: 900; line-height: 1; font-family: monospace; transition: color 0.3s ease; }
.speedometer-unit { color: #666; font-size: 8px; font-weight: 700; text-transform: uppercase; margin-top: 1px; }

/* ========== РџР РћР“Р Р•РЎРЎ-Р‘РђР Р« ========== */
.bottom-progress-bars { 
  padding: 12px 16px; background: #050505; border-top: 1px solid #222; 
  display: flex; flex-direction: column; gap: 8px; z-index: 5; flex-shrink: 0; 
}
.progress-row { display: flex; align-items: center; gap: 10px; }
.progress-label { color: #666; font-size: 10px; font-weight: 900; width: 50px; text-transform: uppercase; letter-spacing: 1px; }
.progress-track { flex: 1; height: 6px; background: #222; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.05s linear; }
.progress-fill.green { background: #00e5ff; box-shadow: 0 0 10px #00e5ff; }
.progress-fill.red { background: #ff3333; box-shadow: 0 0 10px #ff3333; }

/* ========== Р Р•Р—РЈР›Р¬РўРђРў ========== */
.race-result-modal {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px);
  display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; box-sizing: border-box;
}
.race-result-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%); 
  border: 1px solid rgba(0, 229, 255, 0.3); 
  border-radius: 20px;
  padding: 30px 24px; text-align: center;
  width: 100%; max-width: 360px; 
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255,255,255,0.1);
}
.win-text { 
  color: #fff; font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;
  margin: 0 0 24px 0; 
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
}
.lose-text { 
  color: #ff3333; font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;
  margin: 0 0 24px 0; 
  text-shadow: 0 0 20px rgba(255,0,0,0.3);
}
.league-result {
  display: flex; align-items: center; justify-content: space-between; padding: 14px 16px;
  margin: 0 0 10px 0; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px;
}
.league-result-icon { font-size: 24px; margin-right: 12px; }
.league-result-label { font-size: 16px; font-weight: 900; color: #fff; flex: 1; text-align: left; text-transform: uppercase; }
.league-result-points { font-size: 18px; font-weight: 900; }
.league-result-points.positive { color: #00e5ff; text-shadow: 0 0 10px rgba(0,229,255,0.5); }
.league-result-points.negative { color: #ff3333; }
.league-next-hint { text-align: center; font-size: 12px; color: #8892b0; margin-bottom: 20px; font-weight: 600; }
.race-log { 
  margin-bottom: 24px; text-align: left; background: rgba(0,0,0,0.6); padding: 16px; border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08); font-family: monospace; max-height: 140px; overflow-y: auto;
}
.race-log p { color: #a0aec0; font-size: 13px; margin: 8px 0; line-height: 1.5; display: flex; align-items: flex-start; }
.race-log p::before { content: 'вЂє'; color: #00e5ff; margin-right: 10px; font-weight: 900; }
.race-log p:last-child { color: #fff; font-weight: 600; }
.race-log p:last-child::before { content: 'рџЏЃ'; font-size: 14px; }
.race-close-btn { 
  width: 100%; padding: 16px; 
  background: linear-gradient(90deg, #00e5ff, #0088ff); 
  color: #000; border: none; border-radius: 14px; 
  font-weight: 900; font-size: 15px; cursor: pointer; text-transform: uppercase; letter-spacing: 2px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
}
.race-close-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 229, 255, 0.5); }

/* ========== Р›РР”Р•Р Р‘РћР Р” ========== */
.leaderboard-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

.leaderboard-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 340px;
  padding: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
}

.leaderboard-header {
  text-align: center;
  margin-bottom: 24px;
}
.leaderboard-icon {
  font-size: 36px;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
}
.leaderboard-header h2 {
  margin: 10px 0 4px;
  font-size: 22px;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.leaderboard-header p {
  margin: 0;
  font-size: 13px;
  color: #8892b0;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.leaderboard-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  font-size: 14px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.leaderboard-row:hover {
  transform: translateY(-1px);
  border-color: rgba(255,255,255,0.15);
}

.leaderboard-row.is-me {
  border-color: #00e5ff;
  background: rgba(0, 229, 255, 0.08);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.15);
}

.leaderboard-place {
  width: 28px;
  color: #666;
  font-weight: 900;
  font-family: monospace;
  font-size: 16px;
}
.leaderboard-row:nth-child(1) .leaderboard-place { color: #ffd700; text-shadow: 0 0 10px rgba(255,215,0,0.5); }
.leaderboard-row:nth-child(2) .leaderboard-place { color: #e2e8f0; }
.leaderboard-row:nth-child(3) .leaderboard-place { color: #cd7f32; }

.leaderboard-name {
  flex: 1;
  color: #fff;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.leaderboard-row.is-me .leaderboard-name {
  color: #00e5ff;
}
.leaderboard-points {
  color: #8892b0;
  font-weight: 800;
  font-family: monospace;
}

.leaderboard-close-btn {
  width: 100%;
  padding: 16px;
  background: rgba(255,255,255,0.08);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;
}
.leaderboard-close-btn:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}
```

### src/styles/referral.css
```css
/* src/styles/referral.css (РїРѕР»РЅР°СЏ Р·Р°РјРµРЅР°) */

.referral-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.referral-container {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 229, 255, 0.1);
  overflow: hidden;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.referral-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0; /* рџ‘€ С€Р°РїРєР° С„РёРєСЃРёСЂРѕРІР°РЅР° */
  position: sticky;
  top: 0;
  background: linear-gradient(180deg, #141a2e 0%, #0f1422 100%);
  z-index: 2;
}

.referral-topbar h2 {
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 16px;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.referral-back {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.referral-back:hover {
  background: rgba(0, 229, 255, 0.1);
  border-color: var(--accent);
  color: var(--accent);
}

.referral-content {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.referral-content::-webkit-scrollbar { display: none; }


.referral-bonus-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 14px;
  padding: 14px;
  flex-shrink: 0;
}

.bonus-icon { 
  display: flex; 
  align-items: center; 
  justify-content: center;
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(0,229,255,0.5)); 
}

.bonus-text h3 { 
  color: #fff; 
  margin: 0 0 4px; 
  font-size: 14px; 
  text-transform: uppercase; 
  font-family: Impact, sans-serif;
  letter-spacing: 0.5px;
}

.bonus-text p { 
  color: var(--text-secondary, #888); 
  margin: 0; 
  font-size: 11px; 
  line-height: 1.4; 
}

.bonus-text strong { color: var(--accent); font-weight: 900; }

.referral-earnings-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 217, 126, 0.2);
  border-radius: 14px;
  padding: 14px;
  flex-shrink: 0;
}

.earnings-label { 
  color: var(--text-secondary, #888); 
  font-size: 12px; 
  font-weight: 600; 
}

.earnings-value { 
  color: var(--success, #00d97e); 
  font-size: 16px; 
  font-weight: 900; 
  font-family: Impact, sans-serif; 
  text-shadow: 0 0 10px var(--success-glow, rgba(0, 217, 126, 0.4)); 
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: center;
}

.referral-how-it-works {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  flex-shrink: 0;
}

.referral-how-it-works h4 {
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 10px;
  font-family: Impact, sans-serif;
}

.how-step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.how-step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 229, 255, 0.15);
  border: 1px solid rgba(0, 229, 255, 0.4);
  color: var(--accent);
  font-size: 11px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.how-step p {
  color: var(--text-secondary, #888);
  font-size: 11px;
  margin: 0;
}

.how-step p strong { color: var(--accent); }

.referral-link-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.referral-link-box:hover { border-color: var(--accent); }

.link-text { 
  color: #888; 
  font-size: 10px; 
  word-break: break-all; 
  font-family: monospace; 
}

/* рџ‘‡ РљРЅРѕРїРєРё РІСЃРµРіРґР° РІРёРґРЅС‹ РІРЅРёР·Сѓ */
.referral-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 0 max(12px, env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, transparent 0%, #0a0a0a 30%, #0a0a0a 100%);
  position: sticky;
  bottom: 0;
  margin-top: auto; /* рџ‘€ РїСЂРёР¶РёРјР°РµС‚ Рє РЅРёР·Сѓ */
  flex-shrink: 0;
}

.referral-btn-copy, .referral-btn-action {
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.2s;
  font-family: Impact, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.referral-btn-copy {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
}

.referral-btn-copy:hover {
  background: rgba(0, 229, 255, 0.1);
  border-color: var(--accent);
  color: var(--accent);
}

.referral-btn-action {
  background: linear-gradient(90deg, var(--accent), var(--accent-dim, #00b8cc));
  color: #000;
  box-shadow: 0 4px 20px var(--accent-glow, rgba(0,229,255,0.25));
}

.referral-btn-copy:active, .referral-btn-action:active { transform: scale(0.98); }

/* ========== Р”Р РЈР—Р¬РЇ ========== */
.referral-friends-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  flex-shrink: 0;
}

.friends-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  font-family: Impact, sans-serif;
}

.friends-count {
  margin-left: auto;
  background: rgba(0, 229, 255, 0.15);
  border: 1px solid rgba(0, 229, 255, 0.4);
  color: var(--accent);
  font-size: 10px;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 10px;
  font-family: Impact, sans-serif;
}

.friends-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  padding: 16px 0;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
}

.friends-empty p { margin: 0; }

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.friend-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.friend-avatar, .friend-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1.5px solid var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

.friend-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2035 0%, #0a0a0a 100%);
  color: var(--accent);
  font-weight: 900;
  font-size: 13px;
  font-family: Impact, sans-serif;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-date {
  color: var(--text-secondary);
  font-size: 9px;
  font-weight: 600;
  margin-top: 1px;
}

.friend-earned {
  color: var(--success);
  font-family: Impact, sans-serif;
  font-size: 12px;
  font-weight: 900;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-shadow: 0 0 8px var(--success-glow);
}
```

### src/styles/variables.css
```css
:root {
  --bg-base: #090A0C;
  --bg-surface: #14161A;
  --bg-glass: rgba(20, 22, 26, 0.85);
  --text-primary: #FFFFFF;
  --text-secondary: #8E929D;
  --text-muted: #555861;

  /* РќРµРѕРЅРѕРІРѕ-РіРѕР»СѓР±РѕР№ (РѕСЃРЅРѕРІРЅРѕР№ Р°РєС†РµРЅС‚) */
  --accent: #00e5ff;
  --accent-dim: #00b8cc;
  --accent-glow: rgba(0, 229, 255, 0.25);
  --accent-glow-strong: rgba(0, 229, 255, 0.6);

  /* РР·СѓРјСЂСѓРґРЅС‹Р№ */
  --success: #00d97e;
  --success-dim: #00b368;
  --success-glow: rgba(0, 217, 126, 0.4);
  --success-glow-strong: rgba(0, 217, 126, 0.7);

  /* РљСЂР°СЃРЅС‹Р№ */
  --danger: #ff4444;
  --danger-glow: rgba(255, 68, 68, 0.4);

  /* Р—РѕР»РѕС‚РѕР№ */
  --gold: #ffd700;
  --gold-dim: #ff8800;

  /* Р’С‹СЃРѕС‚Р° РЅРёР¶РЅРµРіРѕ РјРµРЅСЋ вЂ” СЃРёРЅС…СЂРѕРЅРёР·РёСЂРѕРІР°РЅР° СЃ .bottom-nav (Р±С‹Р»Рѕ 72px, СЂРµР°Р»СЊРЅРѕ 76px / 98px) */
  --nav-height: 76px;

  /* Safe-area */
  --safe-bottom: env(safe-area-inset-bottom, 20px);

  /* РЁСЂРёС„С‚ */
  --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  /* Р—РЅР°С‡РµРЅРёРµ РґР»СЏ РѕСЃРЅРѕРІРЅРѕРіРѕ РєРѕРЅС‚РµРЅС‚Р° вЂ” JS РїРµСЂРµР·Р°РїРёС€РµС‚ РЅР° 85px РЅР° РјРѕР±РёР»РєРµ */
  --tg-safe-top: 0px;
}

/* iPhone вЂ” РјРµРЅСЋ РІС‹С€Рµ */
@media (max-width: 499px) {
  :root {
    --nav-height: 98px;
  }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes floatCar {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes car-reject {
  0%   { transform: translateX(0); }
  25%  { transform: translateX(-3px); }
  50%  { transform: translateX(3px); }
  75%  { transform: translateX(-1px); }
  100% { transform: translateX(0); }
}

@keyframes blink {
  0% { opacity: 0.2; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* ========== РџР Р•РњРРЈРњ Р’РђР›Р®РўРђ в‚Ѕ ========== */
.currency-ruble {
  display: inline-block;
  font-weight: 900;
  font-family: Impact, 'Arial Black', sans-serif;
  font-size: 1.05em;
  color: #ffd700;
  background: linear-gradient(180deg, #fff4b0 0%, #ffd700 40%, #ff8800 70%, #cc6600 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.7)) drop-shadow(0 0 8px rgba(255, 136, 0, 0.5));
  letter-spacing: -0.5px;
  vertical-align: middle;
  line-height: 1;
  transition: filter 0.2s ease;
  margin-left: 5px;
}

.currency-ruble.glow:hover {
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 1)) drop-shadow(0 0 14px rgba(255, 136, 0, 0.8));
}

.currency-ruble.sm {
  font-size: 0.9em;
  margin-left: 4px;
}

.currency-ruble.lg {
  font-size: 1.2em;
  margin-left: 6px;
}
```

### src/styles/workshop.css
```css
/* src/styles/workshop.css */

.workshop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.workshop-content {
  background: linear-gradient(180deg, #141a2e 0%, #0a0a0a 100%);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 229, 255, 0.1);
  overflow: hidden;
}

.workshop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  position: relative;
}

.workshop-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent);
}

.workshop-header h2 {
  margin: 0;
  color: var(--accent);
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 15px var(--accent-glow);
  font-family: Impact, Arial Black, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
}

.workshop-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.workshop-close:hover {
  background: rgba(255, 68, 68, 0.15);
  border-color: rgba(255, 68, 68, 0.4);
  color: var(--danger);
}

/* РўР°Р±С‹ */
.workshop-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 20px 8px;
  flex-shrink: 0;
}

.workshop-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #888;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.workshop-tab.active {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}

/* Body */
.workshop-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.workshop-body::-webkit-scrollbar { display: none; }

.workshop-list {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.workshop-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
}

.workshop-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.workshop-empty h3 {
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 16px;
  margin: 16px 0 8px;
  letter-spacing: 1px;
}

.workshop-empty p {
  font-size: 12px;
  margin: 0;
}

/* РљР°СЂС‚РѕС‡РєРё */
.workshop-card, .workshop-craft-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.workshop-card.upgrading {
  border-color: rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.02));
}

.workshop-card.claimable {
  border-color: rgba(0, 217, 126, 0.4);
  background: linear-gradient(135deg, rgba(0, 217, 126, 0.08), rgba(0, 217, 126, 0.02));
}

.workshop-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.workshop-card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.workshop-card-title {
  font-size: 13px;
  font-weight: 900;
  font-family: Impact, Arial Black, sans-serif;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.workshop-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 700;
}

.workshop-card-meta strong {
  color: #fff;
}

.workshop-card-timer {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--gold);
  font-size: 10px;
  font-weight: 800;
  margin-top: 2px;
}

.workshop-card-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.workshop-ad-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: linear-gradient(90deg, #ff8800, #ff4444);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 136, 0, 0.3);
  transition: transform 0.15s;
}

.workshop-ad-btn:active { transform: scale(0.95); }
.workshop-ad-btn:disabled { opacity: 0.5; }

.workshop-claim-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: linear-gradient(90deg, var(--success), var(--success-dim));
  border: none;
  border-radius: 8px;
  color: #000;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--success-glow);
  transition: transform 0.15s;
}

.workshop-claim-btn:active { transform: scale(0.97); }

.workshop-upgrade-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.15s;
}

.workshop-upgrade-btn.level {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.workshop-upgrade-btn.gold {
  background: linear-gradient(90deg, var(--gold), var(--gold-dim));
  color: #000;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.workshop-upgrade-btn.red {
  background: linear-gradient(90deg, var(--danger), #cc0000);
  color: #fff;
  box-shadow: 0 4px 12px var(--danger-glow);
}

.workshop-upgrade-btn:active { transform: scale(0.97); }

.workshop-craft-btn {
  padding: 10px 16px;
  background: linear-gradient(90deg, var(--accent), var(--accent-dim));
  border: none;
  border-radius: 10px;
  color: #000;
  font-family: Impact, Arial Black, sans-serif;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--accent-glow);
  transition: transform 0.15s;
  flex-shrink: 0;
}

.workshop-craft-btn:active { transform: scale(0.97); }
.workshop-craft-btn:disabled { opacity: 0.5; }
```

### src/utils/carStats.ts
```ts
// src/utils/carStats.ts
import { CarConfig, CARS } from '../config/cars';
import { ITEMS, ItemConfig } from '../config/items';
import { CarPhysics } from './raceEngine';

interface PartUpgrade {
  level: number;
  goldStars: number;
  redStars: number;
}

/**
 * РЎС‡РёС‚Р°РµС‚ С„РёРЅР°Р»СЊРЅС‹Рµ С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё РјР°С€РёРЅС‹ СЃ СѓС‡С‘С‚РѕРј РїСЂРѕРєР°С‡РєРё.
 * 
 * Р›РѕРіРёРєР°:
 *  - baseStats.performance РјР°С€РёРЅС‹ (СЂРµР°Р»СЊРЅС‹Рµ РєРј/С‡) вЂ” СЌС‚Рѕ Р±Р°Р·Р°.
 *  - РљР°Р¶РґР°СЏ РґРµС‚Р°Р»СЊ РёР· equipped РґР°С‘С‚ РџР РћР¦Р•РќРўРќР«Р™ Р±РѕРЅСѓСЃ.
 *  - РЈСЂРѕРІРЅРё РґРµС‚Р°Р»Рё (level) Рё Р·РІС‘Р·РґС‹ (gold/red) СѓСЃРёР»РёРІР°СЋС‚ СЌС‚РѕС‚ Р±РѕРЅСѓСЃ.
 *  - Р’РѕР·РІСЂР°С‰Р°РµС‚ CarPhysics РґР»СЏ simulateRacePhysics.
 */
export function getFinalCarStats(
  car: CarConfig,
  equipped: Record<string, string | null>,
  partUpgrades: Record<string, PartUpgrade> = {}
): CarPhysics {
  const perf = car.performance;

  // РЎС‚Р°СЂС‚РѕРІС‹Рµ Р·РЅР°С‡РµРЅРёСЏ = СЂРµР°Р»СЊРЅС‹Рµ С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё РјР°С€РёРЅС‹
  let totalPower = perf.power;
  let totalTopSpeed = perf.topSpeed;
  let totalAccel = perf.accel;
  let totalGrip = perf.grip;

  // РЎРєР»Р°РґС‹РІР°РµРј РїСЂРѕС†РµРЅС‚РЅС‹Рµ Р±РѕРЅСѓСЃС‹ РѕС‚ РІСЃРµС… РЅР°РґРµС‚С‹С… РґРµС‚Р°Р»РµР№
  Object.values(equipped).forEach((itemId) => {
    if (!itemId || !ITEMS[itemId]) return;

    const item: ItemConfig = ITEMS[itemId];
    const upg = partUpgrades[itemId] || { level: 0, goldStars: 0, redStars: 0 };

    // РњРЅРѕР¶РёС‚РµР»СЊ РїСЂРѕРєР°С‡РєРё РґРµС‚Р°Р»Рё (1.0 + Р±РѕРЅСѓСЃС‹)
    const levelMult = 1 + upg.level * 0.02;      // +2% Р·Р° СѓСЂРѕРІРµРЅСЊ
    const goldMult = 1 + upg.goldStars * 0.10;   // +10% Р·Р° Р·РѕР»РѕС‚СѓСЋ Р·РІРµР·РґСѓ
    const redMult = 1 + upg.redStars * 0.25;     // +25% Р·Р° РєСЂР°СЃРЅСѓСЋ Р·РІРµР·РґСѓ
    const totalMult = levelMult * goldMult * redMult;

    // РЎС‚Р°С‚С‹ РґРµС‚Р°Р»Рё вЂ” СЌС‚Рѕ РїСЂРѕС†РµРЅС‚С‹ РѕС‚ Р±Р°Р·С‹ РјР°С€РёРЅС‹
    // (engine_3: power=120 в†’ +120% Рє power, topSpeed=25 в†’ +25% Рє topSpeed)
    totalPower *= 1 + (item.stats.power / 100) * totalMult;
    totalTopSpeed *= 1 + (item.stats.topSpeed / 100) * totalMult;
    totalGrip += (item.stats.grip / 100) * totalMult * 50; // grip РІ 0-100

    // ACCEL: РґРµС‚Р°Р»Рё, РєРѕС‚РѕСЂС‹Рµ РґР°СЋС‚ grip/handling, СѓРјРµРЅСЊС€Р°СЋС‚ РІСЂРµРјСЏ СЂР°Р·РіРѕРЅР°
    const accelBonus = ((item.stats.grip + item.stats.handling) / 100) * totalMult;
    totalAccel = Math.max(1.0, totalAccel * (1 - accelBonus * 0.15));
  });

  return {
    power: Math.round(totalPower),
    topSpeed: Math.round(totalTopSpeed),
    accel: Math.round(totalAccel * 100) / 100,
    grip: Math.min(100, Math.round(totalGrip)),
    handling: Math.min(100, Math.round(totalGrip * 1.05)),
  };
}

/**
 * Р’РѕР·РІСЂР°С‰Р°РµС‚ РёС‚РѕРіРѕРІС‹Р№ СЂРµР№С‚РёРЅРі РјР°С€РёРЅС‹ РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ РІ РіР°СЂР°Р¶Рµ.
 */
export function getCarRating(stats: CarPhysics): number {
  return Math.round(
    stats.power * 0.3 +
    stats.topSpeed * 2 +
    (10 - stats.accel) * 50 +
    stats.grip * 3
  );
}
```

### src/utils/raceEngine.ts
```ts
// src/utils/raceEngine.ts
export interface CarPhysics {
  power: number;
  topSpeed: number; // РєРј/С‡
  accel: number;    // СЃРµРє РґРѕ 100 РєРј/С‡
  grip: number;
  handling: number;
}

export interface RaceTick {
  time: number;
  playerDist: number;
  opponentDist: number;
  playerSpeed: number;
  opponentSpeed: number;
}

export interface RaceResult {
  winner: 'player' | 'opponent';
  playerTime: number;
  opponentTime: number;
  ticks: RaceTick[]; // РСЃС‚РѕСЂРёСЏ РґР»СЏ Р°РЅРёРјР°С†РёРё
  log: string[];
}

const TRACK_DISTANCE = 1000; // РјРµС‚СЂРѕРІ

export function simulateRacePhysics(
  player: CarPhysics,
  opponent: CarPhysics,
  opponentName: string
): RaceResult {
  const ticks: RaceTick[] = [];
  let pDist = 0, oDist = 0;
  let pSpeed = 0, oSpeed = 0; // Рј/СЃ
  let time = 0;
  let pFinished = false, oFinished = false;

  const pTime100 = player.accel; // РІСЂРµРјСЏ РґРѕ 100
  const pMaxSpeedMs = player.topSpeed / 3.6;
  const oMaxSpeedMs = opponent.topSpeed / 3.6;

  // РЎРёРјСѓР»СЏС†РёСЏ РєР°Р¶РґС‹Рµ 0.1 СЃРµРєСѓРЅРґС‹
  while (time < 60 && (!pFinished || !oFinished)) {
    time += 0.1;

    // Р Р°Р·РіРѕРЅ (РїР»Р°РІРЅРѕ Рє РјР°РєСЃРёРјР°Р»РєРµ)
    if (!pFinished) {
      const pAccelRate = (pMaxSpeedMs / pTime100) * 0.1; 
      pSpeed += pAccelRate * (1 - pSpeed / pMaxSpeedMs); // Р—Р°С‚СѓС…Р°РЅРёРµ СЂР°Р·РіРѕРЅР°
      if (pSpeed > pMaxSpeedMs) pSpeed = pMaxSpeedMs;
      pDist += pSpeed * 0.1;
      if (pDist >= TRACK_DISTANCE) { pDist = TRACK_DISTANCE; pFinished = true; }
    }

    if (!oFinished) {
      // Р‘РѕС‚ РЅРµРјРЅРѕРіРѕ РѕС€РёР±Р°РµС‚СЃСЏ РЅР° СЃС‚Р°СЂС‚Рµ (СЂР°РЅРґРѕРј)
      const oTime100 = opponent.accel * (0.95 + Math.random() * 0.1);
      const oAccelRate = (oMaxSpeedMs / oTime100) * 0.1;
      oSpeed += oAccelRate * (1 - oSpeed / oMaxSpeedMs);
      if (oSpeed > oMaxSpeedMs) oSpeed = oMaxSpeedMs;
      oDist += oSpeed * 0.1;
      if (oDist >= TRACK_DISTANCE) { oDist = TRACK_DISTANCE; oFinished = true; }
    }

    ticks.push({ time, playerDist: pDist, opponentDist: oDist, playerSpeed: pSpeed, opponentSpeed: oSpeed });
  }

  const winner = pFinished && pDist >= oDist ? 'player' : 'opponent';
  const pTime = pFinished ? time : 99;
  const oTime = oFinished ? time : 99;

  return {
    winner,
    playerTime: pTime,
    opponentTime: oTime,
    ticks,
    log: [
      `рџЏЃ РЎС‚Р°СЂС‚! РЎРѕРїРµСЂРЅРёРє: ${opponentName}`,
      `Р’С‹ РїСЂРѕРµС…Р°Р»Рё 1000Рј Р·Р° ${pTime.toFixed(2)} СЃРµРє.`,
      `${opponentName} РїСЂРѕРµС…Р°Р» Р·Р° ${oTime.toFixed(2)} СЃРµРє.`,
      winner === 'player' ? `рџЏ† РџРѕР±РµРґР°! Р’С‹ Р±С‹Р»Рё Р±С‹СЃС‚СЂРµРµ.` : `рџ’Ё РџРѕСЂР°Р¶РµРЅРёРµ... РЎРѕРїРµСЂРЅРёРє РѕРєР°Р·Р°Р»СЃСЏ СЃРёР»СЊРЅРµРµ.`
    ]
  };
}
```

### src/utils/raceSim.ts
```ts
// src/utils/raceSim.ts
import { RacingStats } from '../config/racing';

export interface RaceResult {
  winner: 'player' | 'opponent';
  playerTime: number;
  opponentTime: number;
  log: string[];
}

export function simulateRace(
  player: RacingStats, 
  opponent: RacingStats, 
  opponentName: string
): RaceResult {
  const log: string[] = [];

  // Р¤РѕСЂРјСѓР»Р°: Р’СЂРµРјСЏ = (Р”РёСЃС‚Р°РЅС†РёСЏ / РњР°РєСЃРёРјР°Р»РєР°) - (Р Р°Р·РіРѕРЅ / 10) - (РЈРїСЂР°РІР»СЏРµРјРѕСЃС‚СЊ / 50) + РЎР»СѓС‡Р°Р№РЅРѕСЃС‚СЊ
  // Р”РёСЃС‚Р°РЅС†РёСЏ: 400 РјРµС‚СЂРѕРІ (СЃС‚Р°РЅРґР°СЂС‚РЅС‹Р№ РґСЂСЌРі)
  const calcTime = (stats: RacingStats) => {
    const baseTime = (400 / stats.topSpeed) * 3600; // РІСЂРµРјСЏ РІ СЃРµРєСѓРЅРґР°С…
    const accelBonus = stats.accel * 0.5;
    const gripBonus = stats.grip * 0.05;
    const handlingBonus = stats.handling * 0.05;
    // РќРµР±РѕР»СЊС€РѕР№ СЂР°РЅРґРѕРј (РѕС‚ 0 РґРѕ 1.5 СЃРµРє)
    const randomDelay = Math.random() * 1.5;
    
    return Math.max(5, baseTime - accelBonus - gripBonus - handlingBonus + randomDelay);
  };

  const playerTime = calcTime(player);
  const opponentTime = calcTime(opponent);

  log.push(`рџЏЃ РЎС‚Р°СЂС‚! РЎРѕРїРµСЂРЅРёРє: ${opponentName}`);
  log.push(`Р’С‹ РїСЂРѕРµС…Р°Р»Рё 400Рј Р·Р° ${playerTime.toFixed(2)} СЃРµРє.`);
  log.push(`${opponentName} РїСЂРѕРµС…Р°Р» Р·Р° ${opponentTime.toFixed(2)} СЃРµРє.`);

  const winner = playerTime < opponentTime ? 'player' : 'opponent';
  
  if (winner === 'player') {
    log.push(`рџЏ† РџРѕР±РµРґР°! Р’С‹ РѕР±РѕРіРЅР°Р»Рё СЃРѕРїРµСЂРЅРёРєР° РЅР° ${(opponentTime - playerTime).toFixed(2)} СЃРµРє.`);
  } else {
    log.push(`рџ’Ё РџРѕСЂР°Р¶РµРЅРёРµ... РЎРѕРїРµСЂРЅРёРє Р±С‹Р» Р±С‹СЃС‚СЂРµРµ РЅР° ${(playerTime - opponentTime).toFixed(2)} СЃРµРє.`);
  }

  return { winner, playerTime, opponentTime, log };
}
```

### src/utils/sound.ts
```ts
// src/utils/sound.ts
let audioCtx: AudioContext | null = null;

export const playSound = (type: 'click' | 'coin' | 'win') => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Р•СЃР»Рё Р±СЂР°СѓР·РµСЂ Р·Р°Р±Р»РѕРєРёСЂРѕРІР°Р» Р·РІСѓРє (РґРѕ РїРµСЂРІРѕРіРѕ РєР»РёРєР°), РїСЂРѕРїСѓСЃРєР°РµРј
    if (audioCtx.state === 'suspended') return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.05, now); // РўРёС…РёР№ РєР»РёРє
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'coin') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(1600, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'win') {
      // РђРєРєРѕСЂРґ РїРѕР±РµРґС‹
      [400, 500, 600].forEach((freq, i) => {
        const o = audioCtx!.createOscillator();
        const g = audioCtx!.createGain();
        o.connect(g); g.connect(audioCtx!.destination);
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.05, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.1);
        o.start(now + i * 0.1);
        o.stop(now + 0.5 + i * 0.1);
      });
    }
  } catch (e) {
    console.log('Audio error:', e);
  }
};
```

### src/vite-env.d.ts
```ts
/// <reference types="vite/client" />
```