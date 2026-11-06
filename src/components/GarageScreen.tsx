// src/components/GarageScreen.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import { UpgradeType, PAINT_COLORS } from '../config/garage';
import { ITEMS, RARITY_COLORS, SELL_PRICES, calculateStats } from '../config/items';
import { CARS } from '../config/cars';
import { TintedCarImage } from './TintedCarImage';
import '../styles/garage.css';

export const GarageScreen: React.FC = () => {
  const [activeUpgrade, setActiveUpgrade] = useState<UpgradeType | null>(null);
  const [sellingId, setSellingId] = useState<string | null>(null);
  const [showCarSelector, setShowCarSelector] = useState(false);

  const user = useGameStore((s) => s.user);
  const carColor = useGameStore((s) => s.carColor);
  const setCarColor = useGameStore((s) => s.setCarColor);
  const inventory = useGameStore((s) => s.inventory);
  const equipped = useGameStore((s) => s.equipped);
  const equipItem = useGameStore((s) => s.equipItem);
  const switchCar = useGameStore((s) => s.switchCar);
  const sellItem = useGameStore((s) => s.sellItem);

  const activeCarId = user?.activeCarId || 'audi-tt';
  const activeCar = CARS[activeCarId] || CARS['audi-tt'];
  const ownedCars = user?.ownedCars || ['audi-tt'];

  // ⚡ Финальные характеристики текущей машины
  const finalStats = useMemo(
    () => calculateStats(equipped, user?.partUpgrades || {}, activeCarId),
    [equipped, user?.partUpgrades, activeCarId]
  );

  // ⚡ Характеристики всех купленных машин
  const carOptions = useMemo(() => {
    return ownedCars
      .map((id) => {
        const car = CARS[id] || CARS['audi-tt'];
        const stats = calculateStats(equipped, user?.partUpgrades || {}, id);
        return { id, car, stats, isActive: id === activeCarId };
      })
      .sort((a, b) => b.stats.rating - a.stats.rating);
  }, [ownedCars, equipped, user?.partUpgrades, activeCarId]);

  const handleUpgradeClick = (id: UpgradeType) => {
    setActiveUpgrade(id);
    try {
      WebApp.HapticFeedback?.impactOccurred('light');
    } catch {}
  };

  const handleColorSelect = (colorId: string) => {
    setCarColor(colorId);
    try {
      WebApp.HapticFeedback?.impactOccurred('medium');
    } catch {}
  };

  const handleSelectCar = async (carId: string) => {
    if (carId === activeCarId) {
      setShowCarSelector(false);
      return;
    }
    try {
      WebApp.HapticFeedback?.impactOccurred('medium');
    } catch {}
    await switchCar(carId);
    setShowCarSelector(false);
  };

  const getModalTitle = () => {
    if (activeUpgrade === 'engine') return 'Двигатель';
    if (activeUpgrade === 'tires') return 'Шины';
    if (activeUpgrade === 'ecu') return 'Прошивка (ECU)';
    if (activeUpgrade === 'suspension') return 'Подвеска';
    if (activeUpgrade === 'paint') return 'Покраска';
    return 'Улучшение';
  };

  const activeColorHex =
    PAINT_COLORS.find((color) => color.id === carColor)?.hex || 'transparent';

  const renderUpgradeSection = (slot: string) => {
    const slotItems = inventory.filter((id) => ITEMS[id]?.slot === slot);
    const uniqueItems = Array.from(new Set(slotItems));

    uniqueItems.sort((a, b) => {
      const rarities = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
      return rarities.indexOf(ITEMS[a].rarity) - rarities.indexOf(ITEMS[b].rarity);
    });

    return (
      <div className="inventory-list">
        <p style={{ color: '#aaa', marginBottom: '10px', fontSize: '13px' }}>
          Нажмите на предмет, чтобы надеть, или продайте за ₽ы:
        </p>

        {uniqueItems.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>
            Пусто. Кликайте на главном экране, чтобы выбить запчасти!
          </p>
        )}

        {uniqueItems.map((itemId, index) => {
          const item = ITEMS[itemId];
          const isEquipped = equipped[item.slot] === itemId;
          const sellPrice = SELL_PRICES[item.rarity];
          const isSelling = sellingId === itemId;

          const upg = user?.partUpgrades?.[itemId] || { level: 0, goldStars: 0, redStars: 0 };
          const levelMulti = 1 + (upg.level || 0) * 0.02;
          const goldMulti = 1 + (upg.goldStars || 0) * 0.10;
          const redMulti = 1 + (upg.redStars || 0) * 0.25;
          const finalMulti = levelMulti * goldMulti * redMulti;

          const power = Math.round(item.stats.power * finalMulti);
          const topSpeed = Math.round(item.stats.topSpeed * finalMulti);
          const grip = Math.round(item.stats.grip * finalMulti);
          const handling = Math.round(item.stats.handling * finalMulti);
          const hasUpgrades = upg.level > 0 || upg.goldStars > 0 || upg.redStars > 0;

          return (
            <motion.div
              key={itemId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2, ease: 'easeOut' }}
              className={`inventory-item ${isEquipped ? 'equipped' : ''}`}
              style={{
                borderColor: isEquipped ? '#00e5ff' : RARITY_COLORS[item.rarity],
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                cursor: isEquipped || isSelling ? 'default' : 'pointer',
                background: isEquipped
                  ? 'linear-gradient(90deg, rgba(0,229,255,0.08) 0%, rgba(0,229,255,0.02) 100%)'
                  : 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                marginBottom: '8px',
                borderWidth: '1px',
                borderStyle: 'solid',
                opacity: isSelling ? 0.5 : 1,
              }}
              onClick={() => {
                if (!isEquipped && !isSelling) equipItem(item.slot, itemId);
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  className="item-name"
                  style={{
                    color: RARITY_COLORS[item.rarity],
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '5px',
                    fontSize: '14px',
                  }}
                >
                  {item.name} {isEquipped && '✓'}
                  {hasUpgrades && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 'normal',
                        color: '#888',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Lv.{upg.level}
                      {upg.goldStars > 0 && <span style={{ color: 'gold', marginLeft: '4px' }}>★{upg.goldStars}</span>}
                      {upg.redStars > 0 && <span style={{ color: '#ff4444', marginLeft: '4px' }}>★{upg.redStars}</span>}
                    </span>
                  )}
                </div>
                <div className="item-stats" style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  {power > 0 && <span>+{power} HP </span>}
                  {topSpeed > 0 && <span>+{topSpeed} Vmax </span>}
                  {grip > 0 && <span>+{grip} Сцеп. </span>}
                  {handling > 0 && <span>+{handling} Управ. </span>}
                </div>
              </div>

              {!isEquipped ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelling) return;
                    setSellingId(itemId);
                    sellItem(itemId).finally(() => setSellingId(null));
                  }}
                  disabled={isSelling}
                  style={{
                    background: isSelling ? 'rgba(255,255,255,0.1)' : 'rgba(255,68,68,0.15)',
                    border: '1px solid rgba(255,68,68,0.5)',
                    color: isSelling ? '#aaa' : '#ff4444',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: isSelling ? 'wait' : 'pointer',
                    whiteSpace: 'nowrap',
                    minWidth: '60px',
                  }}
                >
                  {isSelling ? '...' : `💰 ${sellPrice}`}
                </button>
              ) : (
                <span style={{ fontSize: '11px', color: '#00FF41', fontWeight: 'bold' }}>
                  Надето
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="garage-screen">
      <div className="garage-scene">
        <div className="garage-bg" />

        {/* --- Кнопка смены машины --- */}
        {ownedCars.length > 1 && (
          <div className="garage-car-switch-wrapper">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCarSelector(true)}
              className="garage-car-switch-btn"
            >
              <span>🚗</span>
              <span>{activeCar.name}</span>
              <span style={{ color: '#00e5ff', marginLeft: '4px' }}>▼</span>
            </motion.button>
          </div>
        )}

        {/* --- Плашка характеристик (перенесена на top 16%) --- */}
        <div
          style={{
            position: 'absolute',
            top: '21%',
            left: '10%',
            width: '80%',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            zIndex: 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#aaa',
            fontFamily: 'monospace',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>🚀 {finalStats.topSpeed} км/ч</span>
            <span>⚡ {Number(finalStats.accel ?? 0).toFixed(1)} с</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
            <span>💪 {finalStats.power} л.с.</span>
            <span>⭐ Рейтинг: {finalStats.rating}</span>
          </div>
        </div>

        {/* --- Машина --- */}
        <div
          className="garage-car-container"
          style={{
            top: '38%',
            left: '25%',
            width: '52%',
            position: 'absolute',
            zIndex: 10,
          }}
          onClick={() => handleUpgradeClick('engine')}
        >
          <div className="car-tooltip">Двигатель</div>
          <div className="car-image-wrapper">
            <TintedCarImage
              imageUrl={activeCar.image}
              colorHex={activeColorHex}
              className="garage-car-img"
              style={{ filter: 'none', width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* --- Шины, подвеска, ECU --- */}
        <motion.img
          src="/images/tires.png"
          alt="Шины"
          className="interactive-object"
          style={{ top: '41%', left: '0%', width: '18%' }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          whileTap={{ scale: 1.15 }}
          onClick={() => handleUpgradeClick('tires')}
        />
        <motion.img
          src="/images/suspension.png"
          alt="Подвеска"
          className="interactive-object"
          style={{ top: '33%', left: '76%', width: '25%' }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          whileTap={{ scale: 1.15 }}
          onClick={() => handleUpgradeClick('suspension')}
        />
        <motion.img
          src="/images/computer.png"
          alt="Прошивка (ECU)"
          className="interactive-object"
          style={{ top: '74%', left: '6%', width: '32%' }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          whileTap={{ scale: 1.15 }}
          onClick={() => handleUpgradeClick('ecu')}
        />
      </div>

      {/* ============================================ */}
      {/* МОДАЛКА ВЫБОРА МАШИНЫ                        */}
      {/* ============================================ */}
      <AnimatePresence>
        {showCarSelector && (
          <motion.div
            className="garage-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCarSelector(false)}
          >
            <motion.div
              className="garage-modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="garage-modal-header">
                <h2>Выбор машины</h2>
                <button className="close-btn" onClick={() => setShowCarSelector(false)}>
                  ✕
                </button>
              </div>

              <div className="garage-modal-body">
                <p style={{ color: '#888', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
                  Куплено машин: {ownedCars.length}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {carOptions.map((opt) => {
                    const diffSpeed = opt.stats.topSpeed - finalStats.topSpeed;
                    const diffPower = opt.stats.power - finalStats.power;
                    const diffRating = opt.stats.rating - finalStats.rating;

                    return (
                      <motion.div
                        key={opt.id}
                        whileTap={{ scale: opt.isActive ? 1 : 0.98 }}
                        onClick={() => handleSelectCar(opt.id)}
                        className={`car-option-card ${opt.isActive ? 'active' : ''}`}
                        style={{
                          background: opt.isActive
                            ? 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,136,255,0.05))'
                            : 'rgba(255,255,255,0.03)',
                          border: opt.isActive
                            ? '2px solid #00e5ff'
                            : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '14px',
                          padding: '12px 14px',
                          cursor: opt.isActive ? 'default' : 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                              {opt.car.name}
                            </div>
                            {opt.isActive && (
                              <div style={{ color: '#00e5ff', fontSize: '10px', marginTop: '2px', fontWeight: 'bold', letterSpacing: '1px' }}>
                                ✓ ВЫБРАНА
                              </div>
                            )}
                          </div>
                          <div style={{
                            color: opt.isActive ? '#00e5ff' : '#aaa',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                          }}>
                            ⭐ {opt.stats.rating}
                          </div>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '4px 12px',
                          fontSize: '11px',
                          color: '#aaa',
                          fontFamily: 'monospace',
                        }}>
                          <span>🚀 {opt.stats.topSpeed} км/ч</span>
                          <span>💪 {opt.stats.power} л.с.</span>
                          <span>⚡ {Number(opt.stats.accel).toFixed(1)} с</span>
                          <span>🛞 {opt.stats.grip}</span>
                        </div>

                        {!opt.isActive && (diffSpeed !== 0 || diffPower !== 0 || diffRating !== 0) && (
                          <div style={{
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px dashed rgba(255,255,255,0.1)',
                            fontSize: '10px',
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                          }}>
                            {diffSpeed !== 0 && (
                              <span style={{ color: diffSpeed > 0 ? '#00FF41' : '#ff4444' }}>
                                {diffSpeed > 0 ? '▲' : '▼'} {Math.abs(diffSpeed)} км/ч
                              </span>
                            )}
                            {diffPower !== 0 && (
                              <span style={{ color: diffPower > 0 ? '#00FF41' : '#ff4444' }}>
                                {diffPower > 0 ? '▲' : '▼'} {Math.abs(diffPower)} л.с.
                              </span>
                            )}
                            {diffRating !== 0 && (
                              <span style={{ color: diffRating > 0 ? '#00FF41' : '#ff4444' }}>
                                ⭐ {diffRating > 0 ? '+' : ''}{diffRating}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* МОДАЛКА ПРОКАЧКИ / ПОКРАСКИ                  */}
      {/* ============================================ */}
      <AnimatePresence>
        {activeUpgrade && (
          <motion.div
            className="garage-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveUpgrade(null)}
          >
            <motion.div
              className="garage-modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="garage-modal-header">
                <h2>{getModalTitle()}</h2>
                <button className="close-btn" onClick={() => setActiveUpgrade(null)}>
                  ✕
                </button>
              </div>

              <div className="garage-modal-body">
                {activeUpgrade === 'paint' && (
                  <div className="paint-section">
                    <p className="paint-desc">Выберите цвет кузова:</p>
                    <div className="color-grid">
                      {PAINT_COLORS.map((color) => (
                        <motion.button
                          key={color.id}
                          whileTap={{ scale: 0.95 }}
                          className={`color-btn ${carColor === color.id ? 'active' : ''}`}
                          onClick={() => handleColorSelect(color.id)}
                        >
                          <div
                            className="color-swatch"
                            style={{
                              backgroundColor: color.hex === 'transparent' ? '#888' : color.hex,
                            }}
                          />
                          <span>{color.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {['engine', 'tires', 'suspension', 'ecu'].includes(activeUpgrade) &&
                  renderUpgradeSection(activeUpgrade)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};