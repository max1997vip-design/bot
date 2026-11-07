// src/components/QuestModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointerClick, Flag, Coins, Zap, Trophy, X, Check
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import '../styles/quests.css';

interface Props {
  onClose: () => void;
}

// 👇 5 заданий с XP
const QUESTS_INFO = [
  { id: 'click_1000', title: 'Кликер',        desc: 'Сделай 1000 кликов',    target: 1000, reward: 5000,  rewardXp: 25,  icon: MousePointerClick, color: '#00e5ff' },
  { id: 'win_3',      title: 'Гонщик',        desc: 'Выиграй 3 гонки',        target: 3,    reward: 15000, rewardXp: 50,  icon: Flag,              color: '#ffd700' },
  { id: 'sell_5',     title: 'Барахолка',     desc: 'Продай 5 предметов',     target: 5,    reward: 5000,  rewardXp: 15,  icon: Coins,             color: '#00d97e' },
  { id: 'click_5000', title: 'Кликер-мастер', desc: 'Сделай 5000 кликов',     target: 5000, reward: 25000, rewardXp: 100, icon: Zap,               color: '#ff8800' },
  { id: 'win_5',      title: 'Чемпион',       desc: 'Выиграй 5 гонок',        target: 5,    reward: 50000, rewardXp: 150, icon: Trophy,            color: '#ff4444' },
];

export const QuestModal: React.FC<Props> = ({ onClose }) => {
  const claimQuest = useGameStore((s) => s.claimQuest);
  const [quests, setQuests] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initData = WebApp.initData || '';
    fetch('/api/game?action=getQuests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setQuests(data.quests);
        else setError(true);
      })
      .catch(() => setError(true));
  }, []);

  const handleClaim = async (questId: string) => {
    setLoadingId(questId);
    const newQuests = await claimQuest(questId);
    if (newQuests) {
      setQuests(newQuests);
      playSound('coin');
      WebApp.HapticFeedback?.notificationOccurred('success');
    }
    setLoadingId(null);
  };

  return (
    <div className="quest-overlay" onClick={onClose}>
      <motion.div
        className="quest-content"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quest-header">
          <h2>
            <Trophy size={18} color="var(--gold)" /> ЕЖЕДНЕВНЫЕ ЗАДАНИЯ
          </h2>
          <button className="quest-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="quest-body">
          {!quests && !error && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              Загрузка заданий...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '40px 0' }}>
              Ошибка загрузки. Попробуй позже.
            </div>
          )}

          {quests && QUESTS_INFO.map((q) => {
            const progress = quests.progress?.[q.id] || 0;
            const isCompleted = progress >= q.target;
            const isClaimed = quests.claimed?.[q.id];
            const progressPercent = Math.min(100, (progress / q.target) * 100);
            const Icon = q.icon;

            return (
              <div key={q.id} className={`quest-card ${isCompleted ? 'completed' : ''} ${isClaimed ? 'claimed' : ''}`}>
                <div className="quest-icon-wrapper" style={{ background: `${q.color}15`, borderColor: `${q.color}44` }}>
                  {isClaimed ? (
                    <Check size={22} color="var(--success)" strokeWidth={3} />
                  ) : (
                    <Icon size={22} color={q.color} />
                  )}
                </div>

                <div className="quest-info">
                  <div className="quest-title-row">
                    <span className="quest-title">{q.title}</span>
                    <span className="quest-reward">
                      +{q.reward.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span>
                      <span className="quest-reward-xp">+{q.rewardXp} XP</span>
                    </span>
                  </div>
                  <div className="quest-desc">{q.desc}</div>

                  <div className="quest-progress-bar">
                    <div
                      className="quest-progress-fill"
                      style={{
                        width: `${progressPercent}%`,
                        background: isCompleted
                          ? 'linear-gradient(90deg, var(--success), var(--success-dim))'
                          : `linear-gradient(90deg, ${q.color}, ${q.color}88)`,
                        boxShadow: `0 0 8px ${isCompleted ? 'var(--success-glow)' : `${q.color}66`}`,
                      }}
                    />
                  </div>

                  <div className="quest-footer">
                    <span className="quest-progress-text">
                      {progress.toLocaleString('ru-RU')} / {q.target.toLocaleString('ru-RU')}
                    </span>
                    {isClaimed ? (
                      <span className="quest-status done">ПОЛУЧЕНО</span>
                    ) : isCompleted ? (
                      <button
                        className="quest-claim-btn"
                        onClick={() => handleClaim(q.id)}
                        disabled={loadingId === q.id}
                      >
                        {loadingId === q.id ? '...' : 'ЗАБРАТЬ'}
                      </button>
                    ) : (
                      <span className="quest-status progress">В ПРОЦЕССЕ</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};