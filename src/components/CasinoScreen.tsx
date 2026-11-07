// src/components/CasinoScreen.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, Dices, CircleDot, X, TrendingUp, TrendingDown, Sparkles, RotateCw,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import { effectiveChance, applyPityBonus } from '../config/casinoFair';
import '../styles/casino.css';

type GameTab = 'coinflip' | 'dice' | 'roulette';

interface CasinoProps {
  onClose: () => void;
}

const QUICK_BETS = [100, 1000, 10000, 100000];

export const CasinoScreen: React.FC<CasinoProps> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const playCoinFlip = useGameStore((s) => s.playCoinFlip);
  const playDice = useGameStore((s) => s.playDice);
  const playRoulette = useGameStore((s) => s.playRoulette);

  const [activeTab, setActiveTab] = useState<GameTab>('coinflip');

  // Монетка
  const [coinBet, setCoinBet] = useState<number | ''>('');
  const [coinChoice, setCoinChoice] = useState<'heads' | 'tails'>('heads');
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<{ isWin: boolean; payout: number; result: string } | null>(null);

  // Кубик
  const [diceBet, setDiceBet] = useState<number | ''>('');
  const [diceGuess, setDiceGuess] = useState<number>(1);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<{ roll: number; isWin: boolean; payout: number } | null>(null);

  // Рулетка
  const [rouletteBet, setRouletteBet] = useState<number | ''>('');
  const [rouletteBetType, setRouletteBetType] = useState<'red' | 'black' | 'zero'>('red');
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<{ result: number; color: 'red' | 'black' | 'zero'; isWin: boolean; payout: number } | null>(null);

  const [loading, setLoading] = useState(false);

  const balance = user?.balance || 0;
  const lossStreak = (user as any)?.casinoLossStreak || 0;

  const coinChance = Math.min(1, applyPityBonus(lossStreak, effectiveChance(0.5, Number(coinBet) || 100))) * 100;
  const diceChance = Math.min(1, applyPityBonus(lossStreak, effectiveChance(1 / 6, Number(diceBet) || 100))) * 100;
  const rouletteChance = Math.min(1, applyPityBonus(lossStreak, effectiveChance(rouletteBetType === 'zero' ? 1 / 37 : 18 / 37, Number(rouletteBet) || 100))) * 100;

  // ==================== МОНЕТКА ====================
  const handleCoinFlip = async () => {
    if (!coinBet || coinBet < 100) { WebApp.showAlert('Минимальная ставка 100 ₽'); return; }
    if (balance < coinBet) { WebApp.showAlert('Недостаточно ₽!'); return; }
    setLoading(true); setCoinResult(null); setCoinFlipping(true);
    const res = await playCoinFlip(coinBet, coinChoice);
    setTimeout(() => {
      setCoinFlipping(false); setLoading(false);
      if (res.success && res.isWin !== undefined && res.payout !== undefined && res.result) {
        setCoinResult({ isWin: res.isWin, payout: res.payout, result: res.result });
        playSound(res.isWin ? 'win' : 'click');
      } else { WebApp.showAlert(res.error || 'Ошибка'); }
    }, 1500);
  };

  // ==================== КУБИК ====================
  const handleDiceRoll = async () => {
    if (!diceBet || diceBet < 100) { WebApp.showAlert('Минимальная ставка 100 ₽'); return; }
    if (balance < diceBet) { WebApp.showAlert('Недостаточно ₽!'); return; }
    setLoading(true); setDiceResult(null); setDiceRolling(true);
    const res = await playDice(diceBet, diceGuess);
    setTimeout(() => {
      setDiceRolling(false); setLoading(false);
      if (res.success && res.roll !== undefined && res.isWin !== undefined) {
        setDiceResult({ roll: res.roll, isWin: res.isWin, payout: res.payout || 0 });
        playSound(res.isWin ? 'win' : 'click');
      } else { WebApp.showAlert(res.error || 'Ошибка'); }
    }, 1500);
  };

  // ==================== РУЛЕТКА ====================
  const handleSpinRoulette = async () => {
    if (!rouletteBet || rouletteBet < 100) { WebApp.showAlert('Минимальная ставка 100 ₽'); return; }
    if (balance < rouletteBet) { WebApp.showAlert('Недостаточно ₽!'); return; }
    setLoading(true); setRouletteResult(null); setRouletteSpinning(true);
    const res = await playRoulette(rouletteBet, rouletteBetType);
    setTimeout(() => {
      setRouletteSpinning(false); setLoading(false);
      if (res.success && res.result !== undefined && res.color && res.isWin !== undefined) {
        setRouletteResult({ result: res.result, color: res.color, isWin: res.isWin, payout: res.payout || 0 });
        playSound(res.isWin ? 'win' : 'click');
      } else { WebApp.showAlert(res.error || 'Ошибка'); }
    }, 2500);
  };

  const renderBetInput = (bet: number | '', setBet: (v: number | '') => void, disabled: boolean) => (
    <>
      <div className="casino-bet-display">
        <span className="casino-bet-currency">₽</span>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(e.target.value === '' ? '' : Number(e.target.value))}
          disabled={disabled}
          placeholder="0"
          className="casino-bet-input"
        />
      </div>
      <div className="casino-quick-bets">
        {QUICK_BETS.map((qb) => (
          <button key={qb} onClick={() => setBet(qb)} disabled={disabled} className="casino-quick-bet-btn">
            {qb >= 1000 ? `${qb / 1000}K` : qb}
          </button>
        ))}
        <button onClick={() => setBet(balance)} disabled={disabled} className="casino-quick-bet-btn max">
          MAX
        </button>
      </div>
    </>
  );

  return (
    <div className="casino-overlay" onClick={onClose}>
      <motion.div
        className="casino-modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Декоративные свечения */}
        <div className="casino-aura" />
        <div className="casino-glow-top" />

        {/* HEADER */}
        <div className="casino-header">
          <div className="casino-header-title">
            <motion.div
              className="casino-header-icon"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Dices size={22} color="#ffd700" />
            </motion.div>
            <div>
              <h2 className="casino-header-name">КАЗИНО</h2>
              <span className="casino-header-balance">
                <Coins size={11} /> {balance.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
          <button className="casino-close-btn" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* TABS */}
        <div className="casino-tabs">
          <button
            className={`casino-tab ${activeTab === 'coinflip' ? 'active' : ''}`}
            onClick={() => setActiveTab('coinflip')}
            disabled={loading}
          >
            <div className="casino-tab-icon"><Coins size={16} /></div>
            <span>МОНЕТКА</span>
          </button>
          <button
            className={`casino-tab ${activeTab === 'dice' ? 'active' : ''}`}
            onClick={() => setActiveTab('dice')}
            disabled={loading}
          >
            <div className="casino-tab-icon"><Dices size={16} /></div>
            <span>КУБИК</span>
          </button>
          <button
            className={`casino-tab ${activeTab === 'roulette' ? 'active' : ''}`}
            onClick={() => setActiveTab('roulette')}
            disabled={loading}
          >
            <div className="casino-tab-icon"><CircleDot size={16} /></div>
            <span>РУЛЕТКА</span>
          </button>
        </div>

        {/* BODY */}
        <div className="casino-body">
          <AnimatePresence mode="wait">

            {/* ============ МОНЕТКА ============ */}
            {activeTab === 'coinflip' && (
              <motion.div
                key="coinflip"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="casino-game"
              >
                {/* 3D-монета */}
                <div className="coin-stage">
                  <motion.div
                    className="coin-3d"
                    animate={coinFlipping ? { rotateY: [0, 720, 1440], scale: [1, 1.3, 1] } : { rotateY: 0, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  >
                    <div className="coin-face coin-front">
                      <Coins size={48} color="#7a5a00" strokeWidth={2.5} />
                      <span className="coin-face-label">ОРЁЛ</span>
                    </div>
                    <div className="coin-face coin-back">
                      <Sparkles size={48} color="#7a5a00" strokeWidth={2.5} />
                      <span className="coin-face-label">РЕШКА</span>
                    </div>
                  </motion.div>
                  <div className="coin-shadow" />
                </div>

                {/* Результат */}
                <AnimatePresence>
                  {coinResult && !coinFlipping && (
                    <motion.div
                      className={`casino-result ${coinResult.isWin ? 'win' : 'lose'}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {coinResult.isWin ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <div className="casino-result-text">
                        <strong>{coinResult.isWin ? 'ПОБЕДА!' : 'ПРОИГРЫШ'}</strong>
                        <span>Выпало: {coinResult.result === 'heads' ? 'ОРЁЛ' : 'РЕШКА'}</span>
                        <span className="casino-result-amount">
                          {coinResult.isWin ? `+${coinResult.payout.toLocaleString('ru-RU')} ₽` : `-${coinBet.toLocaleString('ru-RU')} ₽`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Выбор стороны */}
                <div className="casino-choice-row">
                  <button
                    className={`casino-choice-btn ${coinChoice === 'heads' ? 'active' : ''}`}
                    onClick={() => setCoinChoice('heads')}
                    disabled={loading}
                  >
                    <Coins size={20} />
                    ОРЁЛ
                  </button>
                  <button
                    className={`casino-choice-btn ${coinChoice === 'tails' ? 'active' : ''}`}
                    onClick={() => setCoinChoice('tails')}
                    disabled={loading}
                  >
                    <Sparkles size={20} />
                    РЕШКА
                  </button>
                </div>

                {/* Ставка */}
                <div className="casino-bet-box">
                  <label className="casino-bet-label">СУММА СТАВКИ</label>
                  {renderBetInput(coinBet, setCoinBet, loading || coinFlipping)}
                  <button
                    className="casino-play-btn"
                    onClick={handleCoinFlip}
                    disabled={loading || coinFlipping || !coinBet}
                  >
                    {coinFlipping ? 'КРУТИМ...' : 'СДЕЛАТЬ СТАВКУ'}
                  </button>
                  <div className="casino-chance">
                    🎯 Шанс победы: <strong>{coinChance.toFixed(1)}%</strong>
                    {lossStreak > 0 && <span className="casino-chance-bonus">+{lossStreak * 15}% за серию</span>}
                    {coinBet && Number(coinBet) > 50_000 && lossStreak === 0 && (
                      <span className="casino-chance-warning">(понижен)</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============ КУБИК ============ */}
            {activeTab === 'dice' && (
              <motion.div
                key="dice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="casino-game"
              >
                {/* 3D-кубик */}
                <div className="dice-stage">
                  <motion.div
                    className="dice-3d"
                    animate={
                      diceRolling
                        ? { rotate: [0, 180, 360, 540, 720], scale: [1, 1.15, 1.25, 1.15, 1] }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  >
                    <div className="dice-face">
                      <span className="dice-number">
                        {diceRolling ? '?' : diceResult?.roll ?? '?'}
                      </span>
                    </div>
                  </motion.div>
                  <div className="dice-shadow" />
                </div>

                {/* Результат */}
                <AnimatePresence>
                  {diceResult && !diceRolling && (
                    <motion.div
                      className={`casino-result ${diceResult.isWin ? 'win' : 'lose'}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {diceResult.isWin ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <div className="casino-result-text">
                        <strong>{diceResult.isWin ? 'ПОБЕДА!' : 'ПРОИГРЫШ'}</strong>
                        <span>Выпало: {diceResult.roll} (загадано: {diceGuess})</span>
                        <span className="casino-result-amount">
                          {diceResult.isWin ? `+${diceResult.payout.toLocaleString('ru-RU')} ₽` : `-${diceBet.toLocaleString('ru-RU')} ₽`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Выбор числа */}
                <div className="casino-dice-numbers">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      className={`casino-dice-num ${diceGuess === n ? 'active' : ''}`}
                      onClick={() => setDiceGuess(n)}
                      disabled={loading}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {/* Ставка */}
                <div className="casino-bet-box">
                  <label className="casino-bet-label">СУММА СТАВКИ</label>
                  {renderBetInput(diceBet, setDiceBet, loading || diceRolling)}
                  <button
                    className="casino-play-btn"
                    onClick={handleDiceRoll}
                    disabled={loading || diceRolling || !diceBet}
                  >
                    {diceRolling ? 'БРОСАЕМ...' : 'БРОСИТЬ КУБИК'}
                  </button>
                  <div className="casino-chance">
                    🎯 Шанс победы: <strong>{diceChance.toFixed(1)}%</strong>
                    {lossStreak > 0 && <span className="casino-chance-bonus">+{lossStreak * 15}% за серию</span>}
                    {diceBet && Number(diceBet) > 50_000 && lossStreak === 0 && (
                      <span className="casino-chance-warning">(понижен)</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============ РУЛЕТКА ============ */}
            {activeTab === 'roulette' && (
              <motion.div
                key="roulette"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="casino-game"
              >
                {/* Рулетка с шариком */}
                <div className="roulette-stage">
                  <motion.div
                    className="roulette-wheel"
                    animate={rouletteSpinning ? { rotate: 1440 } : { rotate: 0 }}
                    transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <div className="roulette-wheel-inner">
                      {rouletteResult && !rouletteSpinning ? (
                        <span className={`roulette-result-num ${rouletteResult.color}`}>
                          {rouletteResult.result}
                        </span>
                      ) : (
                        <RotateCw size={32} color="#ffd700" className="roulette-spin-icon" />
                      )}
                    </div>
                    <div className="roulette-center" />
                  </motion.div>
                  <div className="roulette-shadow" />
                </div>

                {/* Результат */}
                <AnimatePresence>
                  {rouletteResult && !rouletteSpinning && (
                    <motion.div
                      className={`casino-result ${rouletteResult.isWin ? 'win' : 'lose'}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {rouletteResult.isWin ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <div className="casino-result-text">
                        <strong>{rouletteResult.isWin ? 'ПОБЕДА!' : 'ПРОИГРЫШ'}</strong>
                        <span>
                          Выпало: {rouletteResult.result}{' '}
                          {rouletteResult.color === 'red' ? '(КРАСНОЕ)' : rouletteResult.color === 'black' ? '(ЧЁРНОЕ)' : '(ЗЕРО)'}
                        </span>
                        <span className="casino-result-amount">
                          {rouletteResult.isWin ? `+${rouletteResult.payout.toLocaleString('ru-RU')} ₽` : `-${rouletteBet.toLocaleString('ru-RU')} ₽`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Выбор */}
                <div className="casino-roulette-choices">
                  <button
                    className={`casino-roulette-btn red ${rouletteBetType === 'red' ? 'active' : ''}`}
                    onClick={() => setRouletteBetType('red')}
                    disabled={loading}
                  >
                    КРАСНОЕ
                    <span>×2</span>
                  </button>
                  <button
                    className={`casino-roulette-btn black ${rouletteBetType === 'black' ? 'active' : ''}`}
                    onClick={() => setRouletteBetType('black')}
                    disabled={loading}
                  >
                    ЧЁРНОЕ
                    <span>×2</span>
                  </button>
                  <button
                    className={`casino-roulette-btn green ${rouletteBetType === 'zero' ? 'active' : ''}`}
                    onClick={() => setRouletteBetType('zero')}
                    disabled={loading}
                  >
                    ЗЕРО
                    <span>×14</span>
                  </button>
                </div>

                {/* Ставка */}
                <div className="casino-bet-box">
                  <label className="casino-bet-label">СУММА СТАВКИ</label>
                  {renderBetInput(rouletteBet, setRouletteBet, loading || rouletteSpinning)}
                  <button
                    className="casino-play-btn"
                    onClick={handleSpinRoulette}
                    disabled={loading || rouletteSpinning || !rouletteBet}
                  >
                    {rouletteSpinning ? 'КРУТИМ...' : 'ЗАПУСТИТЬ РУЛЕТКУ'}
                  </button>
                  <div className="casino-chance">
                    🎯 Шанс победы: <strong>{rouletteChance.toFixed(1)}%</strong>
                    {lossStreak > 0 && <span className="casino-chance-bonus">+{lossStreak * 15}% за серию</span>}
                    {rouletteBet && Number(rouletteBet) > 50_000 && lossStreak === 0 && (
                      <span className="casino-chance-warning">(понижен)</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};