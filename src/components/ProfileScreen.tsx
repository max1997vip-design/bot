// src/components/ProfileScreen.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ReferralScreen } from './ReferralScreen';
import { HistoryModal } from './HistoryModal';
import { AchievementsScreen } from './AchievementsScreen'; // 👈 Импорт экрана достижений

// Формула уровня
const calcLevelInfo = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 50;
  const xpNextLevel = Math.pow(level, 2) * 50;
  const progress = Math.min(
    100,
    ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100
  );
  return { level, xpCurrentLevel, xpNextLevel, progress };
};

export const ProfileScreen = () => {
  const user = useGameStore((state) => state.user);
  
  // Состояния для открытия модалок
  const [showReferral, setShowReferral] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false); // 👈 Стейт для достижений

  if (!user) {
    return (
      <div className="profile-screen">
        <div className="placeholder-screen">Загрузка профиля...</div>
      </div>
    );
  }

  const { level, xpCurrentLevel, xpNextLevel, progress } = calcLevelInfo(user.totalEarned);
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Гонщик';

  const joinDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      className="profile-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Шапка с аватаром */}
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

      {/* XP прогресс */}
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

      {/* Сетка статистики */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{user.totalEarned.toLocaleString('ru-RU')}</div>
          <div className="stat-label">Всего заработано</div>
        </div>

        {/* Карточка баланса с открытием истории */}
        <div 
          className="stat-card" 
          onClick={() => setShowHistory(true)}
          style={{ cursor: 'pointer' }}
        >
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
          <div className="stat-value" style={{ fontSize: '16px', textTransform: 'uppercase' }}>
            {user.activeCarId}
          </div>
          <div className="stat-label">Активная машина</div>
        </div>
      </div>

      {/* 👇 КНОПКА ДОСТИЖЕНИЙ */}
      <button
        className="profile-referral-btn"
        onClick={() => setShowAchievements(true)}
        style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }} // Золотая рамка для выделения
      >
        <span className="profile-referral-icon">🏆</span>
        <div className="profile-referral-text">
          <span className="profile-referral-title" style={{ color: '#ffd700' }}>Достижения</span>
          <span className="profile-referral-sub">Получай монеты за прогресс</span>
        </div>
        <span className="profile-referral-arrow">›</span>
      </button>

      {/* Кнопка: Приглашение друзей */}
      <button
        className="profile-referral-btn"
        onClick={() => setShowReferral(true)}
      >
        <span className="profile-referral-icon">🎁</span>
        <div className="profile-referral-text">
          <span className="profile-referral-title">Пригласить друга</span>
          <span className="profile-referral-sub">
            Заработано: {(user.referralEarnings || 0).toLocaleString('ru-RU')} 🪙
          </span>
        </div>
        <span className="profile-referral-arrow">›</span>
      </button>

      {/* Информация об аккаунте */}
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

      {/* Модалки */}
      {showReferral && <ReferralScreen onClose={() => setShowReferral(false)} />}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showAchievements && <AchievementsScreen onClose={() => setShowAchievements(false)} />}
    </motion.div>
  );
};