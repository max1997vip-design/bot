// src/components/CaseModal.tsx
import { useState, useEffect, useRef } from 'react';
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
  caseType: string;
}

const CASE_ITEMS: Record<string, any> = {
  hourly: { name: 'Рекламный', price: 0, icon: '🎬', currency: 'ad', cooldown: 3600000 },
  silver: { name: 'Серебряный', price: 25000, icon: '🎁', currency: 'coins' },
  gold: { name: 'Золотой', price: 100000, icon: '🏆', currency: 'coins' },
  platinum: { name: 'Платиновый', price: 500000, icon: '💎', currency: 'coins' },
  diamond: { name: 'Алмазный', price: 2000000, icon: '💠', currency: 'coins' },
  star_premium: { name: 'Звездный', price: 50, icon: '⭐', currency: 'stars' }
};

const CASE_ITEMS_POOL = {
  hourly: [
    'coins_5000', 'coins_5000', 'coins_5000', 'coins_5000', 'coins_5000',
    'coins_10000', 'coins_10000', 'coins_10000', 'coins_10000', 'coins_10000',
    'coins_20000', 'coins_20000', 'coins_20000',
    'engine_2', 'engine_2', 'engine_2',
    'tires_2', 'tires_2',
    'ecu_2', 'ecu_2'
  ],
  silver: [
    'coins_10000', 'coins_10000', 'coins_10000', 'coins_10000', 'coins_10000',
    'coins_25000', 'coins_25000', 'coins_25000', 'coins_25000', 'coins_25000',
    'coins_40000', 'coins_40000', 'coins_40000',
    'engine_2', 'engine_2', 'engine_2',
    'tires_2', 'tires_2',
    'ecu_1', 'ecu_1'
  ],
  gold: [
    'coins_50000', 'coins_50000', 'coins_50000', 'coins_50000', 'coins_50000',
    'coins_100000', 'coins_100000', 'coins_100000', 'coins_100000', 'coins_100000',
    'coins_150000', 'coins_150000', 'coins_150000',
    'engine_3', 'engine_3', 'engine_3',
    'ecu_3', 'ecu_3',
    'susp_3', 'susp_3'
  ],
  platinum: [
    'coins_250000', 'coins_250000', 'coins_250000', 'coins_250000', 'coins_250000',
    'coins_500000', 'coins_500000', 'coins_500000', 'coins_500000', 'coins_500000',
    'coins_750000', 'coins_750000', 'coins_750000',
    'engine_4', 'engine_4', 'engine_4',
    'tires_4', 'tires_4',
    'ecu_4', 'ecu_4', // 👈 Добавлена прошивка
    'susp_4', 'susp_4'
  ],
  diamond: [
    'coins_1000000', 'coins_1000000', 'coins_1000000', 'coins_1000000', 'coins_1000000',
    'coins_2000000', 'coins_2000000', 'coins_2000000', 'coins_2000000', 'coins_2000000',
    'coins_3000000', 'coins_3000000', 'coins_3000000',
    'engine_5', 'engine_5', 
    'tires_5', 'tires_5',
    'ecu_5', 'ecu_5', // 👈 Добавлена прошивка
    'susp_5'
  ],
  star_premium: [
    'coins_2000000', 'coins_2000000', 'coins_2000000', 'coins_2000000', 'coins_2000000',
    'coins_5000000', 'coins_5000000', 'coins_5000000', 'coins_5000000', 'coins_5000000',
    'coins_10000000', 'coins_10000000', 'coins_10000000',
    'engine_5', 'engine_5', 'engine_5',
    'tires_5', 'tires_5',
    'ecu_5', // 👈 Добавлена прошивка
    'susp_5'
  ]
};

