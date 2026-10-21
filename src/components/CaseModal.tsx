// src/components/CaseModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ITEMS } from '../config/items'; 
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
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
  
  const balance = useGameStore((s) => s.balance);
  const openCase = useGameStore((s) => s.openCase); 

  const caseConfig = CASE_ITEMS[caseType];
  const canAfford = balance >= caseConfig.price;

  // 👇 Безопасное получение данных о предмете (решает ошибку TS и монеты)
  const getItemData = (id: string) => {
    if (id.startsWith('coins_')) {
      const amount = id.split('_')[1];
      return { name: `${Number(amount).toLocaleString('ru-RU')} монет`, icon: '🪙' };
    }
    // Приводим ITEMS к any, чтобы TS не ругался на отсутствующие ключи
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
        // 👇 ВОТ ЗДЕСЬ должен быть лог ответа сервера (в блоке else, а не в catch)
        console.error("Сервер вернул отказ:", res);
        alert("Сервер не разрешил открыть кейс. Проверь консоль.");
      }
    } catch (e) {
      // 👇 А здесь мы ловим только ошибки сети (интернет пропал, сервер упал)
      console.error("Ошибка сети:", e);
      setIsOpening(false);
      alert("Ошибка соединения с сервером.");
    }
  };

  const ITEM_WIDTH = 100; // Ширина 90px + отступ gap 10px
  // Сдвиг, чтобы 45-й элемент встал ровно по центру экрана
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

        {/* Окно рулетки */}
        <div className="case-reel-container">
          <div className="case-reel-pointer" />
          
          {reelItems.length > 0 ? (
            <motion.div 
              className="case-reel"
              initial={{ x: 0 }}
              animate={{ x: targetX }}
              transition={{ duration: 4, ease: [0.1, 0.8, 0.2, 1] }} // Плавное замедление
            >
              {reelItems.map((itemId, index) => {
                const itemData = getItemData(itemId); // 👈 Используем безопасную функцию
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

        {/* Кнопка открытия / Результат */}
        <div className="case-actions">
          {!wonItem ? (
            <button 
              onClick={handleOpenCase} 
              disabled={!canAfford || isOpening}
              className={`open-case-btn ${canAfford ? 'active' : 'disabled'}`}
            >
              {isOpening ? 'Открываем...' : `Открыть за ${caseConfig.price.toLocaleString('ru-RU')} 🪙`}
            </button>
          ) : (
            !isOpening && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="case-result"
              >
                <h3>Вы получили:</h3>
                <div className="result-item">{getItemData(wonItem).name}</div> {/* 👈 Используем безопасную функцию */}
              </motion.div>
            )
          )}
        </div>

      </div>
    </motion.div>
  );
}