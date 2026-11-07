// src/components/BusinessScreen.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, Droplets, Wrench, Fuel, Music,
  TrendingUp, X, Coins, Building2,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import {
  BUSINESSES,
  BusinessConfig,
  getBusinessUpgradeCost,
  getBusinessIncome,
} from '../config/businesses';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import '../styles/business.css';

const BUSINESS_ICONS = {
  Coffee, Droplets, Wrench, Fuel, Music,
} as const;

export const BusinessScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const buyBusiness = useGameStore((s) => s.buyBusiness);
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);
  const collectIncome = useGameStore((s) => s.collectIncome);
  const [loading, setLoading] = useState<string | null>(null);

  const businesses = user?.businesses || {};
  const now = Date.now();
  const balance = user?.balance || 0;

  // Считаем, сколько накопилось
  let totalPending = 0;
  Object.entries(businesses).forEach(([id, data]) => {
    const config = BUSINESSES[id];
    if (!config) return;
    const hoursPassed = Math.min((now - data.lastCollected) / (1000 * 60 * 60), 24);
    if (hoursPassed > 0) {
      totalPending += Math.floor(
        getBusinessIncome(config.baseIncomePerHour, data.level) * hoursPassed
      );
    }
  });

  const handleAction = async (action: () => Promise<any>, id: string) => {
    setLoading(id);
    const ok = await action();
    setLoading(null);
    if (ok) playSound('coin');
  };

  const ownedCount = Object.keys(businesses).length;

  return (
    <div className="business-overlay" onClick={onClose}>
      <motion.div
        className="business-modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="business-header">
          <div className="business-header-title">
            <div className="business-header-icon">
              <Building2 size={22} color="#00d97e" />
            </div>
            <div>
              <h2 className="business-header-name">БИЗНЕСЫ</h2>
              <span className="business-header-sub">
                Владеешь: {ownedCount} / {Object.keys(BUSINESSES).length}
              </span>
            </div>
          </div>
          <button className="business-close-btn" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* БАЛАНС */}
        <div className="business-balance-card">
          <Coins size={18} color="#ffd700" />
          <span className="business-balance-label">Баланс:</span>
          <span className="business-balance-value">{balance.toLocaleString('ru-RU')} ₽</span>
        </div>

        {/* ДОХОД К СБОРУ */}
        {totalPending > 0 && (
          <motion.div
            className="business-collect-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="business-collect-info">
              <TrendingUp size={18} color="#00d97e" />
              <div>
                <span className="business-collect-label">Доступно к сбору:</span>
                <span className="business-collect-value">
                  +{totalPending.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
            <button
              className="business-collect-btn"
              onClick={() => handleAction(collectIncome, 'collect')}
              disabled={loading === 'collect'}
            >
              {loading === 'collect' ? '...' : 'СОБРАТЬ'}
            </button>
          </motion.div>
        )}

        {/* СПИСОК БИЗНЕСОВ */}
        <div className="business-body">
          <AnimatePresence>
            {Object.values(BUSINESSES).map((config: BusinessConfig) => {
              const owned = businesses[config.id];
              const level = owned?.level || 0;
              const upgradeCost = getBusinessUpgradeCost(config.baseCost, level);
              const income = getBusinessIncome(config.baseIncomePerHour, level || 1);
              const isOwned = !!owned;
              const canAffordBuy = balance >= config.baseCost;
              const canAffordUpgrade = balance >= upgradeCost;
              const Icon = BUSINESS_ICONS[config.iconName] || Coffee;

              // pending для конкретного бизнеса
              let pending = 0;
              if (isOwned) {
                const hoursPassed = Math.min(
                  (now - owned.lastCollected) / (1000 * 60 * 60),
                  24
                );
                if (hoursPassed > 0) {
                  pending = Math.floor(income * hoursPassed);
                }
              }

              return (
                <motion.div
                  key={config.id}
                  className={`business-card ${isOwned ? 'owned' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ borderColor: `${config.accentColor}44` }}
                >
                  {/* Иконка */}
                  <div
                    className="business-card-icon"
                    style={{
                      background: `${config.accentColor}18`,
                      borderColor: `${config.accentColor}66`,
                      boxShadow: `0 0 16px ${config.accentColor}33`,
                    }}
                  >
                    <Icon size={22} color={config.accentColor} />
                  </div>

                  {/* Инфо */}
                  <div className="business-card-info">
                    <div className="business-card-name">{config.name}</div>
                    <div className="business-card-desc">{config.description}</div>

                    {isOwned ? (
                      <div className="business-card-stats">
                        <span className="business-stat">
                          Ур. <strong>{level}</strong>
                        </span>
                        <span className="business-stat income">
                          <TrendingUp size={11} />
                          {income.toLocaleString('ru-RU')} ₽/час
                        </span>
                        {pending > 0 && (
                          <span className="business-stat pending">
                            +{pending.toLocaleString('ru-RU')} ₽
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="business-card-stats">
                        <span className="business-stat">
                          Доход: <strong>{getBusinessIncome(config.baseIncomePerHour, 1).toLocaleString('ru-RU')} ₽/час</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Кнопка */}
                  <div className="business-card-action">
                    {!isOwned ? (
                      <button
                        className={`business-btn buy ${canAffordBuy ? 'ready' : 'disabled'}`}
                        onClick={() => handleAction(() => buyBusiness(config.id), config.id)}
                        disabled={!canAffordBuy || loading === config.id}
                      >
                        {loading === config.id ? '...' : config.baseCost.toLocaleString('ru-RU')}
                        <span>₽</span>
                      </button>
                    ) : (
                      <button
                        className={`business-btn upgrade ${canAffordUpgrade ? 'ready' : 'disabled'}`}
                        onClick={() => handleAction(() => upgradeBusiness(config.id), config.id)}
                        disabled={!canAffordUpgrade || loading === config.id}
                        style={{
                          borderColor: canAffordUpgrade ? config.accentColor : undefined,
                          color: canAffordUpgrade ? config.accentColor : undefined,
                        }}
                      >
                        {loading === config.id ? '...' : upgradeCost.toLocaleString('ru-RU')}
                        <span>₽</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};