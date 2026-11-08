// src/components/ProfileScreen.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Coins, Star, Car, Trophy, Gift, History,
  TrendingUp, MousePointerClick, Flag, Building2, Sparkles, ChevronRight, Lock, Check,
  Shield,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ReferralScreen } from './ReferralScreen';
import { HistoryModal } from './HistoryModal';
import { AchievementsScreen } from './AchievementsScreen';
import { LevelRewardModal } from './LevelRewardModal';
import { CARS } from '../config/cars';
import { getLeagueByPoints } from '../config/leagues';
import { LEVEL_REWARDS, calcLevel } from '../config/levelRewards';
import { CATEGORY_META, TIER_META } from '../config/achievements';
import { BADGES } from '../config/badges';
import { getSeasonName } from '../config/seasons';
import '../styles/profile.css';

const calcLevelInfo = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpNextLevel = Math.pow(level, 2) * 100;
  const progress = Math.min(
    100,
    Math.max(0, ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100)
  );
  return { level, xpCurrentLevel, xpNextLevel, progress };
};

const renderLucideIcon = (name: string, size = 20, color = 'currentColor') => {
  const IconComponent = (LucideIcons as any)[name] || Trophy;
  return <IconComponent size={size} color={color} strokeWidth={2} />;
};

export const ProfileScreen = () => {
  const user = useGameStore((state) => state.user);
  const achievementsList = useGameStore((state) => state.achievementsList);
  const getAchievements = useGameStore((state) => state.getAchievements);
  const myBadges = useGameStore((state) => state.myBadges);
  const fetchMyBadges = useGameStore((state) => state.fetchMyBadges);

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
  const [showLevelReward, setShowLevelReward] = useState(false);

  useEffect(() => {
    getAchievements();
    fetchMyBadges();
  }, [getAchievements, fetchMyBadges]);

  const recentAchievements = useMemo(() => {
    if (!achievementsList.length) return [];

    const claimable = achievementsList.filter((a: any) => a.isCompleted && !a.isUnlocked);
    const unlocked = achievementsList.filter((a: any) => a.isUnlocked);
    const inProgress = achievementsList.filter((a: any) => !a.isCompleted && !a.isUnlocked);

    const combined = [...claimable, ...unlocked, ...inProgress];
    return combined.slice(0, 3);
  }, [achievementsList]);

  if (!user) {
    return (
      <div className="profile-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Загрузка...</div>
      </div>
    );
  }

  const { level, xpCurrentLevel, xpNextLevel, progress } = calcLevelInfo(user.xp || 0);
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Гонщик';
  const activeCar = CARS[user.activeCarId] || CARS['vaz-2107'];
  const league = getLeagueByPoints(user.leaguePoints || 0);

  const joinDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const unclaimedCount = achievementsList.filter((a: any) => a.isCompleted && !a.isUnlocked).length;
  const winRate = totalRaces > 0 ? Math.round((totalWins / totalRaces) * 100) : 0;
  const winRateColor = winRate >= 50 ? 'var(--success)' : winRate >= 30 ? '#ffcc00' : 'var(--danger)';
  const winRateGlow = winRate >= 50 ? 'var(--success-glow)' : winRate >= 30 ? 'rgba(255,204,0,0.4)' : 'var(--danger-glow)';

  const lastClaimed = user.lastClaimedLevel || 1;
  const currentLevelNum = calcLevel(user.xp || 0);
  const hasLevelReward =
    currentLevelNum > lastClaimed &&
    LEVEL_REWARDS.some((r) => r.level > lastClaimed && r.level <= currentLevelNum);

  return (
    <motion.div
      className="profile-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
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
            <div className="level-badge">
              LVL {level}
              {hasLevelReward && (
                <span
                  onClick={() => setShowLevelReward(true)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    color: '#000',
                    fontSize: 11,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px var(--gold)',
                    cursor: 'pointer',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                >
                  !
                </span>
              )}
            </div>
          </div>
          <h1 className="profile-name">{displayName}</h1>
          {user.username && <p className="profile-username">@{user.username}</p>}
        </div>

        {/* XP-БАР */}
        <div className="xp-section">
          <div className="xp-labels">
            <span className="xp-label-title">ОПЫТ</span>
            <span className="xp-label-value">
              {Math.max(0, Math.floor((user.xp || 0) - xpCurrentLevel))} / {xpNextLevel - xpCurrentLevel} XP
            </span>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* НАГРАДА ЗА УРОВЕНЬ */}
        {hasLevelReward && (
          <button
            className="profile-menu-btn"
            onClick={() => setShowLevelReward(true)}
            style={{
              borderColor: 'var(--gold)',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 136, 0, 0.05))',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }}
          >
            <span
              className="menu-icon"
              style={{
                background: 'rgba(255, 215, 0, 0.15)',
                borderColor: 'rgba(255, 215, 0, 0.4)',
              }}
            >
              <Sparkles size={20} color="var(--gold)" />
            </span>
            <div className="menu-text">
              <span className="menu-title" style={{ color: 'var(--gold)' }}>
                НАГРАДА ЗА УРОВЕНЬ!
              </span>
              <span className="menu-sub">LVL {currentLevelNum} — забери награду</span>
            </div>
            <span className="menu-arrow" style={{ color: 'var(--gold)' }}>›</span>
          </button>
        )}

        {/* === БЕЙДЖИ === */}
        <div className="profile-card badges-card">
          <div className="card-header">
            <div className="card-title">
              <Shield size={16} color="var(--gold)" />
              <span>БЕЙДЖИ</span>
            </div>
            <div className="badges-season">
              <Sparkles size={12} />
              {getSeasonName()}
            </div>
          </div>

          {myBadges.length === 0 ? (
            <div className="badges-empty">
              Пока нет бейджей. Стань лучшим в сезоне!
            </div>
          ) : (
            <div className="badges-grid">
              {myBadges.map((ub) => {
                const badge = BADGES[ub.badgeId];
                if (!badge) return null;
                const IconComp = (LucideIcons as any)[badge.iconName] || Trophy;
                return (
                  <div
                    key={`${ub.badgeId}_${ub.seasonId}`}
                    className={`badge-item ${badge.seasonOnly ? 'season' : ''}`}
                    style={{
                      borderColor: `${badge.color}66`,
                      background: `linear-gradient(135deg, ${badge.color}22, transparent)`,
                    }}
                    title={badge.description}
                  >
                    <div
                      className="badge-icon"
                      style={{
                        background: `${badge.color}22`,
                        borderColor: `${badge.color}88`,
                        boxShadow: `0 0 15px ${badge.color}44`,
                        color: badge.color,
                      }}
                    >
                      <IconComp size={18} />
                    </div>
                    <div className="badge-info">
                      <span className="badge-name" style={{ color: badge.color }}>
                        {badge.name}
                      </span>
                      {badge.seasonOnly && ub.seasonId && (
                        <span className="badge-season-label">{getSeasonName(ub.seasonId)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              <div className="income-label">
                <MousePointerClick size={14} color="#00e5ff" /> С кликов
              </div>
              <div className="income-value">
                {earnedClicks.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span>
              </div>
            </div>
            <div className="income-row">
              <div className="income-label">
                <Flag size={14} color="#ffd700" /> С гонок
              </div>
              <div className="income-value">
                {earnedRaces.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span>
              </div>
            </div>
            <div className="income-row">
              <div className="income-label">
                <Building2 size={14} color="var(--success)" /> С бизнеса
              </div>
              <div className="income-value">
                {earnedBusiness.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* БАЛАНС И ЗВЁЗДЫ */}
        <div className="profile-grid-2">
          <div className="profile-card mini-card">
            <div
              className="mini-icon"
              style={{ background: 'rgba(255, 204, 0, 0.1)', borderColor: 'rgba(255, 204, 0, 0.3)' }}
            >
              <Coins size={20} color="#ffcc00" />
            </div>
            <div className="mini-info">
              <span className="mini-label">БАЛАНС</span>
              <span className="mini-value">
                {user.balance.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span>
              </span>
            </div>
          </div>
          <div className="profile-card mini-card">
            <div
              className="mini-icon"
              style={{ background: 'rgba(0, 229, 255, 0.1)', borderColor: 'rgba(0, 229, 255, 0.3)' }}
            >
              <Star size={20} color="var(--accent)" />
            </div>
            <div className="mini-info">
              <span className="mini-label">ЗВЁЗДЫ</span>
              <span className="mini-value">{user.starsBalance}</span>
            </div>
          </div>
        </div>

        {/* ЛИГА И МАШИНА */}
        <div className="profile-grid-2">
          <div className="profile-card mini-card">
            <div
              className="mini-icon"
              style={{ background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
            >
              <Trophy size={20} color="#ffd700" />
            </div>
            <div className="mini-info">
              <span className="mini-label">{league.name}</span>
              <span className="mini-value">{user.leaguePoints || 0} ОЧК.</span>
            </div>
          </div>
          <div className="profile-card mini-card">
            <div
              className="mini-icon"
              style={{ background: 'rgba(0, 217, 126, 0.1)', borderColor: 'rgba(0, 217, 126, 0.3)' }}
            >
              <Car size={20} color="var(--success)" />
            </div>
            <div className="mini-info">
              <span className="mini-label">МАШИНА</span>
              <span className="mini-value" style={{ fontSize: '12px' }}>
                {activeCar.name}
              </span>
              {activeCar.clickMultiplier > 1 && (
                <span
                  style={{
                    fontSize: '9px',
                    color: '#00d97e',
                    fontWeight: 800,
                    marginTop: '2px',
                  }}
                >
                  ×{activeCar.clickMultiplier.toFixed(1)} к клику
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ИГРОВАЯ СТАТИСТИКА */}
        <div className="profile-card game-stats-card">
          <div className="game-stat">
            <div className="game-stat-icon">
              <MousePointerClick size={18} color="#00e5ff" />
            </div>
            <div className="game-stat-value">{totalClicks.toLocaleString('ru-RU')}</div>
            <div className="game-stat-label">КЛИКОВ</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon">
              <Flag size={18} color="#ffd700" />
            </div>
            <div className="game-stat-value">{totalRaces}</div>
            <div className="game-stat-label">ГОНОК</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon">
              <Trophy size={18} color="var(--success)" />
            </div>
            <div className="game-stat-value" style={{ color: 'var(--success)' }}>
              {totalWins}
            </div>
            <div className="game-stat-label">ПОБЕД</div>
          </div>
          <div className="game-stat">
            <div className="game-stat-icon">
              <Flag size={18} color="var(--danger)" />
            </div>
            <div className="game-stat-value" style={{ color: 'var(--danger)' }}>
              {totalLosses}
            </div>
            <div className="game-stat-label">ПОРАЖЕНИЙ</div>
          </div>
        </div>

        {/* WINRATE */}
        <div className="profile-card winrate-card">
          <div className="winrate-label">
            <TrendingUp size={16} /> WINRATE
          </div>
          <div
            className="winrate-value"
            style={{ color: winRateColor, textShadow: `0 0 12px ${winRateGlow}` }}
          >
            {winRate}%
          </div>
        </div>

        {/* ПОСЛЕДНИЕ ДОСТИЖЕНИЯ */}
        {recentAchievements.length > 0 && (
          <div className="profile-card recent-achievements-card">
            <div className="card-header">
              <div className="card-title">
                <Trophy size={16} color="var(--gold)" />
                <span>ПОСЛЕДНИЕ ДОСТИЖЕНИЯ</span>
              </div>
              <button className="card-action" onClick={() => setShowAchievements(true)}>
                ВСЕ <ChevronRight size={14} />
              </button>
            </div>
            <div className="recent-achievements-list">
              {recentAchievements.map((ach: any) => {
                const isUnlocked = ach.isUnlocked;
                const isClaimable = ach.isCompleted && !isUnlocked;
                const categoryMeta =
                  CATEGORY_META[ach.category as keyof typeof CATEGORY_META] || CATEGORY_META.wealth;
                const tierMeta = TIER_META[ach.tier as 1 | 2 | 3 | 4 | 5] || TIER_META[1];

                return (
                  <div
                    key={ach.id}
                    className={`recent-ach-item ${isUnlocked ? 'unlocked' : ''} ${
                      isClaimable ? 'claimable' : ''
                    }`}
                  >
                    <div
                      className={`recent-ach-icon ${isUnlocked ? 'unlocked' : ''} ${
                        isClaimable ? 'claimable' : ''
                      }`}
                      style={{
                        background: isUnlocked
                          ? 'rgba(0, 217, 126, 0.15)'
                          : isClaimable
                          ? 'rgba(255, 215, 0, 0.15)'
                          : `${categoryMeta.color}15`,
                        borderColor: isUnlocked
                          ? 'rgba(0, 217, 126, 0.4)'
                          : isClaimable
                          ? 'rgba(255, 215, 0, 0.5)'
                          : `${categoryMeta.color}44`,
                      }}
                    >
                      {isUnlocked ? (
                        <Check size={18} color="var(--success)" strokeWidth={3} />
                      ) : isClaimable ? (
                        renderLucideIcon(ach.icon, 18, 'var(--gold)')
                      ) : (
                        <Lock size={16} color={categoryMeta.color} />
                      )}
                    </div>
                    <div className="recent-ach-info">
                      <div className="recent-ach-name">{ach.name}</div>
                      <div className="recent-ach-meta">
                        <span
                          className="recent-ach-tier"
                          style={{ color: tierMeta.color, borderColor: `${tierMeta.color}44` }}
                        >
                          {tierMeta.name}
                        </span>
                        <span className="recent-ach-reward">
                          {ach.reward.toLocaleString('ru-RU')}{' '}
                          <span className="currency-ruble sm">₽</span>
                        </span>
                      </div>
                    </div>
                    {isClaimable && <span className="recent-ach-badge">!</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* КНОПКИ */}
        <button
          className="profile-menu-btn"
          onClick={() => setShowAchievements(true)}
          style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }}
        >
          <span
            className="menu-icon"
            style={{ background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
          >
            <Trophy size={20} color="#ffd700" />
          </span>
          <span className="menu-title" style={{ color: '#ffd700' }}>
            ДОСТИЖЕНИЯ
          </span>
          {unclaimedCount > 0 && <span className="menu-badge">{unclaimedCount}</span>}
          <span className="menu-arrow">›</span>
        </button>

        <button className="profile-menu-btn" onClick={() => setShowReferral(true)}>
          <span className="menu-icon">
            <Gift size={20} color="var(--accent)" />
          </span>
          <div className="menu-text">
            <span className="menu-title">ПРИГЛАСИТЬ ДРУГА</span>
            <span className="menu-sub">
              Заработано: {(user.referralEarnings || 0).toLocaleString('ru-RU')}{' '}
              <span className="currency-ruble sm">₽</span>
            </span>
          </div>
          <span className="menu-arrow">›</span>
        </button>

        {/* ИНФО */}
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
            <span
              className="info-value"
              style={{ color: 'var(--success)', textShadow: '0 0 8px var(--success-glow)' }}
            >
              ● Активен
            </span>
          </div>
        </div>
      </div>

      {showReferral && <ReferralScreen onClose={() => setShowReferral(false)} />}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showAchievements && <AchievementsScreen onClose={() => setShowAchievements(false)} />}
      {showLevelReward && <LevelRewardModal onClose={() => setShowLevelReward(false)} />}
    </motion.div>
  );
};