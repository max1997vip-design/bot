// src/components/WorkshopScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench, Hammer, X, Check, Timer, Zap, Cog, Disc, Cpu,
  TrendingUp, Sparkles, Play
} from 'lucide-react';
import { useGameStore, PartUpgrade } from '../store/gameStore';
import { ITEMS, RARITY_COLORS, ItemSlot } from '../config/items';
import { playSound } from '../utils/sound';
import { useAdsgram } from '../hooks/useAdsgram';
import WebApp from '@twa-dev/sdk';
import '../styles/workshop.css';

const SLOT_ICONS: Record<ItemSlot, any> = {
  engine: Cog,
  tires: Disc,
  ecu: Cpu,
  suspension: Wrench,
};

const SLOT_NAMES: Record<ItemSlot, string> = {
  engine: 'Двигатель',
  tires: 'Шины',
  ecu: 'Прошивка',
  suspension: 'Подвеска',
};

const AD_REDUCE_MS = 15 * 60 * 1000; // 15 минут

type TabId = 'upgrade' | 'craft';

export const WorkshopScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const equipped = useGameStore((s) => s.equipped);
  const inventory = useGameStore((s) => s.inventory);
  const upgradePart = useGameStore((s) => s.upgradePart);
  const claimUpgrade = useGameStore((s) => s.claimUpgrade);
  const craftItem = useGameStore((s) => s.craftItem);
  const skipUpgradeTime = useGameStore((s) => s.skipUpgradeTime);
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('upgrade');
  const [now, setNow] = useState(Date.now());

  // 👇 Тик для обновления таймеров
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

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
    playSound('coin');
  };

  const handleCraft = async (itemId: string) => {
    setLoading(`craft_${itemId}`);
    await craftItem(itemId);
    setLoading(null);
    playSound('coin');
  };

  // 👇 Реклама за ускорение
  const handleSkipWithAd = (itemId: string) => {
    // Сохраняем itemId для колбэка
    currentAdItemRef.current = itemId;
    showAd();
  };

  const currentAdItemRef = React.useRef<string | null>(null);

  const showAd = useAdsgram({
    blockId: '55486', // тот же что в CaseModal
    onReward: async () => {
      const itemId = currentAdItemRef.current;
      if (!itemId) return;

      setLoading(`skip_${itemId}`);
      const success = await skipUpgradeTime(itemId, AD_REDUCE_MS);
      setLoading(null);

      if (success) {
        playSound('coin');
        WebApp.HapticFeedback?.notificationOccurred('success');
      } else {
        WebApp.showAlert('Не удалось ускорить улучшение');
      }
      currentAdItemRef.current = null;
    },
    onError: () => {
      WebApp.showAlert('Реклама не была просмотрена до конца');
      currentAdItemRef.current = null;
    },
  });

  const formatTimeLeft = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}ч ${m}м`;
    if (m > 0) return `${m}м ${s}с`;
    return `${s}с`;
  };

  return (
    <div className="workshop-overlay" onClick={onClose}>
      <motion.div
        className="workshop-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="workshop-header">
          <h2>
            <Wrench size={18} color="var(--accent)" /> МАСТЕРСКАЯ
          </h2>
          <button className="workshop-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Табы */}
        <div className="workshop-tabs">
          <button
            className={`workshop-tab ${activeTab === 'upgrade' ? 'active' : ''}`}
            onClick={() => setActiveTab('upgrade')}
            style={activeTab === 'upgrade' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
          >
            <TrendingUp size={14} /> УЛУЧШЕНИЯ
          </button>
          <button
            className={`workshop-tab ${activeTab === 'craft' ? 'active' : ''}`}
            onClick={() => setActiveTab('craft')}
            style={activeTab === 'craft' ? { borderColor: 'var(--gold)', color: 'var(--gold)' } : {}}
          >
            <Hammer size={14} /> КРАФТ
          </button>
        </div>

        {/* Body */}
        <div className="workshop-body">
          <AnimatePresence mode="wait">
            {activeTab === 'upgrade' && (
              <motion.div
                key="upgrade"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="workshop-list"
              >
                {Object.values(equipped).filter((id): id is string => Boolean(id)).length === 0 && (
                  <div className="workshop-empty">
                    <Cog size={48} color="var(--text-muted)" />
                    <h3>Нет надетых деталей</h3>
                    <p>Наденьте детали в гараже, чтобы их улучшать</p>
                  </div>
                )}

                {Object.values(equipped)
                  .filter((id): id is string => Boolean(id))
                  .map(itemId => {
                    const item = ITEMS[itemId];
                    if (!item) return null;

                    const upg = partUpgrades[itemId] || { 
                      level: 0, goldStars: 0, redStars: 0, 
                      upgradingUntil: null, upgradeType: null 
                    };
                    
                    const isUpgrading = !!upg.upgradingUntil && upg.upgradingUntil > now;
                    const canClaim = !!upg.upgradingUntil && upg.upgradingUntil <= now;
                    const timeLeft = isUpgrading ? upg.upgradingUntil! - now : 0;

                    const Icon = SLOT_ICONS[item.slot];
                    const rarityColor = RARITY_COLORS[item.rarity];

                    return (
                      <div
                        key={itemId}
                        className={`workshop-card ${isUpgrading ? 'upgrading' : ''} ${canClaim ? 'claimable' : ''}`}
                      >
                        <div className="workshop-card-icon" style={{ background: `${rarityColor}15`, border: `1px solid ${rarityColor}44` }}>
                          <Icon size={22} color={rarityColor} />
                        </div>

                        <div className="workshop-card-info">
                          <div className="workshop-card-title" style={{ color: rarityColor }}>
                            {item.name}
                          </div>
                          <div className="workshop-card-meta">
                            <span>Ур: <strong>{upg.level}/50</strong></span>
                            <span style={{ color: 'var(--gold)' }}>★ {upg.goldStars}</span>
                            <span style={{ color: 'var(--danger)' }}>★ {upg.redStars}</span>
                          </div>

                          {isUpgrading && (
                            <div className="workshop-card-timer">
                              <Timer size={12} />
                              <span>Осталось: {formatTimeLeft(timeLeft)}</span>
                            </div>
                          )}
                        </div>

                        <div className="workshop-card-actions">
                          {isUpgrading && (
                            <button
                              className="workshop-ad-btn"
                              onClick={() => handleSkipWithAd(itemId)}
                              disabled={loading === `skip_${itemId}`}
                            >
                              <Play size={12} /> -15м
                            </button>
                          )}

                          {canClaim && (
                            <button
                              className="workshop-claim-btn"
                              onClick={() => handleClaim(itemId)}
                              disabled={loading === `${itemId}_claim`}
                            >
                              <Check size={14} /> ЗАБРАТЬ
                            </button>
                          )}

                          {!isUpgrading && !canClaim && (
                            <>
                              {upg.level < 50 && (
                                <button
                                  className="workshop-upgrade-btn level"
                                  onClick={() => handleUpgrade(itemId, 'level')}
                                  disabled={loading === `${itemId}_level`}
                                >
                                  +1 УР
                                </button>
                              )}
                              {upg.level >= 50 && upg.goldStars < 5 && (
                                <button
                                  className="workshop-upgrade-btn gold"
                                  onClick={() => handleUpgrade(itemId, 'gold')}
                                  disabled={loading === `${itemId}_gold`}
                                >
                                  +★
                                </button>
                              )}
                              {upg.goldStars >= 5 && upg.redStars < 5 && (
                                <button
                                  className="workshop-upgrade-btn red"
                                  onClick={() => handleUpgrade(itemId, 'red')}
                                  disabled={loading === `${itemId}_red`}
                                >
                                  +★
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </motion.div>
            )}

            {activeTab === 'craft' && (
              <motion.div
                key="craft"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="workshop-list"
              >
                <div className="workshop-hint">
                  <Sparkles size={14} color="var(--gold)" />
                  <span>Объедините 5 одинаковых деталей → получите на ранг выше</span>
                </div>

                {craftableIds.length === 0 && (
                  <div className="workshop-empty">
                    <Hammer size={48} color="var(--text-muted)" />
                    <h3>Нет доступных для крафта</h3>
                    <p>Соберите 5 одинаковых деталей</p>
                  </div>
                )}

                {craftableIds.map(itemId => {
                  const item = ITEMS[itemId];
                  if (!item) return null;
                  const count = itemCounts[itemId];
                  const rarityColor = RARITY_COLORS[item.rarity];
                  const Icon = SLOT_ICONS[item.slot];

                  return (
                    <div key={itemId} className="workshop-craft-card">
                      <div className="workshop-card-icon" style={{ background: `${rarityColor}15`, border: `1px solid ${rarityColor}44` }}>
                        <Icon size={22} color={rarityColor} />
                      </div>
                      <div className="workshop-card-info">
                        <div className="workshop-card-title" style={{ color: rarityColor }}>
                          {item.name}
                        </div>
                        <div className="workshop-card-meta">
                          <span>В наличии: <strong>{count}</strong></span>
                        </div>
                      </div>
                      <button
                        className="workshop-craft-btn"
                        onClick={() => handleCraft(itemId)}
                        disabled={loading === `craft_${itemId}`}
                      >
                        {loading === `craft_${itemId}` ? '...' : 'СКРАФТИТЬ'}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};