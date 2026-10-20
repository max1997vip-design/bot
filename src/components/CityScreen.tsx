// src/components/CityScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RacesScreen } from './RacesScreen';
import { CarDealership } from './CarDealership'; 
import { DailyRewardModal } from './DailyRewardModal';
import { QuestModal } from './QuestModal';
import { WorkshopScreen } from './WorkshopScreen';
import { BusinessScreen } from './BusinessScreen'; // <-- ИМПОРТ
import '../styles/city.css';

export const CityScreen = () => {
  const [activeLocation, setActiveLocation] = useState<'menu' | 'track'>('menu');
  const [showTopBalance, setShowTopBalance] = useState(false);
  const [topBalanceData, setTopBalanceData] = useState<any[]>([]);
  const [showDealership, setShowDealership] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showWorkshop, setShowWorkshop] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false); // <-- СТЕЙТ

  const fetchTopBalance = async () => {
    setShowTopBalance(true);
    try {
      const res = await fetch(`/api/game?action=leaderboard&type=balance`);
      const data = await res.json();
      if (data.success) setTopBalanceData(data.players);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="city-screen">
      <AnimatePresence mode="wait">
        {activeLocation === 'menu' && (
          <motion.div 
            key="city-menu" 
            className="city-hub" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="city-title">ГОРОД</h2>
            
            <div className="city-grid">
              <div className="city-card" onClick={() => setActiveLocation('track')}>
                <span className="city-icon">🏎️</span>
                <h3>Трек</h3>
                <p>Гонки с ботами, PvP</p>
              </div>

              <div className="city-card" onClick={fetchTopBalance}>
                <span className="city-icon">💰</span>
                <h3>Топ Баланса</h3>
                <p>Самые богатые гонщики</p>
              </div>

              <div className="city-card" onClick={() => setShowDealership(true)}>
                <span className="city-icon">🏢</span>
                <h3>Автосалон</h3>
                <p>Покупка новых машин</p>
              </div>
              
              <div className="city-card" onClick={() => setShowDaily(true)}>
                <span className="city-icon">🎁</span>
                <h3>Бонус</h3>
                <p>Ежедневная награда</p>
              </div>

              <div className="city-card" onClick={() => setShowQuests(true)}>
                <span className="city-icon">📋</span>
                <h3>Задания</h3>
                <p>Квесты на сегодня</p>
              </div>

              <div className="city-card" onClick={() => setShowWorkshop(true)}>
                <span className="city-icon">🔧</span>
                <h3>Мастерская</h3>
                <p>Тюнинг и крафт деталей</p>
              </div>

              {/* НОВАЯ КАРТОЧКА БИЗНЕСА */}
              <div className="city-card" onClick={() => setShowBusiness(true)}>
                <span className="city-icon">💼</span>
                <h3>Бизнесы</h3>
                <p>Пассивный доход</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeLocation === 'track' && (
          <motion.div 
            key="city-track" 
            className="city-location" 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <button className="back-to-city" onClick={() => setActiveLocation('menu')}>← Назад</button>
            <RacesScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTopBalance && (
          <motion.div className="race-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="leaderboard-modal">
              <div className="lb-header">
                <h3>Топ Баланса</h3>
                <button className="close-btn" onClick={() => setShowTopBalance(false)}>✕</button>
              </div>
              <div className="lb-list">
                {topBalanceData.map((p, i) => (
                  <div key={p.id} className="lb-row">
                    <span className="lb-rank">{i + 1}</span>
                    <span className="lb-name">{p.firstName || 'Гонщик'}</span>
                    <span className="lb-value">{p.balance.toLocaleString('ru-RU')} 🪙</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showDealership && (
        <CarDealership onClose={() => setShowDealership(false)} />
      )}
      
      {showDaily && (
        <DailyRewardModal onClose={() => setShowDaily(false)} />
      )}

      {showQuests && (
        <QuestModal onClose={() => setShowQuests(false)} />
      )}

      {showWorkshop && (
        <WorkshopScreen onClose={() => setShowWorkshop(false)} />
      )}

      {showBusiness && (
        <BusinessScreen onClose={() => setShowBusiness(false)} />
      )}
    </div>
  );
};