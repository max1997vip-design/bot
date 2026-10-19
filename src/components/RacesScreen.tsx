// src/components/RacesScreen.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { calculateStats } from '../config/items'; // <-- Используем calculateStats вместо getRacingStats
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
  const { equipped, startBotRace, user } = useGameStore(); // <-- Берем equipped
  const [status, setStatus] = useState<'idle' | 'racing' | 'result'>('idle');
  const [raceData, setRaceData] = useState<any>(null);
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  const stats = calculateStats(equipped); // <-- Считаем статы
  const currentRating = user?.rating || 0;
  const league = getLeague(currentRating);

  const handleStartBotRace = async () => {
    setStatus('racing');
    setRaceData(null);
    try {
      const res = await startBotRace();
      if (res.success) setRaceData(res.result);
      else setStatus('idle');
    } catch (e) { console.error(e); setStatus('idle'); }
  };

  const handlePvP = async () => {
    setStatus('racing');
    setRaceData(null);
    try {
      const initData = WebApp.initData || '';
      const res = await fetch('/api/game?action=pvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.success) {
        setRaceData(data.result);
        useGameStore.setState({ 
          balance: data.newBalance,
          user: user ? { ...user, balance: data.newBalance, rating: data.newRating } : null
        }); 
      } else setStatus('idle');
    } catch (e) { console.error(e); setStatus('idle'); }
  };

  const fetchLeaderboard = async () => {
    setShowLeaderboard(true);
    try {
      const res = await fetch(`/api/game?action=leaderboard&type=rating`);
      const data = await res.json();
      if (data.success) setLeaderboardData(data.players);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (status === 'racing' && raceData) {
      const timer = setTimeout(() => setStatus('result'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, raceData]);

  const getBarDurations = () => {
    if (!raceData) return { player: 3, opponent: 3 };
    const minTime = Math.min(raceData.playerTime, raceData.opponentTime);
    return {
      player: (raceData.playerTime / minTime) * 3,
      opponent: (raceData.opponentTime / minTime) * 3
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
        <div className="race-card" onClick={handleStartBotRace} style={{ cursor: 'pointer' }}>
          <div className="race-icon">🤖</div>
          <h3>Тренировка с ботом</h3>
          <p>+1 рейтинг за победу</p>
        </div>
        
        <div className="race-card pvp-card" onClick={handlePvP} style={{ cursor: 'pointer' }}>
          <div className="race-icon">⚔️</div>
          <h3>PvP Гонка</h3>
          <p>Награда х5, +5 рейтинга</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'racing' && (
          <motion.div key="racing" className="race-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <div className="simulation-container">
              <h3 className="sim-title">Заезд 1000м...</h3>
              
              <div className="sim-track">
                <span className="sim-label">Соперник</span>
                <div className="sim-bar-bg">
                  <motion.div className="sim-bar-fill opponent" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: raceData ? durations.opponent : 3, ease: "linear" }}>
                    <span className="car-icon">🏎️</span>
                  </motion.div>
                </div>
              </div>

              <div className="sim-track">
                <span className="sim-label">Вы</span>
                <div className="sim-bar-bg">
                  <motion.div className="sim-bar-fill player" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: raceData ? durations.player : 3, ease: "linear" }}>
                    <span className="car-icon">🚗</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'result' && raceData && (
          <motion.div key="result" className="race-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="race-result-modal">
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
            </div>
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