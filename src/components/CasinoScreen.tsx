// src/components/CasinoScreen.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Dices, CircleDot, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import WebApp from '@twa-dev/sdk';
import { playSound } from '../utils/sound';
import { effectiveChance } from '../config/casinoFair';
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

  // --- Монетка ---
  const [coinBet, setCoinBet] = useState<number | ''>('');
  const [coinChoice, setCoinChoice] = useState<'heads' | 'tails'>('heads');
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<{
    isWin: boolean;
    payout: number;
    result: string;
  } | null>(null);

  // --- Кубик ---
  const [diceBet, setDiceBet] = useState<number | ''>('');
  const [diceGuess, setDiceGuess] = useState<number>(1);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<{
    roll: number;
    isWin: boolean;
    payout: number;
  } | null>(null);

  // --- Рулетка ---
  const [rouletteBet, setRouletteBet] = useState<number | ''>('');
  const [rouletteBetType, setRouletteBetType] = useState<'red' | 'black' | 'zero'>('red');
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<{
    result: number;
    color: 'red' | 'black' | 'zero';
    isWin: boolean;
    payout: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const balance = user?.balance || 0;

  // ============================
  // ШАНСЫ (античит)
  // ============================
  const coinChance = effectiveChance(0.5, Number(coinBet) || 100) * 100;
  const diceChance = effectiveChance(1 / 6, Number(diceBet) || 100) * 100;
  const rouletteChance =
    effectiveChance(
      rouletteBetType === 'zero' ? 1 / 37 : 18 / 37,
      Number(rouletteBet) || 100
    ) * 100;

  // ============================
  // МОНЕТКА
  // ============================
  const handleCoinFlip = async () => {
    if (!coinBet || coinBet < 100) {
      WebApp.showAlert('Минимальная ставка 100 ₽');
      return;
    }
    if (balance < coinBet) {
      WebApp.showAlert('Недостаточно ₽!');
      return;
    }
    setLoading(true);
    setCoinResult(null);
    setCoinFlipping(true);

    const res = await playCoinFlip(coinBet, coinChoice);

    setTimeout(() => {
      setCoinFlipping(false);
      setLoading(false);
      if (res.success && res.isWin !== undefined && res.payout !== undefined && res.result) {
        setCoinResult({ isWin: res.isWin, payout: res.payout, result: res.result });
        playSound(res.isWin ? 'win' : 'click');
      } else {
        WebApp.showAlert(res.error || 'Ошибка');
      }
    }, 1500);
  };

  // ============================
  // КУБИК
  // ============================
  const handleDiceRoll = async () => {
    if (!diceBet || diceBet < 100) {
      WebApp.showAlert('Минимальная ставка 100 ₽');
      return;
    }
    if (balance < diceBet) {
      WebApp.showAlert('Недостаточно ₽!');
      return;
    }
    setLoading(true);
    setDiceResult(null);
    setDiceRolling(true);

    const res = await playDice(diceBet, diceGuess);

    setTimeout(() => {
      setDiceRolling(false);
      setLoading(false);
      if (res.success && res.roll !== undefined && res.isWin !== undefined) {
        setDiceResult({ roll: res.roll, isWin: res.isWin, payout: res.payout || 0 });
        playSound(res.isWin ? 'win' : 'click');
      } else {
        WebApp.showAlert(res.error || 'Ошибка');
      }
    }, 1500);
  };

  // ============================
  // РУЛЕТКА
  // ============================
  const handleSpinRoulette = async () => {
    if (!rouletteBet || rouletteBet < 100) {
      WebApp.showAlert('Минимальная ставка 100 ₽');
      return;
    }
    if (balance < rouletteBet) {
      WebApp.showAlert('Недостаточно ₽!');
      return;
    }
    setLoading(true);
    setRouletteResult(null);
    setRouletteSpinning(true);

    const res = await playRoulette(rouletteBet, rouletteBetType);

    setTimeout(() => {
      setRouletteSpinning(false);
      setLoading(false);
      if (res.success && res.result !== undefined && res.color && res.isWin !== undefined) {
        setRouletteResult({
          result: res.result,
          color: res.color,
          isWin: res.isWin,
          payout: res.payout || 0,
        });
        playSound(res.isWin ? 'win' : 'click');
      } else {
        WebApp.showAlert(res.error || 'Ошибка');
      }
    }, 2500);
  };

  // ============================
  // Универсальный ввод ставки
  // ============================
  const renderBetInput = (
    bet: number | '',
    setBet: (v: number | '') => void,
    disabled: boolean
  ) => (
    <>
      <input
        type="number"
        value={bet}
        onChange={(e) => setBet(e.target.value === '' ? '' : Number(e.target.value))}
        disabled={disabled}
        placeholder="Сумма ставки..."
        className="casino-bet-input"
      />
      <div className="casino-quick-bets">
        {QUICK_BETS.map((qb) => (
          <button
            key={qb}
            onClick={() => setBet(qb)}
            disabled={disabled}
            className="casino-quick-bet-btn"
          >
            {qb >= 1000 ? `${qb / 1000}k` : qb}
          </button>
        ))}
        <button
          onClick={() => setBet(balance)}
          disabled={disabled}
          className="casino-quick-bet-btn max"
        >
          MAX
        </button>
      </div>
    </>
  );

  // ============================
  // Рендер
  // ============================
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
        {/* HEADER */}
        <div className="casino-header">
          <div className="casino-header-title">
            <div className="casino-header-icon">
              <Dices size={22} color="#ff4444" />
            </div>
            <div>
              <h2 className="casino-header-name">КАЗИНО</h2>
              <span className="casino-header-balance">
                Баланс: {balance.toLocaleString('ru-RU')} ₽
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
            <Coins size={14} />
            МОНЕТКА
          </button>
          <button
            className={`casino-tab ${activeTab === 'dice' ? 'active' : ''}`}
            onClick={() => setActiveTab('dice')}
            disabled={loading}
          >
            <Dices size={14} />
            КУБИК
          </button>
          <button
            className={`casino-tab ${activeTab === 'roulette' ? 'active' : ''}`}
            onClick={() => setActiveTab('roulette')}
            disabled={loading}
          >
            <CircleDot size={14} />
            РУЛЕТКА
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
                {/* Визуал */}
                <div className="coin-stage">
                  <motion.div
                    className="coin"
                    animate={
                      coinFlipping
                        ? { rotateY: [0, 720, 1440], scale: [1, 1.5, 1] }
                        : { rotateY: 0, scale: 1 }
                    }
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  >
                    <Coins size={56} color="#ffd700" />
                  </motion.div>
                </div>

                {/* Результат */}
                <AnimatePresence>
                  {coinResult && !coinFlipping && (
                    <motion.div
                      className={`casino-result ${coinResult.isWin ? 'win' : 'lose'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {coinResult.isWin ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      <div className="casino-result-text">
                        <strong>{coinResult.isWin ? 'ПОБЕДА!' : 'ПРОИГРЫШ'}</strong>
                        <span>
                          Выпало: {coinResult.result === 'heads' ? 'ОРЁЛ' : 'РЕШКА'}
                        </span>
                        <span className="casino-result-amount">
                          {coinResult.isWin
                            ? `+${coinResult.payout.toLocaleString('ru-RU')} ₽`
                            : `-${coinBet.toLocaleString('ru-RU')} ₽`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Выбор стороны */}
                <div className="casino-choice-row">
                  <button
                    className={`casino-choice-btn ${coinChoice === 'heads' ? 'active gold' : ''}`}
                    onClick={() => setCoinChoice('heads')}
                    disabled={loading}
                  >
                    <Coins size={18} />
                    ОРЁЛ
                  </button>
                  <button
                    className={`casino-choice-btn ${coinChoice === 'tails' ? 'active gold' : ''}`}
                    onClick={() => setCoinChoice('tails')}
                    disabled={loading}
                  >
                    <CircleDot size={18} />
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
                  <div className="casino-info">
                    Коэффициент выигрыша: <strong>×1.9</strong>
                  </div>
                  <div className="casino-chance">
                    🎯 Шанс победы: <strong>{coinChance.toFixed(1)}%</strong>
                    {coinBet && Number(coinBet) > 10_000 && (
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
                {/* Визуал */}
                <div className="dice-stage">
                  <motion.div
                    className="dice-cube"
                    animate={
                      diceRolling
                        ? { rotate: [0, 180, 360, 540], scale: [1, 1.2, 1.3, 1.2] }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  >
                    <span className="dice-value">
                      {diceRolling ? '?' : diceResult?.roll ?? '?'}
                    </span>
                  </motion.div>
                </div>

                {/* Результат */}
                <AnimatePresence>
                  {diceResult && !diceRolling && (
                    <motion.div
                      className={`casino-result ${diceResult.isWin ? 'win' : 'lose'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {diceResult.isWin ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      <div className="casino-result-text">
                        <strong>{diceResult.isWin ? 'ПОБЕДА!' : 'ПРОИГРЫШ'}</strong>
                        <span>
                          Выпало: {diceResult.roll} (загадано: {diceGuess})
                        </span>
                        <span className="casino-result-amount">
                          {diceResult.isWin
                            ? `+${diceResult.payout.toLocaleString('ru-RU')} ₽`
                            : `-${diceBet.toLocaleString('ru-RU')} ₽`}
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
                  <div className="casino-info">
                    Коэффициент выигрыша: <strong>×5.5</strong>
                  </div>
                  <div className="casino-chance">
                    🎯 Шанс победы: <strong>{diceChance.toFixed(1)}%</strong>
                    {diceBet && Number(diceBet) > 10_000 && (
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
                {/* Визуал */}
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
                        <span className="roulette-result-num">?</span>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Результат */}
                <AnimatePresence>
                  {rouletteResult && !rouletteSpinning && (
                    <motion.div
                      className={`casino-result ${rouletteResult.isWin ? 'win' : 'lose'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {rouletteResult.isWin ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      <div className="casino-result-text">
                        <strong>{rouletteResult.isWin ? 'ПОБЕДА!' : 'ПРОИГРЫШ'}</strong>
                        <span>
                          Выпало: {rouletteResult.result}{' '}
                          {rouletteResult.color === 'red'
                            ? '(КРАСНОЕ)'
                            : rouletteResult.color === 'black'
                            ? '(ЧЁРНОЕ)'
                            : '(ЗЕРО)'}
                        </span>
                        <span className="casino-result-amount">
                          {rouletteResult.isWin
                            ? `+${rouletteResult.payout.toLocaleString('ru-RU')} ₽`
                            : `-${rouletteBet.toLocaleString('ru-RU')} ₽`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Выбор */}
                <div className="casino-roulette-choices">
                  <button
                    className={`casino-roulette-btn red ${
                      rouletteBetType === 'red' ? 'active' : ''
                    }`}
                    onClick={() => setRouletteBetType('red')}
                    disabled={loading}
                  >
                    КРАСНОЕ
                    <span>×2</span>
                  </button>
                  <button
                    className={`casino-roulette-btn black ${
                      rouletteBetType === 'black' ? 'active' : ''
                    }`}
                    onClick={() => setRouletteBetType('black')}
                    disabled={loading}
                  >
                    ЧЁРНОЕ
                    <span>×2</span>
                  </button>
                  <button
                    className={`casino-roulette-btn green ${
                      rouletteBetType === 'zero' ? 'active' : ''
                    }`}
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
                    {rouletteBet && Number(rouletteBet) > 10_000 && (
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