// src/config/leagues.ts
export type LeagueId = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface League {
  id: LeagueId;
  name: string;
  color: string;
  gradient: string;
  icon: string;
  minPoints: number;
  maxPoints: number;
  winPoints: number;
  losePoints: number;
}

export const LEAGUES: League[] = [
  {
    id: 'bronze',
    name: 'Бронза',
    color: '#cd7f32',
    gradient: 'linear-gradient(135deg, #cd7f32, #8b5a2b)',
    icon: '🥉',
    minPoints: 0,
    maxPoints: 499,
    winPoints: 15,
    losePoints: -5,
  },
  {
    id: 'silver',
    name: 'Серебро',
    color: '#c0c0c0',
    gradient: 'linear-gradient(135deg, #e0e0e0, #a0a0a0)',
    icon: '🥈',
    minPoints: 500,
    maxPoints: 1499,
    winPoints: 20,
    losePoints: -8,
  },
  {
    id: 'gold',
    name: 'Золото',
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700, #b8860b)',
    icon: '🥇',
    minPoints: 1500,
    maxPoints: 2999,
    winPoints: 25,
    losePoints: -10,
  },
  {
    id: 'platinum',
    name: 'Платина',
    color: '#5ce1e6',
    gradient: 'linear-gradient(135deg, #5ce1e6, #1f7c8a)',
    icon: '₽',
    minPoints: 3000,
    maxPoints: 4999,
    winPoints: 30,
    losePoints: -12,
  },
  {
    id: 'diamond',
    name: 'Алмаз',
    color: '#b9a4ff',
    gradient: 'linear-gradient(135deg, #b9a4ff, #5a3ec8)',
    icon: '💠',
    minPoints: 5000,
    maxPoints: Infinity,
    winPoints: 40,
    losePoints: -15,
  },
];

export const getLeagueByPoints = (points: number): League => {
  return LEAGUES.find(l => points >= l.minPoints && points <= l.maxPoints) || LEAGUES[0];
};

export const getLeagueById = (id: LeagueId): League => {
  return LEAGUES.find(l => l.id === id) || LEAGUES[0];
};

export const getLeagueProgress = (points: number): number => {
  const league = getLeagueByPoints(points);
  if (league.id === 'diamond') return 100;
  const range = league.maxPoints - league.minPoints;
  const current = points - league.minPoints;
  return Math.min(100, Math.max(0, (current / range) * 100));
};

export const getNextLeague = (currentId: LeagueId): League | null => {
  const idx = LEAGUES.findIndex(l => l.id === currentId);
  return idx >= 0 && idx < LEAGUES.length - 1 ? LEAGUES[idx + 1] : null;
};