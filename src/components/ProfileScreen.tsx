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
  const user = useGameStore((state) => state.user);
  const achievementsList = useGameStore((state) => state.achievementsList);
  const getAchievements = useGameStore((state) => state.getAchievements);

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
        <div style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Загрузка...</div>
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
  const winRate = totalRaces > 0 ? Math.round((totalWins / totalRaces) * 100) : 0;
  const winRateColor = winRate >= 50 ? 'var(--success)' : winRate >= 30 ? '#ffcc00' : 'var(--danger)';
  const winRateGlow = winRate >= 50 ? 'var(--success-glow)' : winRate >= 30 ? 'rgba(255,204,0,0.4)' : 'var(--danger-glow)';

  return (
    <motion.div className="profile-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="profile-content">
        
                        {/* === ШАПКА === */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={displayName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">{displayName[0]?.toUpperCase() || 'Г'}</div>
            )}
            <div className="level-badge">LVL {level}</div>
          </div>
          <h1 className="profile-name">{displayName}</h1>
          {user.username && <p className="profile-username">@{user.username}</p>}
        </div>

        {/* XP-бар */}
        <div className="xp-section">
          <div className="xp-labels">
            <span className="xp-label-title">ОПЫТ</span>
            <span className="xp-label-value">{Math.max(0, Math.floor(user.totalEarned - xpCurrentLevel))} / {xpNextLevel - xpCurrentLevel} XP</span>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* === СТАТИСТИКА ДОХОДА === */}
        <div className="profile-card income-card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={16} color="var(--accent)" />
              <span>СТАТИСТИКА ДОХОДА</span>
            </div>
            <button className="card-action" onClick={() => setShowHistory(true)}>
              <History size={14} /> ИСТОРИЯ
            </button>
          </div>
          <div className="income-list">
            <div className="income-row">
              <div className="income-label"><MousePointerClick size={14} color="#00e5ff" /> С кликов</div>
              <div className="income-value">{earnedClicks.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span></div>
            </div>
            <div className="income-row">
              <div className="income-label"><Flag size={14} color="#ffd700" /> С гонок</div>
              <div className="income-value">{earnedRaces.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span></div>
            </div>
            <div className="income-row">
              <div className="income-label"><Building2 size={14} color="var(--success)" /> С бизнеса</div>
              <div className="income-value">{earnedBusiness.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span></div>
            </div>
          </div>
        </div>

        {/* === БАЛАНС И ЗВЕЗДЫ === */}
        <div className="profile-grid-2">
          <div className="profile-card mini-card">
            <div className="mini-icon" style={{ background: 'rgba(255, 204, 0, 0.1)', borderColor: 'rgba(255, 204, 0, 0.3)' }}><Coins size={20} color="#ffcc00" /></div>
            <div className="mini-info">
              <span className="mini-label">БАЛАНС</span>
              <span className="mini-value">{user.balance.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span></span>
            </div>
          </div>
          <div className="profile-card mini-card">
            <div className="mini-icon" style={{ background: 'rgba(0, 229, 255, 0.1)', borderColor: 'rgba(0, 229, 255, 0.3)' }}><Star size={20} color="var(--accent)" /></div>
            <div className="mini-info">
              <span className="mini-label">ЗВЁЗДЫ</span>
              <span className="mini-value">{user.starsBalance}</span>
            </div>
          </div>
        </div>

        {/* === ЛИГА И МАШИНА === */}
        <div className="profile-grid-2">
          <div className="profile-card mini-card">
            <div className="mini-icon" style={{ background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}><Trophy size={20} color="#ffd700" /></div>
            <div className="mini-info">
              <span className="mini-label">{league.name}</span>
              <span className="mini-value">{user.leaguePoints || 0} ОЧК.</span>
            </div>
          </div>
          <div className="profile-card mini-card">
            <div className="mini-icon" style={{ background: 'rgba(0, 217, 126, 0.1)', borderColor: 'rgba(0, 217, 126, 0.3)' }}><Car size={20} color="var(--success)" /></div>
            <div className="mini-info">
              <span className="mini-label">МАШИНА</span>
              <span className="mini-value" style={{ fontSize: '12px' }}>{activeCar.name}</span>
            </div>
          </div>
        </div>

        {/* === ИГРОВАЯ СТАТИСТИКА === */}
        <div className="profile-card game-stats-card">
          <div className="game-stat">
            <div className="game-stat-icon"><MousePointerClick size={18} color="#00e5ff" /></div>
            <div className="game-stat-value">{totalClicks.toLocaleString('ru-RU')}</div>
            <div className="game-stat-label">КЛИКОВ</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon"><Flag size={18} color="#ffd700" /></div>
            <div className="game-stat-value">{totalRaces}</div>
            <div className="game-stat-label">ГОНОК</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon"><Trophy size={18} color="var(--success)" /></div>
            <div className="game-stat-value" style={{ color: 'var(--success)' }}>{totalWins}</div>
            <div className="game-stat-label">ПОБЕД</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon"><Flag size={18} color="var(--danger)" /></div>
            <div className="game-stat-value" style={{ color: 'var(--danger)' }}>{totalLosses}</div>
            <div className="game-stat-label">ПОРАЖЕНИЙ</div>
          </div>
        </div>

        {/* === WINRATE === */}
        <div className="profile-card winrate-card">
          <div className="winrate-label"><TrendingUp size={16} /> WINRATE</div>
          <div className="winrate-value" style={{ color: winRateColor, textShadow: `0 0 12px ${winRateGlow}` }}>
            {winRate}%
          </div>
        </div>

        {/* === КНОПКИ === */}
        <button className="profile-menu-btn" onClick={() => setShowAchievements(true)} style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }}>
          <span className="menu-icon" style={{ background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}><Trophy size={20} color="#ffd700" /></span>
          <span className="menu-title" style={{ color: '#ffd700' }}>ДОСТИЖЕНИЯ</span>
          {unclaimedCount > 0 && <span className="menu-badge">{unclaimedCount}</span>}
          <span className="menu-arrow">›</span>
        </button>

        <button className="profile-menu-btn" onClick={() => setShowReferral(true)}>
          <span className="menu-icon"><Gift size={20} color="var(--accent)" /></span>
          <div className="menu-text">
            <span className="menu-title">ПРИГЛАСИТЬ ДРУГА</span>
            <span className="menu-sub">Заработано: {(user.referralEarnings || 0).toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span></span>
          </div>
          <span className="menu-arrow">›</span>
        </button>

        {/* === ИНФО === */}
        <div className="profile-card info-card">
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
            <span className="info-value" style={{ color: 'var(--success)', textShadow: '0 0 8px var(--success-glow)' }}>● Активен</span>
          </div>
        </div>

      </div>

      {showReferral && <ReferralScreen onClose={() => setShowReferral(false)} />}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showAchievements && <AchievementsScreen onClose={() => setShowAchievements(false)} />}
    </motion.div>
  );
};