// src/App.tsx
import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { RaceScreen } from './components/RaceScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { GarageScreen } from './components/GarageScreen';
import { CityScreen } from './components/CityScreen'; 
import { LoadingScreen } from './components/LoadingScreen';
import WebApp from '@twa-dev/sdk';

type Tab = 'race' | 'city' | 'garage' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('race');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setUser = useGameStore((state) => state.setUser);
  const syncTaps = useGameStore((state) => state.syncTaps);
  const user = useGameStore((state) => state.user);

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
          setUser(
            data.user, 
            data.inventory || [], 
            data.equipped || { engine: null, tires: null, ecu: null, suspension: null }
          );
          setIsReady(true);
        } else {
          setError(data.error || 'Не удалось загрузить профиль');
          setIsReady(true);
        }
      } catch (e) {
        console.error('Ошибка sync:', e);
        setError('Ошибка сети. Проверьте интернет.');
        setIsReady(true);
      }
    };
    
    setTimeout(loadUser, 100); 

    const syncInterval = setInterval(() => syncTaps(), 1000);
    return () => clearInterval(syncInterval);
  }, [setUser, syncTaps]);

  // Экран загрузки
  if (!isReady) {
    return <LoadingScreen />;
  }

  // Экран ошибки (если user не загрузился)
  if (error || !user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#111', color: 'white', padding: 20, textAlign: 'center' }}>
        <h2 style={{ color: '#ff4444', marginBottom: 10 }}>Ошибка загрузки</h2>
        <p style={{ color: '#aaa', marginBottom: 20 }}>{error || 'Пользователь не найден'}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ padding: '12px 24px', background: '#00FF41', color: 'black', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
        >
          Перезагрузить
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
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