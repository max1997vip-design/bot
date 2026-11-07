// src/components/CaseModal.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clapperboard, Gift, Trophy, Gem, Diamond, Star,
  X, Package, Cog, Disc, Cpu, Wrench, Sparkles,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ITEMS } from '../config/items';
import { CASES, CASE_KEYS, CaseConfig } from '../config/cases';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import { useAdsgram } from '../hooks/useAdsgram';
import '../styles/case.css';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseType: string;
}

const CASE_ICON_MAP = {
  Clapperboard, Gift, Trophy, Gem, Diamond, Star,
} as const;

const SLOT_ICON_MAP = {
  engine: Cog,
  tires: Disc,
  ecu: Cpu,
  suspension: Wrench,
} as const;

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

  const caseConfig: CaseConfig = CASES[activeCase];
  const itemsPool = caseConfig.items;

  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (caseConfig.currency !== 'ad' || !user?.lastAdCaseAt) return;
    const cd = caseConfig.cooldownMs || 3600000;
    const interval = setInterval(() => {
      const last = new Date(user.lastAdCaseAt!).getTime();
      const remaining = Math.max(0, last + cd - Date.now());
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [caseConfig, user?.lastAdCaseAt]);

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
        const pool = CASES[caseTypeToOpen]?.items || [];
        const poolIds = pool.map((p) => p.id);
        const newReel = Array.from({ length: 50 }, () =>
          poolIds[Math.floor(Math.random() * poolIds.length)]
        );
        newReel[45] = res.wonItem.id;

        setReelItems(newReel);
        setWonItem(res.wonItem);

        const containerWidth = reelRef.current ? reelRef.current.offsetWidth : 300;
        const ITEM_WIDTH = 100;
        const exactX = containerWidth / 2 - (45 * ITEM_WIDTH + 45);
        setTargetX(exactX);

        setTimeout(() => {
          setIsOpening(false);
          playSound(res.wonItem.rarity === 'legendary' ? 'win' : 'coin');
          try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}
        }, 4200);
      } else {
        setIsOpening(false);
        WebApp.showAlert(res.error || 'Не удалось открыть кейс.');
      }
    } catch {
      setIsOpening(false);
      WebApp.showAlert('Ошибка соединения с сервером.');
    }
  };

  const showAd = useAdsgram({
    blockId: '55486',
    onReward: async () => {
      setIsWatchingAd(false);
      setPendingAdOpen(false);
      setTimeout(() => executeCaseOpening(stateRef.current.activeCase), 100);
    },
    onError: () => {
      setIsWatchingAd(false);
      setPendingAdOpen(false);
      WebApp.showAlert('Реклама не была просмотрена до конца. Попробуйте позже.');
    },
  });

  const getItemData = (id: string) => {
    if (id.startsWith('coins_')) {
      const amount = id.split('_')[1];
      return {
        name: `${Number(amount).toLocaleString('ru-RU')} ₽`,
        IconComponent: null as any,
        slot: null as any,
        rarity: 'common',
      };
    }
    const item = ITEMS[id];
    const IconComponent = item ? SLOT_ICON_MAP[item.slot] : Package;
    return {
      name: item?.name || 'Неизвестный предмет',
      IconComponent,
      slot: item?.slot ?? null,
      rarity: item?.rarity || 'common',
    };
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

  const canAfford =
    caseConfig.currency === 'coins'
      ? balance >= caseConfig.price
      : caseConfig.currency === 'stars'
      ? (user?.starsBalance || 0) >= caseConfig.price
      : true;

  const ActiveCaseIcon = CASE_ICON_MAP[caseConfig.iconName] || Gift;

  return (
    <div className="case-overlay" onClick={onClose}>
      <motion.div
        className="case-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="case-header">
          <h2>
            <ActiveCaseIcon size={18} color={caseConfig.accentColor} />
            ОТКРЫТИЕ КЕЙСОВ
          </h2>
          <button
            className="case-close-btn"
            onClick={onClose}
            disabled={isOpening}
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        {/* Табы */}
        <div className="case-tabs">
          {CASE_KEYS.map((key) => {
            const cfg = CASES[key];
            const Icon = CASE_ICON_MAP[cfg.iconName] || Gift;
            const isActive = activeCase === key;
            const isAd = cfg.currency === 'ad';
            return (
              <button
                key={key}
                className={`case-tab ${isActive ? 'active' : ''} ${isAd ? 'ad-tab' : ''}`}
                onClick={() => {
                  setActiveCase(key);
                  setReelItems([]);
                  setWonItem(null);
                }}
                disabled={isOpening}
                style={
                  isActive
                    ? { borderColor: cfg.accentColor, color: cfg.accentColor }
                    : {}
                }
              >
                <Icon size={14} color={isActive ? cfg.accentColor : 'currentColor'} />
                {cfg.name}
              </button>
            );
          })}
        </div>

        {/* Рулетка */}
        <div className="case-reel-container" ref={reelRef}>
          <div className="case-reel-pointer" />
          {reelItems.length > 0 ? (
            <motion.div
              className="case-reel"
              key={activeCase + (reelItems[45] || '')}
              initial={{ x: 0 }}
              animate={{ x: targetX }}
              transition={{ duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
            >
              {reelItems.map((itemId, index) => {
                const d = getItemData(itemId);
                const Icon = d.IconComponent;
                return (
                  <div
                    key={index}
                    className={`case-reel-item rarity-${d.rarity}`}
                  >
                    <div className="item-icon">
                      {Icon ? (
                        <Icon size={32} color="currentColor" />
                      ) : (
                        <span className="item-icon-coin">₽</span>
                      )}
                    </div>
                    <span className="item-name">{d.name}</span>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <div className="case-placeholder">
              <motion.div
                className="case-placeholder-icon"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={40} color={caseConfig.accentColor} />
              </motion.div>
              <div style={{ color: caseConfig.accentColor }}>
                Испытай свою удачу
              </div>
            </div>
          )}
        </div>

        {/* Результат + кнопка */}
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
                <div className="result-item-name">
                  {getItemData(wonItem.id).name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className={`case-btn-primary ${
              canAfford || caseConfig.currency === 'ad' ? 'ready' : ''
            }`}
            onClick={handleOpenClick}
            disabled={
              (!canAfford && caseConfig.currency !== 'ad') ||
              isOpening ||
              isWatchingAd ||
              (caseConfig.currency === 'ad' && timeLeft > 0)
            }
            style={
              canAfford || caseConfig.currency === 'ad'
                ? {
                    background: `linear-gradient(135deg, ${caseConfig.accentColor}, ${caseConfig.accentColor}99)`,
                  }
                : undefined
            }
          >
            {isOpening
              ? 'Крутим...'
              : isWatchingAd
              ? 'Загрузка рекламы...'
              : caseConfig.currency === 'ad' && timeLeft > 0
              ? `Ждать ${formatTime(timeLeft)}`
              : caseConfig.currency === 'ad'
              ? 'СМОТРЕТЬ РЕКЛАМУ (БЕСПЛАТНО)'
              : caseConfig.currency === 'stars'
              ? `Открыть за ${caseConfig.price} ⭐`
              : `Открыть за ${caseConfig.price.toLocaleString('ru-RU')} ₽`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}