// src/components/CaseModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ITEMS } from '../config/items'; 
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import { useAdsgram } from '../hooks/useAdsgram';
import '../styles/case.css';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseType: 'bronze' | 'silver' | 'gold';
}

const CASE_ITEMS = {
  bronze: { price: 5000, items: ['engine_1', 'tires_1', 'coins_1000'] },
  silver: { price: 25000, items: ['engine_2', 'tires_2', 'coins_5000', 'ecu_1'] },
  gold: { price: 100000, items: ['engine_3', 'ecu_3', 'suspension_3', 'coins_25000'] }
};

export function CaseModal({ isOpen, onClose, caseType }: CaseModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [reelItems, setReelItems] = useState<string[]>([]);
  const [wonItem, setWonItem] = useState<string | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  
  const balance = useGameStore((s) => s.balance);
  const openCase = useGameStore((s) => s.openCase); 
  const syncTaps = useGameStore((s) => s.syncTaps);

  const caseConfig = CASE_ITEMS[caseType];
  const canAfford = balance >= caseConfig.price;

  // 👇 НАСТРОЙКА РЕКЛАМЫ
  const showAd = useAdsgram({
    blockId: '55414', 
    onReward: async () => {
      setIsWatchingAd(false);
      WebApp.showAlert("Реклама просмотрена! 5000 монет зачислено.");
      // Ждем полсекунды, чтобы сервер успел начислить монеты, и синхронизируем баланс
      setTimeout(() => syncTaps(), 500);
    },
    onError: (err) => {
      setIsWatchingAd(false);
      console.error("Ad error:", err);
      WebApp.showAlert("Реклама не была просмотрена до конца. Попробуйте позже.");
    },
  });

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    showAd();
  };

  const getItemData = (id: string) => {
    if (id.startsWith('coins_')) {
      const amount = id.split('_')[1];
      return { name: `${Number(amount).toLocaleString('ru-RU')} монет`, icon: '🪙' };
    }
    const item = (ITEMS as any)[id];
    return { 
      name: item?.name || 'Неизвестный предмет', 
      icon: item?.icon || '📦' 
    };
  };

  const handleOpenCase = async () => {
    if (!canAfford || isOpening) return;
    
    setIsOpening(true);
    setWonItem(null);
    setReelItems([]); 
    playSound('click');

    try {
      const res = await openCase(caseType);
      
      if (res.success && res.wonItem) {
        const newReel = Array.from({ length: 50 }, () => 
          caseConfig.items[Math.floor(Math.random() * caseConfig.items.length)]
        );
        newReel[45] = res.wonItem.id;
        
        setReelItems(newReel);
        setWonItem(res.wonItem.id);

        setTimeout(() => {
          setIsOpening(false);
          playSound(res.wonItem.rarity === 'legendary' ? 'win' : 'coin');
          try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}
        }, 4200);

      } else {
        setIsOpening(false);
        console.error("Сервер вернул отказ:", res);
        WebApp.showAlert("Не удалось открыть кейс. Проверьте баланс.");
      }
    } catch (e) {
      console.error("Ошибка сети:", e);
      setIsOpening(false);
      WebApp.showAlert("Ошибка соединения с сервером.");
    }
  };

  const ITEM_WIDTH = 100; 
  const targetX = -(45 * ITEM_WIDTH) + (window.innerWidth / 2) - (ITEM_WIDTH / 2);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateZ(0)' }}
    >
      <div style={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
        
        <div className="case-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'white' }}>{caseType.toUpperCase()} КЕЙС</h2>
          <button onClick={onClose} disabled={isOpening} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '35px', height: '35px', fontSize: '18px', cursor: isOpening ? 'not-allowed' : 'pointer' }}>✕</button>
        </div>

        <div className="case-reel-container">
          <div className="case-reel-pointer" />
          
          {reelItems.length > 0 ? (
            <motion.div 
              className="case-reel"
              initial={{ x: 0 }}
              animate={{ x: targetX }}
              transition={{ duration: 4, ease: [0.1, 0.8, 0.2, 1] }}
            >
              {reelItems.map((itemId, index) => {
                const itemData = getItemData(itemId);
                return (
                  <div key={index} className="case-reel-item">
                    <div className="item-icon">{itemData.icon}</div>
                    <span className="item-name">{itemData.name}</span>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <div className="case-placeholder">Нажми кнопку, чтобы открыть</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', minHeight: '150px' }}>
          
          <AnimatePresence>
            {wonItem && !isOpening && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="case-result"
                style={{ textAlign: 'center', marginBottom: '15px' }}
              >
                <h3 style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '14px' }}>Вы получили:</h3>
                <div className="result-item" style={{ fontSize: '22px', fontWeight: '900', color: '#00FF41', textShadow: '0 0 10px rgba(0,255,65,0.5)' }}>
                  {getItemData(wonItem).name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка открытия за монеты */}
          <button 
            onClick={handleOpenCase} 
            disabled={!canAfford || isOpening || isWatchingAd}
            className={`open-case-btn ${canAfford && !isOpening ? 'active' : 'disabled'}`}
            style={{ width: '100%', maxWidth: '300px', padding: '15px', fontSize: '16px', borderRadius: '12px', marginBottom: '10px' }}
          >
            {isOpening ? 'Крутим...' : `Открыть за ${caseConfig.price.toLocaleString('ru-RU')} 🪙`}
          </button>

          {/* 👇 Кнопка рекламы */}
          <button 
            onClick={handleWatchAd}
            disabled={isOpening || isWatchingAd}
            style={{ 
              width: '100%', maxWidth: '300px', padding: '12px', 
              background: '#2b2b2b', color: '#fff', 
              borderRadius: '12px', border: '1px solid #555', 
              cursor: isOpening || isWatchingAd ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', fontSize: '14px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
            }}
          >
            {isWatchingAd ? 'Загрузка рекламы...' : '🎬 Смотреть рекламу (+5000 🪙)'}
          </button>

        </div>

      </div>
    </motion.div>
  );
}