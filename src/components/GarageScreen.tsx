// src/components/GarageScreen.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import { UpgradeType, PAINT_COLORS, CAR_POSITION } from '../config/garage';
import { ITEMS, RARITY_COLORS, SELL_PRICES } from '../config/items';
import { CARS } from '../config/cars';
import '../styles/garage.css';

export const GarageScreen: React.FC = () => {
  const [activeUpgrade, setActiveUpgrade] = useState<UpgradeType | null>(null);
  const [sellingId, setSellingId] = useState<string | null>(null); 
  
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

  const handleUpgradeClick = (id: UpgradeType) => {
    setActiveUpgrade(id);
    try { WebApp.HapticFeedback?.impactOccurred('light'); } catch {}
  };

  const handleColorSelect = (colorId: string) => {
    setCarColor(colorId);
    try { WebApp.HapticFeedback?.impactOccurred('medium'); } catch {}
  };

  const getModalTitle = () => {
    if (activeUpgrade === 'engine') return 'Двигатель';
    if (activeUpgrade === 'tires') return 'Шины';
    if (activeUpgrade === 'ecu') return 'Прошивка (ECU)';
    if (activeUpgrade === 'suspension') return 'Подвеска';
    if (activeUpgrade === 'paint') return 'Покраска';
    return 'Улучшение';
  };

  const activeColorHex = PAINT_COLORS.find((c) => c.id === carColor)?.hex || 'transparent';
  const isOriginal = carColor === 'original';

  const renderUpgradeSection = (slot: string) => {
    const slotItems = inventory.filter(id => ITEMS[id]?.slot === slot);
    const uniqueItems = Array.from(new Set(slotItems));
    
    uniqueItems.sort((a, b) => {
      const rarities = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
      return rarities.indexOf(ITEMS[a].rarity) - rarities.indexOf(ITEMS[b].rarity);
    });

    return (
      <div className="inventory-list">
        <p style={{ color: '#aaa', marginBottom: '10px', fontSize: '13px' }}>
          Нажмите на предмет, чтобы надеть, или продайте за монеты:
        </p>
        
        {uniqueItems.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>
            Пусто. Кликайте на главном экране, чтобы выбить запчасти!
          </p>
        )}
        
        {uniqueItems.map(itemId => {
          const item = ITEMS[itemId];
          const isEquipped = equipped[item.slot] === itemId;
          const sellPrice = SELL_PRICES[item.rarity];
          const isSelling = sellingId === itemId; 
          
          return (
            <div 
              key={itemId} 
              className={`inventory-item ${isEquipped ? 'equipped' : ''}`}
              style={{ 
                borderColor: RARITY_COLORS[item.rarity],
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px 15px',
                cursor: (isEquipped || isSelling) ? 'default' : 'pointer',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                marginBottom: '8px',
                borderWidth: '1px',
                borderStyle: 'solid',
                opacity: isSelling ? 0.5 : 1 
              }}
              onClick={() => !isEquipped && !isSelling && equipItem(item.slot, itemId)}
            >
              <div>
                <div className="item-name" style={{ color: RARITY_COLORS[item.rarity], fontWeight: 'bold' }}>
                  {item.name} {isEquipped && '✓'}
                </div>
                <div className="item-stats" style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  {item.stats.power > 0 && <span>+{item.stats.power} HP </span>}
                  {item.stats.topSpeed > 0 && <span>+{item.stats.topSpeed} Vmax </span>}
                  {item.stats.grip > 0 && <span>+{item.stats.grip} Сцеп. </span>}
                  {item.stats.handling > 0 && <span>+{item.stats.handling} Управ. </span>}
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
                    background: isSelling ? 'rgba(255,255,255,0.1)' : 'rgba(255, 68, 68, 0.15)',
                    border: '1px solid rgba(255, 68, 68, 0.5)',
                    color: isSelling ? '#aaa' : '#ff4444',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: isSelling ? 'wait' : 'pointer',
                    whiteSpace: 'nowrap',
                    minWidth: '60px'
                  }}
                >
                  {isSelling ? '...' : `💰 ${sellPrice}`}
                </button>
              ) : (
                <span style={{ fontSize: '11px', color: '#00FF41', fontWeight: 'bold' }}>
                  Надето
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="garage-screen" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="garage-bg" />

      {/* Переключатель машин */}
      {ownedCars.length > 1 && (
        <div style={{ position: 'absolute', top: 20, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 50 }}>
          {ownedCars.map(id => (
            <button
              key={id}
              onClick={() => switchCar(id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: id === activeCarId ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                border: id === activeCarId ? '2px solid #fff' : '2px solid rgba(255,255,255,0.1)',
                color: id === activeCarId ? '#fff' : '#888',
                fontSize: '12px',
                fontWeight: 'bold',
                backdropFilter: 'blur(5px)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {CARS[id]?.name || id}
            </button>
          ))}
        </div>
      )}

      {/* Сама машина (клик открывает двигатель) */}
      <div
        className="garage-car-container"
        style={{ top: CAR_POSITION.y, left: CAR_POSITION.x, width: CAR_POSITION.width, position: 'absolute', zIndex: 10 }}
        onClick={() => handleUpgradeClick('engine')}
      >
        <div className="car-tooltip">Двигатель</div>
        
        <div className="car-image-wrapper">
          <img
            src={activeCar.image}
            alt={activeCar.name}
            className="garage-car-img"
            style={{ 
              filter: isOriginal 
                ? 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))' 
                : 'grayscale(1) brightness(1.1) contrast(1.2) drop-shadow(0 15px 15px rgba(0,0,0,0.6))' 
            }}
          />
          {!isOriginal && (
            <div className="car-color-overlay" style={{ backgroundColor: activeColorHex }} />
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* ИНТЕРАКТИВНЫЕ ОБЪЕКТЫ С АНИМАЦИЕЙ */}
      {/* ========================================= */}
      
      {/* 1. Шины (вырезанная картинка) */}
      <motion.img
        src="/images/tires.png" // Положи картинку в public/images/tires.png
        alt="Шины"
        className="interactive-object"
        style={{ top: '48%', left: '12%', width: '15%' }} // ПОДГОНИ КООРДИНАТЫ ПОД СВОЙ ФОН
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.88, rotate: -3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={() => handleUpgradeClick('tires')}
      />

      {/* 2. Стойка с краской (когда вырежешь, раскомментируй и подгони стили) */}
      {/* 
      <motion.img
        src="/images/paint.png"
        alt="Покраска"
        className="interactive-object"
        style={{ top: '20%', left: '65%', width: '15%' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9, rotate: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={() => handleUpgradeClick('paint')}
      />
      */}

      {/* 3. Стойка с подвеской (когда вырежешь, раскомментируй и подгони стили) */}
      {/* 
      <motion.img
        src="/images/suspension.png"
        alt="Подвеска"
        className="interactive-object"
        style={{ top: '55%', left: '75%', width: '15%' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9, rotate: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={() => handleUpgradeClick('suspension')}
      />
      */}

      {/* 4. Компьютер (когда вырежешь, раскомментируй и подгони стили) */}
      {/* 
      <motion.img
        src="/images/computer.png"
        alt="ECU"
        className="interactive-object"
        style={{ top: '60%', left: '5%', width: '10%' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={() => handleUpgradeClick('ecu')}
      />
      */}

      {/* ========================================= */}

      {/* Модальное окно улучшений */}
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
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="garage-modal-header">
                <h2>{getModalTitle()}</h2>
                <button className="close-btn" onClick={() => setActiveUpgrade(null)}>✕</button>
              </div>

              <div className="garage-modal-body">
                {activeUpgrade === 'paint' && (
                  <div className="paint-section">
                    <p className="paint-desc">Выберите цвет кузова:</p>
                    <div className="color-grid">
                      {PAINT_COLORS.map((color) => (
                        <button
                          key={color.id}
                          className={`color-btn ${carColor === color.id ? 'active' : ''}`}
                          onClick={() => handleColorSelect(color.id)}
                        >
                          <div 
                            className="color-swatch" 
                            style={{ backgroundColor: color.hex === 'transparent' ? '#888' : color.hex }} 
                          />
                          <span>{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {['engine', 'tires', 'suspension', 'ecu'].includes(activeUpgrade) && renderUpgradeSection(activeUpgrade)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};