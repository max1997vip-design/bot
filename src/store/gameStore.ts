// src/store/gameStore.ts
import { create } from 'zustand';
import { calculateStats, ITEMS, SELL_PRICES } from '../config/items';
import WebApp from '@twa-dev/sdk';
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
  id: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  balance: number;
  totalEarned: number;
  starsBalance: number;
  level: number;
  xp: number;
  activeCarId: string;
  createdAt: string;
  referredBy: number | null;
  referralEarnings: number;
  rating: number;
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
    seasonId?: string;   // 🆕 сезон (YYYY-MM)
    weekId?: number;     // оставляем для совместимости
    xp: number;
    isPremium?: boolean;
    claimed: number[];
    claimedPremium?: number[];
  };
  isAdmin?: boolean;
  lastClaimedLevel?: number;

  // Статистика
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

  // Кланы
  myClanInvites: any[];
  myClanApplications: any[];
  clanApplications: any[];
  clanInfo: any | null;
  clanMembers: any[];
  clansList: any[];
  clanMessages: any[];
  hasUnreadClanMessages: boolean;
  lastReadClanMessageId: string | null;
  clanBoss: any | null;
  bossDamageStats: any[];
  referrals: any[];

  // 🆕 Бейджи
  myBadges: Array<{ badgeId: string; seasonId: string; unlockedAt: string }>;

  // ==================== МЕТОДЫ ====================

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
  adminGetData: () => Promise<{ flags: any[]; users: any[] } | null>;
  adminAction: (action: string, payload: any) => Promise<boolean>;

  // Казино
  playCoinFlip: (
    betAmount: number,
    choice: 'heads' | 'tails'
  ) => Promise<{ success: boolean; isWin?: boolean; result?: string; payout?: number; error?: string }>;
  playDice: (
    betAmount: number,
    guess: number
  ) => Promise<{ success: boolean; roll?: number; isWin?: boolean; payout?: number; error?: string }>;
  playRoulette: (
    betAmount: number,
    betType: 'red' | 'black' | 'zero'
  ) => Promise<{
    success: boolean;
    result?: number;
    color?: 'red' | 'black' | 'zero';
    isWin?: boolean;
    payout?: number;
    error?: string;
  }>;

  // Кланы
  fetchClans: () => Promise<void>;
  fetchClanMessages: () => Promise<void>;
  sendClanMessage: (message: string) => Promise<boolean>;
  markClanChatAsRead: () => void;
  fetchReferrals: () => Promise<void>;
  skipUpgradeTime: (itemId: string, reduceMs?: number) => Promise<boolean>;
  applyToClan: (clanId: string, message?: string) => Promise<boolean>;
  inviteToClan: (targetUsername: string) => Promise<{ success: boolean; error?: string; targetName?: string }>;
  getMyClanRequests: () => Promise<void>;
  respondToInvite: (requestId: string, accept: boolean) => Promise<boolean>;
  getClanApplications: () => Promise<void>;
  respondToApplication: (requestId: string, accept: boolean) => Promise<boolean>;
  cancelApplication: (requestId: string) => Promise<boolean>;
  searchPlayers: (query: string) => Promise<
    Array<{
      id: number;
      username: string | null;
      firstName: string | null;
      lastName: string | null;
      photoUrl: string | null;
      level: number;
      xp: number;
      invited: boolean;
    }>
  >;

  // Игрок
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
  attackClanBoss: () => Promise<{
    success: boolean;
    damage?: number;
    isDefeated?: boolean;
    reward?: number;
    playerCoins?: number;
  }>;

  startBotRace: () => Promise<{ success: boolean; result?: any }>;
  switchCar: (carId: string) => Promise<void>;
  reportPvpResult: (data: {
    won: boolean;
    ratingDelta: number;
    coinsDelta: number;
    playerStats?: any;
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

  // 🆕 Бейджи
  fetchMyBadges: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null,
  balance: 0,
  unsyncedTaps: 0,
  unsyncedClicks: 0,
  isSyncing: false,
  tapCountInSecond: 0,
  lastTapSecond: 0,
  carColor: 'original',
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

  myClanInvites: [],
  myClanApplications: [],
  clanApplications: [],

  myBadges: [],

  setUser: (user, inventory, equipped) => set({ user, balance: user.balance, inventory, equipped }),

  // ==================== ТАП ====================
  tap: () => {
    const state = get();
    const now = Date.now();
    const tapPower = state.user?.clickLevel || 1;

    let newTapCount = state.tapCountInSecond;
    let lastSecond = state.lastTapSecond;
    if (now - lastSecond > 1000) {
      newTapCount = 1;
      lastSecond = now;
    } else {
      if (newTapCount >= 15) return;
      newTapCount += 1;
    }

    set((s) => ({
      tapCountInSecond: newTapCount,
      lastTapSecond: lastSecond,
      balance: s.balance + tapPower,
      user: s.user
        ? {
            ...s.user,
            totalEarned: s.user.totalEarned + tapPower,
            totalClicks: (s.user.totalClicks || 0) + 1,
            earnedFromClicks: (s.user.earnedFromClicks || 0) + tapPower,
            xp: (s.user.xp || 0) + 1,
          }
        : null,
      unsyncedTaps: s.unsyncedTaps + tapPower,
      unsyncedClicks: s.unsyncedClicks + 1,
    }));
  },

  // ==================== КЕЙСЫ ====================
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
          user: s.user
            ? {
                ...s.user,
                balance: data.newBalance,
                starsBalance: data.newStars ?? s.user.starsBalance,
                lastAdCaseAt: data.lastAdCaseAt ?? s.user.lastAdCaseAt,
              }
            : null,
          inventory: data.wonItem.id.startsWith('coins_')
            ? s.inventory
            : [...s.inventory, data.wonItem.id],
        }));
        return { success: true, wonItem: data.wonItem };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  },

  // ==================== ИСТОРИЯ ====================
  fetchHistory: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ history: data.history });
    } catch (e) {
      console.error(e);
    }
  },

  // ==================== РЕФЕРАЛЫ ====================
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

  // ==================== КЛАНЫ ====================
  fetchClan: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getClan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ clansList: data.clans });
    } catch (e) {
      console.error(e);
    }
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            hasUnreadClanMessages: isNew ? true : state.hasUnreadClanMessages,
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
  },

  markClanChatAsRead: () => {
    const msgs = get().clanMessages;
    const newest = msgs.length > 0 ? msgs[msgs.length - 1] : null;
    set({
      hasUnreadClanMessages: false,
      lastReadClanMessageId: newest ? newest.id : null,
    });
  },

  sendClanMessage: async (message) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=sendClanMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, message }),
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  },

  adminGetData: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action: 'getData' }),
      });
      const data = await res.json();
      if (data.success) return { flags: data.flags, users: data.users };
      return null;
    } catch {
      return null;
    }
  },

  adminAction: async (action, payload) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action, payload }),
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  },

  createClan: async (name) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=createClan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, name }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance } : null,
        }));
        await get().fetchClan();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  joinClan: async (clanName) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=joinClan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, clanName }),
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchClan();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  clanAction: async (action, amount = 0, targetId, role) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=clanAction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action, amount, targetId, role }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.newBalance !== undefined) {
          set((s) => ({
            balance: data.newBalance,
            user: s.user ? { ...s.user, balance: data.newBalance } : null,
          }));
        }
        await get().fetchClan();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  applyToClan: async (clanId, message) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=applyToClan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, clanId, message }),
      });
      const data = await res.json();
      if (data.success) return true;
      WebApp.showAlert(data.error || 'Ошибка');
      return false;
    } catch {
      return false;
    }
  },

  inviteToClan: async (targetUsername) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=inviteToClan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, targetUsername }),
      });
      const data = await res.json();
      if (data.success) return { success: true, targetName: data.targetName };
      return { success: false, error: data.error || 'Ошибка' };
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  },

  searchPlayers: async (query) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=searchPlayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, query }),
      });
      const data = await res.json();
      if (data.success) return data.players;
      return [];
    } catch {
      return [];
    }
  },

  getMyClanRequests: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getMyClanRequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set({
          myClanInvites: data.invites || [],
          myClanApplications: data.applications || [],
        });
      }
    } catch {}
  },

  respondToInvite: async (requestId, accept) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=respondToInvite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, requestId, accept }),
      });
      const data = await res.json();
      if (data.success) {
        await get().getMyClanRequests();
        if (accept) await get().fetchClan();
        return true;
      }
      WebApp.showAlert(data.error || 'Ошибка');
      return false;
    } catch {
      return false;
    }
  },

  getClanApplications: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getClanApplications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set({ clanApplications: data.applications || [] });
      }
    } catch {}
  },

  respondToApplication: async (requestId, accept) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=respondToApplication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, requestId, accept }),
      });
      const data = await res.json();
      if (data.success) {
        await get().getClanApplications();
        await get().fetchClan();
        return true;
      }
      WebApp.showAlert(data.error || 'Ошибка');
      return false;
    } catch {
      return false;
    }
  },

  cancelApplication: async (requestId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=cancelApplication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, requestId }),
      });
      const data = await res.json();
      if (data.success) {
        await get().getMyClanRequests();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  fetchClanBoss: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getClanBoss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ clanBoss: data.boss, bossDamageStats: data.damageStats });
    } catch (e) {
      console.error(e);
    }
  },

  attackClanBoss: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=attackClanBoss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          clanBoss: state.clanBoss ? { ...state.clanBoss, currentHp: data.newHp } : null,
          balance: data.newBalance,
          user: state.user ? { ...state.user, balance: data.newBalance } : null,
        }));
        if (data.isDefeated) {
          get().fetchClanBoss();
          get().fetchClan();
        }
        return {
          success: true,
          damage: data.damage,
          isDefeated: data.isDefeated,
          reward: data.reward,
          playerCoins: data.playerCoins,
        };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  // ==================== БИЗНЕС ====================
  buyBusiness: async (businessId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=buyBusiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, businessId }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user
            ? { ...s.user, balance: data.newBalance, businesses: data.businesses }
            : null,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  upgradeBusiness: async (businessId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=upgradeBusiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, businessId }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user
            ? { ...s.user, balance: data.newBalance, businesses: data.businesses }
            : null,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  collectIncome: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=collectIncome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user
            ? {
                ...s.user,
                balance: data.newBalance,
                businesses: data.businesses,
                earnedFromBusiness: data.earnedFromBusiness ?? s.user.earnedFromBusiness,
              }
            : null,
        }));
        return { success: true, collected: data.collected };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  // ==================== КАЗИНО ====================
  playCoinFlip: async (betAmount, choice) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=flipCoin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, betAmount, choice }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance } : null,
        }));
        return {
          success: true,
          isWin: data.isWin,
          result: data.result,
          payout: data.payout,
        };
      }
      return { success: false, error: data.error || 'Ошибка сервера' };
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  },

  playDice: async (betAmount, guess) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=flipDice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, betAmount, guess }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance } : null,
        }));
        return {
          success: true,
          roll: data.roll,
          isWin: data.isWin,
          payout: data.payout,
        };
      }
      return { success: false, error: data.error || 'Ошибка сервера' };
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  },

  playRoulette: async (betAmount, betType) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=spinRoulette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, betAmount, betType }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance } : null,
        }));
        return {
          success: true,
          result: data.result,
          color: data.color,
          isWin: data.isWin,
          payout: data.payout,
        };
      }
      return { success: false, error: data.error || 'Ошибка сервера' };
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  },

  // ==================== АПГРЕЙДЫ ====================
  upgradePart: async (itemId, type) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=upgradePart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId, type }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user
            ? { ...s.user, balance: data.newBalance, partUpgrades: data.partUpgrades }
            : null,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  claimUpgrade: async (itemId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=claimUpgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({ user: s.user ? { ...s.user, partUpgrades: data.partUpgrades } : null }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  craftItem: async (itemId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=craftItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => {
          const inv = [...s.inventory];
          let removed = 0;
          const newInv = inv.filter((id) => {
            if (id === itemId && removed < 5) {
              removed++;
              return false;
            }
            return true;
          });
          newInv.push(data.newItemId);
          return { inventory: newInv };
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // ==================== ПРОПУСК ====================
  getPass: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getPass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, level, track }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user
            ? { ...s.user, balance: data.newBalance, weeklyPass: data.pass }
            : null,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  buyPremiumPass: async (): Promise<{ success: boolean; error?: string }> => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=buyPremium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user
            ? { ...s.user, balance: data.newBalance, weeklyPass: data.pass }
            : null,
        }));
        return { success: true };
      }
      return { success: false, error: data.error || 'Ошибка сервера' };
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  },

  // ==================== СИНХРОНИЗАЦИЯ ТАПОВ ====================
  syncTaps: async () => {
    const { unsyncedTaps, unsyncedClicks, isSyncing } = get();
    if (unsyncedTaps === 0 || isSyncing) return;
    const tapsToSend = unsyncedTaps;
    const clicksToSend = unsyncedClicks;
    set({ unsyncedTaps: 0, unsyncedClicks: 0, isSyncing: true });
    try {
      const initData = getInitData();
      const res = await fetch('/api/game?action=tap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, amount: tapsToSend, clicks: clicksToSend }),
      });
      if (!res.ok) throw new Error('Ошибка сервера');
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance + s.unsyncedTaps,
          user: s.user
            ? {
                ...s.user,
                totalEarned: data.newTotalEarned + s.unsyncedTaps,
                totalClicks: data.totalClicks ?? s.user.totalClicks,
                earnedFromClicks: data.earnedFromClicks ?? s.user.earnedFromClicks,
                xp: data.xp ?? s.user.xp,
              }
            : null,
        }));
        if (data.droppedItem) {
          set((s) => ({
            inventory: [...s.inventory, data.droppedItem.id],
            lastDroppedItem: data.droppedItem,
          }));
        }
      }
    } catch (error) {
      set((state) => ({
        unsyncedTaps: state.unsyncedTaps + tapsToSend,
        unsyncedClicks: state.unsyncedClicks + clicksToSend,
      }));
    } finally {
      set({ isSyncing: false });
    }
  },

  setCarColor: (color) => set({ carColor: color }),
  setLastDroppedItem: (item) => set({ lastDroppedItem: item }),

  equipItem: async (slot: string, itemId: string) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, slot, itemId }),
      });
      if (res.ok) {
        set((state) => ({ equipped: { ...state.equipped, [slot]: itemId } }));
        return true;
      }
    } catch {}
    return false;
  },

  // ==================== ГОНКИ ====================
  startBotRace: async () => {
    const { user, equipped } = get();
    if (!user) return { success: false };
    const playerStats = calculateStats(equipped, user.partUpgrades, user.activeCarId);
    const deviation = () => 0.8 + Math.random() * 0.1;
    const botStats = {
      power: playerStats.power * deviation(),
      topSpeed: playerStats.topSpeed * deviation(),
      grip: playerStats.grip * deviation(),
      handling: playerStats.handling * deviation(),
      accel: playerStats.accel * deviation(),
      rating: playerStats.rating * deviation(),
    };
    const calcTime = (stats: any, isBot: boolean = false) => {
      const baseTime = (1000 / stats.topSpeed) * 3600;
      const penalty = isBot ? Math.random() * 2.5 : Math.random() * 1.0;
      return (
        baseTime -
        stats.accel * 0.5 -
        stats.grip * 0.05 -
        stats.handling * 0.05 +
        penalty
      );
    };
    const pTime = calcTime(playerStats, false);
    const oTime = calcTime(botStats, true);
    const winner = pTime < oTime ? 'player' : 'opponent';
    const log = [
      `🏁 Старт! Соперник: Бот (Рейтинг: ${botStats.rating.toFixed(0)})`,
      `Вы проехали 1000м за ${pTime.toFixed(2)} сек.`,
      `Бот проехал за ${oTime.toFixed(2)} сек.`,
      winner === 'player' ? `🏆 Победа! +1 рейтинг.` : `💨 Поражение...`,
    ];
    const reward = winner === 'player' ? 1000 + playerStats.rating * 10 : 0;
    return {
      success: true,
      result: {
        winner,
        log,
        playerTime: pTime,
        opponentTime: oTime,
        ratingChange: winner === 'player' ? 1 : -1,
        reward,
      },
    };
  },

  switchCar: async (carId: string) => {
    const { user } = get();
    if (!user) return;
    const prevCarId = user.activeCarId;
    set({ user: { ...user, activeCarId: carId } });
    try {
      const initData = getInitData();
      const res = await fetch('/api/game?action=switchCar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, carId }),
      });
      if (!res.ok) throw new Error('Failed to switch car');
    } catch (e) {
      console.error(e);
      set((state) => ({
        user: state.user ? { ...state.user, activeCarId: prevCarId } : null,
      }));
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
        user: state.user
          ? {
              ...state.user,
              balance: data.newBalance ?? state.user.balance,
              rating: data.newRating ?? state.user.rating,
              totalRaces: data.totalRaces ?? state.user.totalRaces,
              totalWins: data.totalWins ?? state.user.totalWins,
              totalLosses: data.totalLosses ?? state.user.totalLosses,
              earnedFromRaces: data.earnedFromRaces ?? state.user.earnedFromRaces,
              xp: data.xp ?? state.user.xp,
            }
          : null,
      }));
    } catch (e) {
      console.error('[PVP] Fetch error:', e);
      set((state) => ({
        balance: prevBalance,
        user: state.user
          ? { ...state.user, balance: prevBalance, rating: prevRating }
          : null,
      }));
    }
  },

  // ==================== МАШИНЫ ====================
  buyCar: async (carId, price) => {
    const { user } = get();
    if (!user) return false;
    if (user.balance < price) return false;
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=buyCar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, carId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((state) => ({
          balance: data.newBalance,
          user: state.user
            ? { ...state.user, balance: data.newBalance, ownedCars: data.ownedCars }
            : null,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // ==================== АПГРЕЙДЫ КЛИКЕРА ====================
  upgradeClicker: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=upgradeClicker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user
            ? { ...s.user, balance: data.newBalance, clickLevel: data.newClickLevel }
            : null,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  },

  upgradeOffline: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=upgradeOffline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user
            ? { ...s.user, balance: data.newBalance, offlineLevel: data.newOfflineLevel }
            : null,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  },

  // ==================== ДОСТИЖЕНИЯ ====================
  getAchievements: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getAchievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          achievementsList: s.achievementsList.map((a) =>
            a.id === id ? { ...a, isUnlocked: true } : a
          ),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // ==================== ПРОДАЖА ====================
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
    set({
      balance: newBalance,
      inventory: newInventory,
      user: { ...user, balance: newBalance },
    });
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=sellItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      set((s) => ({
        balance: data.newBalance,
        user: s.user ? { ...s.user, balance: data.newBalance } : null,
      }));
      return true;
    } catch {
      set({ balance: state.balance, inventory: state.inventory, user: state.user });
      return false;
    }
  },

  // ==================== ПРОПУСК ВРЕМЕНИ ====================
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

  // ==================== ЕЖЕДНЕВНЫЙ ====================
  claimDaily: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=claimDaily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set((state) => ({
          balance: data.newBalance,
          user: state.user
            ? {
                ...state.user,
                balance: data.newBalance,
                dailyStreak: data.dailyStreak,
                xp: data.xp ?? state.user.xp,
                lastDailyClaim: data.lastDailyClaim,
              }
            : null,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // ==================== УРОВЕНЬ ====================
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
          user: s.user
            ? {
                ...s.user,
                balance: data.newBalance,
                starsBalance: data.newStars ?? s.user.starsBalance,
                totalEarned: data.newTotalEarned ?? s.user.totalEarned,
                lastClaimedLevel: data.newLastClaimedLevel ?? s.user.lastClaimedLevel,
              }
            : null,
        }));
        return data;
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  },

  // ==================== КВЕСТЫ ====================
  claimQuest: async (questId) => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=claimQuest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, questId }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          balance: data.newBalance,
          user: state.user
            ? {
                ...state.user,
                balance: data.newBalance,
                totalEarned: data.newTotalEarned ?? state.user.totalEarned,
                xp: data.xp ?? state.user.xp,
              }
            : null,
        }));
        return data.quests;
      }
      return null;
    } catch {
      return null;
    }
  },

  // ==================== БЕЙДЖИ ====================
  fetchMyBadges: async () => {
    const initData = getInitData();
    try {
      const res = await fetch('/api/game?action=getMyBadges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ myBadges: data.badges || [] });
    } catch (e) {
      console.error(e);
    }
  },
}));