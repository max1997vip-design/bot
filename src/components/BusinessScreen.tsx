import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BUSINESSES, getBusinessUpgradeCost, getBusinessIncome, BusinessConfig } from '../config/businesses';

export const BusinessScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const buyBusiness = useGameStore((s) => s.buyBusiness);
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);
  const collectIncome = useGameStore((s) => s.collectIncome);
  const [loading, setLoading] = useState<string | null>(null);

  const businesses = user?.businesses || {};
  const now = Date.now();
  let totalPending = 0;

  Object.entries(businesses).forEach(([id, data]) => {
    const config = BUSINESSES[id];
    if (!config) return;
    const hoursPassed = Math.min((now - data.lastCollected) / (1000 * 60 * 60), 24);
    if (hoursPassed > 0) {
      totalPending += Math.floor(getBusinessIncome(config.baseIncomePerHour, data.level) * hoursPassed);
    }
  });

  const handleAction = async (action: () => Promise<any>, id: string) => {
    setLoading(id);
    await action();
    setLoading(null);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#111', zIndex: 1000, overflowY: 'auto', padding: '20px',
      paddingTop: 'calc(20px + var(--tg-safe-top, 0px))', // 👈 ДОБАВИТЬ
      paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' // 👈 ДОБАВИТЬ (для iPhone)

    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>🏢 Бизнесы</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Закрыть</button>
        </div>

        {totalPending > 0 && (
          <div style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid #00FF41', borderRadius: '12px', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#00FF41', fontWeight: 'bold' }}>Доступно к сбору:</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{totalPending.toLocaleString('ru-RU')} 🪙</div>
            </div>
            <button 
              onClick={() => handleAction(collectIncome, 'collect')}
              disabled={loading === 'collect'}
              style={{ background: '#00FF41', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading === 'collect' ? '...' : 'СОБРАТЬ'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {Object.values(BUSINESSES).map((config: BusinessConfig) => {
            const owned = businesses[config.id];
            const level = owned?.level || 0;
            const upgradeCost = getBusinessUpgradeCost(config.baseCost, level);
            const income = getBusinessIncome(config.baseIncomePerHour, level || 1);

            return (
              <div key={config.id} style={{ background: '#222', borderRadius: '12px', padding: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ fontSize: '32px' }}>{config.icon}</div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>{config.name}</div>
                      <div style={{ color: '#888', fontSize: '12px' }}>{config.description}</div>
                      {owned && (
                        <div style={{ color: '#ffd700', fontSize: '13px', marginTop: '4px' }}>
                          Ур. {level} | Доход: {income.toLocaleString('ru-RU')} 🪙/час
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!owned ? (
                    <button 
                      onClick={() => handleAction(() => buyBusiness(config.id), config.id)}
                      disabled={loading === config.id}
                      style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {config.baseCost.toLocaleString('ru-RU')} 🪙
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleAction(() => upgradeBusiness(config.id), config.id)}
                      disabled={loading === config.id}
                      style={{ background: 'rgba(255,215,0,0.2)', color: '#ffd700', border: '1px solid #ffd700', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {upgradeCost.toLocaleString('ru-RU')} 🪙
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};