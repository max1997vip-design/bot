// src/App.tsx
import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { RaceScreen } from './components/RaceScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { GarageScreen } from './components/GarageScreen';
import { CityScreen } from './components/CityScreen'; 
import { LoadingScreen } from './components/LoadingScreen';
import WebApp from '@twa-dev/sdk';
import { AnimatePresence } from 'framer-motion';

type Tab = 'race' | 'city' | 'garage' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('race');
  const [isReady, setIsReady] = useState(false);
  const setUser = useGameStore((state) => state.setUser);
  const syncTaps = useGameStore((state) => state.syncTaps);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();

    const loadUser = async () => {
      try {
        const initData = WebApp.initData || '';
        const startParam = WebApp.initDataUnsafe?.start_param || '';

        const res = await fetch('/api/game?action=sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData, startParam }),
        });
        
        const data = await res.json();
        
        if (data.user && data.user.id) {
          // ИСПРАВЛЕНИЕ ЗДЕСЬ: Передаем inventory и equipped из ответа сервера
          setUser(
            data.user, 
            data.inventory || [], 
            data.equipped || { engine: null, tires: null, ecu: null }
          );
        }
      } catch (e) {
        console.error('Ошибка sync:', e);
      } finally {
        setTimeout(() => setIsReady(true), 2500); 
      }
    };
    
    setTimeout(loadUser, 100); 

    const syncInterval = setInterval(() => syncTaps(), 1000);
    return () => clearInterval(syncInterval);
  }, [setUser, syncTaps]);

  return (
    <div className="app-container">
      <AnimatePresence>
        {!isReady && <LoadingScreen />}
      </AnimatePresence>

      <main className="main-content">
        {activeTab === 'race' && <RaceScreen />}
        {activeTab === 'city' && <CityScreen />}
        {activeTab === 'garage' && <GarageScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${activeTab === 'race' ? 'active' : ''}`} onClick={() => setActiveTab('race')}>
          <span className="nav-icon">🏁</span><span className="nav-label">Гонка</span>
        </button>
        <button className={`nav-btn ${activeTab === 'city' ? 'active' : ''}`} onClick={() => setActiveTab('city')}>
          <span className="nav-icon">🏙️</span><span className="nav-label">Город</span>
        </button>
        <button className={`nav-btn ${activeTab === 'garage' ? 'active' : ''}`} onClick={() => setActiveTab('garage')}>
          <span className="nav-icon">🔧</span><span className="nav-label">Гараж</span>
        </button>
        <button className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <span className="nav-icon">👤</span><span className="nav-label">Профиль</span>
        </button>
      </nav>
    </div>
  );
}