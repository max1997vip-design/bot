// src/store/gameStore.ts
import { create } from 'zustand';
import { calculateStats, ITEMS, SELL_PRICES } from '../config/items';

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
  businesses?: Record<string, { level: number; lastCollected: number }>;
  partUpgrades?: Record<string, PartUpgrade>;
  features?: Record<string, boolean>;
  weeklyPass?: { weekId: number; xp: number; claimed: number[] };
  isAdmin?: boolean;
}

interface GameState {
  user: UserData | null;
  balance: number;
  unsyncedTaps: number;
  isSyncing: boolean;
  tapCountInSecond: number;
  lastTapSecond: number;
  carColor: string;
  inventory: string[];
  equipped: Record<string, string | null>;
  lastDroppedItem: any | null;
  history: any[];

  
  
  upgradePart: (itemId: string, type: 'level' | 'gold' | 'red') => Promise<boolean>;
  claimUpgrade: (itemId: string) => Promise<boolean>;
  craftItem: (itemId: string) => Promise<boolean>;
  buyBusiness: (businessId: string) => Promise<boolean>;
  upgradeBusiness: (businessId: string) => Promise<boolean>;
  collectIncome: () => Promise<{ success: boolean; collected?: number }>;
  adminGetData: () => Promise<{ flags: any[], users: any[] } | null>;
  adminAction: (action: string, payload: any) => Promise<boolean>;
  playCoinFlip: (betAmount: number, choice: 'heads' | 'tails') => Promise<{ success: boolean; isWin?: boolean; result?: string; payout?: number; error?: string }>;

  setUser: (user: UserData, inventory: string[], equipped: Record<string, string | null>) => void;
  tap: () => void;
  syncTaps: () => Promise<void>;
  setCarColor: (color: string) => void;
  equipItem: (slot: string, itemId: string) => Promise<boolean>;
  setLastDroppedItem: (item: any) => void;
  openCase: (caseType: string) => Promise<{ success: boolean; wonItem?: any }>;
  clanInfo: any | null;
  clanMembers: any[];
  fetchClan: () => Promise<void>;
  createClan: (name: string) => Promise<boolean>;
  fetchHistory: () => Promise<void>;
  joinClan: (clanName: string) => Promise<boolean>;
  clanAction: (action: 'donate' | 'upgrade', amount?: number) => Promise<boolean>;

  
  startBotRace: () => Promise<{ success: boolean; result?: any }>;
  switchCar: (carId: string) => Promise<void>;
  reportPvpResult: (data: { won: boolean; ratingDelta: number; coinsDelta: number }) => Promise<void>;
  buyCar: (carId: string, price: number) => Promise<boolean>;
  sellItem: (itemId: string) => Promise<boolean>;
  upgradeClicker: () => Promise<void>;
  upgradeOffline: () => Promise<void>;
  claimDaily: () => Promise<boolean>;
  claimQuest: (questId: string) => Promise<any>;
  getPass: () => Promise<void>;
  claimPassReward: (level: number) => Promise<boolean>;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null, balance: 0, unsyncedTaps: 0, isSyncing: false,
  tapCountInSecond: 0, lastTapSecond: 0, carColor: 'original',
  inventory: [], 
  equipped: { engine: null, tires: null, ecu: null, suspension: null }, 
  lastDroppedItem: null,

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
      user: s.user ? { ...s.user, totalEarned: s.user.totalEarned + tapPower } : null,
      unsyncedTaps: s.unsyncedTaps + tapPower,
    }));
  },

  openCase: async (caseType) => {
    const initData = window.Telegram?.WebApp?.initData || '';
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
        user: s.user ? { ...s.user, balance: data.newBalance } : null,
        // Если выпал предмет, добавляем в инвентарь
        inventory: data.wonItem.id.startsWith('coins_') ? s.inventory : [...s.inventory, data.wonItem.id] 
      }));
      return { success: true, wonItem: data.wonItem };
    }
    return { success: false };
    } catch (e) {
    return { success: false };
    }
  },

  history: [],
