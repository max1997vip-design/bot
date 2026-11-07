// src/components/CarDealership.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flag, Gauge, Target, ShoppingCart, X, Check } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { CARS, CarConfig } from '../config/cars';
import { playSound } from '../utils/sound';
import '../styles/cardealership.css';

// 👇 Группировка машин по тирам
const TIERS = [
  { id: 'budget', name: 'Бюджет', minPrice: 0, maxPrice: 100000 },
  { id: 'classic', name: 'Классика', minPrice: 100000, maxPrice: 1000000 },
  { id: 'sport', name: 'Спорт', minPrice: 1000000, maxPrice: 10000000 },
  { id: 'super', name: 'Суперкары', minPrice: 10000000, maxPrice: 100000000 },
  { id: 'hyper', name: 'Гиперкары', minPrice: 100000000, maxPrice: Infinity },
];

type TierId = typeof TIERS[number]['id'];

export const CarDealership: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const buyCar = useGameStore((s) => s.buyCar);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<TierId>('budget');

  const ownedCars = user?.ownedCars || ['vaz-2107'];
  const balance = user?.balance || 0;

  // 👇 Фильтруем по тиру и убираем купленные
  const availableCars = useMemo(() => {
    const tier = TIERS.find(t => t.id === activeTier);
    if (!tier) return [];
    
    return Object.values(CARS).filter(car => 
      !ownedCars.includes(car.id) && 
      car.price >= tier.minPrice && 
      car.price < tier.maxPrice
    ).sort((a, b) => a.price - b.price);
  }, [ownedCars, activeTier]);

  // 👇 Счётчик машин по тирам (для бейджей на табах)
  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TIERS.forEach(tier => {
      counts[tier.id] = Object.values(CARS).filter(car => 
        !ownedCars.includes(car.id) && 
        car.price >= tier.minPrice && 
        car.price < tier.maxPrice
      ).length;
    });
    return counts;
  }, [ownedCars]);

  const handleBuy = async (carId: string, price: number) => {
    if (balance < price || buyingId) return;
    setBuyingId(carId);
    const success = await buyCar(carId, price);
    setBuyingId(null);
    if (success) {
      playSound('coin');
    }
  };

  return (
    <div className="cardealer-overlay" onClick={onClose}>
      <motion.div
        className="cardealer-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="cardealer-header">
          <h2>
            <ShoppingCart size={18} color="var(--gold)" /> АВТОСАЛОН
          </h2>
          <div className="cardealer-balance">
            {balance.toLocaleString('ru-RU')}
            <span className="currency-ruble sm" style={{ marginLeft: 4 }}>₽</span>
          </div>
          <button className="cardealer-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Табы по тирам */}
        <div className="cardealer-tabs">
          {TIERS.map(tier => (
            <button
              key={tier.id}
              className={`cardealer-tab ${activeTier === tier.id ? 'active' : ''}`}
              onClick={() => setActiveTier(tier.id)}
            >
              <span>{tier.name}</span>
              {tierCounts[tier.id] > 0 && (
                <span className="cardealer-tab-count">{tierCounts[tier.id]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Список машин */}
        <div className="cardealer-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTier}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="cardealer-list"
            >
              {availableCars.length === 0 && (
                <div className="cardealer-empty">
                  <ShoppingCart size={48} color="var(--text-muted)" />
                  <h3>Нет доступных машин</h3>
                  <p>В этом тире все машины уже куплены</p>
                </div>
              )}

              {availableCars.map((car: CarConfig) => {
                const canAfford = balance >= car.price;
                const isBuying = buyingId === car.id;

                return (
                  <motion.div
                    key={car.id}
                    className={`cardealer-card ${canAfford ? 'affordable' : ''}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {/* Картинка */}
                    <div className="cardealer-image">
                      <span className="cardealer-image-fallback">🏎️</span>
                      {car.image && !car.image.includes('placeholder') && (
                        <img
                          src={car.image}
                          alt={car.name}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>

                    {/* Инфо */}
                    <div className="cardealer-info">
                      <h3 className="cardealer-name">{car.name}</h3>
                      <div className="cardealer-stats">
                        <div className="cardealer-stat">
                          <Zap size={12} color="#ffd700" />
                          <span>{car.baseStats.power} HP</span>
                        </div>
                        <div className="cardealer-stat">
                          <Flag size={12} color="var(--accent)" />
                          <span>{car.baseStats.topSpeed} Vmax</span>
                        </div>
                        <div className="cardealer-stat">
                          <Gauge size={12} color="var(--success)" />
                          <span>{car.baseStats.grip} Grip</span>
                        </div>
                        <div className="cardealer-stat">
                          <Target size={12} color="#ff8800" />
                          <span>{car.baseStats.handling} Handl</span>
                        </div>
                      </div>
                    </div>

                    {/* Цена + кнопка */}
                    <div className="cardealer-footer">
                      <div className="cardealer-price" style={{ color: canAfford ? 'var(--gold)' : 'var(--danger)' }}>
                        {car.price.toLocaleString('ru-RU')}
                        <span className="currency-ruble sm" style={{ marginLeft: 3 }}>₽</span>
                      </div>
                      <button
                        className={`cardealer-buy ${canAfford ? 'ready' : ''}`}
                        onClick={() => handleBuy(car.id, car.price)}
                        disabled={!canAfford || !!buyingId}
                      >
                        {isBuying ? '...' : canAfford ? 'КУПИТЬ' : 'МАЛО ₽'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};