// src/components/ShopModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';

export function ShopModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const syncTaps = useGameStore((s) => s.syncTaps);

  // 👇 Дублируем конфиг с бэкенда для отображения
  const SHOP_ITEMS = [
    { id: 'stars_500', title: '500 звёзд', stars: 20, type: 'stars', icon: '⭐' },
    { id: 'stars_3000', title: '3000 звёзд (+10%)', stars: 100, type: 'stars', icon: '🌟' },
    { id: 'coins_100k', title: '100 000 монет', stars: 10, type: 'coins', icon: '🪙' },
    { id: 'coins_1m', title: '1 000 000 монет', stars: 80, type: 'coins', icon: '💰' },
    { id: 'battle_pass_s1', title: 'Battle Pass — Сезон 1', stars: 150, type: 'pass', icon: '🏁' },
    { id: 'boost_x2_24h', title: 'Буст ×2 дохода (24ч)', stars: 30, type: 'boost', icon: '⚡' },
  ];

  const handleBuy = async (itemId: string) => {
    if (isLoading) return;
    setIsLoading(itemId);
    
    try {
      const initData = WebApp.initData || '';
      
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, itemId }),
      });
      
      const data = await res.json();

      if (data.invoiceLink) {
        WebApp.openInvoice(data.invoiceLink, (status) => {
          if (status === 'paid') {
            WebApp.showAlert("Оплата прошла успешно! Предмет зачислен.");
            setTimeout(() => syncTaps(), 1000); // Синхронизируем баланс
            onClose();
          } else if (status === 'failed') {
            WebApp.showAlert("Ошибка при оплате.");
          }
          setIsLoading(null);
        });
      } else {
        WebApp.showAlert(data.error || "Не удалось создать счет.");
        setIsLoading(null);
      }
    } catch (e) {
      console.error(e);
      WebApp.showAlert("Ошибка сети.");
      setIsLoading(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>🛒 Магазин</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', fontSize: '16px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SHOP_ITEMS.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' }}>{item.icon}</span>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{item.title}</div>
                  {/* Можно добавить описание, если нужно */}
                </div>
              </div>
              
              <button 
                onClick={() => handleBuy(item.id)}
                disabled={isLoading !== null}
                style={{ 
                  background: isLoading === item.id ? '#555' : (item.type === 'stars' ? '#ffd700' : '#00FF41'), 
                  color: 'black', 
                  border: 'none', padding: '8px 12px', borderRadius: '8px', 
                  fontWeight: 'bold', fontSize: '13px', 
                  cursor: isLoading !== null ? 'not-allowed' : 'pointer',
                  minWidth: '70px'
                }}
              >
                {isLoading === item.id ? '...' : `${item.stars} ⭐`}
              </button>

            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}