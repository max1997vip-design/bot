// src/components/RacesScreen.tsx
import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound';
import { CARS } from '../config/cars';
import { simulateRacePhysics, CarPhysics } from '../utils/raceEngine';
import { LeagueBadge } from './LeagueBadge';
import { getLeagueByPoints, getNextLeague } from '../config/leagues';
import '../styles/races.css';

type RacePhase = 'idle' | 'racing' | 'finish';

export const RacesScreen = () => {
  const user = useGameStore((s) => s.user);
  const reportPvpResult = useGameStore((s) => s.reportPvpResult);
  const addLeaguePoints = useGameStore((s) => s.addLeaguePoints);
  
  const [view, setView] = useState<'menu' | 'racing' | 'result'>('menu');
  const [raceResult, setRaceResult] = useState<any>(null);
  const [racePhase, setRacePhase] = useState<RacePhase>('idle');
  const [leaguePointsEarned, setLeaguePointsEarned] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Рефы для прямого доступа к DOM
  const raceStageRef = useRef<HTMLDivElement>(null);
  const playerCarRef = useRef<HTMLDivElement>(null);
  const opponentCarRef = useRef<HTMLDivElement>(null);
  const playerProgressRef = useRef<HTMLDivElement>(null);
  const opponentProgressRef = useRef<HTMLDivElement>(null);
  
  // ДВА РАЗНЫХ РЕФА ДЛЯ СКОРОСТИ (HUD и Спидометр)
  const hudSpeedTextRef = useRef<HTMLSpanElement>(null);
  const speedometerValueRef = useRef<HTMLSpanElement>(null);
  
  const speedometerFillRef = useRef<SVGCircleElement>(null);
  const speedLinesContainerRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const activeCarId = user?.activeCarId || 'vaz-2107';
  const activeCar = CARS[activeCarId] || CARS['vaz-2107'];
  const leaguePoints = user?.leaguePoints ?? 0;
  const league = getLeagueByPoints(leaguePoints);
  const nextLeague = getNextLeague(league.id);
  
  const playerCarImage = `/cars/side/${activeCarId}.png`;

  const playerPhysics: CarPhysics = { power: 719, topSpeed: 719, accel: 6.5, grip: 100, handling: 100 };
  const opponentPhysics: CarPhysics = { power: 656, topSpeed: 656, accel: 6.2, grip: 95, handling: 95 };

  // Сброс при входе в меню
  useEffect(() => {
    if (view === 'menu') {
      if (playerCarRef.current) playerCarRef.current.style.transform = 'translate3d(0px, 0, 0)';
      if (opponentCarRef.current) opponentCarRef.current.style.transform = 'translate3d(0px, 0, 0)';
      if (playerProgressRef.current) playerProgressRef.current.style.width = '0%';
      if (opponentProgressRef.current) opponentProgressRef.current.style.width = '0%';
      if (hudSpeedTextRef.current) hudSpeedTextRef.current.textContent = '0';
      if (speedometerValueRef.current) speedometerValueRef.current.textContent = '0';
      if (speedometerFillRef.current) speedometerFillRef.current.style.strokeDashoffset = '283';
      
      // Сброс классов NOS
      playerCarRef.current?.classList.remove('max-speed-glow');
      opponentCarRef.current?.classList.remove('max-speed-glow');
      speedLinesContainerRef.current?.classList.remove('is-max');
      vignetteRef.current?.classList.remove('is-max');
    }
  }, [view]);

  const handleStartRace = () => {
    playSound('click');
    setView('racing');
    setRacePhase('racing');
    setLeaguePointsEarned(0);

    setTimeout(() => {
      const result = simulateRacePhysics(playerPhysics, opponentPhysics, 'Turbo Rider');
      setRaceResult(result);
      startAnimation(result.ticks, result); 
    }, 1000);
  };

  const startAnimation = (ticks: any[], result: any) => {
    const duration = 4500;
    const startTime = performance.now();
    
    const stageWidth = raceStageRef.current?.clientWidth || 320;
    const carWidth = 120;
    const finishOffset = 60;
    
    const maxDistance = Math.max(180, stageWidth - carWidth - finishOffset);
    const isPlayerWinner = result.winner === 'player';
    
    const relativeGap = Math.abs(ticks[0].playerDist - ticks[0].opponentDist) / Math.max(1, ticks[0].playerDist, ticks[0].opponentDist);
    const finishGap = Math.min(92, 52 + relativeGap * 260);
    const loserDistance = Math.max(150, maxDistance - finishGap);
    
    const playerTarget = isPlayerWinner ? maxDistance : loserDistance;
    const opponentTarget = isPlayerWinner ? loserDistance : maxDistance;

    let nosTriggered = false;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 2.4);
      
      const playerX = eased * playerTarget;
      const opponentX = eased * opponentTarget;
      
      // ПРЯМОЕ ОБНОВЛЕНИЕ DOM
      if (playerCarRef.current) playerCarRef.current.style.transform = `translate3d(${playerX}px, 0, 0)`;
      if (opponentCarRef.current) opponentCarRef.current.style.transform = `translate3d(${opponentX}px, 0, 0)`;
      
      if (playerProgressRef.current) playerProgressRef.current.style.width = `${Math.min(100, (playerX / maxDistance) * 100)}%`;
      if (opponentProgressRef.current) opponentProgressRef.current.style.width = `${Math.min(100, (opponentX / maxDistance) * 100)}%`;

      // ОБНОВЛЕНИЕ СКОРОСТИ В HUD И СПИДОМЕТРЕ (разные рефы)
      const currentSpd = Math.round(playerPhysics.topSpeed * progress);
      if (hudSpeedTextRef.current) hudSpeedTextRef.current.textContent = currentSpd.toString();
      if (speedometerValueRef.current) speedometerValueRef.current.textContent = currentSpd.toString();
      
      if (speedometerFillRef.current) {
        const offset = 283 - (283 * (currentSpd / (playerPhysics.topSpeed || 1)));
        speedometerFillRef.current.style.strokeDashoffset = offset.toString();
      }

      // УПРАВЛЕНИЕ NOS ЧЕРЕЗ DOM (БЕЗ РЕРЕНДЕРА REACT)
      if (progress > 0.7 && progress < 0.95) {
        if (!nosTriggered) {
          nosTriggered = true;
          playerCarRef.current?.classList.add('max-speed-glow');
          opponentCarRef.current?.classList.add('max-speed-glow');
          speedLinesContainerRef.current?.classList.add('is-max');
          vignetteRef.current?.classList.add('is-max');
        }
      } else {
        if (nosTriggered) {
          nosTriggered = false;
          playerCarRef.current?.classList.remove('max-speed-glow');
          opponentCarRef.current?.classList.remove('max-speed-glow');
          speedLinesContainerRef.current?.classList.remove('is-max');
          vignetteRef.current?.classList.remove('is-max');
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRacePhase('finish');
        
        const pointsDelta = isPlayerWinner ? league.winPoints : league.losePoints;
        setLeaguePointsEarned(pointsDelta);
        addLeaguePoints(pointsDelta);

        setTimeout(() => {
          setView('result');
          if (result.winner === 'player') playSound('win');
          reportPvpResult({
            won: result.winner === 'player',
            ratingDelta: result.winner === 'player' ? 15 : -10,
            coinsDelta: result.winner === 'player' ? 3000 : 0
          });
        }, 400);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleBackToMenu = () => {
    setView('menu');
    setRacePhase('idle');
  };

  const fakeLeaderboard = [
    { id: 1, name: 'Turbo Rider', points: 1540, isMe: false },
    { id: 2, name: 'Dev (Вы)', points: leaguePoints, isMe: true },
    { id: 3, name: 'Neon Racer', points: 1200, isMe: false },
    { id: 4, name: 'NightRider', points: 980, isMe: false },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="races-screen">
      <div className="races-header">
        <h2>ТРЕК</h2>
      </div>

      {view === 'menu' && (
        <div className="race-hub">
          <div className="race-hub-heading">
            <h1>Гонки</h1>
            <p>Выберите формат и выходите на старт</p>
          </div>

          <button className="league-badge-button" onClick={() => setShowLeaderboard(true)}>
             <LeagueBadge />
          </button>

          <button className="race-mode-primary" onClick={handleStartRace}>
            <div className="race-mode-bg-glow"></div>
            <span className="race-icon">🏁</span>
            <div className="race-mode-info">
              <strong>Быстрая гонка</strong>
              <small>Подбор по скорости: {playerPhysics.topSpeed} км/ч</small>
            </div>
            <span className="race-mode-action">Начать заезд</span>
          </button>

          <div className="race-extra-modes">
            <div className="race-extra-card">
              <span className="extra-icon">🏆</span>
              <div>
                <strong>Турнир</strong>
                <small>Скоро</small>
              </div>
            </div>
            <div className="race-extra-card">
              <span className="extra-icon">⏳</span>
              <div>
                <strong>На время</strong>
                <small>Скоро</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'racing' && (
        <div className="premium-race-container">
          <LeagueBadge />

          <div className="online-versus-card">
            <article className="racer-profile">
              <div className="racer-avatar">
                <img src={user?.photoUrl || ''} alt="" referrerPolicy="no-referrer" draggable="false" />
              </div>
              <div className="racer-meta">
                <small>Вы</small>
                <strong>{user?.firstName || 'Игрок'}</strong>
                <span>{activeCar.name}</span>
                <em>PX · {playerPhysics.topSpeed} км/ч</em>
              </div>
            </article>

            <div className="versus-badge">VS</div>

            <article className="racer-profile enemy-profile found">
              <div className="racer-avatar enemy"><span>PX</span></div>
              <div className="racer-meta">
                <small>Соперник</small>
                <strong>Turbo Rider</strong>
                <span>Solivane Apex PX</span>
                <em>PX · {opponentPhysics.topSpeed} км/ч</em>
              </div>
            </article>
          </div>

          <div 
            ref={raceStageRef}
            className={`race-stage ${racePhase === 'racing' ? 'is-racing' : ''} ${racePhase === 'finish' ? 'is-finishing' : ''}`} 
            id="race-stage"
          >
            <div className="race-sky">
              <div className="race-sun"></div>
              <div className="race-city"></div>
            </div>
            
            <div className="race-horizon"></div>
            <div className="race-road-bg"></div>

            <div className="race-track-hud">
              <span>NEON SPRINT · 1/4 МИЛИ</span>
              <strong><span ref={hudSpeedTextRef}>0</span> км/ч</strong>
            </div>

            <div className="race-lane lane-one">
              <div className="lane-label">ВЫ <span>{playerPhysics.topSpeed}</span></div>
              <div className="road-marks-inner"></div>
              <div className="finish-line-inner"></div>
              <div 
                ref={playerCarRef}
                className="race-car" 
                id="my-race-car"
              >
                <img 
                  className="paintable-car paint-gloss" 
                  src={playerCarImage} 
                  alt={activeCar.name}
                  onError={(e) => { e.currentTarget.src = '/cars/side/vaz-2107.png'; }}
                />
              </div>
            </div>

            <div className="race-lane lane-two">
                <div className="lane-label">TURBO RIDER <span>{opponentPhysics.topSpeed}</span></div>
                <div className="road-marks-inner"></div>
                <div className="finish-line-inner"></div>
                <div 
                 ref={opponentCarRef}
                 className="race-car enemy-car-sprite" 
                 id="enemy-race-car"
              >
                <img 
                 src="/cars/side/vaz-2107.png" 
                 alt="Соперник" 
                 className="enemy-img"
                />
              </div>
            </div>

            <div className="race-side-barrier left"></div>
            <div className="race-side-barrier right"></div>

            <div ref={speedLinesContainerRef} className="speed-lines-container">
              <div className="speed-line"></div>
              <div className="speed-line"></div>
              <div className="speed-line"></div>
              <div className="speed-line"></div>
              <div className="speed-line"></div>
            </div>
            
            <div ref={vignetteRef} className="race-vignette"></div>

            <div className="speedometer">
              <svg className="speedometer-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="speedometer-track" />
                <circle 
                  ref={speedometerFillRef}
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="speedometer-fill" 
                  style={{ strokeDasharray: 283, strokeDashoffset: 283 }} 
                />
              </svg>
              <div className="speedometer-content">
                <span className="speedometer-value" ref={speedometerValueRef}>0</span>
                <span className="speedometer-unit">км/ч</span>
              </div>
            </div>

            <div className="race-guardrail"></div>
          </div>

          <div className="bottom-progress-bars">
            <div className="progress-row">
              <span className="progress-label">ВЫ</span>
              <div className="progress-track">
                <div ref={playerProgressRef} className="progress-fill green" style={{ width: '0%' }} />
              </div>
            </div>
            <div className="progress-row">
              <span className="progress-label">СОПЕРНИК</span>
              <div className="progress-track">
                <div ref={opponentProgressRef} className="progress-fill red" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'result' && raceResult && (
        <div className="race-result-modal">
          <div className="race-result-content">
            <h2 className={raceResult.winner === 'player' ? 'win-text' : 'lose-text'}>
              {raceResult.winner === 'player' ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ'}
            </h2>

            <div className="league-result">
              <span className="league-result-icon">{league.icon}</span>
              <span className="league-result-label">{league.name}</span>
              <span className={`league-result-points ${leaguePointsEarned >= 0 ? 'positive' : 'negative'}`}>
                {leaguePointsEarned >= 0 ? '+' : ''}{leaguePointsEarned} очков
              </span>
            </div>

            {nextLeague && leaguePointsEarned > 0 && (
              <div className="league-next-hint">
                До {nextLeague.name}: {Math.max(0, nextLeague.minPoints - (leaguePoints + leaguePointsEarned))} очков
              </div>
            )}

            <div className="race-log">
              {Array.isArray(raceResult.log) ? (
                raceResult.log.map((line: any, i: number) => (
                  <p key={i}>{typeof line === 'string' ? line : JSON.stringify(line)}</p>
                ))
              ) : (
                <p>Гонка завершена!</p>
              )}
            </div>
            
            <button className="race-close-btn" onClick={handleBackToMenu}>
              В МЕНЮ
            </button>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div className="leaderboard-modal">
          <div className="leaderboard-content">
            <div className="leaderboard-header">
              <span className="leaderboard-icon">{league.icon}</span>
              <h2>{league.name} Лига</h2>
              <p>Топ игроков ранга</p>
            </div>
            
            <div className="leaderboard-list">
              {fakeLeaderboard.map((player, idx) => (
                <div key={player.id} className={`leaderboard-row ${player.isMe ? 'is-me' : ''}`}>
                  <span className="leaderboard-place">{idx + 1}</span>
                  <span className="leaderboard-name">{player.name}</span>
                  <span className="leaderboard-points">{player.points} очк.</span>
                </div>
              ))}
            </div>

            <button className="leaderboard-close-btn" onClick={() => setShowLeaderboard(false)}>
              ЗАКРЫТЬ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};