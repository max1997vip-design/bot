import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export function HistoryModal({ onClose }: { onClose: () => void }) {
  const history = useGameStore((s) => s.history);
  const fetchHistory = useGameStore((s) => s.fetchHistory);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>📜 История баланса</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', fontSize: '16px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {history.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Пока нет транзакций</p>}
          
          {history.map((tx: any) => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', borderLeft: `3px solid ${tx.amount > 0 ? '#00FF41' : '#ff4444'}` }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{tx.description}</span>
                <span style={{ color: '#666', fontSize: '10px' }}>{new Date(tx.createdAt).toLocaleString('ru-RU')}</span>
              </div>
              <span style={{ color: tx.amount > 0 ? '#00FF41' : '#ff4444', fontWeight: '900', fontSize: '14px', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ru-RU')} 🪙
              </span>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}