// src/components/RaceScreen.tsx
import React, { useCallback, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PAINT_COLORS } from '../config/garage';
import { CARS } from '../config/cars';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import { QuestModal } from './QuestModal';
import { PassScreen } from './PassScreen';

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
  const isOriginal = carColor === 'original';

  // Проверяем, является ли картинка заглушкой или отсутствует
  const isPlaceholder = !activeCar.image || activeCar.image.includes('placeholder');

  return (
    <motion.div
      className={`race-car-container ${isRejected ? 'rejected' : ''}`}
      onPointerDown={onPointerDown}
      style={{ ...carStyles, willChange: 'transform' }}
      whileTap={{ scale: 0.96 }}
    >
      {/* 👇 Обертка для картинки с заглушкой */}
      <div className="race-car-wrapper" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Иконка-заглушка (видна, если нет картинки) */}
        <span style={{ 
          fontSize: '120px', 
          position: 'absolute', 
          zIndex: 0,
          opacity: isPlaceholder ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          🏎️
        </span>

        <img
          src={activeCar.image}
          alt={activeCar.name}
          className="race-car-image"
          draggable={false}
          loading="eager"
          decoding="sync"
          onError={(e) => { e.currentTarget.style.opacity = '0'; }}
          style={{
            opacity: isPlaceholder ? 0 : 1,
            filter: isOriginal 
              ? 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))' 
              : 'grayscale(1) brightness(1.1) contrast(1.2) drop-shadow(0 15px 15px rgba(0,0,0,0.6))',
            transition: 'filter 0.4s ease, opacity 0.3s ease',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            position: 'relative',
            zIndex: 1
          }}
        />
        {!isOriginal && !isPlaceholder && (
          <div className="race-color-overlay" style={{ backgroundColor: activeColorHex }} />
        )}
      </div>
      
      <div className={`headlight-glow ${isFlashing ? 'flash' : ''}`} />
      <div className={`headlight-halo ${isFlashing ? 'flash' : ''}`} />
    </motion.div>
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

  const totalEarned = user?.totalEarned || 0;
  const level = Math.floor(Math.sqrt(totalEarned / 50)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 50;
  const xpNextLevel = Math.pow(level, 2) * 50;
  const progress = Math.min(100, ((totalEarned - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100);

  // 👇 ИЗМЕНЕНО НА ВАЗ 2107 (защита от undefined)
  const activeCarId = user?.activeCarId || 'vaz-2107';
  const activeCar = CARS[activeCarId] || CARS['vaz-2107'];

  const clickLevel = user?.clickLevel || 1;
  const offlineLevel = user?.offlineLevel || 1;
  const clickCost = Math.floor(1000 * Math.pow(1.5, clickLevel - 1));
  const offlineCost = Math.floor(5000 * Math.pow(1.8, offlineLevel - 1));

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

  // 👇 Безопасное получение координат фар (чтобы не упало на новых машинах)
  const carStyles = {
    '--left-hl-x': activeCar.leftHeadlight?.x || '30%',
    '--left-hl-y': activeCar.leftHeadlight?.y || '50%',
    '--right-hl-x': activeCar.rightHeadlight?.x || '70%',
    '--right-hl-y': activeCar.rightHeadlight?.y || '50%',
  } as React.CSSProperties;

  return (
    <div className="race-screen" style={{ position: 'relative', overflow: 'hidden' }}>
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
              color: '#FFD700',
              fontSize: '24px',
              fontWeight: '900',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              pointerEvents: 'none',
              zIndex: 9999,
              userSelect: 'none',
              transform: 'translate(-50%, -50%)'
            }}
          >
            +{text.value} 🪙
          </motion.div>
        ))}
      </AnimatePresence>

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

      <CarClicker 
        isFlashing={isFlashing}
        isRejected={isRejected}
        carColor={carColor}
        activeCar={activeCar}
        carStyles={carStyles}
        onPointerDown={handlePointerDown}
      />

      {/* Кнопка заданий */}
      <button
        onClick={() => setShowQuests(true)}
        style={{
          position: 'absolute', bottom: '260px', left: '20px', zIndex: 100,
          background: 'linear-gradient(135deg, #ff8c00, #ff4500)', border: 'none',
          borderRadius: '50%', width: '60px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,140,0,0.4)',
        }}
      >
        📋
      </button>

      {/* Кнопка пропуска */}
      <button
        onClick={() => setShowPass(true)}
        style={{
          position: 'absolute', bottom: '330px', left: '20px', zIndex: 100,
          background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none',
          borderRadius: '50%', width: '60px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,191,255,0.4)',
        }}
      >
        🏁
      </button>

      {/* Кнопка улучшений */}
      <button
        onClick={() => setShowUpgrades(true)}
        style={{
          position: 'absolute', bottom: '260px', right: '20px', zIndex: 100,
          background: 'linear-gradient(135deg, #00FF41, #00bfff)', border: 'none',
          borderRadius: '50%', width: '60px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,255,65,0.4)',
        }}
      >
        ⚡
      </button>

      {showQuests && <QuestModal onClose={() => setShowQuests(false)} />}
      {showPass && <PassScreen onClose={() => setShowPass(false)} />}

      {/* Модалка улучшений кликера */}
      <AnimatePresence>
        {showUpgrades && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowUpgrades(false)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', zIndex: 1000,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              transform: 'translateZ(0)', isolation: 'isolate'
            }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1a1a1a', borderRadius: '24px 24px 0 0',
                width: '100%', maxWidth: '500px', padding: '25px 20px 40px 20px',
                border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'white', margin: 0, fontSize: '22px' }}>⚡ Улучшения</h2>
                <button onClick={() => setShowUpgrades(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '35px', height: '35px', fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '16px', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '36px' }}>💪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Сила клика</div>
                  <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>+1 монета за клик</div>
                  <div style={{ color: '#00FF41', fontSize: '12px', marginTop: '4px' }}>Текущий уровень: {clickLevel}</div>
                </div>
                <button onClick={() => { upgradeClicker(); playSound('coin'); }} disabled={balance < clickCost} style={{ background: balance >= clickCost ? '#00FF41' : '#333', color: balance >= clickCost ? 'black' : '#666', border: 'none', borderRadius: '10px', padding: '10px 16px', fontWeight: 'bold', fontSize: '13px', cursor: balance >= clickCost ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                  {clickCost.toLocaleString('ru-RU')} 🪙
                </button>
              </div>

              <div style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.3)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '36px' }}>⏱️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Оффлайн-доход</div>
                  <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>+500 монет/час</div>
                  <div style={{ color: '#00bfff', fontSize: '12px', marginTop: '4px' }}>Текущий уровень: {offlineLevel}</div>
                </div>
                <button onClick={() => { upgradeOffline(); playSound('coin'); }} disabled={balance < offlineCost} style={{ background: balance >= offlineCost ? '#00bfff' : '#333', color: balance >= offlineCost ? 'black' : '#666', border: 'none', borderRadius: '10px', padding: '10px 16px', fontWeight: 'bold', fontSize: '13px', cursor: balance >= offlineCost ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                  {offlineCost.toLocaleString('ru-RU')} 🪙
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}