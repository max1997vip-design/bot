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
      return res.status(400).json({ error: 'Деталь уже улучшается' });
    }

    let cost = 0;
    let durationMs = 0;

    if (type === 'level') {
      if (currentUpg.level >= 50) return res.status(400).json({ error: 'Достигнут максимальный уровень' });
      cost = Math.round(500 * Math.pow(1.15, currentUpg.level));

      // 👇 Прогрессивное время
      const lvl = currentUpg.level;
      let minutes = 0;
      if (lvl < 5) {
        minutes = (lvl + 1) * 2;                // 2, 4, 6, 8, 10 мин
      } else if (lvl < 10) {
        minutes = 10 + (lvl - 5) * 4;           // 10, 14, 18, 22, 26 мин
      } else if (lvl < 15) {
        minutes = 30 + (lvl - 10) * 6;          // 30, 36, 42, 48, 54 мин
      } else if (lvl < 20) {
        minutes = 60 + (lvl - 15) * 12;         // 1ч — 2ч
      } else if (lvl < 25) {
        minutes = 120 + (lvl - 20) * 24;        // 2ч — 4ч
      } else if (lvl < 30) {
        minutes = 240 + (lvl - 25) * 48;        // 4ч — 8ч
      } else if (lvl < 35) {
        minutes = 480 + (lvl - 30) * 48;        // 8ч — 12ч
      } else if (lvl < 40) {
        minutes = 720 + (lvl - 35) * 72;        // 12ч — 18ч
      } else if (lvl < 45) {
        minutes = 1080 + (lvl - 40) * 72;       // 18ч — 24ч
      } else {
        minutes = 1440 + (lvl - 45) * 144;      // 24ч — 36ч
      }

      durationMs = minutes * 60 * 1000;
    }
    else if (type === 'gold') {
      if (currentUpg.level < 50) return res.status(400).json({ error: 'Сначала прокачайте до 50 уровня' });
      if (currentUpg.goldStars >= 5) return res.status(400).json({ error: 'Достигнут максимум золотых звезд' });
      cost = 50000 * (currentUpg.goldStars + 1);
      durationMs = 2 * 60 * 60 * 1000; // 2 часа
    }
    else if (type === 'red') {
      if (currentUpg.goldStars < 5) return res.status(400).json({ error: 'Сначала получите 5 золотых звезд' });
      if (currentUpg.redStars >= 5) return res.status(400).json({ error: 'Достигнут максимум красных звезд' });
      cost = 500000 * (currentUpg.redStars + 1);
      durationMs = 12 * 60 * 60 * 1000; // 12 часов
    }

    if (user.balance < cost) return res.status(400).json({ error: 'Недостаточно ₽' });

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