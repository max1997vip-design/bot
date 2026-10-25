import React, { useState } from 'react';
import { useGameStore, PartUpgrade } from '../store/gameStore';
import { ITEMS, RARITY_COLORS } from '../config/items';

export const WorkshopScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const equipped = useGameStore((s) => s.equipped);
  const inventory = useGameStore((s) => s.inventory);
  const upgradePart = useGameStore((s) => s.upgradePart);
  const claimUpgrade = useGameStore((s) => s.claimUpgrade);
  const craftItem = useGameStore((s) => s.craftItem);
  const [loading, setLoading] = useState<string | null>(null);

  const partUpgrades: Record<string, PartUpgrade> = user?.partUpgrades || {};

  const itemCounts = inventory.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const craftableIds = Object.keys(itemCounts).filter(id => itemCounts[id] >= 5);

  const handleUpgrade = async (itemId: string, type: 'level' | 'gold' | 'red') => {
    setLoading(`${itemId}_${type}`);
    await upgradePart(itemId, type);
    setLoading(null);
  };

  const handleClaim = async (itemId: string) => {
    setLoading(`${itemId}_claim`);
    await claimUpgrade(itemId);
    setLoading(null);
  };

  const handleCraft = async (itemId: string) => {
    setLoading(`craft_${itemId}`);
    await craftItem(itemId);
    setLoading(null);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#111', zIndex: 1000, overflowY: 'auto', 
      padding: '20px',
      paddingTop: 'calc(20px + var(--tg-safe-top, 0px))', // 👈 ДОБАВЛЕНА ЭТА СТРОКА
      paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>🔧 Мастерская</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Закрыть</button>
        </div>

        <h3 style={{ color: '#ffd700', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Улучшение деталей</h3>
        <p style={{ color: '#aaa', fontSize: '13px' }}>Улучшайте детали за монеты. Прокачка занимает реальное время!</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          {Object.values(equipped)
            .filter((id): id is string => Boolean(id))
            .map(itemId => {
            const item = ITEMS[itemId];
            if (!item) return null;

            const upg = partUpgrades[itemId] || { level: 0, goldStars: 0, redStars: 0, upgradingUntil: null, upgradeType: null };
            
            const isUpgrading = !!upg.upgradingUntil && upg.upgradingUntil > Date.now();
            const canClaim = !!upg.upgradingUntil && upg.upgradingUntil <= Date.now();
            
            const timeLeft = isUpgrading ? Math.ceil((upg.upgradingUntil! - Date.now()) / 60000) : 0;

            return (
              <div key={itemId} style={{ background: '#222', borderRadius: '12px', padding: '15px', border: `1px solid ${RARITY_COLORS[item.rarity]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: RARITY_COLORS[item.rarity], fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>
                      Ур: {upg.level}/50 | <span style={{ color: 'gold' }}>★ {upg.goldStars}</span> | <span style={{ color: 'red' }}>★ {upg.redStars}</span>
                    </div>
                  </div>
                  {isUpgrading ? (
                    <div style={{ color: '#ffd700', fontSize: '12px' }}>Улучшается... {timeLeft} мин</div>
                  ) : canClaim ? (
                    <button onClick={() => handleClaim(itemId)} style={{ background: '#00FF41', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                      ЗАБРАТЬ
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {upg.level < 50 && (
                        <button onClick={() => handleUpgrade(itemId, 'level')} disabled={loading === `${itemId}_level`} style={{ background: '#444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                          +1 Ур
                        </button>
                      )}
                      {upg.level >= 50 && upg.goldStars < 5 && (
                        <button onClick={() => handleUpgrade(itemId, 'gold')} disabled={loading === `${itemId}_gold`} style={{ background: 'gold', color: '#000', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                          +★ Золото
                        </button>
                      )}
                      {upg.goldStars >= 5 && upg.redStars < 5 && (
                        <button onClick={() => handleUpgrade(itemId, 'red')} disabled={loading === `${itemId}_red`} style={{ background: 'red', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                          +★ Красная
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <h3 style={{ color: '#00bfff', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: '30px' }}>Крафт деталей</h3>
        <p style={{ color: '#aaa', fontSize: '13px' }}>Объедините 5 одинаковых деталей, чтобы получить деталь на ранг выше.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          {craftableIds.length === 0 && <div style={{ color: '#666' }}>У вас нет 5 одинаковых деталей для крафта.</div>}
          {craftableIds.map(itemId => {
            const item = ITEMS[itemId];
            if (!item) return null;

            const count = itemCounts[itemId];
            return (
              <div key={itemId} style={{ background: '#222', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: RARITY_COLORS[item.rarity], fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>В наличии: {count} шт.</div>
                </div>
                <button onClick={() => handleCraft(itemId)} disabled={loading === `craft_${itemId}`} style={{ background: '#00bfff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {loading === `craft_${itemId}` ? '...' : 'СКРАФТИТЬ'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};