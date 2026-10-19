// src/store/gameStore.ts
import { create } from 'zustand';
import { calculateStats } from '../config/items';

// ВОЗВРАЩАЕМ ОБЪЯВЛЕНИЕ ДЛЯ TELEGRAM SDK
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
      };
    };
  }
}

export interface UserData {
  id: number; username: string | null; firstName: string | null; lastName: string | null;
  photoUrl: string | null; balance: number; totalEarned: number; starsBalance: number;
  level: number; xp: number; activeCarId: string; createdAt: string;
  referredBy: number | null; referralEarnings: number; rating: number;
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

  setUser: (user: UserData, inventory: string[], equipped: Record<string, string | null>) => void;
  tap: () => void;
  syncTaps: () => Promise<void>;
  setCarColor: (color: string) => void;
  equipItem: (slot: string, itemId: string) => Promise<boolean>;
  setLastDroppedItem: (item: any) => void;
  startBotRace: () => Promise<{ success: boolean; result?: any }>;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null, balance: 0, unsyncedTaps: 0, isSyncing: false,
  tapCountInSecond: 0, lastTapSecond: 0, carColor: 'original',
  inventory: [], equipped: { engine: null, tires: null, ecu: null }, lastDroppedItem: null,

  setUser: (user, inventory, equipped) => set({ user, balance: user.balance, inventory, equipped }),

  tap: () => {
    const state = get(); const now = Date.now();
    let newTapCount = state.tapCountInSecond; let lastSecond = state.lastTapSecond;
    if (now - lastSecond > 1000) { newTapCount = 1; lastSecond = now; } 
    else { if (newTapCount >= 15) return; newTapCount += 1; }
    set((s) => ({
      tapCountInSecond: newTapCount, lastTapSecond: lastSecond,
      balance: s.balance + 1,
      user: s.user ? { ...s.user, totalEarned: s.user.totalEarned + 1 } : null,
      unsyncedTaps: s.unsyncedTaps + 1,
    }));
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
    const { user, equipped, balance } = get();
    if (!user) return { success: false };

    const playerStats = calculateStats(equipped);
    const botRating = Math.max(0, playerStats.rating + (Math.random() * 10 - 5));
    
    const botStats = {
      power: 150 + botRating, topSpeed: 180 + botRating * 0.5,
      grip: botRating * 0.5, handling: botRating * 0.5,
      accel: Math.max(1.5, 7.0 - (botRating * 0.005)),
      rating: botRating
    };

    const calcTime = (stats: any) => {
      const baseTime = (1000 / stats.topSpeed) * 3600; 
      return baseTime - (stats.accel * 0.5) - (stats.grip * 0.05) - (stats.handling * 0.05) + (Math.random() * 1.5);
    };

    const pTime = calcTime(playerStats);
    const oTime = calcTime(botStats);
    const winner = pTime < oTime ? 'player' : 'opponent';
    const log = [
      `🏁 Старт! Соперник: Бот (Рейтинг: ${botRating.toFixed(0)})`,
      `Вы проехали 1000м за ${pTime.toFixed(2)} сек.`,
      `Бот проехал за ${oTime.toFixed(2)} сек.`,
      winner === 'player' ? `🏆 Победа! +1 рейтинг.` : `💨 Поражение...`
    ];

    if (winner === 'player') {
      const reward = 1000 + playerStats.rating * 10;
      set({ 
        balance: balance + reward, 
        user: { ...user, balance: balance + reward, rating: user.rating + 1 } 
      });
      
      const initData = window.Telegram?.WebApp?.initData || '';
      fetch('/api/game?action=tap', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, amount: reward }),
      }).catch(console.error);
    }
    return { success: true, result: { winner, log, playerTime: pTime, opponentTime: oTime, ratingChange: winner === 'player' ? 1 : 0 } };
  },
}));