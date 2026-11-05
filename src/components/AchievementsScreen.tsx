// src/components/AchievementsScreen.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import '../styles/achievements.css';

interface AchievementsScreenProps {
  onClose: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onClose }) => {
  const achievementsList = useGameStore((s) => s.achievementsList);
  const getAchievements = useGameStore((s) => s.getAchievements);
  const claimAchievement = useGameStore((s) => s.claimAchievement);

  useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  return (
    <div className="achievements-screen" onClick={onClose}>
      <motion.div
        className="achievements-content"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="achievements-header">
          <h2>🏆 Достижения</h2>
          <button className="achievements-close" onClick={onClose}>✕</button>
        </div>

        <div className="achievements-body">
          {achievementsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              Достижений пока нет
            </div>
          ) : (
            achievementsList.map((ach) => {
              const isClaimable = ach.isCompleted && !ach.isUnlocked;
              const isDone = ach.isUnlocked;

              return (
                <div
                  key={ach.id}
                  className={`achievement-card ${isDone ? 'unlocked' : ''} ${isClaimable ? 'claimable' : ''}`}
                >
                  <div className="achievement-icon">{ach.icon || '🏆'}</div>
                  <div className="achievement-info">
                    <div className="achievement-name">{ach.name}</div>
                    <div className="achievement-desc">{ach.description}</div>
                    <div className="achievement-reward">💰 {ach.reward?.toLocaleString('ru-RU') || 0}</div>
                  </div>
                  {isClaimable ? (
                    <button
                      className="achievement-claim-btn"
                      onClick={() => claimAchievement(ach.id)}
                    >
                      Забрать
                    </button>
                  ) : isDone ? (
                    <span className="achievement-status done">Получено</span>
                  ) : (
                    <span className="achievement-status progress">В процессе</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};