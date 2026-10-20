import { db } from '../db.js';
import { users } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq } from 'drizzle-orm';
import { ITEMS } from '../items.js';

export async function upgradePartHandler(req: any, res: any) {
  try {
    const { initData, itemId, type } = req.body; // type: 'level' | 'gold' | 'red'
    const valid = validateInitData(initData, process.env.BOT_TOKEN!);
    if (!valid?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select().from(users).where(eq(users.id, valid.user.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const itemConfig = ITEMS[itemId];
    if (!itemConfig) return res.status(400).json({ error: 'Item not found' });

    const partUpg = { ...(user.partUpgrades || {}) };
    const currentUpg = partUpg[itemId] || { level: 0, goldStars: 0, redStars: 0, upgradingUntil: null, upgradeType: null };

    if (currentUpg.upgradingUntil && currentUpg.upgradingUntil > Date.now()) {
      return res.status(400).json({ error: 'Деталь уже улучшается' });
    }

    let cost = 0;
    let durationMs = 0;
    let nextType = type;

    if (type === 'level') {
      if (currentUpg.level >= 50) return res.status(400).json({ error: 'Достигнут максимальный уровень' });
      cost = Math.round(500 * Math.pow(1.15, currentUpg.level));
      durationMs = (currentUpg.level + 1) * 60 * 1000; // 1 минута * уровень
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

    if (user.balance < cost) return res.status(400).json({ error: 'Недостаточно монет' });

    // Списываем деньги и запускаем таймер
    const newBalance = user.balance - cost;
    partUpg[itemId] = {
      ...currentUpg,
      upgradingUntil: Date.now() + durationMs,
      upgradeType: type
    };

    await db.update(users).set({ balance: newBalance, partUpgrades: partUpg }).where(eq(users.id, user.id));
    
    return res.json({ success: true, newBalance, partUpgrades: partUpg });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}