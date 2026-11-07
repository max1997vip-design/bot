// src/components/RaceScreen.tsx
import React, { useCallback, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ClipboardList, Flag } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { PAINT_COLORS } from '../config/garage';
import { CARS } from '../config/cars';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import { QuestModal } from './QuestModal';
import { PassScreen } from './PassScreen';
import { TintedCarImage } from './TintedCarImage';
import '../styles/race.css';
import '../styles/races.css';

const FLASH_DURATION_MS = 110;

interface FloatingText {
  id: number;
  x: number;
  y: number;
  value: number;
}

const CarClicker = memo(({ 
  isFlashing, 
  isRejected, 
  carColor, 
  activeCar, 
  carStyles, 
  onPointerDown 
}: any) => {
  const activeColorHex = PAINT_COLORS.find((c: any) => c.id === carColor)?.hex || 'transparent';
  const isPlaceholder = !activeCar.image || activeCar.image.includes('placeholder');

  return (
    <div
      className={`race-car-container ${isRejected ? 'rejected' : ''}`}
      onPointerDown={onPointerDown}
      style={carStyles}
    >
      <motion.div
        whileTap={{ scale: 0.96 }}
        className="race-car-wrapper"
        style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <span style={{ 
          fontSize: '120px', position: 'absolute', zIndex: 0,
          opacity: isPlaceholder ? 1 : 0, transition: 'opacity 0.3s ease'
        }}>
          🏎️
        </span>

        {!isPlaceholder && (
          <TintedCarImage
            imageUrl={activeCar.image}
            colorHex={activeColorHex}
            className="race-car-image"
            style={{
              filter: 'none',
              transition: 'opacity 0.3s ease',
              position: 'relative', zIndex: 1
            }}
          />
        )}
      </motion.div>
    </div>
  );
});

