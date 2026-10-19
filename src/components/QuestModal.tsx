import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';

interface Props {
  onClose: () => void;
}

const QUESTS_INFO = [
  { id: 'click_1000', title: 'Кликер', desc: 'Сделайте 1000 кликов', target: 1000, reward: 5000, icon: '👆' },
  { id: 'win_3', title: 'Гонщик', desc: 'Выиграйте 3 гонки', target: 3, reward: 15000, icon: '🏎️' },
  { id: 'sell_5', title: 'Барахолка', desc: 'Продайте 5 предметов', target: 5, reward: 5000, icon: '💰' },
];

export const QuestModal: React.FC<Props> = ({ onClose }) => {
  const claimQuest = useGameStore((s) => s.claimQuest);
  const [quests, setQuests] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initData = WebApp.initData || '';
    fetch('/api/game?action=getQuests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuests(data.quests);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  const handleClaim = async (questId: string) => {
    setLoadingId(questId);
    const newQuests = await claimQuest(questId);
    if (newQuests) {
      setQuests(newQuests);
      playSound('coin');
    }
    setLoadingId(null);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,215,0,0.3)', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
        
        <h2 style={{ color: '#ffd700', textAlign: 'center', margin: '0 0 20px 0' }}>📋 Ежедневные задания</h2>
        
        {/* Состояния загрузки и ошибки */}
        {!quests && !error && (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '20px 0' }}>
            Загрузка заданий...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#ff4444', padding: '20px 0' }}>
            Ошибка загрузки. Попробуйте позже.
          </div>
        )}

        {/* Список квестов */}
        {quests && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {QUESTS_INFO.map(q => {
              const progress = quests.progress?.[q.id] || 0;
              const isCompleted = progress >= q.target;
              const isClaimed = quests.claimed?.[q.id];
              const progressPercent = Math.min(100, (progress / q.target) * 100);

              return (
                <div key={q.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{q.icon}</span>
                      <div>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>{q.title}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{q.desc}</div>
                      </div>
                    </div>
                    <div style={{ color: '#ffd700', fontWeight: 'bold' }}>{q.reward} 🪙</div>
                  </div>

                  <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', marginBottom: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: isCompleted ? '#00FF41' : '#ffd700', transition: 'width 0.3s' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa', fontSize: '12px' }}>{progress} / {q.target}</span>
                    <button
                      onClick={() => handleClaim(q.id)}
                      disabled={!isCompleted || isClaimed || loadingId === q.id}
                      style={{
                        background: isClaimed ? 'transparent' : isCompleted ? '#00FF41' : 'transparent',
                        color: isClaimed ? '#555' : isCompleted ? 'black' : '#888',
                        border: isClaimed ? 'none' : isCompleted ? 'none' : '1px solid #444',
                        padding: '6px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: (isCompleted && !isClaimed) ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {isClaimed ? 'ПОЛУЧЕНО' : loadingId === q.id ? '...' : isCompleted ? 'ЗАБРАТЬ' : 'В ПРОЦЕССЕ'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};