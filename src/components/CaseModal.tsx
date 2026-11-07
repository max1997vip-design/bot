// src/components/CaseModal.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clapperboard, Gift, Trophy, Gem, Diamond, Star,
  X, Package, Cog, Disc, Cpu, Wrench, Sparkles, Coins, Play,
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
      setTimeLeft(Math.max(0, last + cd - Date.now()));
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
        }, 4500);
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
        IconComponent: Coins,
        isCoins: true,
        rarity: 'common' as const,
        accent: '#ffd700',
      };
    }
    const item = ITEMS[id];
    const IconComponent = item ? SLOT_ICON_MAP[item.slot] : Package;
    const rarityAccent: Record<string, string> = {
      common: '#aaaaaa',
      uncommon: '#00d97e',
      rare: '#00bfff',
      epic: '#b000ff',
      legendary: '#ffd700',
    };
    return {
      name: item?.name || 'Неизвестный предмет',
      IconComponent,
      isCoins: false,
      rarity: (item?.rarity || 'common') as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
      accent: rarityAccent[item?.rarity || 'common'] || '#aaaaaa',
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
  const accent = caseConfig.accentColor;

  return (
    <div className="case-overlay" onClick={onClose}>
      <motion.div
        className="case-modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ '--case-accent': accent } as React.CSSProperties}
      >
        {/* Внешнее свечение — меняется с акцентом кейса */}
        <div className="case-aura" />
        <div className="case-glow-top" />

        {/* HEADER */}
        <div className="case-header">
          <div className="case-header-title">
            <motion.div
              className="case-header-icon"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                borderColor: `${accent}66`,
                boxShadow: `0 0 24px ${accent}55, inset 0 0 16px ${accent}22`,
                color: accent,
              }}
            >
              <ActiveCaseIcon size={22} />
            </motion.div>
            <div>
              <h2 className="case-header-name" style={{ color: accent }}>
                {caseConfig.name} кейс
              </h2>
              <span className="case-header-sub">
                {caseConfig.currency === 'ad'
                  ? 'БЕСПЛАТНО ЗА РЕКЛАМУ'
                  : caseConfig.currency === 'stars'
                  ? `${caseConfig.price} ⭐`
                  : `${caseConfig.price.toLocaleString('ru-RU')} ₽`}
              </span>
            </div>
          </div>
          <button
            className="case-close-btn"
            onClick={onClose}
            disabled={isOpening}
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        {/* TABS */}
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
                    ? {
                        borderColor: cfg.accentColor,
                        color: cfg.accentColor,
                        background: `linear-gradient(135deg, ${cfg.accentColor}22, ${cfg.accentColor}05)`,
                        boxShadow: `0 0 20px ${cfg.accentColor}55, inset 0 0 12px ${cfg.accentColor}22`,
                      }
                    : {}
                }
              >
                <Icon size={14} color={isActive ? cfg.accentColor : 'currentColor'} />
                {cfg.name}
              </button>
            );
          })}
        </div>

        {/* REEL */}
        <div className="case-reel-wrapper">
          {/* Золотые «стрелки» сверху/снизу у указателя */}
          <div className="case-reel-pointer-arrow top" style={{ borderTopColor: accent }} />
          <div className="case-reel-pointer-arrow bottom" style={{ borderBottomColor: accent }} />

          <div className="case-reel-container" ref={reelRef}>
            <div
              className="case-reel-pointer"
              style={{
                background: accent,
                boxShadow: `0 0 20px ${accent}, 0 0 40px ${accent}`,
              }}
            />
            <div
              className="case-reel-glow"
              style={{
                background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
              }}
            />
            {reelItems.length > 0 ? (
              <motion.div
                className="case-reel"
                key={activeCase + (reelItems[45] || '')}
                initial={{ x: 0 }}
                animate={{ x: targetX }}
                transition={{ duration: 4.5, ease: [0.15, 0.85, 0.25, 1] }}
              >
                {reelItems.map((itemId, index) => {
                  const d = getItemData(itemId);
                  const Icon = d.IconComponent;
                  return (
                    <div
                      key={index}
                      className={`case-reel-item rarity-${d.rarity}`}
                      style={{
                        borderColor: `${d.accent}99`,
                        boxShadow: `inset 0 0 24px ${d.accent}22, 0 0 14px ${d.accent}44`,
                      }}
                    >
                      <div className="item-icon" style={{ color: d.accent }}>
                        <Icon size={30} />
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
                  animate={{ y: [0, -12, 0], rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: accent }}
                >
                  <Sparkles size={48} />
                </motion.div>
                <div
                  style={{
                    color: accent,
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: 2,
                    textShadow: `0 0 16px ${accent}`,
                  }}
                >
                  ИСПЫТАЙ УДАЧУ
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RESULT */}
        <AnimatePresence mode="wait">
          {wonItem && !isOpening && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 14, stiffness: 200 }}
              className="case-result"
            >
              <div className="case-result-label">ВЫ ПОЛУЧИЛИ</div>
              <div className="case-result-icon-wrapper">
                <motion.div
                  className="case-result-icon-halo"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    background: `radial-gradient(circle, ${getItemData(wonItem.id).accent}88, transparent 70%)`,
                  }}
                />
                <motion.div
                  className="case-result-icon"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 180 }}
                  style={{
                    background: `linear-gradient(135deg, ${getItemData(wonItem.id).accent}40, ${getItemData(wonItem.id).accent}10)`,
                    borderColor: `${getItemData(wonItem.id).accent}aa`,
                    boxShadow: `0 0 40px ${getItemData(wonItem.id).accent}88, inset 0 0 20px ${getItemData(wonItem.id).accent}33`,
                    color: getItemData(wonItem.id).accent,
                  }}
                >
                  {(() => {
                    const Icon = getItemData(wonItem.id).IconComponent;
                    return <Icon size={40} />;
                  })()}
                </motion.div>
              </div>
              <div
                className="case-result-name"
                style={{
                  background: `linear-gradient(90deg, #fff, ${getItemData(wonItem.id).accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {getItemData(wonItem.id).name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTION */}
        <button
          className={`case-btn-primary ${canAfford || caseConfig.currency === 'ad' ? 'ready' : ''}`}
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
                  background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
                  boxShadow: `0 8px 32px ${accent}88, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  color: '#000',
                }
              : undefined
          }
        >
          {isOpening ? (
            'КРУТИМ...'
          ) : isWatchingAd ? (
            'ЗАГРУЗКА РЕКЛАМЫ...'
          ) : caseConfig.currency === 'ad' && timeLeft > 0 ? (
            `ЖДАТЬ ${formatTime(timeLeft)}`
          ) : caseConfig.currency === 'ad' ? (
            <>
              <Play size={16} style={{ marginRight: 6 }} /> СМОТРЕТЬ РЕКЛАМУ
            </>
          ) : caseConfig.currency === 'stars' ? (
            `ОТКРЫТЬ ЗА ${caseConfig.price} ⭐`
          ) : (
            `ОТКРЫТЬ ЗА ${caseConfig.price.toLocaleString('ru-RU')} ₽`
          )}
        </button>
      </motion.div>
    </div>
  );
}