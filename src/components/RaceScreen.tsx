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

  // Вычисляем цвет и проверяем, выбран ли оригинал
  const activeColorHex = PAINT_COLORS.find((c) => c.id === carColor)?.hex || 'transparent';
  const isOriginal = carColor === 'original';

  // Получаем totalEarned для расчета уровня
  const totalEarned = useGameStore((s) => s.user?.totalEarned || 0);

  // Формула расчета уровня
  const level = Math.floor(Math.sqrt(totalEarned / 50)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 50;
  const xpNextLevel = Math.pow(level, 2) * 50;
  const progress = Math.min(
    100,
    ((totalEarned - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100
  );

  const activeCarId = useGameStore((s) => s.user?.activeCarId || 'audi-tt');
  const activeCar = CARS[activeCarId] || CARS['audi-tt'];

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
        {/* HUD (только баланс, без множителя) */}
        <div className="race-hud">
          <span className="race-hud-coins">{Math.floor(balance).toLocaleString('ru-RU')}</span>
        </div>

        {/* ПОЛОСКА УРОВНЯ */}
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

      <div
        className={`race-car-container ${isRejected ? 'rejected' : ''}`}
        onClick={onCarClick}
        style={carStyles}
      >
        {/* Обертка для наложения цвета */}
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
          
          {/* Цветной слой */}
          {!isOriginal && (
            <div
              className="race-color-overlay"
              style={{ backgroundColor: activeColorHex }}
            />
          )}
        </div>

        <div className={`headlight-glow ${isFlashing ? 'flash' : ''}`} />
        <div className={`headlight-halo ${isFlashing ? 'flash' : ''}`} />
      </div>
    </div>
  );
}