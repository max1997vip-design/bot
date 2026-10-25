// src/components/RacesScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound';
import '../styles/races.css';

// 👇 Экспорт именованный (с const), чтобы CityScreen мог его импортировать
export const RacesScreen = () => {
  const startBotRace = useGameStore((s) => s.startBotRace);
  const reportPvpResult = useGameStore((s) => s.reportPvpResult);
  const user = useGameStore((s) => s.user);

  const [status, setStatus] = useState<'idle' | 'racing' | 'result'>('idle');
  const [raceData, setRaceData] = useState<any>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

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

        if (res.result.winner === 'player') {
          playSound('win');
        }

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
      </div>

      <div className="race-modes">
        <div
          className={`race-card ${status !== 'idle' ? 'disabled' : ''}`}
          onClick={handleStartBotRace}
          style={{ cursor: status === 'idle' ? 'pointer' : 'not-allowed', opacity: status === 'idle' ? 1 : 0.5 }}
        >
          <div className="race-icon">🤖</div>
          <h3>Тренировка с ботом</h3>
          <p>+1 рейтинг за победу</p>
        </div>
      </div>

      <AnimatePresence>
        {(status === 'racing' || status === 'result') && (
          <motion.div
            className="race-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'translateZ(0)', isolation: 'isolate'
            }}
          >
            {status === 'racing' && (
              <motion.div
                className="simulation-container"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              >
                <h3 className="sim-title">Заезд 1000м...</h3>
                <div className="sim-track">
                  <span className="sim-label">Соперник</span>
                  <div className="sim-bar-bg">
                    <motion.div className="sim-bar-fill opponent" initial={{ scaleX: 0, transformOrigin: 'left' }} animate={{ scaleX: 1 }} transition={{ duration: durations.opponent, ease: 'linear' }} style={{ width: '100%' }}>
                      <span className="car-icon" style={{ position: 'absolute', right: 0 }}>🏎️</span>
                    </motion.div>
                  </div>
                </div>
                <div className="sim-track">
                  <span className="sim-label">Вы</span>
                  <div className="sim-bar-bg">
                    <motion.div className="sim-bar-fill player" initial={{ scaleX: 0, transformOrigin: 'left' }} animate={{ scaleX: 1 }} transition={{ duration: durations.player, ease: 'linear' }} style={{ width: '100%' }}>
                      <span className="car-icon" style={{ position: 'absolute', right: 0 }}>🚗</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'result' && raceData && (
              <motion.div
                className="race-result-modal"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
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
            <motion.div
              className="leaderboard-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};