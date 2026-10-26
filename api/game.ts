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
import { getClanMessagesHandler, sendClanMessageHandler } from './_lib/handlers/clanChat.js';
import { getClanBossHandler, attackClanBossHandler } from './_lib/handlers/clanBoss.js';

export default async function handler(req: any, res: any) {
  const rawAction = req.query.action;
  const action = Array.isArray(rawAction) ? rawAction[0] : rawAction;

  // 👇 DEV BYPASS ДЛЯ ЛОКАЛЬНОЙ РАЗРАБОТКИ 👇
  // Если мы локально и фронт прислал наш флаг, подменяем данные
  if (process.env.NODE_ENV !== 'production' && req.body?.initData === 'DEV_BYPASS') {
    // Подменяем initData на фейковый валидный токен или прямо в req.body
    // Если твои хендлеры используют библиотеку типа @telegram-apps/init-data-node
    // тебе нужно будет сгенерировать валидную строку. 
    // Но самый простой путь - передать флаг дальше, если хендлеры его понимают.
    
    // ВРЕМЕННО: Подменяем telegramId (если хендлеры читают req.user)
    // В идеале тебе нужно добавить в свойство req.user фейкового юзера.
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
    case 'getAchievements': return getAchievementsHandler(req, res);
    case 'claimAchievement': return claimAchievementHandler(req, res);
    case 'buyPremium': return buyPremiumHandler(req, res);
    case 'getClans': return getClansHandler(req, res);
    case 'getClanMessages': return getClanMessagesHandler(req, res);
    case 'sendClanMessage': return sendClanMessageHandler(req, res);
    case 'getClanBoss': return getClanBossHandler(req, res);
    case 'attackClanBoss': return attackClanBossHandler(req, res);
    default: return res.status(400).json({ error: 'Invalid action' });
  }
}