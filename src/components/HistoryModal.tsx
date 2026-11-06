// src/components/HistoryModal.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { TrendingUp, TrendingDown, X, History } from 'lucide-react';
import '../styles/history.css';

export function HistoryModal({ onClose }: { onClose: () => void }) {
  const history = useGameStore((s) => s.history);
  const fetchHistory = useGameStore((s) => s.fetchHistory);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Показываем только 10 последних операций
  const recentHistory = history.slice(0, 10);

  return (
    <motion.div 
      className="history-overlay"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="history-container"
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="history-header">
          <h2>
            <History size={18} color="var(--accent)" />
            ИСТОРИЯ
          </h2>
          <button className="history-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Список */}
        <div className="history-body">
          {recentHistory.length === 0 && (
            <div className="history-empty">
              <History size={32} color="var(--text-muted)" />
              <p>Пока нет операций</p>
            </div>
          )}

          {recentHistory.map((tx: any, index: number) => {
            const isPositive = tx.amount > 0;
            const IconComponent = isPositive ? TrendingUp : TrendingDown;
            // 👇 Используем переменные через inline-стили
            const colorVar = isPositive ? 'var(--success)' : 'var(--danger)';
            const glowVar = isPositive ? 'var(--success-glow)' : 'var(--danger-glow)';
            const bgVar = isPositive ? 'rgba(0, 217, 126, 0.15)' : 'rgba(255, 68, 68, 0.15)';
            const borderVar = isPositive ? 'rgba(0, 217, 126, 0.4)' : 'rgba(255, 68, 68, 0.4)';

            return (
              <motion.div 
                key={tx.id}
                className="history-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                style={{ borderLeftColor: colorVar }}
              >
                <div className="history-icon" style={{ background: bgVar, border: `1px solid ${borderVar}` }}>
                  <IconComponent size={14} color={colorVar} />
                </div>

                <div className="history-info">
                  <span className="history-desc">{tx.description}</span>
                  <span className="history-date">
                    {new Date(tx.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>

                <span className="history-amount" style={{ color: colorVar, textShadow: `0 0 8px ${glowVar}` }}>
                  {isPositive ? '+' : ''}{tx.amount.toLocaleString('ru-RU')}
                  <span className="currency-ruble sm" style={{ marginLeft: 3 }}>₽</span>
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Футер (опционально) */}
        {history.length > 10 && (
          <div className="history-footer">
            Показаны последние 10 операций
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}