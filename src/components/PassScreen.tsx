// src/components/PassScreen.tsx
import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PASS_LEVELS, PassLevel } from '../config/pass';

export const PassScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const getPass = useGameStore((s) => s.getPass);
  const claimPassReward = useGameStore((s) => s.claimPassReward);
  const buyPremiumPass = useGameStore((s) => s.buyPremiumPass);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    getPass();
  }, [getPass]);

  const pass = user?.weeklyPass || { xp: 0, isPremium: false, claimed: [], claimedPremium: [] };
  const isPremium = pass.isPremium || false;

  const handleClaim = async (level: number, track: 'free' | 'premium') => {
    setLoading(`${level}_${track}`);
    await claimPassReward(level, track);
    setLoading(null);
  };

  const handleBuyPremium = async () => {
    if (!window.confirm('Купить Премиум Пропуск за 500,000 🪙?\n\nВы получите х3 опыта и х3 награды!')) return;
    setLoading('buy');
    const success = await buyPremiumPass();
    if (!success) alert('Не хватает монет или произошла ошибка!');
    setLoading(null);
  };

  const nextLevel = PASS_LEVELS.find(l => pass.xp < l.xpReq) || PASS_LEVELS[PASS_LEVELS.length - 1];
  const prevXpReq = nextLevel.level === 1 ? 0 : PASS_LEVELS[nextLevel.level - 2].xpReq;
  const progressPercent = Math.min(100, ((pass.xp - prevXpReq) / (nextLevel.xpReq - prevXpReq)) * 100);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#0a0a0a', zIndex: 1000, overflowY: 'auto', 
      padding: '20px',
      paddingTop: 'calc(20px + var(--tg-safe-top, 0px))'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Шапка */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#00bfff', margin: 0 }}>🏁 Гоночный Пропуск</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Закрыть</button>
        </div>

        {/* Кнопка покупки Премиума */}
        {!isPremium && (
          <button
            onClick={handleBuyPremium}
            disabled={loading === 'buy'}
            style={{
              width: '100%', padding: '15px', marginBottom: '20px',
              background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
              color: '#000', border: 'none', borderRadius: '12px',
              fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
          >
            {loading === 'buy' ? '...' : '👑 КУПИТЬ ПРЕМИУМ (500,000 🪙)'}
          </button>
        )}

        {isPremium && (
          <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid #ffd700', padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', color: '#ffd700', fontWeight: 'bold' }}>
            👑 ПРЕМИУМ АКТИВЕН: х3 ОПЫТ И х3 НАГРАДЫ!
          </div>
        )}

        {/* Прогресс бар */}
        <div style={{ background: '#222', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>
            <span>Ур. {nextLevel.level - 1}</span>
            <span>{pass.xp.toLocaleString('ru-RU')} / {nextLevel.xpReq.toLocaleString('ru-RU')} XP</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: '#111', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: isPremium ? '#ffd700' : '#00bfff', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Список уровней */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {PASS_LEVELS.map((lvl: PassLevel) => {
            const isFreeClaimed = pass.claimed.includes(lvl.level);
            const canClaimFree = pass.xp >= lvl.xpReq && !isFreeClaimed;

            const isPremiumClaimed = pass.claimedPremium?.includes(lvl.level);
            const canClaimPremium = pass.xp >= lvl.xpReq && !isPremiumClaimed && isPremium;

            return (
              <div key={lvl.level} style={{
                background: '#1a1a1a', borderRadius: '16px', padding: '15px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                  <div style={{
                    width: '35px', height: '35px', borderRadius: '50%',
                    background: pass.xp >= lvl.xpReq ? (isPremium ? '#ffd700' : '#00bfff') : '#333',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontWeight: 'bold', color: pass.xp >= lvl.xpReq ? '#000' : '#888'
                  }}>
                    {lvl.level}
                  </div>
                  <div style={{ color: '#888', fontSize: '13px' }}>Требуется: {lvl.xpReq.toLocaleString('ru-RU')} XP</div>
                </div>

                {/* Бесплатная дорожка */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', background: '#222', padding: '10px 15px', borderRadius: '10px' }}>
                  <div>
                    <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 'bold' }}>БЕСПЛАТНО</div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{lvl.reward.toLocaleString('ru-RU')} 🪙</div>
                  </div>
                  <button
                    onClick={() => handleClaim(lvl.level, 'free')}
                    disabled={!canClaimFree || loading === `${lvl.level}_free`}
                    style={{
                      background: isFreeClaimed ? 'transparent' : canClaimFree ? '#00FF41' : '#333',
                      color: isFreeClaimed ? '#00FF41' : canClaimFree ? '#000' : '#888',
                      border: isFreeClaimed ? '1px solid #00FF41' : 'none',
                      padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px',
                      cursor: canClaimFree ? 'pointer' : 'default'
                    }}
                  >
                    {isFreeClaimed ? 'ПОЛУЧЕНО' : loading === `${lvl.level}_free` ? '...' : canClaimFree ? 'ЗАБРАТЬ' : 'ЗАКРЫТО'}
                  </button>
                </div>

                {/* Премиум дорожка */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,215,0,0.05)', padding: '10px 15px', borderRadius: '10px', border: '1px solid rgba(255,215,0,0.2)' }}>
                  <div>
                    <div style={{ color: '#ffd700', fontSize: '11px', fontWeight: 'bold' }}>👑 ПРЕМИУМ (x3)</div>
                    <div style={{ color: '#ffd700', fontWeight: 'bold' }}>{(lvl.reward * 3).toLocaleString('ru-RU')} 🪙</div>
                  </div>
                  <button
                    onClick={() => handleClaim(lvl.level, 'premium')}
                    disabled={!canClaimPremium || loading === `${lvl.level}_premium`}
                    style={{
                      background: isPremiumClaimed ? 'transparent' : canClaimPremium ? '#ffd700' : '#333',
                      color: isPremiumClaimed ? '#ffd700' : canClaimPremium ? '#000' : '#888',
                      border: isPremiumClaimed ? '1px solid #ffd700' : 'none',
                      padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px',
                      cursor: canClaimPremium ? 'pointer' : 'default'
                    }}
                  >
                    {isPremiumClaimed ? 'ПОЛУЧЕНО' : !isPremium ? '🔒 ЗАКРЫТО' : loading === `${lvl.level}_premium` ? '...' : canClaimPremium ? 'ЗАБРАТЬ' : 'НЕТ XP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};