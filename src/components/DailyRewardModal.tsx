import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound';

interface Props {
  onClose: () => void;
}

const REWARDS = [1000, 2500, 5000, 10000, 25000, 50000, 100000];

// Вспомогательная функция: возвращает timestamp 00:00 по МСК (UTC+3)
// offsetDays = 0 (сегодня), 1 (завтра) и т.д.
const getMskMidnight = (offsetDays = 0) => {
  const now = new Date();
  const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // Переводим в UTC+3
  mskTime.setUTCHours(0, 0, 0, 0); // Ставим 00:00
  mskTime.setUTCDate(mskTime.getUTCDate() + offsetDays); // Прибавляем дни
  return mskTime.getTime() - 3 * 60 * 60 * 1000; // Возвращаем в UTC timestamp
};

export const DailyRewardModal: React.FC<Props> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const claimDaily = useGameStore((s) => s.claimDaily);
  const [isLoading, setIsLoading] = useState(false);

  const streak = user?.dailyStreak || 0;
  const lastClaim = user?.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canClaim, setCanClaim] = useState<boolean>(true);

  useEffect(() => {
    const updateTimer = () => {
      if (!lastClaim) {
        setCanClaim(true);
        setTimeLeft(0);
        return;
      }

      const todayMidnight = getMskMidnight(0); // Начало сегодняшнего дня (00:00 МСК)
      
      // Если последний клейм был до сегодняшней полуночи МСК — награда доступна
      if (lastClaim.getTime() < todayMidnight) {
        setCanClaim(true);
        setTimeLeft(0);
      } else {
        // Иначе показываем таймер до следующей полуночи (завтрашней)
        const nextMidnight = getMskMidnight(1);
        setCanClaim(false);
        setTimeLeft(nextMidnight - Date.now());
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastClaim]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  let activeDay = streak;
  if (canClaim) {
    activeDay = (streak % 7) + 1;
  }

  const handleClaim = async () => {
    if (isLoading || !canClaim) return;
    setIsLoading(true);
    try {
      const success = await claimDaily();
      if (success) {
        playSound('coin');
        // После успешного получения принудительно обновляем таймер
        const nextMidnight = getMskMidnight(1);
        setTimeLeft(nextMidnight - Date.now());
        setCanClaim(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      paddingTop: 'var(--tg-safe-top, 0px)', // 👈 Добавлен безопасный отступ сверху
      paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px'
    }}>
      <div style={{ 
        background: '#1a1a1a', 
        borderRadius: '20px', 
        padding: '25px', 
        width: '100%', 
        maxWidth: '400px', 
        border: '1px solid rgba(255,215,0,0.3)',
        position: 'relative'
      }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ✕
        </button>

        <h2 style={{ color: '#ffd700', textAlign: 'center', margin: '0 0 20px 0' }}>🎁 Ежедневный бонус</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {REWARDS.slice(0, 6).map((reward, index) => {
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

        {!canClaim && timeLeft > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <span style={{ color: '#aaa', fontSize: '13px' }}>Следующая награда через:</span>
            <div style={{ color: '#ffd700', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px' }}>
              {formatTime(timeLeft)}
            </div>
          </div>
        )}

        <button
          onClick={canClaim ? handleClaim : undefined}
          disabled={!canClaim || isLoading}
          style={{
            width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
            fontSize: '16px', fontWeight: 'bold',
            background: !canClaim ? 'rgba(255,255,255,0.05)' : isLoading ? '#888' : '#ffd700',
            color: !canClaim ? '#666' : 'black',
            cursor: (!canClaim || isLoading) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isLoading ? 'ПОЛУЧАЕМ...' : canClaim ? 'ЗАБРАТЬ НАГРАДУ' : 'ПОДОЖДИТЕ'}
        </button>
      </div>
    </div>
  );
};