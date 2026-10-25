// src/components/CaseModal.tsx
import { useState, useEffect } from 'react';
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
  caseType: string; // Теперь строка, так как кейсов много
}

const CASE_ITEMS: Record<string, any> = {
  hourly: { name: 'Бесплатный (Реклама)', price: 0, icon: '🎬', currency: 'ad', cooldown: 3600000 },
  bronze: { name: 'Бронзовый', price: 5000, icon: '📦', currency: 'coins' },
  silver: { name: 'Серебряный', price: 25000, icon: '🎁', currency: 'coins' },
  gold: { name: 'Золотой', price: 100000, icon: '🏆', currency: 'coins' },
  platinum: { name: 'Платиновый', price: 500000, icon: '💎', currency: 'coins' },
  diamond: { name: 'Алмазный', price: 2000000, icon: '💠', currency: 'coins' },
  star_premium: { name: 'Звездный', price: 50, icon: '⭐', currency: 'stars' }
};

const CASE_ITEMS_POOL = {
  hourly: ['engine_2', 'tires_2', 'coins_10000', 'ecu_2'],
  bronze: ['engine_1', 'tires_1', 'coins_1000'],
  silver: ['engine_2', 'tires_2', 'coins_5000', 'ecu_1'],
  gold: ['engine_3', 'ecu_3', 'suspension_3', 'coins_25000'],
  platinum: ['engine_4', 'tires_4', 'suspension_4', 'coins_100000'],
  diamond: ['engine_4', 'engine_5', 'tires_5', 'coins_500000'],
  star_premium: ['engine_5', 'tires_5', 'ecu_5', 'coins_5000000'],
};

