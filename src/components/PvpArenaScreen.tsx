// src/components/PvpArenaScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, X, Clock, Trophy, TrendingUp, TrendingDown, Coins, Users,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { calculateStats } from '../config/items';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import '../styles/pvparena.css';

const MIN_BET = 1000;
const MAX_BET = 10_000_000;

const QUICK_BETS = [1000, 10000, 100000, 1000000];

export const PvpArenaScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const equipped = useGameStore((s) => s.equipped);
  const myBattle = useGameStore((s) => s.myBattle);
  const pvpMatchmake = useGameStore((s) => s.pvpMatchmake);
  const getMyBattle = useGameStore((s) => s.getMyBattle);
  const pvpCancel = useGameStore((s) => s.pvpCancel);

  const [bet, setBet] = useState<number | ''>(10000);
  const [searching, setSearching] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const balance = user?.balance || 0;

  // При монтировании — проверяем, нет ли уже матча
  useEffect(() => {
    getMyBattle();
  }, [getMyBattle]);

  // Polling когда есть активный матч
  useEffect(() => {
    if (!myBattle || myBattle.status === 'finished' || myBattle.status === 'cancelled') {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    pollRef.current = setInterval(() => {
      getMyBattle();
    }, 2000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [myBattle, getMyBattle]);

  // Таймер ожидания
  useEffect(() => {
    if (myBattle?.status === 'waiting') {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [myBattle]);

  // Если матч завершён — проигрываем звук
  useEffect(() => {
    if (myBattle?.status === 'finished') {
      const isWin = myBattle.winnerId === user?.id;
      playSound(isWin ? 'win' : 'click');
      try { WebApp.HapticFeedback?.notificationOccurred(isWin ? 'success' : 'error'); } catch {}
    }
  }, [myBattle?.status, myBattle?.winnerId, user?.id]);

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
    const res = await pvpMatchmake(bet, stats);
    setSearching(false);
    if (!res.success) {
      WebApp.showAlert(res.error || 'Ошибка');
    }
  };

  const handleCancel = async () => {
    if (await pvpCancel()) {
      setSearching(false);
      setElapsed(0);
    }
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
          <button className="pvparena-close-btn" onClick={handleClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="pvparena-body">
          <AnimatePresence mode="wait">

            {/* IDLE */}
            {(!myBattle || myBattle.status === 'cancelled') && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pvparena-game"
              >
                <div className="pvparena-intro">
                  <motion.div
                    className="pvparena-swords"
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Swords size={64} color="#ff8800" />
                  </motion.div>
                  <h3>Сразись с реальным игроком</h3>
                  <p>Поставь ставку — победитель забирает <strong>95%</strong> банка</p>
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
                      <button
                        key={qb}
                        onClick={() => setBet(qb)}
                        className="pvparena-quick-bet-btn"
                      >
                        {qb >= 1000000 ? `${qb / 1000000}M` : qb >= 1000 ? `${qb / 1000}K` : qb}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="pvparena-play-btn"
                  onClick={handleSearch}
                  disabled={searching || !bet}
                >
                  {searching ? 'ПОИСК СОПЕРНИКА...' : 'НАЙТИ ИГРУ'}
                </button>
              </motion.div>
            )}

            {/* WAITING */}
            {myBattle?.status === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pvparena-waiting"
              >
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
                  <span>{elapsed} сек</span>
                </div>
                <p className="pvparena-waiting-hint">
                  Ждём игрока с такой же ставкой. Обычно 5–30 секунд.
                </p>
                <button className="pvparena-cancel-btn" onClick={handleCancel}>
                  ОТМЕНИТЬ (вернуть ставку)
                </button>
              </motion.div>
            )}

            {/* FINISHED */}
            {myBattle?.status === 'finished' && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pvparena-finished"
              >
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
                    <div className="pvparena-result-stats">
                      <div className="pvparena-result-row">
                        <span>Твоё время:</span>
                        <strong>{myBattle.player1Id === user?.id ? myBattle.player1Time : myBattle.player2Time} сек</strong>
                      </div>
                      <div className="pvparena-result-row">
                        <span>Время соперника:</span>
                        <strong>{myBattle.player1Id === user?.id ? myBattle.player2Time : myBattle.player1Time} сек</strong>
                      </div>
                      <div className="pvparena-result-row highlight">
                        <TrendingUp size={16} />
                        <span>Выигрыш:</span>
                        <strong style={{ color: '#00d97e' }}>
                          +{((myBattle.player1Id === user?.id ? myBattle.player1CoinsChange : myBattle.player2CoinsChange) || 0).toLocaleString('ru-RU')} ₽
                        </strong>
                      </div>
                      <div className="pvparena-result-row">
                        <span>Рейтинг:</span>
                        <strong style={{ color: '#00d97e' }}>+15</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pvparena-result-icon lose">
                      <TrendingDown size={64} color="#ff4444" />
                    </div>
                    <h3 className="lose-text">ПОРАЖЕНИЕ</h3>
                    <div className="pvparena-result-stats">
                      <div className="pvparena-result-row">
                        <span>Твоё время:</span>
                        <strong>{myBattle.player1Id === user?.id ? myBattle.player1Time : myBattle.player2Time} сек</strong>
                      </div>
                      <div className="pvparena-result-row">
                        <span>Время соперника:</span>
                        <strong>{myBattle.player1Id === user?.id ? myBattle.player2Time : myBattle.player1Time} сек</strong>
                      </div>
                      <div className="pvparena-result-row highlight">
                        <TrendingDown size={16} />
                        <span>Потеря:</span>
                        <strong style={{ color: '#ff4444' }}>
                          {(myBattle.player1Id === user?.id ? myBattle.player1CoinsChange : myBattle.player2CoinsChange || 0).toLocaleString('ru-RU')} ₽
                        </strong>
                      </div>
                      <div className="pvparena-result-row">
                        <span>Рейтинг:</span>
                        <strong style={{ color: '#ff4444' }}>-10</strong>
                      </div>
                    </div>
                  </>
                )}

                <button
                  className="pvparena-play-btn"
                  onClick={() => {
                    // Сброс — можно искать заново
                    useGameStore.setState({ myBattle: null });
                  }}
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