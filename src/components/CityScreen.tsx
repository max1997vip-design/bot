// src/components/CityScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag, Castle, Coins, Building2, Dices, Package, ShoppingCart,
  Wrench, Briefcase, Wrench as AdminWrench, X
} from 'lucide-react';
import { RacesScreen } from './RacesScreen';
import { CarDealership } from './CarDealership';
import { WorkshopScreen } from './WorkshopScreen';
import { BusinessScreen } from './BusinessScreen';
import { CasinoScreen } from './CasinoScreen';
import { ClanScreen } from './ClanScreen';
import { AdminScreen } from './AdminScreen';
import { useGameStore } from '../store/gameStore';
import { CaseModal } from './CaseModal';
import { ShopModal } from './ShopModal';
import '../styles/city.css';

export const CityScreen = () => {
  const [activeLocation, setActiveLocation] = useState<'menu' | 'track'>('menu');
  const [showTopBalance, setShowTopBalance] = useState(false);
  const [topBalanceData, setTopBalanceData] = useState<any[]>([]);
  const [showDealership, setShowDealership] = useState(false);
  const [showWorkshop, setShowWorkshop] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const [showCasino, setShowCasino] = useState(false);
  const [showClan, setShowClan] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [activeCase, setActiveCase] = useState<string | null>(null);

  const user = useGameStore((s) => s.user);
  const features = user?.features || {};

  const fetchTopBalance = async () => {
    setShowTopBalance(true);
    try {
      const res = await fetch('/api/game?action=leaderboard&type=balance');
      const data = await res.json();
      if (data.success) setTopBalanceData(data.players);
    } catch (e) {
      console.error(e);
    }
  };

  // 👇 Список карточек города (легко расширять)
  const cityCards = [
    { id: 'track', title: 'Трек', desc: 'Гонки с ботами, PvP', icon: Flag, color: 'var(--accent)', action: () => setActiveLocation('track') },
    { id: 'clans', title: 'Кланы', desc: 'Сообщество и бонусы', icon: Castle, color: '#ff8800', action: () => setShowClan(true), hidden: features.clans === false },
    { id: 'leaderboard', title: 'Топ Баланса', desc: 'Самые богатые', icon: Coins, color: '#ffd700', action: fetchTopBalance },
    { id: 'dealership', title: 'Автосалон', desc: 'Покупка машин', icon: Building2, color: 'var(--accent)', action: () => setShowDealership(true) },
    { id: 'casino', title: 'Казино', desc: 'Испытай удачу', icon: Dices, color: '#ff4444', action: () => setShowCasino(true), hidden: features.casino === false },
    { id: 'cases', title: 'Кейсы', desc: 'Бесплатный и другие', icon: Package, color: 'var(--gold)', action: () => setActiveCase('hourly') },
    { id: 'shop', title: 'Магазин', desc: 'Покупка ₽', icon: ShoppingCart, color: '#ffd700', action: () => setShowShop(true), highlight: true },
    { id: 'workshop', title: 'Мастерская', desc: 'Тюнинг и крафт', icon: Wrench, color: 'var(--accent)', action: () => setShowWorkshop(true), hidden: features.workshop === false },
    { id: 'business', title: 'Бизнесы', desc: 'Пассивный доход', icon: Briefcase, color: 'var(--success)', action: () => setShowBusiness(true), hidden: features.business === false },
    { id: 'admin', title: 'Админка', desc: 'Управление игрой', icon: AdminWrench, color: '#ff4444', action: () => setShowAdmin(true), hidden: !user?.isAdmin, admin: true },
  ];

  return (
    <div className="city-screen">
      <AnimatePresence mode="wait">
        {activeLocation === 'menu' && (
          <motion.div
            key="city-menu"
            className="city-hub"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="city-title">ГОРОД</h2>

            <div className="city-grid">
              {cityCards.filter((c) => !c.hidden).map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    className={`city-card ${card.admin ? 'admin' : ''} ${card.highlight ? 'highlight' : ''}`}
                    onClick={card.action}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="city-card-icon" style={{ background: `${card.color}15`, border: `1px solid ${card.color}44` }}>
                      <Icon size={24} color={card.color} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </motion.div>
                );
              })}
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
            <button className="back-to-city" onClick={() => setActiveLocation('menu')}>
              ← Назад
            </button>
            <RacesScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Топ Баланса */}
      <AnimatePresence>
        {showTopBalance && (
          <motion.div
            className="race-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTopBalance(false)}
          >
            <motion.div
              className="race-modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="race-modal-header">
                <h2>
                  <Coins size={18} color="var(--gold)" /> ТОП БАЛАНСА
                </h2>
                <button className="race-modal-close" onClick={() => setShowTopBalance(false)}>
                  ✕
                </button>
              </div>
              <div className="race-leaderboard">
                {topBalanceData.map((p, i) => (
                  <div key={p.id} className="race-lb-row">
                    <span className="race-lb-rank" style={{ color: i === 0 ? 'var(--gold)' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--text-muted)' }}>
                      #{i + 1}
                    </span>
                    <span className="race-lb-name">{p.firstName || 'Гонщик'}</span>
                    <span className="race-lb-value">
                      {p.balance.toLocaleString('ru-RU')} <span className="currency-ruble sm">₽</span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showDealership && <CarDealership onClose={() => setShowDealership(false)} />}
      {showWorkshop && <WorkshopScreen onClose={() => setShowWorkshop(false)} />}
      {showBusiness && <BusinessScreen onClose={() => setShowBusiness(false)} />}
      {showCasino && <CasinoScreen onClose={() => setShowCasino(false)} />}
      {showClan && <ClanScreen onClose={() => setShowClan(false)} />}
      {showAdmin && <AdminScreen onClose={() => setShowAdmin(false)} />}
      {showShop && <ShopModal onClose={() => setShowShop(false)} />}

      <CaseModal
        isOpen={activeCase !== null}
        onClose={() => setActiveCase(null)}
        caseType={activeCase || 'hourly'}
      />
    </div>
  );
};