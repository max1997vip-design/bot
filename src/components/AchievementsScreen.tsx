// src/components/AchievementsScreen.tsx
import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound';

export const AchievementsScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const achievementsList = useGameStore((s) => s.achievementsList);
  const getAchievements = useGameStore((s) => s.getAchievements);
  const claimAchievement = useGameStore((s) => s.claimAchievement);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  const handleClaim = async (id: string) => {
    setLoading(id);
    const success = await claimAchievement(id);
    if (success) playSound('coin');
    setLoading(null);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#0a0a0a', zIndex: 1000, overflowY: 'auto',
      padding: '20px',
      paddingTop: 'calc(20px + var(--tg-safe-top, 0px))'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#ffd700', margin: 0 }}>🏆 Достижения</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Закрыть</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {achievementsList.map((ach) => (
            <div key={ach.id} style={{
              background: ach.isUnlocked ? 'rgba(0,255,65,0.05)' : '#222',
              borderRadius: '12px', padding: '15px',
              border: ach.isCompleted && !ach.isUnlocked ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', gap: '15px'
            }}>
              <div style={{ 
                fontSize: '36px', 
                opacity: ach.isCompleted || ach.isUnlocked ? 1 : 0.5,
                filter: ach.isCompleted || ach.isUnlocked ? 'none' : 'grayscale(100%)'
              }}>
                {ach.icon}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>{ach.name}</div>
                <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>{ach.description}</div>
                <div style={{ color: '#ffd700', fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>
                  Награда: {ach.reward.toLocaleString('ru-RU')} 🪙
                </div>
              </div>

              {ach.isUnlocked ? (
                <div style={{ color: '#00FF41', fontWeight: 'bold', fontSize: '12px' }}>ПОЛУЧЕНО</div>
              ) : ach.isCompleted ? (
                <button
                  onClick={() => handleClaim(ach.id)}
                  disabled={loading === ach.id}
                  style={{ background: '#ffd700', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {loading === ach.id ? '...' : 'ЗАБРАТЬ'}
                </button>
              ) : (
                <div style={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>В ПРОЦЕССЕ</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};