export function CaseModal({ isOpen, onClose, caseType: initialCaseType }: CaseModalProps) {
  const [activeCase, setActiveCase] = useState(initialCaseType || 'hourly');
  const [isOpening, setIsOpening] = useState(false);
  const [reelItems, setReelItems] = useState<string[]>([]);
  const [wonItem, setWonItem] = useState<any | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [pendingAdOpen, setPendingAdOpen] = useState(false);
  const [targetX, setTargetX] = useState(0);
  
  const reelRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isWatchingAd, pendingAdOpen, activeCase });
  useEffect(() => {
    stateRef.current = { isWatchingAd, pendingAdOpen, activeCase };
  }, [isWatchingAd, pendingAdOpen, activeCase]);

  const balance = useGameStore((s) => s.balance);
  const user = useGameStore((s) => s.user);
  const openCase = useGameStore((s) => s.openCase); 

  const caseConfig = CASE_ITEMS[activeCase];
  const itemsPool = CASE_ITEMS_POOL[activeCase as keyof typeof CASE_ITEMS_POOL];

  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (activeCase !== 'hourly' || !user?.lastAdCaseAt) return;
    const interval = setInterval(() => {
      const last = new Date(user.lastAdCaseAt!).getTime();
      const remaining = Math.max(0, (last + 3600000) - Date.now());
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCase, user?.lastAdCaseAt]);

  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}м ${s}с`;
  };

  const executeCaseOpening = async (caseTypeToOpen: string) => {
    setIsOpening(true);
    setWonItem(null);
    setReelItems([]); 
    playSound('click');

    try {
      const res = await openCase(caseTypeToOpen);
      
      if (res.success && res.wonItem) {
        const pool = CASE_ITEMS_POOL[caseTypeToOpen as keyof typeof CASE_ITEMS_POOL];
        const newReel = Array.from({ length: 50 }, () => 
          pool[Math.floor(Math.random() * pool.length)]
        );
        newReel[45] = res.wonItem.id;
        
        setReelItems(newReel);
        setWonItem(res.wonItem);

        const containerWidth = reelRef.current ? reelRef.current.offsetWidth : 300;
        const ITEM_WIDTH = 100;
        const exactX = (containerWidth / 2) - (45 * ITEM_WIDTH + 45);
        
        setTargetX(exactX);

        setTimeout(() => {
          setIsOpening(false);
          playSound(res.wonItem.rarity === 'legendary' ? 'win' : 'coin');
          try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}
        }, 4200);
      } else {
        setIsOpening(false);
        WebApp.showAlert(res.error || "Не удалось открыть кейс.");
      }
    } catch (e) {
      setIsOpening(false);
      WebApp.showAlert("Ошибка соединения с сервером.");
    }
  };

  const showAd = useAdsgram({
    blockId: '55486', 
    onReward: async () => {
      setIsWatchingAd(false);
      setPendingAdOpen(false);
      setTimeout(() => {
        executeCaseOpening(stateRef.current.activeCase);
      }, 100);
    },
    onError: (err) => {
      setIsWatchingAd(false);
      setPendingAdOpen(false);
      WebApp.showAlert("Реклама не была просмотрена до конца. Попробуйте позже.");
    },
  });

  const getItemData = (id: string) => {
    if (id.startsWith('coins_')) {
      const amount = id.split('_')[1];
      return { name: `${Number(amount).toLocaleString('ru-RU')} монет`, icon: '🪙', rarity: 'common' };
    }
    const item = (ITEMS as any)[id];
    
    let icon = '📦';
    if (item?.slot === 'engine') icon = '⚙️';
    else if (item?.slot === 'tires') icon = '🛞';
    else if (item?.slot === 'ecu') icon = '💻';
    else if (item?.slot === 'suspension') icon = '🧲';

    return { name: item?.name || 'Неизвестный предмет', icon, rarity: item?.rarity || 'common' };
  };

  const handleOpenClick = () => {
    if (isOpening || isWatchingAd) return;
    if (caseConfig.currency === 'ad') {
      if (timeLeft > 0) return;
      setPendingAdOpen(true);
      setIsWatchingAd(true);
      showAd();
    } else {
      executeCaseOpening(activeCase);
    }
  };

  if (!isOpen) return null;

  const canAfford = caseConfig.currency === 'coins' ? balance >= caseConfig.price : 
                    caseConfig.currency === 'stars' ? (user?.starsBalance || 0) >= caseConfig.price : true;

  return (
    <div className="case-overlay">
      <motion.div 
        className="case-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        
        <div className="case-header">
          <h2>Открытие Кейсов</h2>
          <button className="case-close-btn" onClick={onClose} disabled={isOpening}>✕</button>
        </div>

        <div className="case-tabs">
          {Object.keys(CASE_ITEMS).map((key) => (
            <button
              key={key}
              className={`case-tab ${activeCase === key ? 'active' : ''} ${CASE_ITEMS[key].currency === 'ad' ? 'ad-tab' : ''}`}
              onClick={() => { setActiveCase(key); setReelItems([]); setWonItem(null); }}
              disabled={isOpening}
            >
              {CASE_ITEMS[key].icon} {CASE_ITEMS[key].name}
            </button>
          ))}
        </div>

        <div className="case-reel-container" ref={reelRef}>
          <div className="case-reel-pointer" />
          {reelItems.length > 0 ? (
            <motion.div 
              className="case-reel"
              key={activeCase + reelItems[45]}
              initial={{ x: 0 }}
              animate={{ x: targetX }}
              transition={{ duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
            >
              {reelItems.map((itemId, index) => {
                const itemData = getItemData(itemId);
                return (
                  <div key={index} className={`case-reel-item rarity-${itemData.rarity}`}>
                    <div className="item-icon">{itemData.icon}</div>
                    <span className="item-name">{itemData.name}</span>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            /* 👇 НОВЫЙ ПЛЕЙСХОЛДЕР */
            <div className="case-placeholder">
              <div className="case-placeholder-icon">🎁</div>
              <div>Испытай свою удачу</div>
            </div>
          )}
        </div>

        <div className="case-actions">
          
          <AnimatePresence mode="wait">
            {wonItem && !isOpening && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.8, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="case-result"
              >
                <h3>Вы получили:</h3>
                <div className="result-item-name">{getItemData(wonItem.id).name}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            className={`case-btn-primary ${canAfford || caseConfig.currency === 'ad' ? 'ready' : ''}`}
            onClick={handleOpenClick} 
            disabled={(!canAfford && caseConfig.currency !== 'ad') || isOpening || isWatchingAd || (caseConfig.currency === 'ad' && timeLeft > 0)}
          >
            {isOpening ? 'Крутим...' : 
             isWatchingAd ? 'Загрузка рекламы...' :
             caseConfig.currency === 'ad' && timeLeft > 0 ? `Ждать ${formatTime(timeLeft)}` :
             caseConfig.currency === 'ad' ? '🎬 Смотреть рекламу (Бесплатно)' :
             caseConfig.currency === 'stars' ? `Открыть за ${caseConfig.price} ⭐` :
             `Открыть за ${caseConfig.price.toLocaleString('ru-RU')} 🪙`}
          </button>

        </div>
      </motion.div>
    </div>
  );
}