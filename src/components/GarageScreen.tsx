// src/components/GarageScreen.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import { GARAGE_HOTSPOTS, UpgradeType, PAINT_COLORS, CAR_POSITION } from '../config/garage';
import { ITEMS, RARITY_COLORS, calculateStats } from '../config/items';
import '../styles/garage.css';

export const GarageScreen: React.FC = () => {
  const [activeUpgrade, setActiveUpgrade] = useState<UpgradeType | null>(null);
  
  // Достаем всё нужное из нового стора
  const { carColor, setCarColor, inventory, equipped, equipItem } = useGameStore();

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
    return GARAGE_HOTSPOTS.find((s) => s.id === activeUpgrade)?.label;
  };

  const activeColorHex = PAINT_COLORS.find((c) => c.id === carColor)?.hex || 'transparent';
  const isOriginal = carColor === 'original';

  // Расчет текущих характеристик (можно вывести где-нибудь в гараже)
  const currentStats = calculateStats(equipped);

  // Рендер списка предметов для конкретного слота
  const renderUpgradeSection = (slot: string) => {
    // Оставляем только предметы для этого слота
    const slotItems = inventory.filter(id => ITEMS[id]?.slot === slot);
    // Убираем дубликаты (если выпало 3 одинаковых мотора)
    const uniqueItems = Array.from(new Set(slotItems));
    
    // Сортируем по редкости (сначала легендарки)
    uniqueItems.sort((a, b) => {
      const rarities = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
      return rarities.indexOf(ITEMS[a].rarity) - rarities.indexOf(ITEMS[b].rarity);
    });

    return (
      <div className="inventory-list">
        <p style={{ color: '#aaa', marginBottom: '10px', fontSize: '13px' }}>
          Нажмите на предмет, чтобы надеть:
        </p>
        
        {uniqueItems.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>
            Пусто. Кликайте на главном экране, чтобы выбить запчасти!
          </p>
        )}
        
        {uniqueItems.map(itemId => {
          const item = ITEMS[itemId];
          const isEquipped = equipped[item.slot] === itemId;
          
          return (
            <div 
              key={itemId} 
              className={`inventory-item ${isEquipped ? 'equipped' : ''}`}
              style={{ borderColor: RARITY_COLORS[item.rarity] }}
              onClick={() => equipItem(item.slot, itemId)}
            >
              <div className="item-name" style={{ color: RARITY_COLORS[item.rarity] }}>
                {item.name} {isEquipped && '✓ (Надето)'}
              </div>
              <div className="item-stats">
                {item.stats.power > 0 && <span>+{item.stats.power} HP </span>}
                {item.stats.topSpeed > 0 && <span>+{item.stats.topSpeed} Vmax </span>}
                {item.stats.grip > 0 && <span>+{item.stats.grip} Сцепление </span>}
                {item.stats.handling > 0 && <span>+{item.stats.handling} Управляемость </span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="garage-screen">
      <div className="garage-bg" />

      {/* Машина */}
      <div
        className="garage-car-container"
        style={{ top: CAR_POSITION.y, left: CAR_POSITION.x, width: CAR_POSITION.width }}
        onClick={() => handleUpgradeClick('engine')}
      >
        <div className="car-tooltip">Двигатель</div>
        
        <div className="car-image-wrapper">
          <img
            src="/cars/audi-tt-front.png"
            alt="Car"
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

      {/* Точки на фоне */}
      {GARAGE_HOTSPOTS.map((spot) => (
        <motion.div
          key={spot.id}
          className="garage-hotspot"
          style={{ top: spot.y, left: spot.x }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleUpgradeClick(spot.id)}
        >
          <div className="hotspot-dot" />
          <div className="hotspot-tooltip">{spot.label}</div>
        </motion.div>
      ))}

      {/* Модалка */}
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
                {/* ПОКРАСКА */}
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

                {/* ИНВЕНТАРЬ ДЛЯ ДВИГАТЕЛЯ, ШИН И ПРОШИВКИ */}
                {['engine', 'tires', 'suspension', 'ecu'].includes(activeUpgrade) && renderUpgradeSection(activeUpgrade)
                }
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};