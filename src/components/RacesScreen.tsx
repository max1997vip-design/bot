// src/components/RacesScreen.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { calculateStats } from '../config/items'; 
import WebApp from '@twa-dev/sdk';
import '../styles/races.css';

const getLeague = (rating: number) => {
  if (rating >= 2000) return { name: 'Легенда', color: '#ff0055', icon: '👑' };
  if (rating >= 1000) return { name: 'Платина', color: '#00e5ff', icon: '💎' };
  if (rating >= 600) return { name: 'Золото', color: '#ffd700', icon: '🥇' };
  if (rating >= 300) return { name: 'Серебро', color: '#c0c0c0', icon: '🥈' };
  if (rating >= 100) return { name: 'Бронза', color: '#cd7f32', icon: '🥉' };
  return { name: 'Новичок', color: '#aaaaaa', icon: '🚗' };
};

export const RacesScreen = () => {
  const equipped = useGameStore((s) => s.equipped);
  const startBotRace = useGameStore((s) => s.startBotRace);
  const reportPvpResult = useGameStore((s) => s.reportPvpResult);
  const user = useGameStore((s) => s.user);

  const [status, setStatus] = useState<'idle' | 'racing' | 'result'>('idle');
  const [raceData, setRaceData] = useState<any>(null);
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  const currentRating = user?.rating || 0;
  const league = getLeague(currentRating);

  const handleStartBotRace = async () => {
    if (status !== 'idle') return; 
    setStatus('racing');
    setRaceData(null);

    try {
      const res = await startBotRace();
      await new Promise(resolve => setTimeout(resolve, 3500));

      if (res.success && res.result) {
        setRaceData(res.result);
        setStatus('result');
        
        reportPvpResult({
          won: res.result.winner === 'player',
          ratingDelta: res.result.ratingChange,
          coinsDelta: res.result.reward
        });
      } else {
        setStatus('idle');
      }
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  const handlePvP = async () => {
    if (status !== 'idle') return;
    setStatus('racing');
    setRaceData(null);

    try {
      const initData = WebApp.initData || '';
      
      const fetchPromise = fetch('/api/game?action=pvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      }).then(r => r.json());

      // Ждем 3.5 сек для анимации, даже если сервер ответит быстрее
      const [data] = await Promise.all([
        fetchPromise,
        new Promise(resolve => setTimeout(resolve, 3500))
      ]);

      if (data.success) {
        setRaceData(data.result);
        setStatus('result');
        useGameStore.setState((state) => ({ 
          balance: data.newBalance,
          user: state.user ? { ...state.user, balance: data.newBalance, rating: data.newRating } : null
        })); 
      } else {
        setStatus('idle');
      }
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  const fetchLeaderboard = async () => {
    setShowLeaderboard(true);
    try {
      const res = await fetch(`/api/game?action=leaderboard&type=rating`);
      const data = await res.json();
      if (data.success) setLeaderboardData(data.players);
    } catch (e) { console.error(e); }
  };

  const getBarDurations = () => {
    if (!raceData) return { player: 3.5, opponent: 3.5 };
    const minTime = Math.min(raceData.playerTime, raceData.opponentTime);
    return {
      player: (raceData.playerTime / minTime) * 3.5,
      opponent: (raceData.opponentTime / minTime) * 3.5
    };
  };
  const durations = getBarDurations();

  return (
    <div className="races-screen">
      <div className="races-header" style={{ position: 'relative' }}>
        <h2>ТРЕК</h2>
        <button className="top-rating-btn" onClick={fetchLeaderboard}>🏆</button>
        
        <div className="league-badge" style={{ color: league.color }}>
          {league.icon} {league.name} ({currentRating})
        </div>
      </div>

      <div className="race-modes">
        <div className={`race-card ${status !== 'idle' ? 'disabled' : ''}`} onClick={handleStartBotRace} style={{ cursor: status === 'idle' ? 'pointer' : 'not-allowed', opacity: status === 'idle' ? 1 : 0.5 }}>
          <div className="race-icon">🤖</div>
          <h3>Тренировка с ботом</h3>
          <p>+1 рейтинг за победу</p>
        </div>
        
        <div className={`race-card pvp-card ${status !== 'idle' ? 'disabled' : ''}`} onClick={handlePvP} style={{ cursor: status === 'idle' ? 'pointer' : 'not-allowed', opacity: status === 'idle' ? 1 : 0.5 }}>
          <div className="race-icon">⚔️</div>
          <h3>PvP Гонка</h3>
          <p>Награда х5, +5 рейтинга</p>
        </div>
      </div>

      {/* ЕДИНЫЙ ОВЕРЛЕЙ ДЛЯ ГОНКИ И РЕЗУЛЬТАТА */}
      <AnimatePresence>
        {(status === 'racing' || status === 'result') && (
          <motion.div 
            key="race-overlay-container"
            className="race-overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            {status === 'racing' && (
              <div className="simulation-container">
                <h3 className="sim-title">Заезд 1000м...</h3>
                <div className="sim-track">
                  <span className="sim-label">Соперник</span>
                  <div className="sim-bar-bg">
                    <motion.div className="sim-bar-fill opponent" initial={{ scaleX: 0, transformOrigin: 'left' }} animate={{ scaleX: 1 }} transition={{ duration: 3.5, ease: "linear" }} style={{ width: '100%' }}>
                      <span className="car-icon" style={{ position: 'absolute', right: 0 }}>🏎️</span>
                    </motion.div>
                  </div>
                </div>
                <div className="sim-track">
                  <span className="sim-label">Вы</span>
                  <div className="sim-bar-bg">
                    <motion.div className="sim-bar-fill player" initial={{ scaleX: 0, transformOrigin: 'left' }} animate={{ scaleX: 1 }} transition={{ duration: 3.5, ease: "linear" }} style={{ width: '100%' }}>
                      <span className="car-icon" style={{ position: 'absolute', right: 0 }}>🚗</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {status === 'result' && raceData && (
              <motion.div 
                className="race-result-modal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <h2 className={raceData.winner === 'player' ? 'win-text' : 'lose-text'}>
                  {raceData.winner === 'player' ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ'}
                </h2>
                {raceData.ratingChange !== undefined && (
                  <p style={{ color: raceData.ratingChange > 0 ? '#00FF41' : '#ff4444', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>
                    Рейтинг: {raceData.ratingChange > 0 ? '+' : ''}{raceData.ratingChange}
                  </p>
                )}
                <div className="race-log">
                  {raceData.log.map((line: string, i: number) => <p key={i}>{line}</p>)}
                </div>
                <button className="race-close-btn" onClick={() => setStatus('idle')}>Закрыть</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaderboard && (
          <motion.div className="race-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="leaderboard-modal">
              <div className="lb-header">
                <h3>Топ Рейтинга</h3>
                <button className="close-btn" onClick={() => setShowLeaderboard(false)}>✕</button>
              </div>
              <div className="lb-list">
                {leaderboardData.map((p, i) => (
                  <div key={p.id} className={`lb-row ${p.id === user?.id ? 'me' : ''}`}>
                    <span className="lb-rank">{i + 1}</span>
                    <span className="lb-name">{p.firstName || 'Гонщик'}</span>
                    <span className="lb-value">{p.rating} 🏁</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};