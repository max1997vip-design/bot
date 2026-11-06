// src/components/AchievementsScreen.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Check, Gift } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import '../styles/achievements.css';

// Маппинг эмодзи → lucide-иконки (если хочешь конкретные иконки на каждое достижение)
const iconMap: Record<string, any> = {
  '💰': Gift,
  '🏆': Trophy,
  '⭐': Trophy,
};

export const AchievementsScreen = ({ onClose }: { onClose: () => void }) => {
  const achievementsList = useGameStore((s) => s.achievementsList);
  const getAchievements = useGameStore((s) => s.getAchievements);
  const claimAchievement = useGameStore((s) => s.claimAchievement);

  useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  const handleClaim = async (id: string) => {
    const success = await claimAchievement(id);
    if (success) WebApp.HapticFeedback?.notificationOccurred('success');
    else WebApp.HapticFeedback?.notificationOccurred('error');
  };

  return (
    <div className="achievements-screen" onClick={onClose}>
      <motion.div 
        className="achievements-content"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="achievements-header">
          <h2><Trophy size={20} color="#ffd700" /> Достижения</h2>
          <button className="achievements-close" onClick={onClose}>✕</button>
        </div>

        <div className="achievements-body">
          {achievementsList.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              Загрузка достижений...
            </div>
          )}

          {achievementsList.map((ach: any) => {
            const isUnlocked = ach.isUnlocked;
            const isClaimable = ach.isCompleted && !ach.isUnlocked;
            const isInProgress = !ach.isCompleted && !ach.isUnlocked;

            let cardClass = 'achievement-card';
            if (isUnlocked) cardClass += ' unlocked';
            if (isClaimable) cardClass += ' claimable';

            // Пытаемся найти иконку по эмодзи, иначе — Trophy
            const IconComponent = iconMap[ach.icon] || Trophy;

            return (
              <div key={ach.id} className={cardClass}>
                {/* Премиум-иконка */}
                <div className={`achievement-icon-wrapper ${isUnlocked ? 'unlocked' : ''} ${isClaimable ? 'claimable' : ''}`}>
                  {isUnlocked ? (
                    <Check size={20} color="#00FF41" strokeWidth={3} />
                  ) : isClaimable ? (
                    <IconComponent size={20} color="#ffd700" strokeWidth={2.5} />
                  ) : (
                    <Lock size={18} color="#666" />
                  )}
                </div>

                {/* Инфо */}
                <div className="achievement-info">
                  <span className="achievement-name">{ach.name}</span>
                  <span className="achievement-desc">{ach.description}</span>
                  <span className="achievement-reward">💎 {ach.reward?.toLocaleString('ru-RU') || 0}</span>
                </div>

                {/* Статус / Кнопка */}
                {isUnlocked && <span className="achievement-status done">ПОЛУЧЕНО</span>}
                {isInProgress && <span className="achievement-status progress">В ПРОЦЕССЕ</span>}
                {isClaimable && (
                  <button className="achievement-claim-btn" onClick={() => handleClaim(ach.id)}>
                    ЗАБРАТЬ
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};