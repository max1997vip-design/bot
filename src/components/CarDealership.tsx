// src/components/CarDealership.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { CARS } from '../config/cars';

export const CarDealership: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const buyCar = useGameStore((s) => s.buyCar);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const ownedCars = user?.ownedCars || ['vaz-2107'];
  const balance = user?.balance || 0;

  // 👇 ФИЛЬТРУЕМ МАШИНЫ: показываем только те, которых нет у игрока
  const availableCars = Object.values(CARS).filter(car => !ownedCars.includes(car.id));

  const handleBuy = async (carId: string, price: number) => {
    if (balance < price) return;
    setBuyingId(carId);
    await buyCar(carId, price);
    setBuyingId(null);
    // После покупки машина автоматически исчезнет из списка благодаря фильтру
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#090A0C', zIndex: 1000,
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      {/* Шапка салона */}
      <div style={{ 
        padding: '20px', 
        paddingTop: 'calc(20px + var(--tg-safe-top, 0px))', // 👈 Безопасный отступ сверху
        background: 'rgba(20, 22, 26, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10
      }}>
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '22px' }}>🏢 Автосалон</h2>
          <p style={{ color: '#00FF41', margin: '4px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>
            Баланс: {balance.toLocaleString('ru-RU')} 🪙
          </p>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
          Закрыть
        </button>
      </div>

      {/* Список машин */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 👇 Если все машины куплены, показываем сообщение */}
        {availableCars.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', marginTop: '50px' }}>
            <span style={{ fontSize: '60px' }}>🏆</span>
            <h3 style={{ color: '#fff', marginTop: '20px' }}>Все машины скуплены!</h3>
            <p>Вы собрали всю коллекцию. Зайдите в Гараж, чтобы выбрать автомобиль по вкусу.</p>
          </div>
        )}

        {/* Список доступных машин */}
        {availableCars.map((car) => {
          const canAfford = balance >= car.price;
          const isBuying = buyingId === car.id;

          return (
            <motion.div 
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#14161A', borderRadius: '20px', padding: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', gap: '15px'
              }}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                
                {/* Блок картинки с заглушкой */}
                <div style={{ 
                  width: '120px', height: '80px', borderRadius: '12px', overflow: 'hidden', 
                  background: 'linear-gradient(135deg, #1f2229, #2a2e38)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, position: 'relative'
                }}>
                  <span style={{ fontSize: '40px', position: 'absolute' }}>🏎️</span>
                  {car.image && !car.image.includes('placeholder') && (
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} 
                    />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '18px' }}>{car.name}</h3>
                  
                  {/* Статы */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#aaa' }}>
                    <span>⚡ {car.baseStats.power} HP</span>
                    <span>🏁 {car.baseStats.topSpeed} Vmax</span>
                    <span>🛞 {car.baseStats.grip} Grip</span>
                    <span>🎯 {car.baseStats.handling} Handl</span>
                  </div>
                </div>
              </div>

              {/* Кнопка покупки */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                <div style={{ color: canAfford ? '#ffd700' : '#ff4444', fontWeight: 'bold', fontSize: '16px' }}>
                  {car.price.toLocaleString('ru-RU')} 🪙
                </div>

                <button
                  onClick={() => handleBuy(car.id, car.price)}
                  disabled={!canAfford || isBuying}
                  style={{
                    background: canAfford ? '#ffd700' : '#333',
                    color: canAfford ? '#000' : '#666',
                    border: 'none', padding: '10px 20px', borderRadius: '10px',
                    fontWeight: 'bold', fontSize: '14px', cursor: canAfford ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isBuying ? 'ПОКУПКА...' : 'КУПИТЬ'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};