// src/components/AchievementsScreen.tsx (начало файла)
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Lock, Check,
  Coins, Wallet, Gem, Crown, Landmark,
  Pointer, Zap, Flame, Rocket, Sparkles,
  Flag, Gauge, Medal, Award,
  Car, CarFront, CarTaxiFront, Warehouse,
  Wrench, Cog, Hammer, Shield, Star,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { CATEGORY_META, TIER_META, AchievementCategory } from '../config/achievements';
import '../styles/achievements.css';

const ICON_MAP: Record<string, any> = {
  Coins, Wallet, Gem, Crown, Landmark,
  Pointer, Zap, Flame, Rocket, Sparkles,
  Flag, Gauge, Trophy, Medal, Award,
  Car, CarFront, CarTaxiFront, Warehouse,
  Wrench, Cog, Hammer, Shield, Star,
};

const renderLucideIcon = (name: string, size = 20, color = 'currentColor') => {
  const IconComponent = ICON_MAP[name] || Trophy;
  return <IconComponent size={size} color={color} strokeWidth={2} />;
};

export const AchievementsScreen = ({ onClose }: { onClose: () => void }) => {
  const achievementsList = useGameStore((s) => s.achievementsList);
  const getAchievements = useGameStore((s) => s.getAchievements);
  const claimAchievement = useGameStore((s) => s.claimAchievement);

  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('wealth');

  useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  const handleClaim = async (id: string) => {
    const success = await claimAchievement(id);
    if (success) WebApp.HapticFeedback?.notificationOccurred('success');
    else WebApp.HapticFeedback?.notificationOccurred('error');
  };

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    achievementsList.forEach((ach: any) => {
      const cat = ach.category || 'legend';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(ach);
    });
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => (a.tier || 0) - (b.tier || 0));
    });
    return groups;
  }, [achievementsList]);

  const totalUnlocked = achievementsList.filter(a => a.isUnlocked).length;
  const totalClaimable = achievementsList.filter(a => a.isCompleted && !a.isUnlocked).length;
  const activeAchievements = grouped[activeCategory] || [];
  const activeUnlocked = activeAchievements.filter(a => a.isUnlocked).length;

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
          <h2>
            <Trophy size={18} color="#ffd700" /> 
            Достижения
            {totalClaimable > 0 && (
              <span style={{
                background: '#ff4444', color: '#fff', fontSize: '10px', fontWeight: 'bold',
                padding: '2px 6px', borderRadius: '10px', marginLeft: 4,
              }}>
                {totalClaimable}
              </span>
            )}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: 700 }}>
              {totalUnlocked}/{achievementsList.length}
            </span>
            <button className="achievements-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Табы категорий */}
        <div className="achievements-tabs">
          {(Object.keys(CATEGORY_META) as AchievementCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const catAchievements = grouped[cat] || [];
            const catUnlocked = catAchievements.filter(a => a.isUnlocked).length;
            const hasClaimable = catAchievements.some(a => a.isCompleted && !a.isUnlocked);
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                className={`achievement-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={isActive ? { borderColor: meta.color, color: meta.color } : {}}
              >
                {renderLucideIcon(meta.icon, 16, isActive ? meta.color : '#888')}
                <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {meta.name}
                </span>
                <span style={{ fontSize: '8px', color: '#666' }}>
                  {catUnlocked}/{catAchievements.length}
                </span>
                {hasClaimable && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#ff4444', boxShadow: '0 0 6px #ff4444',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Прогресс категории */}
        <div className="achievements-progress-bar">
          <div 
            className="achievements-progress-fill"
            style={{ 
              width: activeAchievements.length > 0 ? `${(activeUnlocked / activeAchievements.length) * 100}%` : '0%',
              background: `linear-gradient(90deg, ${CATEGORY_META[activeCategory].color}, ${CATEGORY_META[activeCategory].color}88)`,
              boxShadow: `0 0 10px ${CATEGORY_META[activeCategory].color}66`
            }} 
          />
        </div>

        <div className="achievements-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {activeAchievements.length === 0 && (
                <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
                  Нет достижений в этой категории
                </div>
              )}

              {activeAchievements.map((ach: any) => {
                const isUnlocked = ach.isUnlocked;
                const isClaimable = ach.isCompleted && !ach.isUnlocked;
                const tier = (ach.tier || 1) as 1|2|3|4|5;
                const tierColor = TIER_META[tier]?.color || '#888';

                let cardClass = 'achievement-card';
                if (isUnlocked) cardClass += ' unlocked';
                if (isClaimable) cardClass += ' claimable';

                return (
                  <div key={ach.id} className={cardClass}>
                    <div className={`achievement-icon-wrapper ${isUnlocked ? 'unlocked' : ''} ${isClaimable ? 'claimable' : ''}`}>
                      {isUnlocked ? (
                        <Check size={20} color="#00FF41" strokeWidth={3} />
                      ) : isClaimable ? (
                        renderLucideIcon(ach.icon, 20, '#ffd700')
                      ) : (
                        <Lock size={18} color="#666" />
                      )}
                    </div>

                    <div className="achievement-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span 
                          style={{
                            fontSize: '9px', fontWeight: 900, padding: '1px 6px',
                            borderRadius: 4, background: `${tierColor}22`,
                            color: tierColor, border: `1px solid ${tierColor}44`,
                            textTransform: 'uppercase', letterSpacing: '0.5px',
                          }}
                        >
                          {TIER_META[tier]?.name || 'T' + tier}
                        </span>
                        <span className="achievement-name">{ach.name}</span>
                      </div>
                      <span className="achievement-desc">{ach.description}</span>
                      <span className="achievement-reward">💎 {ach.reward?.toLocaleString('ru-RU') || 0}</span>
                    </div>

                    {isUnlocked && <span className="achievement-status done">✓</span>}
                    {isClaimable && (
                      <button className="achievement-claim-btn" onClick={() => handleClaim(ach.id)}>
                        ЗАБРАТЬ
                      </button>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};