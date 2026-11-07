// src/components/PvpArenaScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, X, Clock, Trophy, TrendingUp, TrendingDown, Coins, Users, Zap, Wifi, WifiOff,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { calculateStats } from '../config/items';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import '../styles/pvparena.css';

const MIN_BET = 1000;
const MAX_BET = 10_000_000;
const QUICK_BETS = [1000, 10000, 100000, 1000000];

type Mode = 'online' | 'offline';

export const PvpArenaScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const equipped = useGameStore((s) => s.equipped);
  const myBattle = useGameStore((s) => s.myBattle);
  const pvpMatchmake = useGameStore((s) => s.pvpMatchmake);
  const pvpOffline = useGameStore((s) => s.pvpOffline);
  const getMyBattle = useGameStore((s) => s.getMyBattle);
  const pvpCancel = useGameStore((s) => s.pvpCancel);

  const [mode, setMode] = useState<Mode>('online');
  const [bet, setBet] = useState<number | ''>(10000);
  const [searching, setSearching] = useState(false);

  // 🎯 Таймер — от createdAt
  const [now, setNow] = useState(Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const balance = user?.balance || 0;

  useEffect(() => {
    getMyBattle();
  }, [getMyBattle]);

  // Polling для онлайн-поиска
  useEffect(() => {
    if (!myBattle || myBattle.status !== 'waiting' || myBattle.mode !== 'online') {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    pollRef.current = setInterval(() => {
      getMyBattle();
    }, 2000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [myBattle?.status, myBattle?.id, myBattle?.mode, getMyBattle]);

  // Обновление таймера
  useEffect(() => {
    if (myBattle?.status === 'waiting') {
      const t = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(t);
    }
  }, [myBattle?.status]);

  // Звук при завершении
  useEffect(() => {
    if (myBattle?.status === 'finished') {
      const isWin = myBattle.winnerId === user?.id;
      playSound(isWin ? 'win' : 'click');
      try { WebApp.HapticFeedback?.notificationOccurred(isWin ? 'success' : 'error'); } catch {}
    }
  }, [myBattle?.status, myBattle?.winnerId, user?.id]);

  const elapsed = myBattle?.status === 'waiting'
    ? Math.floor((now - new Date(myBattle.createdAt).getTime()) / 1000)
    : 0;
  const timeLeft = Math.max(0, 60 - elapsed);

  const handleSearch = async () => {
    if (!bet || bet < MIN_BET) {
      WebApp.showAlert(`Минимальная ставка ${MIN_BET.toLocaleString('ru-RU')} ₽`);
      return;
    }
    if (balance < bet) {
      WebApp.showAlert('Недостаточно ₽!');
      return;
    }
    setSearching(true);
    const stats = calculateStats(equipped, user?.partUpgrades, user?.activeCarId);

    if (mode === 'online') {
      const res = await pvpMatchmake(bet, stats);
      if (!res.success) WebApp.showAlert(res.error || 'Ошибка');
    } else {
      const res = await pvpOffline(bet, stats);
      if (!res.success) WebApp.showAlert(res.error || 'Ошибка');
    }
    setSearching(false);
  };

  const handleCancel = async () => {
    if (await pvpCancel()) setSearching(false);
  };

  const handleClose = async () => {
    if (myBattle?.status === 'waiting') {
      const ok = confirm('Отменить поиск? Ставка вернётся на баланс.');
      if (!ok) return;
      await pvpCancel();
    }
    onClose();
  };

  return (
    <div className="pvparena-overlay" onClick={handleClose}>
      <motion.div
        className="pvparena-modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pvparena-aura" />
        <div className="pvparena-glow-top" />

        {/* HEADER */}
        <div className="pvparena-header">
          <div className="pvparena-header-title">
            <div className="pvparena-header-icon">
              <Swords size={22} color="#ff8800" />
            </div>
            <div>
              <h2 className="pvparena-header-name">PvP АРЕНА</h2>
              <span className="pvparena-header-balance">
                <Coins size={11} /> {balance.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
          <button className="pvparena-close-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="pvparena-body">
          <AnimatePresence mode="wait">

            {/* IDLE — выбор режима */}
            {(!myBattle || myBattle.status === 'cancelled') && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pvparena-game">
                <div className="pvparena-mode-tabs">
                  <button
                    className={`pvparena-mode-tab ${mode === 'online' ? 'active online' : ''}`}
                    onClick={() => setMode('online')}
                  >
                    <Wifi size={14} />
                    ОНЛАЙН
                    <span>+15 / −10</span>
                  </button>
                  <button
                    className={`pvparena-mode-tab ${mode === 'offline' ? 'active offline' : ''}`}
                    onClick={() => setMode('offline')}
                  >
                    <WifiOff size={14} />
                    ОФЛАЙН
                    <span>+3 / −1</span>
                  </button>
                </div>

                <div className="pvparena-intro">
                  <motion.div
                    className="pvparena-swords"
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Swords size={64} color={mode === 'online' ? '#00d97e' : '#ff8800'} />
                  </motion.div>
                  <h3>{mode === 'online' ? 'Онлайн-бой' : 'Офлайн-бой'}</h3>
                  <p>
                    {mode === 'online'
                      ? 'Сразись с реальным игроком · 95% банка победителю'
                      : 'Соперник из твоей лиги · мягкий рейтинг'}
                  </p>
                </div>

                <div className="pvparena-bet-box">
                  <label className="pvparena-bet-label">СУММА СТАВКИ</label>
                  <div className="pvparena-bet-display">
                    <span className="pvparena-bet-currency">₽</span>
                    <input
                      type="number"
                      value={bet}
                      onChange={(e) => setBet(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="pvparena-bet-input"
                    />
                  </div>
                  <div className="pvparena-quick-bets">
                    {QUICK_BETS.map((qb) => (
                      <button key={qb} onClick={() => setBet(qb)} className="pvparena-quick-bet-btn">
                        {qb >= 1000000 ? `${qb / 1000000}M` : qb >= 1000 ? `${qb / 1000}K` : qb}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="pvparena-play-btn"
                  onClick={handleSearch}
                  disabled={searching || !bet}
                  style={
                    mode === 'online'
                      ? { background: 'linear-gradient(135deg, #00d97e, #00b368)' }
                      : undefined
                  }
                >
                  {searching
                    ? 'ЗАГРУЗКА...'
                    : mode === 'online'
                    ? 'НАЙТИ ИГРОКА'
                    : 'СРАЗИТЬСЯ С ИГРОКОМ ИЗ ЛИГИ'}
                </button>
              </motion.div>
            )}

            {/* WAITING — только для онлайн */}
            {myBattle?.status === 'waiting' && myBattle.mode === 'online' && (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pvparena-waiting">
                <motion.div
                  className="pvparena-radar"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Users size={64} color="#ff8800" />
                </motion.div>
                <h3>ПОИСК СОПЕРНИКА</h3>
                <p className="pvparena-waiting-bet">
                  Ставка: <strong>{(myBattle.bet || 0).toLocaleString('ru-RU')} ₽</strong>
                </p>
                <div className="pvparena-timer">
                  <Clock size={16} />
                  <span>{elapsed} сек · таймаут {timeLeft} сек</span>
                </div>
                <p className="pvparena-waiting-hint">
                  Ждём игрока с такой же ставкой. Если не найдём за 60 сек — вернём ставку.
                </p>
                <button className="pvparena-cancel-btn" onClick={handleCancel}>
                  ОТМЕНИТЬ
                </button>
              </motion.div>
            )}

            {/* FINISHED */}
            {myBattle?.status === 'finished' && (
              <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pvparena-finished">
                {myBattle.winnerId === user?.id ? (
                  <>
                    <motion.div
                      className="pvparena-result-icon win"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Trophy size={64} color="#ffd700" />
                    </motion.div>
                    <h3 className="win-text">ПОБЕДА!</h3>
                  </>
                ) : (
                  <>
                    <div className="pvparena-result-icon lose">
                      <TrendingDown size={64} color="#ff4444" />
                    </div>
                    <h3 className="lose-text">ПОРАЖЕНИЕ</h3>
                  </>
                )}

                <div className="pvparena-result-stats">
                  <div className="pvparena-result-row">
                    <span>Режим:</span>
                    <strong>{myBattle.mode === 'online' ? 'Онлайн' : 'Офлайн'}</strong>
                  </div>
                  <div className="pvparena-result-row">
                    <span>Ставка:</span>
                    <strong>{(myBattle.bet || 0).toLocaleString('ru-RU')} ₽</strong>
                  </div>
                  <div className="pvparena-result-row">
                    <span>Твоё время:</span>
                    <strong>{myBattle.player1Id === user?.id ? myBattle.player1Time : myBattle.player2Time} сек</strong>
                  </div>
                  <div className="pvparena-result-row">
                    <span>Соперник:</span>
                    <strong>{myBattle.player1Id === user?.id ? myBattle.player2Time : myBattle.player1Time} сек</strong>
                  </div>
                  <div className="pvparena-result-row highlight">
                    <TrendingUp size={16} />
                    <span>Баланс:</span>
                    <strong style={{ color: myBattle.winnerId === user?.id ? '#00d97e' : '#ff4444' }}>
                      {myBattle.player1Id === user?.id
                        ? (myBattle.player1CoinsChange >= 0 ? '+' : '') + (myBattle.player1CoinsChange || 0).toLocaleString('ru-RU')
                        : (myBattle.player2CoinsChange >= 0 ? '+' : '') + (myBattle.player2CoinsChange || 0).toLocaleString('ru-RU')} ₽
                    </strong>
                  </div>
                  <div className="pvparena-result-row">
                    <span>Рейтинг:</span>
                    <strong style={{ color: myBattle.winnerId === user?.id ? '#00d97e' : '#ff4444' }}>
                      {myBattle.winnerId === user?.id ? `+${myBattle.mode === 'online' ? 15 : 3}` : `−${myBattle.mode === 'online' ? 10 : 1}`}
                    </strong>
                  </div>
                </div>

                <button
                  className="pvparena-play-btn"
                  onClick={() => useGameStore.setState({ myBattle: null })}
                >
                  ИГРАТЬ СНОВА
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};