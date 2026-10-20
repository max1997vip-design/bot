import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const CasinoScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const playCoinFlip = useGameStore((s) => s.playCoinFlip);
  
  const [bet, setBet] = useState<number | ''>('');
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isWin: boolean; payout: number; result: string } | null>(null);
  const [flipping, setFlipping] = useState(false);

  const handlePlay = async () => {
    if (!bet || bet < 100) return alert('Минимальная ставка 100 🪙');
    if (user && bet > user.balance) return alert('Недостаточно монет!');
    
    setLoading(true);
    setResult(null);
    setFlipping(true);

    const res = await playCoinFlip(bet, choice);
    
    // Искусственная задержка для анимации
    setTimeout(() => {
      setFlipping(false);
      setLoading(false);
      if (res.success && res.isWin !== undefined && res.payout !== undefined && res.result) {
        setResult({ isWin: res.isWin, payout: res.payout, result: res.result });
      }
    }, 1500);
  };

  const quickBets = [100, 1000, 10000, 100000];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle at center, #2a0a0a 0%, #111 100%)', zIndex: 1000, overflowY: 'auto', padding: '20px'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#ff4444', margin: 0 }}>🎰 Казино</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Закрыть</button>
        </div>

        {/* Монетка */}
        <div style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <motion.div
            animate={flipping ? { rotateY: [0, 720, 1440], scale: [1, 1.5, 1] } : { rotateY: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd700, #b8860b)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontSize: '40px', boxShadow: '0 0 20px rgba(255,215,0,0.5)',
              border: '4px solid #fff'
            }}
          >
            {flipping ? '🪙' : (result ? (result.result === 'heads' ? '👑' : '🦅') : '🪙')}
          </motion.div>
        </div>

        {/* Результат */}
        {result && !flipping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '20px', minHeight: '60px' }}>
            <h3 style={{ color: result.isWin ? '#00FF41' : '#ff4444', margin: 0 }}>
              {result.isWin ? 'ПОБЕДА!' : 'ВЫ ПРОИГРАЛИ'}
            </h3>
            <p style={{ color: '#fff', margin: '5px 0 0 0' }}>
              {result.result === 'heads' ? 'Выпал Орел 👑' : 'Выпала Решка 🦅'} <br/>
              {result.isWin ? `Выигрыш: +${result.payout.toLocaleString('ru-RU')} 🪙` : `Потеряно: -${bet.toLocaleString('ru-RU')} 🪙`}
            </p>
          </motion.div>
        )}

        {/* Выбор стороны */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setChoice('heads')}
            disabled={loading}
            style={{
              flex: 1, padding: '15px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold',
              background: choice === 'heads' ? '#ffd700' : 'rgba(255,255,255,0.1)',
              color: choice === 'heads' ? '#000' : '#fff',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >Орел 👑</button>
          
          <button
            onClick={() => setChoice('tails')}
            disabled={loading}
            style={{
              flex: 1, padding: '15px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold',
              background: choice === 'tails' ? '#ffd700' : 'rgba(255,255,255,0.1)',
              color: choice === 'tails' ? '#000' : '#fff',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >Решка 🦅</button>
        </div>

        {/* Ставка */}
        <div style={{ background: '#222', borderRadius: '12px', padding: '20px' }}>
          <div style={{ color: '#aaa', marginBottom: '10px' }}>Сумма ставки:</div>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={loading}
            placeholder="Введите сумму..."
            style={{
              width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #444',
              background: '#111', color: '#fff', fontSize: '20px', textAlign: 'center', marginBottom: '15px',
              outline: 'none'
            }}
          />
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {quickBets.map(qb => (
              <button
                key={qb}
                onClick={() => setBet(qb)}
                disabled={loading}
                style={{ flex: 1, padding: '8px 0', background: 'rgba(255,255,255,0.05)', color: '#aaa', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }}
              >
                {qb >= 1000 ? `${qb/1000}k` : qb}
              </button>
            ))}
          </div>

          <button
            onClick={handlePlay}
            disabled={loading || !bet || bet < 100}
            style={{
              width: '100%', padding: '18px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold',
              background: loading ? '#555' : '#ff4444', color: '#fff', border: 'none', cursor: loading ? 'wait' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 20px rgba(255,68,68,0.4)'
            }}
          >
            {loading ? 'КРУТИМ...' : 'СДЕЛАТЬ СТАВКУ'}
          </button>
          <div style={{ color: '#888', fontSize: '12px', marginTop: '15px' }}>
            Коэффициент выигрыша: x1.9 <br/>
            Баланс: {user?.balance.toLocaleString('ru-RU')} 🪙
          </div>
        </div>
      </div>
    </div>
  );
};