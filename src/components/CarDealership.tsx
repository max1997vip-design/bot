// src/components/CarDealership.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { CARS } from '../config/cars';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';

interface CarDealershipProps {
  onClose: () => void;
}

export const CarDealership: React.FC<CarDealershipProps> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const buyCar = useGameStore((s) => s.buyCar);
  
  // Получаем список всех машин в виде массива
  const carsList = Object.values(CARS);
  
  // Индекс текущей выбранной машины
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = вправо, -1 = влево
  const [isBuying, setIsBuying] = useState(false);

  const currentCar = carsList[currentIndex];
  const isOwned = user?.ownedCars?.includes(currentCar.id) || false;
  const canAfford = (user?.balance || 0) >= currentCar.price;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % carsList.length);
    try { WebApp.HapticFeedback?.impactOccurred('light'); } catch {}
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + carsList.length) % carsList.length);
    try { WebApp.HapticFeedback?.impactOccurred('light'); } catch {}
  };

  const handleBuy = async () => {
    if (isOwned || !canAfford || isBuying) return;
    
    setIsBuying(true);
    try { WebApp.HapticFeedback?.impactOccurred('medium'); } catch {}
    
    const success = await buyCar(currentCar.id, currentCar.price);
    
    if (success) {
      try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}
    } else {
      try { WebApp.HapticFeedback?.notificationOccurred('error'); } catch {}
    }
    setIsBuying(false);

    if (success) {
      playSound('coin'); // <-- звук покупки
      try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}
    } else {
      try { WebApp.HapticFeedback?.notificationOccurred('error'); } catch {}
    }
  };

  // Анимации для смены машины
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(to bottom, #111, #000)',
      zIndex: 1000, display: 'flex', flexDirection: 'column'
    }}>
      {/* ХЕДЕР */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px', zIndex: 10 
      }}>
        <button onClick={onClose} style={{ 
          background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', 
          borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' 
        }}>←</button>
        <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '18px' }}>
          {user?.balance.toLocaleString('ru-RU') || 0} 🪙
        </div>
      </div>

      <h2 style={{ textAlign: 'center', color: 'white', margin: '0 0 20px 0', letterSpacing: '2px' }}>
        АВТОСАЛОН
      </h2>

      {/* ОСНОВНАЯ СЦЕНА */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Стрелка влево */}
        <button onClick={handlePrev} style={{
          position: 'absolute', left: '10px', zIndex: 10, background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.5)', fontSize: '40px', cursor: 'pointer', padding: '10px'
        }}>‹</button>

        {/* Машина и Подиум */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentCar.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'
            }}
          >
            {/* Картинка машины */}
            <div style={{ position: 'relative', width: '80%', maxWidth: '350px', marginBottom: '-40px', zIndex: 2 }}>
              <img 
                src={currentCar.image} 
                alt={currentCar.name}
                style={{ 
                  width: '100%', objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.8))'
                }}
              />
            </div>

            {/* Подиум */}
            <div style={{
              width: '85%', maxWidth: '380px', height: '120px',
              background: 'linear-gradient(to bottom, #222, #111)',
              borderRadius: '50% 50% 10px 10px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9), inset 0 2px 5px rgba(255,255,255,0.2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1
            }}>
              <h3 style={{ margin: '10px 0 5px 0', color: 'white', fontSize: '20px' }}>
                {currentCar.name}
              </h3>
              <p style={{ 
                margin: 0, color: isOwned ? '#00FF41' : '#ffd700', 
                fontSize: '18px', fontWeight: 'bold' 
              }}>
                {isOwned ? 'В ГАРАЖЕ' : `${currentCar.price.toLocaleString('ru-RU')} 🪙`}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Стрелка вправо */}
        <button onClick={handleNext} style={{
          position: 'absolute', right: '10px', zIndex: 10, background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.5)', fontSize: '40px', cursor: 'pointer', padding: '10px'
        }}>›</button>
      </div>

      {/* КНОПКА ПОКУПКИ */}
      <div style={{ padding: '20px 20px 40px 20px', zIndex: 10 }}>
        <button
          onClick={handleBuy}
          disabled={isOwned || !canAfford || isBuying}
          style={{
            width: '100%', padding: '18px', borderRadius: '15px', border: 'none',
            fontSize: '18px', fontWeight: 'bold', cursor: (isOwned || !canAfford || isBuying) ? 'not-allowed' : 'pointer',
            background: isOwned ? 'rgba(0, 255, 65, 0.2)' : canAfford ? '#00FF41' : 'rgba(255,255,255,0.1)',
            color: isOwned ? '#00FF41' : canAfford ? 'black' : '#666',
            transition: 'all 0.2s ease',
            boxShadow: canAfford && !isOwned ? '0 0 20px rgba(0,255,65,0.4)' : 'none'
          }}
        >
          {isOwned 
            ? '✓ Уже куплено' 
            : !canAfford 
              ? 'Недостаточно монет' 
              : isBuying 
                ? 'Покупка...' 
                : 'КУПИТЬ'}
        </button>
      </div>
    </div>
  );
};