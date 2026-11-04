// src/components/ProfileScreen.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ReferralScreen } from './ReferralScreen';
import { HistoryModal } from './HistoryModal';
import { AchievementsScreen } from './AchievementsScreen';
import { CARS } from '../config/cars';
import '../styles/profile.css';

const calcLevelInfo = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 50;
  const xpNextLevel = Math.pow(level, 2) * 50;
  const progress = Math.min(100, ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100);
  return { level, xpCurrentLevel, xpNextLevel, progress };
};

export const ProfileScreen = () => {
  const user = useGameStore((state) => state.user);
  const achievementsList = useGameStore((state) => state.achievementsList);
  const getAchievements = useGameStore((state) => state.getAchievements);
  
  const [showReferral, setShowReferral] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  if (!user) {
    return (
      <div className="profile-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#666' }}>Загрузка профиля...</div>
      </div>
    );
  }

  const { level, xpCurrentLevel, xpNextLevel, progress } = calcLevelInfo(user.totalEarned);
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Гонщик';
  const activeCar = CARS[user.activeCarId] || CARS['vaz-2107'];

  const joinDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const unclaimedCount = achievementsList.filter(a => a.isCompleted && !a.isUnlocked).length;

  // Winrate
  const totalRaces = user.totalRaces || 0;
  const totalWins = user.totalWins || 0;
  const winRate = totalRaces > 0 ? Math.round((totalWins / totalRaces) * 100) : 0;
  const winRateColor = winRate >= 50 ? '#00FF41' : winRate >= 30 ? '#ffcc00' : '#ff4444';
  const winRateGlow = winRate >= 50 ? 'rgba(0,255,65,0.5)' : winRate >= 30 ? 'rgba(255,204,0,0.5)' : 'rgba(255,68,68,0.5)';

  return (
    <motion.div
      className="profile-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* === ШАПКА === */}
      <div className="profile-header">
        <div className="avatar-wrapper">
          {user.photoUrl ? (
            <img src={user.photoUrl} alt={displayName} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {displayName[0].toUpperCase()}
            </div>
          )}
          <div className="level-badge">LVL {level}</div>
        </div>

        <h1 className="profile-name">{displayName}</h1>
        {user.username && <p className="profile-username">@{user.username}</p>}
      </div>

      {/* === XP === */}
      <div className="xp-section">
        <div className="xp-labels">
          <span className="xp-label-title">Опыт</span>
          <span className="xp-label-value">
            {Math.floor(user.totalEarned - xpCurrentLevel)} / {xpNextLevel - xpCurrentLevel} XP
          </span>
        </div>
        <div className="xp-bar">
          <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* === ОБЩАЯ СТАТИСТИКА === */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{user.totalEarned.toLocaleString('ru-RU')}</div>
          <div className="stat-label">Всего заработано</div>
        </div>

        <div className="stat-card" onClick={() => setShowHistory(true)} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">💵</div>
          <div className="stat-value">{user.balance.toLocaleString('ru-RU')}</div>
          <div className="stat-label">Баланс 📜</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{user.starsBalance}</div>
          <div className="stat-label">Звезды</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-value" style={{ fontSize: '14px', textTransform: 'uppercase' }}>
            {activeCar.name}
          </div>
          <div className="stat-label">Активная машина</div>
        </div>
      </div>

      {/* === ИГРОВАЯ СТАТИСТИКА === */}
      <div style={{
        fontSize: '14px', fontWeight: 900, textTransform: 'uppercase',
        letterSpacing: '1.5px', color: '#fff', margin: '8px 0 10px',
        paddingLeft: '10px', borderLeft: '3px solid #00e5ff', lineHeight: 1.2,
      }}>
        📊 Статистика
      </div>

      <div className="stats-grid" style={{ marginBottom: '14px' }}>
        <div className="stat-card">
          <div className="stat-icon">👆</div>
          <div className="stat-value">{(user.totalClicks || 0).toLocaleString('ru-RU')}</div>
          <div className="stat-label">Кликов</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏁</div>
          <div className="stat-value">{user.totalRaces || 0}</div>
          <div className="stat-label">Гонок</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value" style={{ color: '#00FF41' }}>{user.totalWins || 0}</div>
          <div className="stat-label">Побед</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💨</div>
          <div className="stat-value" style={{ color: '#ff4444' }}>{user.totalLosses || 0}</div>
          <div className="stat-label">Поражений</div>
        </div>
      </div>

      {/* Winrate */}
      <div className="profile-info-card" style={{ marginBottom: '14px' }}>
        <div className="info-row">
          <span className="info-label">Winrate (побед)</span>
          <span className="info-value" style={{ color: winRateColor, textShadow: `0 0 10px ${winRateGlow}` }}>
            {winRate}%
          </span>
        </div>
      </div>

      {/* === ДОСТИЖЕНИЯ === */}
      <button
        className="profile-referral-btn"
        onClick={() => setShowAchievements(true)}
        style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }}
      >
        <span className="profile-referral-icon">🏆</span>
        <div className="profile-referral-text" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <span className="profile-referral-title" style={{ color: '#ffd700' }}>Достижения</span>
          {unclaimedCount > 0 && (
            <div style={{
              background: '#ff4444', color: '#fff', fontSize: '11px', fontWeight: 'bold',
              padding: '2px 6px', borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 0 10px rgba(255,68,68,0.5)',
            }}>
              {unclaimedCount}
            </div>
          )}
        </div>
        <span className="profile-referral-arrow">›</span>
      </button>

      {/* === РЕФЕРАЛЫ === */}
      <button className="profile-referral-btn" onClick={() => setShowReferral(true)}>
        <span className="profile-referral-icon">🎁</span>
        <div className="profile-referral-text">
          <span className="profile-referral-title">Пригласить друга</span>
          <span className="profile-referral-sub">
            Заработано: {(user.referralEarnings || 0).toLocaleString('ru-RU')} 🪙
          </span>
        </div>
        <span className="profile-referral-arrow">›</span>
      </button>

      {/* === ИНФО === */}
      <div className="profile-info-card">
        <div className="info-row">
          <span className="info-label">Telegram ID</span>
          <span className="info-value">{user.id}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Дата регистрации</span>
          <span className="info-value">{joinDate}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Статус</span>
          <span className="info-value status-active">● Активен</span>
        </div>
      </div>

      {/* === МОДАЛКИ === */}
      {showReferral && <ReferralScreen onClose={() => setShowReferral(false)} />}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showAchievements && <AchievementsScreen onClose={() => setShowAchievements(false)} />}
    </motion.div>
  );
};