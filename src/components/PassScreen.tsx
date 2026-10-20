import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PASS_LEVELS, PassLevel } from '../config/pass';

export const PassScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const getPass = useGameStore((s) => s.getPass);
  const claimPassReward = useGameStore((s) => s.claimPassReward);
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    getPass();
  }, [getPass]);

  const pass = user?.weeklyPass || { xp: 0, claimed: [] };

  const handleClaim = async (level: number) => {
    setLoading(level);
    await claimPassReward(level);
    setLoading(null);
  };

  const nextLevel = PASS_LEVELS.find(l => pass.xp < l.xpReq) || PASS_LEVELS[PASS_LEVELS.length - 1];
  const prevXpReq = nextLevel.level === 1 ? 0 : PASS_LEVELS[nextLevel.level - 2].xpReq;
  const progressPercent = Math.min(100, ((pass.xp - prevXpReq) / (nextLevel.xpReq - prevXpReq)) * 100);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#0a0a0a', zIndex: 1000, overflowY: 'auto', padding: '20px'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#00bfff', margin: 0 }}>🏁 Гоночный Пропуск</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Закрыть</button>
        </div>

        <div style={{ background: '#222', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>
            <span>Ур. {nextLevel.level - 1}</span>
            <span>{pass.xp.toLocaleString('ru-RU')} / {nextLevel.xpReq.toLocaleString('ru-RU')} XP</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: '#111', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#00bfff', transition: 'width 0.3s' }} />
          </div>
          <div style={{ color: '#555', fontSize: '11px', marginTop: '10px', textAlign: 'center' }}>
            Получайте XP за клики и победы в гонках. Сброс каждую неделю!
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PASS_LEVELS.map((lvl: PassLevel) => {
            const isClaimed = pass.claimed.includes(lvl.level);
            const canClaim = pass.xp >= lvl.xpReq && !isClaimed;
            const isLocked = pass.xp < lvl.xpReq;

            return (
              <div key={lvl.level} style={{
                background: isClaimed ? 'rgba(0,255,65,0.05)' : '#222',
                borderRadius: '12px', padding: '15px',
                border: canClaim ? '1px solid #00FF41' : '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: isLocked ? 0.6 : 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: isLocked ? '#333' : '#00bfff',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontWeight: 'bold', color: isLocked ? '#888' : '#000'
                  }}>
                    {lvl.level}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{lvl.reward.toLocaleString('ru-RU')} 🪙</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>Требуется: {lvl.xpReq.toLocaleString('ru-RU')} XP</div>
                  </div>
                </div>

                <button
                  onClick={() => handleClaim(lvl.level)}
                  disabled={!canClaim || loading === lvl.level}
                  style={{
                    background: isClaimed ? 'transparent' : canClaim ? '#00FF41' : '#333',
                    color: isClaimed ? '#00FF41' : canClaim ? '#000' : '#888',
                    border: isClaimed ? '1px solid #00FF41' : 'none',
                    padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold',
                    cursor: canClaim ? 'pointer' : 'default'
                  }}
                >
                  {isClaimed ? 'ПОЛУЧЕНО' : loading === lvl.level ? '...' : canClaim ? 'ЗАБРАТЬ' : 'ЗАКРЫТО'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};