// src/components/RaceScreen.tsx
import { useCallback, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PAINT_COLORS } from '../config/garage';
import { CARS } from '../config/cars';

const FLASH_DURATION_MS = 110;

export function RaceScreen() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rejectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tap = useGameStore((s) => s.tap);
  const balance = useGameStore((s) => s.balance);
  const carColor = useGameStore((s) => s.carColor);
  
  const user = useGameStore((s) => s.user);
  const upgradeClicker = useGameStore((s) => s.upgradeClicker);
  const upgradeOffline = useGameStore((s) => s.upgradeOffline);

  const activeColorHex = PAINT_COLORS.find((c) => c.id === carColor)?.hex || 'transparent';
  const isOriginal = carColor === 'original';

  const totalEarned = user?.totalEarned || 0;
  const level = Math.floor(Math.sqrt(totalEarned / 50)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 50;
  const xpNextLevel = Math.pow(level, 2) * 50;
  const progress = Math.min(100, ((totalEarned - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100);

  const activeCarId = user?.activeCarId || 'audi-tt';
  const activeCar = CARS[activeCarId] || CARS['audi-tt'];

  const clickLevel = user?.clickLevel || 1;
  const offlineLevel = user?.offlineLevel || 1;
  const clickCost = Math.floor(1000 * Math.pow(1.5, clickLevel - 1));
  const offlineCost = Math.floor(5000 * Math.pow(1.8, offlineLevel - 1));

  const onCarClick = useCallback(() => {
    const before = useGameStore.getState().balance;
    tap();
    const after = useGameStore.getState().balance;
    const accepted = after > before;

    if (accepted) {
      setIsFlashing(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setIsFlashing(false), FLASH_DURATION_MS);
    } else {
      setIsRejected(true);
      if (rejectTimer.current) clearTimeout(rejectTimer.current);
      rejectTimer.current = setTimeout(() => setIsRejected(false), 160);
    }
  }, [tap]);

  const carStyles = {
    '--left-hl-x': activeCar.leftHeadlight.x,
    '--left-hl-y': activeCar.leftHeadlight.y,
    '--right-hl-x': activeCar.rightHeadlight.x,
    '--right-hl-y': activeCar.rightHeadlight.y,
  } as React.CSSProperties;

  return (
    <div className="race-screen">
      <div className="race-background" />
      <div className="race-background-overlay" />

      <div className="race-top-ui">
        <div className="race-hud">
          <span className="race-hud-coins">{Math.floor(balance).toLocaleString('ru-RU')}</span>
        </div>
        <div className="race-level-bar-wrapper">
          <div className="race-level-text">
            <span>LVL {level}</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="race-xp-bar">
            <div className="race-xp-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* ЛЕВАЯ ПАНЕЛЬ: КЛИКЕР */}
      <div style={{ position: 'absolute', left: '10px', top: '35%', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={upgradeClicker}
          style={{ 
            background: 'rgba(0,255,65,0.15)', border: '1px solid #00FF41', borderRadius: '12px', 
            padding: '10px', color: 'white', backdropFilter: 'blur(5px)', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px'
          }}
        >
          <span style={{ fontSize: '20px' }}>💪</span>
          <span style={{ fontSize: '10px', color: '#ccc', marginTop: '2px' }}>LVL {clickLevel}</span>
          <span style={{ fontSize: '11px', color: '#ffd700', fontWeight: 'bold', marginTop: '2px' }}>{clickCost} 🪙</span>
        </button>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ: ОФФЛАЙН */}
      <div style={{ position: 'absolute', right: '10px', top: '35%', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={upgradeOffline}
          style={{ 
            background: 'rgba(0,191,255,0.15)', border: '1px solid #00bfff', borderRadius: '12px', 
            padding: '10px', color: 'white', backdropFilter: 'blur(5px)', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px'
          }}
        >
          <span style={{ fontSize: '20px' }}>⏱️</span>
          <span style={{ fontSize: '10px', color: '#ccc', marginTop: '2px' }}>LVL {offlineLevel}</span>
          <span style={{ fontSize: '11px', color: '#ffd700', fontWeight: 'bold', marginTop: '2px' }}>{offlineCost} 🪙</span>
        </button>
      </div>

      <div
        className={`race-car-container ${isRejected ? 'rejected' : ''}`}
        onClick={onCarClick}
        style={carStyles}
      >
        <div className="race-car-wrapper">
          <img
            src={activeCar.image}
            alt={activeCar.name}
            className="race-car-image"
            draggable={false}
            style={{
              filter: isOriginal 
                ? 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))' 
                : 'grayscale(1) brightness(1.1) contrast(1.2) drop-shadow(0 15px 15px rgba(0,0,0,0.6))',
              transition: 'filter 0.4s ease',
            }}
          />
          {!isOriginal && (
            <div className="race-color-overlay" style={{ backgroundColor: activeColorHex }} />
          )}
        </div>

        <div className={`headlight-glow ${isFlashing ? 'flash' : ''}`} />
        <div className={`headlight-halo ${isFlashing ? 'flash' : ''}`} />
      </div>
    </div>
  );
}