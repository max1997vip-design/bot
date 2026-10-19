import { syncHandler } from './_lib/handlers/sync.js';
import { tapHandler } from './_lib/handlers/tap.js';
import { pvpHandler } from './_lib/handlers/pvp.js';
import { leaderboardHandler } from './_lib/handlers/leaderboard.js';
import { equipHandler } from './_lib/handlers/equip.js';

export default async function handler(req: any, res: any) {
  const rawAction = req.query.action;
  const action = Array.isArray(rawAction) ? rawAction[0] : rawAction;

  switch (action) {
    case 'sync': return syncHandler(req, res);
    case 'tap': return tapHandler(req, res);
    case 'pvp': return pvpHandler(req, res);
    case 'leaderboard': return leaderboardHandler(req, res);
    case 'equip': return equipHandler(req, res);
    default: return res.status(400).json({ error: 'Invalid action' });
  }
}