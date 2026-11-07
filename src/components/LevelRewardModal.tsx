// src/components/LevelRewardModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coins, Star, Package, Sparkles, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import '../styles/levelReward.css';

interface LevelRewardModalProps {
  onClose: () => void;
  onClaimed?: () => void;
}

export const LevelRewardModal = ({ onClose, onClaimed }: LevelRewardModalProps) => {
  const claimLevelReward = useGameStore((s) => s.claimLevelReward);
  const user = useGameStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleClaim = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await claimLevelReward();
      if (res.success) {
        playSound('coin');
        WebApp.HapticFeedback?.notificationOccurred('success');
        setResult(res);
        onClaimed?.();
      } else {
        WebApp.HapticFeedback?.notificationOccurred('error');
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentLevel = Math.floor(Math.sqrt((user?.xp || 0) / 100)) + 1;

  return (
    <div className="level-reward-overlay" onClick={result ? onClose : undefined}>
      <motion.div
        className="level-reward-content"
        initial={{ scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.7, y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Декоративные искры */}
        {!result && (
          <>
            <motion.div
              className="sparkle sparkle-1"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={20} color="#ffd700" />
            </motion.div>
            <motion.div
              className="sparkle sparkle-2"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles size={16} color="#00e5ff" />
            </motion.div>
          </>
        )}

        {/* ЗАГОЛОВОК */}
        <div className="level-reward-header">
          <Trophy size={48} color="#ffd700" strokeWidth={2.5} />
          <h2>{result ? 'ПОЗДРАВЛЯЕМ!' : 'НОВЫЙ УРОВЕНЬ!'}</h2>
          <div className="level-badge-big">LVL {currentLevel}</div>
        </div>

        {/* ТЕЛО */}
        {!result ? (
          <>
            <p className="level-reward-subtitle">
              Ты достиг нового уровня и заслужил награду!
            </p>

            <button
              className="level-reward-btn"
              onClick={handleClaim}
              disabled={loading}
            >
              {loading ? 'ЗАГРУЗКА...' : 'ЗАБРАТЬ НАГРАДУ'}
            </button>
          </>
        ) : (
          <>
            <p className="level-reward-subtitle">Твои награды:</p>

            <div className="level-rewards-list">
              {result.totalRubles > 0 && (
                <div className="level-reward-item">
                  <div className="reward-item-icon" style={{ background: 'rgba(255,215,0,0.15)', borderColor: 'rgba(255,215,0,0.4)' }}>
                    <Coins size={22} color="#ffd700" />
                  </div>
                  <span className="reward-item-value">
                    +{result.totalRubles.toLocaleString('ru-RU')}
                    <span className="currency-ruble" style={{ marginLeft: 4 }}>₽</span>
                  </span>
                </div>
              )}

              {result.totalStars > 0 && (
                <div className="level-reward-item">
                  <div className="reward-item-icon" style={{ background: 'rgba(0,229,255,0.15)', borderColor: 'rgba(0,229,255,0.4)' }}>
                    <Star size={22} color="#00e5ff" />
                  </div>
                  <span className="reward-item-value">
                    +{result.totalStars} ⭐
                  </span>
                </div>
              )}

              {result.caseType && (
                <div className="level-reward-item">
                  <div className="reward-item-icon" style={{ background: 'rgba(255,136,0,0.15)', borderColor: 'rgba(255,136,0,0.4)' }}>
                    <Package size={22} color="#ff8800" />
                  </div>
                  <span className="reward-item-value">
                    Кейс: <strong>{result.caseType === 'hourly' ? 'Обычный' : result.caseType === 'rare' ? 'Редкий' : 'Легендарный'}</strong>
                  </span>
                </div>
              )}
            </div>

            <button className="level-reward-btn" onClick={onClose}>
              ОТЛИЧНО!
            </button>
          </>
        )}

        {/* КРЕСТИК */}
        <button className="level-reward-close" onClick={onClose}>
          <X size={18} />
        </button>
      </motion.div>
    </div>
  );
};