// src/components/CarDealership.tsx
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CARS } from '../config/cars';
import WebApp from '@twa-dev/sdk';

interface CarDealershipProps {
  onClose: () => void;
}

export const CarDealership: React.FC<CarDealershipProps> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const buyCar = useGameStore((s) => s.buyCar);
  const [loadingCar, setLoadingCar] = useState<string | null>(null);

  const ownedCars = user?.ownedCars || ['audi-tt'];
  const allCars = Object.values(CARS).filter(c => c.price > 0); // Показываем только те, что можно купить

  const handleBuy = async (carId: string, price: number) => {
    if (!user || user.balance < price) {
      try { WebApp.HapticFeedback?.notificationOccurred('error'); } catch {}
      return;
    }

    setLoadingCar(carId);
    try { WebApp.HapticFeedback?.impactOccurred('medium'); } catch {}
    
    const success = await buyCar(carId, price);
    
    if (success) {
      try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}
    } else {
      try { WebApp.HapticFeedback?.notificationOccurred('error'); } catch {}
    }
    setLoadingCar(null);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'white', margin: 0 }}>🏪 Автосалон</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '24px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {allCars.map(car => {
          const isOwned = ownedCars.includes(car.id);
          const canAfford = (user?.balance || 0) >= car.price;
          
          return (
            <div key={car.id} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px',
              border: isOwned ? '2px solid #00FF41' : '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>{car.name}</h3>
                  <p style={{ margin: 0, color: '#ffd700', fontWeight: 'bold' }}>
                    {car.price.toLocaleString('ru-RU')} 🪙
                  </p>
                </div>
                
                {isOwned ? (
                  <span style={{ color: '#00FF41', fontWeight: 'bold' }}>В гараже</span>
                ) : (
                  <button
                    onClick={() => handleBuy(car.id, car.price)}
                    disabled={!canAfford || loadingCar === car.id}
                    style={{
                      padding: '10px 20px', borderRadius: '8px', border: 'none',
                      background: canAfford ? '#00FF41' : '#333',
                      color: canAfford ? 'black' : '#888',
                      fontWeight: 'bold', cursor: canAfford ? 'pointer' : 'not-allowed',
                      opacity: loadingCar === car.id ? 0.5 : 1
                    }}
                  >
                    {loadingCar === car.id ? 'Покупка...' : 'Купить'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};