export function CaseModal({ isOpen, onClose, caseType: initialCaseType }: CaseModalProps) {
  const [activeCase, setActiveCase] = useState(initialCaseType || 'bronze');
  const [isOpening, setIsOpening] = useState(false);
  const [reelItems, setReelItems] = useState<string[]>([]);
  const [wonItem, setWonItem] = useState<string | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [pendingAdOpen, setPendingAdOpen] = useState(false);

  const balance = useGameStore((s) => s.balance);
  const user = useGameStore((s) => s.user);
  const openCase = useGameStore((s) => s.openCase); 
  const syncTaps = useGameStore((s) => s.syncTaps);

  const caseConfig = CASE_ITEMS[activeCase];
  const itemsPool = CASE_ITEMS_POOL[activeCase as keyof typeof CASE_ITEMS_POOL];

  // Таймер кулдауна
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

  // 👇 НАСТРОЙКА РЕКЛАМЫ
  const showAd = useAdsgram({
    blockId: '55486', 
    onReward: async () => {
      setIsWatchingAd(false);
      if (pendingAdOpen) {
        setPendingAdOpen(false);
        processOpenCase(); // Открываем кейс после рекламы
      } else {
        WebApp.showAlert("Реклама просмотрена! 5000 монет зачислено.");
        setTimeout(() => syncTaps(), 500);
      }
    },
    onError: (err) => {
      setIsWatchingAd(false);
      setPendingAdOpen(false);
      WebApp.showAlert("Реклама не была просмотрена до конца. Попробуйте позже.");
    },
  });

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    setPendingAdOpen(false);
    showAd();
  };

  const getItemData = (id: string) => {
    if (id.startsWith('coins_')) {
      const amount = id.split('_')[1];
      return { name: `${Number(amount).toLocaleString('ru-RU')} монет`, icon: '🪙' };
    }
    const item = (ITEMS as any)[id];
    return { name: item?.name || 'Неизвестный предмет', icon: item?.icon || '📦' };
  };

  // Запуск анимации
  const processOpenCase = async () => {
    setIsOpening(true);
    setWonItem(null);
    setReelItems([]); 
    playSound('click');

    try {
      const res = await openCase(activeCase);
      
      if (res.success && res.wonItem) {
        const newReel = Array.from({ length: 50 }, () => 
          itemsPool[Math.floor(Math.random() * itemsPool.length)]
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
        WebApp.showAlert(res.error || "Не удалось открыть кейс.");
      }
    } catch (e) {
      setIsOpening(false);
      WebApp.showAlert("Ошибка соединения с сервером.");
    }
  };

  // Нажатие на кнопку
  const handleOpenClick = () => {
    if (isOpening || isWatchingAd) return;

    if (caseConfig.currency === 'ad') {
      if (timeLeft > 0) return; // На кулдауне
      setPendingAdOpen(true);
      setIsWatchingAd(true);
      showAd();
    } else {
      processOpenCase();
    }
  };

  const ITEM_WIDTH = 100; 
  const targetX = -(45 * ITEM_WIDTH) + (window.innerWidth / 2) - (ITEM_WIDTH / 2);

  if (!isOpen) return null;

  const canAfford = caseConfig.currency === 'coins' ? balance >= caseConfig.price : 
                    caseConfig.currency === 'stars' ? (user?.starsBalance || 0) >= caseConfig.price : true;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateZ(0)' }}
    >
      <div style={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
        
        {/* Шапка */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: 'white' }}>КЕЙСЫ</h2>
          <button onClick={onClose} disabled={isOpening} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '35px', height: '35px', fontSize: '18px', cursor: isOpening ? 'not-allowed' : 'pointer' }}>✕</button>
        </div>

        {/* Вкладки кейсов */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '15px' }}>
          {Object.keys(CASE_ITEMS).map((key) => (
            <button
              key={key}
              onClick={() => { setActiveCase(key); setReelItems([]); setWonItem(null); }}
              disabled={isOpening}
              style={{
                background: activeCase === key ? 'rgba(0,255,65,0.2)' : '#222',
                border: activeCase === key ? '1px solid #00FF41' : '1px solid rgba(255,255,255,0.1)',
                color: activeCase === key ? '#00FF41' : '#fff',
                padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              {CASE_ITEMS[key].icon} {CASE_ITEMS[key].name}
            </button>
          ))}
        </div>

        {/* Рулетка */}
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

        {/* Результат и кнопки */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', minHeight: '150px' }}>
          
          <AnimatePresence>
            {wonItem && !isOpening && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="case-result" style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '14px' }}>Вы получили:</h3>
                <div className="result-item" style={{ fontSize: '22px', fontWeight: '900', color: '#00FF41' }}>
                  {getItemData(wonItem).name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка открытия */}
          <button 
            onClick={handleOpenClick} 
            disabled={(!canAfford && caseConfig.currency !== 'ad') || isOpening || isWatchingAd || (caseConfig.currency === 'ad' && timeLeft > 0)}
            className={`open-case-btn ${canAfford || caseConfig.currency === 'ad' ? 'active' : 'disabled'}`}
            style={{ width: '100%', maxWidth: '300px', padding: '15px', fontSize: '16px', borderRadius: '12px', marginBottom: '10px' }}
          >
            {isOpening ? 'Крутим...' : 
             isWatchingAd ? 'Загрузка...' :
             caseConfig.currency === 'ad' && timeLeft > 0 ? `Ждать ${formatTime(timeLeft)}` :
             caseConfig.currency === 'ad' ? '🎬 Смотреть рекламу (Бесплатно)' :
             caseConfig.currency === 'stars' ? `Открыть за ${caseConfig.price} ⭐` :
             `Открыть за ${caseConfig.price.toLocaleString('ru-RU')} 🪙`}
          </button>

          {/* Дополнительная кнопка рекламы за монеты */}
          <button 
            onClick={handleWatchAd}
            disabled={isOpening || isWatchingAd}
            style={{ width: '100%', maxWidth: '300px', padding: '12px', background: '#2b2b2b', color: '#fff', borderRadius: '12px', border: '1px solid #555', cursor: isOpening || isWatchingAd ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            {isWatchingAd ? 'Загрузка рекламы...' : '🎬 Смотреть рекламу (+5000 🪙)'}
          </button>

        </div>
      </div>
    </motion.div>
  );
}