fetchHistory: async () => {
  const initData = window.Telegram?.WebApp?.initData || '';
  try {
    const res = await fetch('/api/game?action=getHistory', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });
    const data = await res.json();
    if (data.success) set({ history: data.history });
  } catch (e) { console.error(e); }
},


    clanInfo: null,
  clanMembers: [],

  fetchClan: async () => {
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=getClan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) set({ clanInfo: data.clan, clanMembers: data.members });
    } catch {}
  },

    adminGetData: async () => {
    const initData = window.Telegram?.WebApp?.initData || '';
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
    const initData = window.Telegram?.WebApp?.initData || '';
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
    const initData = window.Telegram?.WebApp?.initData || '';
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
    const initData = window.Telegram?.WebApp?.initData || '';
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

  clanAction: async (action, amount = 0) => {
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=clanAction', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action, amount }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.newBalance !== undefined) {
          set((s) => ({ balance: data.newBalance, user: s.user ? { ...s.user, balance: data.newBalance } : null }));
        }
        await get().fetchClan(); // Обновляем инфу о клане
        return true;
      }
      return false;
    } catch { return false; }
  },

  buyBusiness: async (businessId) => {
    const initData = window.Telegram?.WebApp?.initData || '';
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
    const initData = window.Telegram?.WebApp?.initData || '';
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
      return { success: false, error: data.error || 'Ошибка сервера' };
    } catch (e) {
      return { success: false, error: 'Ошибка сети' };
    }
  },

  upgradeBusiness: async (businessId) => {
    const initData = window.Telegram?.WebApp?.initData || '';
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
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=collectIncome', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance, businesses: data.businesses } : null
        }));
        return { success: true, collected: data.collected };
      }
      return { success: false };
    } catch { return { success: false }; }
  },

  upgradePart: async (itemId, type) => {
    const initData = window.Telegram?.WebApp?.initData || '';
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
    const initData = window.Telegram?.WebApp?.initData || '';
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

      claimPassReward: async (level: number) => { // <-- Добавлен : number
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=claimPassReward', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, level }),
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


  claimUpgrade: async (itemId) => {
    const initData = window.Telegram?.WebApp?.initData || '';
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
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=craftItem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      const data = await res.json();
      if (data.success) {
        // Локально обновляем инвентарь: удаляем 5 старых, добавляем 1 новый
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
    const { unsyncedTaps, isSyncing } = get();
    if (unsyncedTaps === 0 || isSyncing) return;
    const tapsToSend = unsyncedTaps;
    set({ unsyncedTaps: 0, isSyncing: true });
    try {
      const initData = window.Telegram?.WebApp?.initData || '';
      const res = await fetch('/api/game?action=tap', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, amount: tapsToSend }),
      });
      if (!res.ok) throw new Error('Ошибка сервера');
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance + s.unsyncedTaps,
          user: s.user ? { ...s.user, totalEarned: data.newTotalEarned + s.unsyncedTaps } : null
        }));
        if (data.droppedItem) {
          set((s) => ({ inventory: [...s.inventory, data.droppedItem.id], lastDroppedItem: data.droppedItem }));
        }
      }
    } catch (error) {
      set((state) => ({ unsyncedTaps: state.unsyncedTaps + tapsToSend }));
    } finally { set({ isSyncing: false }); }
  },

  setCarColor: (color) => set({ carColor: color }),
  setLastDroppedItem: (item) => set({ lastDroppedItem: item }),

  equipItem: async (slot: string, itemId: string) => {
    const initData = window.Telegram?.WebApp?.initData || '';
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

    // Передаем partUpgrades и activeCarId в расчет статов!
    const playerStats = calculateStats(equipped, user.partUpgrades, user.activeCarId);
    const deviation = () => 0.80 + Math.random() * 0.10;
    
    const botStats = {
      power: playerStats.power * deviation(),
      topSpeed: playerStats.topSpeed * deviation(),
      grip: playerStats.grip * deviation(),
      handling: playerStats.handling * deviation(),
      accel: playerStats.accel * deviation(),
      rating: playerStats.rating * deviation()
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
      `🏁 Старт! Соперник: Бот (Рейтинг: ${botStats.rating.toFixed(0)})`,
      `Вы проехали 1000м за ${pTime.toFixed(2)} сек.`,
      `Бот проехал за ${oTime.toFixed(2)} сек.`,
      winner === 'player' ? `🏆 Победа! +1 рейтинг.` : `💨 Поражение...`
    ];

    const reward = winner === 'player' ? (1000 + playerStats.rating * 10) : 0;

    return { 
      success: true, 
      result: { winner, log, playerTime: pTime, opponentTime: oTime, ratingChange: winner === 'player' ? 1 : -1, reward } 
    };
  },

  switchCar: async (carId: string) => {
    const { user } = get();
    if (!user) return;
    const prevCarId = user.activeCarId;
    set({ user: { ...user, activeCarId: carId } });

    try {
      const initData = window.Telegram?.WebApp?.initData || '';
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

  reportPvpResult: async ({ won, ratingDelta, coinsDelta }) => {
    const { user } = get();
    if (!user) return;

    const prevBalance = user.balance;
    const prevRating = user.rating;

    set({
      balance: Math.max(0, user.balance + coinsDelta),
      user: {
        ...user,
        balance: Math.max(0, user.balance + coinsDelta),
        rating: Math.max(0, user.rating + ratingDelta)
      }
    });

    try {
      const initData = window.Telegram?.WebApp?.initData || '';
      const res = await fetch('/api/game?action=pvpResult', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, won, ratingDelta, coinsDelta }),
      });
      
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      
      set((state) => ({
        balance: data.newBalance ?? state.balance,
        user: state.user ? { ...state.user, balance: data.newBalance ?? state.user.balance, rating: data.newRating ?? state.user.rating } : null
      }));
    } catch (e) {
      console.error(e);
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

    const initData = window.Telegram?.WebApp?.initData || '';
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
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  upgradeClicker: async () => {
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=upgradeClicker', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance, clickLevel: data.newClickLevel } : null
        }));
      }
    } catch (e) { console.error(e); }
  },

  upgradeOffline: async () => {
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=upgradeOffline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({
          balance: data.newBalance,
          user: s.user ? { ...s.user, balance: data.newBalance, offlineLevel: data.newOfflineLevel } : null
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

    set({
      balance: newBalance,
      inventory: newInventory,
      user: { ...user, balance: newBalance }
    });

    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=sellItem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      
      set((s) => ({
        balance: data.newBalance,
        user: s.user ? { ...s.user, balance: data.newBalance } : null
      }));
      return true;
    } catch (e) {
      console.error('Sell error:', e);
      set({
        balance: state.balance,
        inventory: state.inventory,
        user: state.user
      });
      return false;
    }
  },

  claimDaily: async () => {
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=claimDaily', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        set((state) => ({
          balance: data.newBalance,
          user: state.user ? { 
            ...state.user, 
            balance: data.newBalance, 
            dailyStreak: data.dailyStreak, 
            lastDailyClaim: data.lastDailyClaim 
          } : null
        }));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  claimQuest: async (questId) => {
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch('/api/game?action=claimQuest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, questId }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          balance: data.newBalance,
          user: state.user ? { ...state.user, balance: data.newBalance } : null
        }));
        return data.quests;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}));