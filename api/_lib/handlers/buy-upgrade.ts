// api/_lib/handlers/buy-upgrade.ts
import { db } from '../db.js';
import { users, upgrades } from '../schema.js';
import { validateInitData } from '../telegram.js';
import { eq, and, sql } from 'drizzle-orm';

// Копируем конфиг с фронтенда, чтобы цены совпадали
const UPGRADE_CONFIG: Record<string, { maxLevel: number; baseCost: number; costMultiplier: number }> = {
  engine:      { maxLevel: 20, baseCost: 5000, costMultiplier: 1.7 },
  tires:       { maxLevel: 20, baseCost: 3000, costMultiplier: 1.6 },
  suspension:  { maxLevel: 20, baseCost: 4000, costMultiplier: 1.65 },
  diagnostics: { maxLevel: 20, baseCost: 2000, costMultiplier: 1.5 },
};

export async function buyUpgradeHandler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { initData, upgradeId } = req.body;
  const validatedData = validateInitData(initData, process.env.BOT_TOKEN!);

  if (!validatedData || !validatedData.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const telegramId = validatedData.user.id;
  const cfg = UPGRADE_CONFIG[upgradeId];

  if (!cfg) {
    return res.status(400).json({ error: 'Invalid upgradeId' });
  }

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, telegramId) });
    if (!user) return res.status(404).json({ error: 'NO_USER' });

    const existingUpgrade = await db.query.upgrades.findFirst({
      where: and(
        eq(upgrades.userId, telegramId), 
        eq(upgrades.upgradeId, upgradeId)
      )
    });

    const currentLevel = existingUpgrade?.level || 0;
    
    if (currentLevel >= cfg.maxLevel) {
      return res.status(400).json({ error: 'MAX_LEVEL' });
    }

    // Считаем стоимость по формуле с фронтенда
    const cost = Math.floor(cfg.baseCost * Math.pow(cfg.costMultiplier, currentLevel));

    if (user.balance < cost) {
      return res.status(400).json({ error: 'INSUFFICIENT_FUNDS' });
    }

    // Списываем деньги
    const [updatedUser] = await db.update(users).set({
      balance: sql`${users.balance} - ${cost}`
    }).where(eq(users.id, telegramId)).returning();

    // Обновляем или создаем уровень
    const newLevel = currentLevel + 1;
    
    if (existingUpgrade) {
      await db.update(upgrades)
        .set({ level: newLevel })
        .where(and(
          eq(upgrades.userId, telegramId), 
          eq(upgrades.upgradeId, upgradeId)
        ));
    } else {
      await db.insert(upgrades).values({
        userId: telegramId,
        upgradeId: upgradeId,
        level: newLevel
      });
    }

    return res.status(200).json({
      success: true,
      newBalance: updatedUser.balance,
      newLevel: newLevel
    });
  } catch (error) {
    console.error('Buy upgrade error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}