// src/components/LeagueBadge.tsx
import { motion } from 'framer-motion';
import { getLeagueByPoints, getLeagueProgress, getNextLeague } from '../config/leagues';
import { useGameStore } from '../store/gameStore';

export const LeagueBadge = () => {
  const leaguePoints = useGameStore((s) => s.user?.leaguePoints ?? 0);
  const league = getLeagueByPoints(leaguePoints);
  const progress = getLeagueProgress(leaguePoints);
  const next = getNextLeague(league.id);

  return (
    <motion.div
      className="league-badge"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="league-badge-content">
        <span className="league-badge-icon">{league.icon}</span>
        <div className="league-badge-info">
          <span className="league-badge-name" style={{ color: league.color }}>
            {league.name}
          </span>
          <span className="league-badge-points">
            {leaguePoints} очков
            {next && ` · до ${next.name}: ${Math.max(0, next.minPoints - leaguePoints)}`}
          </span>
        </div>
      </div>
      
      {/* Полоса прогресса (опционально, можно оставить для визуала) */}
      <div className="league-badge-progress">
        <motion.div
          className="league-badge-progress-fill"
          style={{ background: league.gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};