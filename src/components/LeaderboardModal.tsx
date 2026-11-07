// src/components/LeaderboardModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Trophy, X, Crown } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import '../styles/leaderboard.css';

type LeaderboardType = 'balance' | 'xp' | 'wins';

interface Player {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  balance: number;
  xp: number;
  totalWins: number;
  rating: number;
}

interface LeaderboardModalProps {
  onClose: () => void;
}

const TABS: { id: LeaderboardType; label: string; icon: any; color: string }[] = [
  { id: 'balance', label: 'Баланс', icon: Coins,       color: '#ffd700' },
  { id: 'xp',      label: 'Опыт',   icon: TrendingUp,  color: '#00e5ff' },
  { id: 'wins',    label: 'Победы', icon: Trophy,      color: '#00d97e' },
];

export const LeaderboardModal = ({ onClose }: LeaderboardModalProps) => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('balance');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const initData = WebApp.initData || '';
        const res = await fetch(`/api/game?action=leaderboard&type=${activeTab}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });
        const data = await res.json();
        if (data.success) setPlayers(data.players);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, [activeTab]);

  const getValue = (player: Player, type: LeaderboardType) => {
    if (type === 'xp') return `${player.xp.toLocaleString('ru-RU')} XP`;
    if (type === 'wins') return `${player.totalWins} 🏆`;
    return `${player.balance.toLocaleString('ru-RU')} ₽`;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'var(--gold)';
    if (index === 1) return '#c0c0c0';
    if (index === 2) return '#cd7f32';
    return 'var(--text-muted)';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown size={16} color="var(--gold)" />;
    return <span style={{ fontFamily: 'Impact, sans-serif', color: getRankColor(index) }}>#{index + 1}</span>;
  };

  return (
    <div className="leaderboard-overlay" onClick={onClose}>
      <motion.div
        className="leaderboard-content"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="leaderboard-header">
          <h2>
            <Trophy size={18} color="var(--gold)" /> ТОП ИГРОКОВ
          </h2>
          <button className="leaderboard-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Табы */}
        <div className="leaderboard-tabs">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`leaderboard-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={isActive ? { borderColor: tab.color, color: tab.color } : {}}
              >
                <Icon size={16} color={isActive ? tab.color : '#888'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Список */}
        <div className="leaderboard-body">
          {loading && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              Загрузка...
            </div>
          )}

          {!loading && players.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              Пока никого нет
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="leaderboard-list"
            >
              {players.map((p, i) => {
                const tab = TABS.find(t => t.id === activeTab)!;
                return (
                  <div
                    key={p.id}
                    className={`leaderboard-row ${i < 3 ? 'top-3' : ''}`}
                  >
                    <div className="lb-rank">
                      {getRankIcon(i)}
                    </div>
                    {p.photoUrl ? (
                      <img src={p.photoUrl} alt="" className="lb-avatar" />
                    ) : (
                      <div className="lb-avatar-placeholder">
                        {(p.firstName?.[0] || 'Г').toUpperCase()}
                      </div>
                    )}
                    <div className="lb-info">
                      <div className="lb-name">
                        {[p.firstName, p.lastName].filter(Boolean).join(' ') || p.username || 'Гонщик'}
                      </div>
                      {p.username && <div className="lb-username">@{p.username}</div>}
                    </div>
                    <div
                      className="lb-value"
                      style={{ color: tab.color }}
                    >
                      {getValue(p, activeTab)}
                    </div>
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