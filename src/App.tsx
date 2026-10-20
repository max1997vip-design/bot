// src/App.tsx
import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { RaceScreen } from './components/RaceScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { GarageScreen } from './components/GarageScreen';
import { CityScreen } from './components/CityScreen'; 
import { LoadingScreen } from './components/LoadingScreen';
import WebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'race' | 'city' | 'garage' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('race');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineEarnings, setOfflineEarnings] = useState(0);
  
  const setUser = useGameStore((state) => state.setUser);
  const syncTaps = useGameStore((state) => state.syncTaps);
  const user = useGameStore((state) => state.user);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();

    const loadUser = async () => {
      const startTime = Date.now();
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
          if (data.offlineEarnings && data.offlineEarnings > 0) {
            setOfflineEarnings(data.offlineEarnings);
          }
        } else {
          setError(data.error || 'Не удалось загрузить профиль');
        }
      } catch (e) {
        console.error('Ошибка sync:', e);
        setError('Ошибка сети. Проверьте интернет.');
      } finally {
        // Гарантируем, что экран загрузки провисит минимум 2.5 секунды
        const elapsed = Date.now() - startTime;
        const minTime = 2500; 
        if (elapsed < minTime) {
          setTimeout(() => setIsReady(true), minTime - elapsed);
        } else {
          setIsReady(true);
        }
      }
    };
    
    setTimeout(loadUser, 100); 

    const syncInterval = setInterval(() => syncTaps(), 1000);
    return () => clearInterval(syncInterval);
  }, [setUser, syncTaps]);

  return (
    <>
      {/* Красивое исчезновение экрана загрузки */}
      <AnimatePresence>
       {!isReady && <LoadingScreen />}
      </AnimatePresence>

      {/* Экран ошибки (если сеть упала) */}
      {isReady && (error || !user) && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: '#111', color: 'white', padding: 20, textAlign: 'center' }}>
          <h2 style={{ color: '#ff4444', marginBottom: 10 }}>Ошибка загрузки</h2>
          <p style={{ color: '#aaa', marginBottom: 20 }}>{error || 'Пользователь не найден'}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: '#00FF41', color: 'black', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
            Перезагрузить
          </button>
        </div>
      )}

      {/* Главный экран */}
      {isReady && !error && user && (
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

          <AnimatePresence>
            {offlineEarnings > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' , transform: 'translateZ(0)', isolation: 'isolate' }}
              >
                <motion.div 
                  initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
                  style={{ background: '#1a1a1a', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid #ffd700', boxShadow: '0 0 30px rgba(255,215,0,0.2)' }}
                >
                  <h2 style={{ color: '#ffd700', margin: '0 0 10px 0' }}>С возвращением!</h2>
                  <p style={{ color: '#ccc', marginBottom: '20px' }}>Пока вас не было, механики заработали:</p>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00FF41', marginBottom: '25px', textShadow: '0 0 10px rgba(0,255,65,0.5)' }}>
                    +{offlineEarnings.toLocaleString('ru-RU')} 🪙
                  </div>
                  <button 
                    onClick={() => setOfflineEarnings(0)}
                    style={{ background: '#00FF41', color: 'black', border: 'none', padding: '14px 40px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', width: '100%' }}
                  >
                    Забрать
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}