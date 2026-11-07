// src/components/PassScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Lock, Check, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { PASS_LEVELS, PassLevel } from '../config/pass';
import { playSound } from '../utils/sound';
import '../styles/pass.css';

export const PassScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const getPass = useGameStore((s) => s.getPass);
  const claimPassReward = useGameStore((s) => s.claimPassReward);
  const buyPremiumPass = useGameStore((s) => s.buyPremiumPass);
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);

  useEffect(() => {
    getPass();
  }, [getPass]);

  const pass = user?.weeklyPass || {
    xp: 0,
    isPremium: false,
    claimed: [] as number[],
    claimedPremium: [] as number[],
  };
  const currentXp = pass.xp || 0;
  const isPremium = pass.isPremium || false; // 👈 ДОБАВЛЕНО

  const handleClaim = async (level: number, track: 'free' | 'premium') => {
    setLoading(`${level}_${track}`);
    await claimPassReward(level, track);
    playSound('coin');
    setLoading(null);
  };

  const handleBuyPremium = async () => {
    setLoading('buy');
    const result = await buyPremiumPass();
    setLoading(null);
    setShowBuyConfirm(false);

    if (result.success) {
      playSound('coin');
    } else {
      alert(`❌ Ошибка: ${result.error}`);
    }
  };

  const nextLevel = PASS_LEVELS.find(l => currentXp < l.xpReq) || PASS_LEVELS[PASS_LEVELS.length - 1];
  const prevXpReq = nextLevel.level === 1 ? 0 : PASS_LEVELS[nextLevel.level - 2].xpReq;
  const progressPercent = Math.min(100, ((currentXp - prevXpReq) / (nextLevel.xpReq - prevXpReq)) * 100);

  return (
    <div className="pass-overlay" onClick={onClose}>
      <motion.div
        className="pass-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="pass-header">
          <h2>
            <Trophy size={18} color="var(--gold)" /> ГОНОЧНЫЙ ПРОПУСК
          </h2>
          <button className="pass-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Прогресс-бар */}
        <div className="pass-progress-section">
          <div className="pass-progress-header">
            <span className="pass-progress-level">УР. {nextLevel.level - 1}</span>
            <span className="pass-progress-xp">
              {currentXp.toLocaleString('ru-RU')} / {nextLevel.xpReq.toLocaleString('ru-RU')} XP
            </span>
          </div>
          <div className="pass-progress-bar">
            <div
              className="pass-progress-fill"
              style={{
                width: `${progressPercent}%`,
                background: isPremium
                  ? 'linear-gradient(90deg, var(--gold), var(--gold-dim))'
                  : 'linear-gradient(90deg, var(--accent), var(--accent-dim))',
              }}
            />
          </div>
        </div>

        {/* Премиум-статус / кнопка */}
        {isPremium ? (
          <div className="pass-premium-active">
            <Crown size={18} color="var(--gold)" />
            <span>ПРЕМИУМ АКТИВЕН — x3 НАГРАДЫ</span>
          </div>
        ) : (
          <button
            className="pass-buy-premium"
            onClick={() => setShowBuyConfirm(true)}
            disabled={loading === 'buy'}
          >
            <Crown size={18} />
            {loading === 'buy' ? '...' : 'КУПИТЬ ПРЕМИУМ — 500,000 ₽'}
          </button>
        )}

        {/* Табы */}
        <div className="pass-tabs">
          <button
            className={`pass-tab ${activeTab === 'free' ? 'active' : ''}`}
            onClick={() => setActiveTab('free')}
            style={activeTab === 'free' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
          >
            БЕСПЛАТНО
          </button>
          <button
            className={`pass-tab ${activeTab === 'premium' ? 'active' : ''}`}
            onClick={() => setActiveTab('premium')}
            style={activeTab === 'premium' ? { borderColor: 'var(--gold)', color: 'var(--gold)' } : {}}
          >
            <Crown size={14} /> ПРЕМИУМ
          </button>
        </div>

        {/* Список уровней */}
        <div className="pass-body">
          {PASS_LEVELS.map((lvl: PassLevel) => {
            const isFreeClaimed = (pass.claimed as number[]).includes(lvl.level);
            const canClaimFree = currentXp >= lvl.xpReq && !isFreeClaimed;
            const isPremiumClaimed = (pass.claimedPremium as number[] | undefined)?.includes(lvl.level) ?? false;
            const canClaimPremium = currentXp >= lvl.xpReq && !isPremiumClaimed && isPremium;
            const isUnlocked = currentXp >= lvl.xpReq;

            const showFree = activeTab === 'free';
            const showPremium = activeTab === 'premium';

            return (
              <div
                key={lvl.level}
                className={`pass-level ${isUnlocked ? 'unlocked' : 'locked'} ${isPremium ? 'premium' : ''}`}
              >
                <div className="pass-level-header">
                  <div className={`pass-level-badge ${isUnlocked ? 'unlocked' : ''}`}>
                    {isUnlocked ? <Check size={14} color="#000" strokeWidth={3} /> : lvl.level}
                  </div>
                  <div className="pass-level-title">УРОВЕНЬ {lvl.level}</div>
                  <div className="pass-level-req">
                    {isUnlocked ? '✓' : <Lock size={12} />}
                    {lvl.xpReq.toLocaleString('ru-RU')} XP
                  </div>
                </div>

                {showFree && (
                  <div className="pass-reward free">
                    <div className="pass-reward-info">
                      <div className="pass-reward-label">БЕСПЛАТНО</div>
                      <div className="pass-reward-value">
                        {lvl.reward.toLocaleString('ru-RU')}
                        <span className="currency-ruble sm" style={{ marginLeft: 4 }}>₽</span>
                      </div>
                    </div>
                    <button
                      className={`pass-claim-btn ${isFreeClaimed ? 'claimed' : canClaimFree ? 'ready' : ''}`}
                      onClick={() => handleClaim(lvl.level, 'free')}
                      disabled={!canClaimFree || loading === `${lvl.level}_free`}
                    >
                      {isFreeClaimed ? '✓ ПОЛУЧЕНО' : loading === `${lvl.level}_free` ? '...' : canClaimFree ? 'ЗАБРАТЬ' : 'ЗАКРЫТО'}
                    </button>
                  </div>
                )}

                {showPremium && (
                  <div className="pass-reward premium">
                    <div className="pass-reward-info">
                      <div className="pass-reward-label">
                        <Crown size={12} /> ПРЕМИУМ (x3)
                      </div>
                      <div className="pass-reward-value gold">
                        {(lvl.reward * 3).toLocaleString('ru-RU')}
                        <span className="currency-ruble sm" style={{ marginLeft: 4 }}>₽</span>
                      </div>
                    </div>
                    <button
                      className={`pass-claim-btn ${isPremiumClaimed ? 'claimed' : canClaimPremium ? 'ready-premium' : ''}`}
                      onClick={() => handleClaim(lvl.level, 'premium')}
                      disabled={!canClaimPremium || loading === `${lvl.level}_premium`}
                    >
                      {isPremiumClaimed ? '✓ ПОЛУЧЕНО' : !isPremium ? '🔒 КУПИ' : loading === `${lvl.level}_premium` ? '...' : canClaimPremium ? 'ЗАБРАТЬ' : 'НЕТ XP'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Модалка подтверждения покупки */}
      <AnimatePresence>
        {showBuyConfirm && (
          <motion.div
            className="pass-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBuyConfirm(false)}
          >
            <motion.div
              className="pass-confirm-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Crown size={48} color="var(--gold)" />
              <h3>КУПИТЬ ПРЕМИУМ?</h3>
              <p>500,000 ₽ за х3 награды</p>
              <div className="pass-confirm-actions">
                <button className="pass-confirm-cancel" onClick={() => setShowBuyConfirm(false)}>
                  ОТМЕНА
                </button>
                <button className="pass-confirm-buy" onClick={handleBuyPremium}>
                  КУПИТЬ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};