export function RaceScreen() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rejectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textIdCounter = useRef(0);

  const tap = useGameStore((s) => s.tap);
  const balance = useGameStore((s) => s.balance); 
  const carColor = useGameStore((s) => s.carColor);
  
  const user = useGameStore((s) => s.user);
  const upgradeClicker = useGameStore((s) => s.upgradeClicker);
  const upgradeOffline = useGameStore((s) => s.upgradeOffline);

  
  const xp = user?.xp || 0;
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpNextLevel = Math.pow(level, 2) * 100;
  const progress = Math.min(100, Math.max(0, ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100));

  const activeCarId = user?.activeCarId || 'vaz-2107';
  const activeCar = CARS[activeCarId] || CARS['vaz-2107'];

  const clickLevel = user?.clickLevel || 1;
  const offlineLevel = user?.offlineLevel || 1;
  const clickCost = Math.floor(1000 * Math.pow(1.5, clickLevel - 1));
  const offlineCost = Math.floor(5000 * Math.pow(1.8, offlineLevel - 1));

  const canUpgrade = balance >= clickCost || balance >= offlineCost;
  const hasPassRewards = false; // заглушка

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const before = useGameStore.getState().balance;
    tap();
    const after = useGameStore.getState().balance;
    const accepted = after > before;

    if (accepted) {
      playSound('click');
      try { WebApp.HapticFeedback?.impactOccurred('light'); } catch {}

      setIsFlashing(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setIsFlashing(false), FLASH_DURATION_MS);

      const newText: FloatingText = {
        id: textIdCounter.current++,
        x: e.clientX,
        y: e.clientY - 50,
        value: clickLevel
      };
      
      setFloatingTexts(prev => [...prev, newText]);

      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
      }, 800);

    } else {
      setIsRejected(true);
      if (rejectTimer.current) clearTimeout(rejectTimer.current);
      rejectTimer.current = setTimeout(() => setIsRejected(false), 160);
    }
  }, [tap, clickLevel]);

  const carStyles = {
    '--left-hl-x': activeCar.leftHeadlight?.x || '30%',
    '--left-hl-y': activeCar.leftHeadlight?.y || '50%',
    '--right-hl-x': activeCar.rightHeadlight?.x || '70%',
    '--right-hl-y': activeCar.rightHeadlight?.y || '50%',
  } as React.CSSProperties;

  return (
    <div className="race-screen">
      <div className="race-scene">
        <div className="race-background" />
        <div className="race-background-overlay" />

        <AnimatePresence>
          {floatingTexts.map(text => (
            <motion.div
              key={text.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -120, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: 'fixed',
                left: text.x,
                top: text.y,
                color: 'var(--gold)',
                fontSize: '24px',
                fontWeight: '900',
                fontFamily: 'Impact, sans-serif',
                textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255,215,0,0.6)',
                pointerEvents: 'none',
                zIndex: 9999,
                userSelect: 'none',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              +{text.value} <span className="currency-ruble">₽</span>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="race-top-ui">
          <div className="race-hud">
            <span className="race-hud-coins">{Math.floor(balance).toLocaleString('ru-RU')}</span>
            <span className="currency-ruble sm" style={{ marginLeft: 4 }}>₽</span>
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

        <CarClicker 
          isFlashing={isFlashing}
          isRejected={isRejected}
          carColor={carColor}
          activeCar={activeCar}
          carStyles={carStyles}
          onPointerDown={handlePointerDown}
        />

        {/* ВЕРТИКАЛЬНАЯ ПАНЕЛЬ ДЕЙСТВИЙ */}
        <div className="race-action-panel">
          <button
            onClick={() => setShowQuests(true)}
            className="race-action-btn"
            style={{ '--btn-color': '#ff8c00' } as any}
          >
            <ClipboardList size={22} />
            <span className="race-action-label">Задания</span>
          </button>

          <button
            onClick={() => setShowPass(true)}
            className="race-action-btn"
            style={{ '--btn-color': 'var(--accent)' } as any}
          >
            <Flag size={22} />
            <span className="race-action-label">Пропуск</span>
            {hasPassRewards && <span className="race-action-badge">!</span>}
          </button>

          <button
            onClick={() => setShowUpgrades(true)}
            className="race-action-btn"
            style={{ '--btn-color': 'var(--success)' } as any}
          >
            <Zap size={22} />
            <span className="race-action-label">Апгрейд</span>
            {canUpgrade && <span className="race-action-badge dot" />}
          </button>
        </div>

        {showQuests && <QuestModal onClose={() => setShowQuests(false)} />}
        {showPass && <PassScreen onClose={() => setShowPass(false)} />}

        {/* МОДАЛКА УЛУЧШЕНИЙ */}
        <AnimatePresence>
          {showUpgrades && (
            <motion.div
              className="race-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgrades(false)}
            >
              <motion.div
                className="race-modal-content"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="race-modal-header">
                  <h2>
                    <Zap size={18} color="var(--success)" /> УЛУЧШЕНИЯ
                  </h2>
                  <button className="race-modal-close" onClick={() => setShowUpgrades(false)}>
                    ✕
                  </button>
                </div>

                {/* 👇 ОБЁРНУТО В race-modal-body для скролла */}
                <div className="race-modal-body">
                  <div className="race-upgrade-card">
                    <div className="race-upgrade-icon" style={{ background: 'rgba(0,217,126,0.15)', border: '1px solid rgba(0,217,126,0.3)' }}>
                      <Zap size={24} color="var(--success)" />
                    </div>
                    <div className="race-upgrade-info">
                      <div className="race-upgrade-title">Сила клика</div>
                      <div className="race-upgrade-desc">+1 ₽ за клик</div>
                      <div className="race-upgrade-level" style={{ color: 'var(--success)' }}>
                        Уровень: {clickLevel}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        upgradeClicker();
                        playSound('coin');
                      }}
                      disabled={balance < clickCost}
                      className="race-upgrade-buy"
                      style={{
                        background: balance >= clickCost ? 'linear-gradient(90deg, var(--success), var(--success-dim))' : '#333',
                        color: balance >= clickCost ? '#000' : '#666',
                      }}
                    >
                      {clickCost.toLocaleString('ru-RU')} ₽
                    </button>
                  </div>

                  <div className="race-upgrade-card">
                    <div className="race-upgrade-icon" style={{ background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.3)' }}>
                      <Zap size={24} color="var(--accent)" />
                    </div>
                    <div className="race-upgrade-info">
                      <div className="race-upgrade-title">Оффлайн-доход</div>
                      <div className="race-upgrade-desc">+500 ₽/час</div>
                      <div className="race-upgrade-level" style={{ color: 'var(--accent)' }}>
                        Уровень: {offlineLevel}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        upgradeOffline();
                        playSound('coin');
                      }}
                      disabled={balance < offlineCost}
                      className="race-upgrade-buy"
                      style={{
                        background: balance >= offlineCost ? 'linear-gradient(90deg, var(--accent), var(--accent-dim))' : '#333',
                        color: balance >= offlineCost ? '#000' : '#666',
                      }}
                    >
                      {offlineCost.toLocaleString('ru-RU')} ₽
                    </button>
                  </div>
                </div>
                {/* 👆 КОНЕЦ race-modal-body */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}