// src/components/ProfileScreen.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, Star, Car, Trophy, Gift, History, 
  TrendingUp, MousePointerClick, Flag, Building2
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ReferralScreen } from './ReferralScreen';
import { HistoryModal } from './HistoryModal';
import { AchievementsScreen } from './AchievementsScreen';
import { CARS } from '../config/cars';
import { getLeagueByPoints } from '../config/leagues';
import '../styles/profile.css';

const calcLevelInfo = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 50;
  const xpNextLevel = Math.pow(level, 2) * 50;
  const progress = Math.min(100, Math.max(0, ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100));
  return { level, xpCurrentLevel, xpNextLevel, progress };
};

export const ProfileScreen = () => {
  // 👇 Общий объект user (для avatar, balance, username и т.д.)
  const user = useGameStore((state) => state.user);
  const achievementsList = useGameStore((state) => state.achievementsList);
  const getAchievements = useGameStore((state) => state.getAchievements);

  // 👇 Ключевые поля отдельно — примитивы для реактивности
  const earnedClicks = useGameStore((state) => state.user?.earnedFromClicks || 0);
  const earnedRaces = useGameStore((state) => state.user?.earnedFromRaces || 0);
  const earnedBusiness = useGameStore((state) => state.user?.earnedFromBusiness || 0);
  const totalRaces = useGameStore((state) => state.user?.totalRaces || 0);
  const totalWins = useGameStore((state) => state.user?.totalWins || 0);
  const totalLosses = useGameStore((state) => state.user?.totalLosses || 0);
  const totalClicks = useGameStore((state) => state.user?.totalClicks || 0);
  
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

  const { level, xpCurrentLevel, xpNextLevel, progress } = calcLevelInfo(user.totalEarned || 0);
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Гонщик';
  const activeCar = CARS[user.activeCarId] || CARS['vaz-2107'];
  const league = getLeagueByPoints(user.leaguePoints || 0);

  const joinDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const unclaimedCount = achievementsList.filter(a => a.isCompleted && !a.isUnlocked).length;

  // 👇 Винрейт считаем из примитивов
  const winRate = totalRaces > 0 ? Math.round((totalWins / totalRaces) * 100) : 0;
  const winRateColor = winRate >= 50 ? '#00d97e' : winRate >= 30 ? '#ffcc00' : '#ff4444';
  const winRateGlow = winRate >= 50 ? 'rgba(0,217,126,0.5)' : winRate >= 30 ? 'rgba(255,204,0,0.5)' : 'rgba(255,68,68,0.5)';

  return (
    <motion.div
      className="profile-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="profile-content">
        {/* === ШАПКА === */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={displayName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {displayName[0]?.toUpperCase() || 'Г'}
              </div>
            )}
            <div className="level-badge">LVL {level}</div>
          </div>

          <h1 className="profile-name">{displayName}</h1>
          {user.username && <p className="profile-username">@{user.username}</p>}

          <div className="xp-section">
            <div className="xp-labels">
              <span className="xp-label-title">Опыт</span>
              <span className="xp-label-value">
                {Math.max(0, Math.floor(user.totalEarned - xpCurrentLevel))} / {xpNextLevel - xpCurrentLevel} XP
              </span>
            </div>
            <div className="xp-bar">
              <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* === СТАТИСТИКА ДОХОДА === */}
        <div className="profile-stats-card single">
          <div className="profile-stat-cell" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} color="var(--accent)" />
                <span className="profile-stat-label" style={{ fontSize: '10px' }}>Статистика дохода</span>
              </div>
              <button 
                onClick={() => setShowHistory(true)}
                style={{ 
                  background: 'none', border: 'none', color: 'var(--accent)', 
                  fontSize: '10px', fontWeight: 900, cursor: 'pointer', 
                  textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px'
                }}
              >
                <History size={12} />
                История
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <MousePointerClick size={12} color="#00e5ff" /> С кликов:
                </div>
                <span style={{ fontWeight: 900, color: '#fff' }}>
                  {earnedClicks.toLocaleString('ru-RU')}
                <span className="currency-ruble sm" style={{ marginLeft: 3 }}>₽</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Flag size={12} color="#ffd700" /> С гонок:
                </div>
                <span style={{ fontWeight: 900, color: '#fff' }}>
                  {earnedRaces.toLocaleString('ru-RU')}
                <span className="currency-ruble sm" style={{ marginLeft: 3 }}>₽</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Building2 size={12} color="#00d97e" /> С бизнеса:
                </div>
                <span style={{ fontWeight: 900, color: '#fff' }}>
                  {earnedBusiness.toLocaleString('ru-RU')}
                <span className="currency-ruble sm" style={{ marginLeft: 3 }}>₽</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* === БАЛАНС И ЗВЕЗДЫ === */}
        <div className="profile-stats-card">
          <div className="profile-stat-cell">
            <div className="profile-stat-icon stars"><Coins size={16} color="#ffcc00" /></div>
            <div className="profile-stat-info">
              <span className="profile-stat-label">Баланс</span>
              <span className="profile-stat-value">
                {user.balance.toLocaleString('ru-RU')}
              <span className="currency-ruble" style={{ marginLeft: 4 }}>₽</span>
              </span>
            </div>
          </div>
          <div className="profile-stat-cell">
            <div className="profile-stat-icon league"><Star size={16} color="#00e5ff" /></div>
            <div className="profile-stat-info">
              <span className="profile-stat-label">Звёзды</span>
              <span className="profile-stat-value">{user.starsBalance}</span>
            </div>
          </div>
        </div>

        {/* === ЛИГА И МАШИНА === */}
        <div className="profile-stats-card">
          <div className="profile-stat-cell">
            <div className="profile-stat-icon rating"><Trophy size={16} color="#ffd700" /></div>
            <div className="profile-stat-info">
              <span className="profile-stat-label">{league.name}</span>
              <span className="profile-stat-value">{user.leaguePoints || 0} очк.</span>
            </div>
          </div>
          <div className="profile-stat-cell">
            <div className="profile-stat-icon balance"><Car size={16} color="#00d97e" /></div>
            <div className="profile-stat-info">
              <span className="profile-stat-label">Активная машина</span>
              <span className="profile-stat-value" style={{ fontSize: '10px' }}>{activeCar.name}</span>
            </div>
          </div>
        </div>

        {/* === ИГРОВАЯ СТАТИСТИКА === */}
        <div className="profile-game-stats">
          <div className="profile-game-stat">
            <MousePointerClick size={14} color="#00e5ff" style={{ marginBottom: '2px' }} />
            <div className="profile-game-stat-value">{totalClicks.toLocaleString('ru-RU')}</div>
            <div className="profile-game-stat-label">Кликов</div>
          </div>
          <div className="profile-game-stat">
            <Flag size={14} color="#ffd700" style={{ marginBottom: '2px' }} />
            <div className="profile-game-stat-value">{totalRaces}</div>
            <div className="profile-game-stat-label">Гонок</div>
          </div>
          <div className="profile-game-stat">
            <Trophy size={14} color="#00d97e" style={{ marginBottom: '2px' }} />
            <div className="profile-game-stat-value" style={{ color: '#00d97e' }}>{totalWins}</div>
            <div className="profile-game-stat-label">Побед</div>
          </div>
          <div className="profile-game-stat">
            <Flag size={14} color="#ff4444" style={{ marginBottom: '2px' }} />
            <div className="profile-game-stat-value" style={{ color: '#ff4444' }}>{totalLosses}</div>
            <div className="profile-game-stat-label">Поражений</div>
          </div>
        </div>

        {/* === WINRATE === */}
        <div className="profile-winrate-row">
          <span className="profile-winrate-label">
            <TrendingUp size={12} /> Winrate (побед)
          </span>
          <span className="profile-winrate-value" style={{ color: winRateColor, textShadow: `0 0 10px ${winRateGlow}` }}>
            {winRate}%
          </span>
        </div>

        {/* === ДОСТИЖЕНИЯ === */}
        <button
          className="profile-referral-btn"
          onClick={() => setShowAchievements(true)}
          style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }}
        >
          <span className="profile-referral-icon" style={{ background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}>
            <Trophy size={16} color="#ffd700" />
          </span>
          <div className="profile-referral-text" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <span className="profile-referral-title" style={{ color: '#ffd700' }}>Достижения</span>
            {unclaimedCount > 0 && (
              <div style={{
                background: '#ff4444', color: '#fff', fontSize: '10px', fontWeight: 'bold',
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
          <span className="profile-referral-icon"><Gift size={16} color="var(--accent)" /></span>
          <div className="profile-referral-text">
            <span className="profile-referral-title">Пригласить друга</span>
            <span className="profile-referral-sub">
              Заработано: {(user.referralEarnings || 0).toLocaleString('ru-RU')} ₽
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
      </div>

      {/* === МОДАЛКИ === */}
      {showReferral && <ReferralScreen onClose={() => setShowReferral(false)} />}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showAchievements && <AchievementsScreen onClose={() => setShowAchievements(false)} />}
    </motion.div>
  );
};