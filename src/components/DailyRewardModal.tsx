import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound';

interface Props {
  onClose: () => void;
}

const REWARDS = [1000, 2500, 5000, 10000, 25000, 50000, 100000];

export const DailyRewardModal: React.FC<Props> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const claimDaily = useGameStore((s) => s.claimDaily);
  const [isLoading, setIsLoading] = useState(false);

  const streak = user?.dailyStreak || 0;
  const lastClaim = user?.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
  
  // Проверка, можно ли забрать награду
  const canClaim = !lastClaim || (Date.now() - lastClaim.getTime()) >= 24 * 60 * 60 * 1000;
  
  // Вычисляем, какой день сейчас активен
  let activeDay = streak;
  if (canClaim) {
    activeDay = (streak % 7) + 1;
  }

  const handleClaim = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const success = await claimDaily();
      if (success) {
        playSound('coin');
      } else {
        console.error('Не удалось забрать награду (ошибка сервера или рано)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,215,0,0.3)' }}>
        <h2 style={{ color: '#ffd700', textAlign: 'center', margin: '0 0 20px 0' }}>🎁 Ежедневный бонус</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {REWARDS.map((reward, index) => {
            const day = index + 1;
            const isClaimed = streak >= day && !canClaim;
            const isActive = day === activeDay && canClaim;
            
            return (
              <div key={day} style={{
                background: isActive ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
                border: isActive ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '10px 5px', textAlign: 'center',
                opacity: isClaimed ? 0.5 : 1,
                position: 'relative'
              }}>
                <div style={{ fontSize: '11px', color: isActive ? '#ffd700' : '#888', marginBottom: '4px', fontWeight: 'bold' }}>
                  День {day}
                </div>
                <div style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>
                  {reward.toLocaleString('ru-RU')}
                </div>
                <div style={{ fontSize: '10px', color: '#ffd700' }}>🪙</div>
                {isClaimed && <div style={{ position: 'absolute', top: 2, right: 4, color: '#00FF41', fontSize: '14px' }}>✓</div>}
              </div>
            );
          })}
          {/* 7-й день на всю ширину */}
          <div style={{
             gridColumn: 'span 3',
             background: activeDay === 7 && canClaim ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
             border: activeDay === 7 && canClaim ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
             borderRadius: '10px', padding: '12px', textAlign: 'center',
             opacity: streak >= 7 && !canClaim ? 0.5 : 1,
             marginTop: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px'
          }}>
             <div style={{ color: '#888', fontSize: '12px', fontWeight: 'bold' }}>День 7</div>
             <div style={{ color: '#00FF41', fontSize: '18px', fontWeight: 'bold' }}>100,000 🪙</div>
          </div>
        </div>

        <button
          onClick={canClaim ? handleClaim : onClose}
          disabled={!canClaim || isLoading}
          style={{
            width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
            fontSize: '16px', fontWeight: 'bold',
            background: !canClaim ? '#333' : isLoading ? '#888' : '#ffd700',
            color: !canClaim ? '#666' : 'black',
            cursor: (!canClaim || isLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'ПОЛУЧАЕМ...' : canClaim ? 'ЗАБРАТЬ НАГРАДУ' : 'ЗАКРЫТЬ'}
        </button>
      </div>
    </div>
  );
};