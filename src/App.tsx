
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
    let mounted = true;
    let loadTimeout: ReturnType<typeof setTimeout> | undefined;
    let readyTimeout: ReturnType<typeof setTimeout> | undefined;

    const initTelegram = () => {
      try {
        WebApp.ready();

        const platform = WebApp.platform;
        const isMobile =
          platform === 'ios' || platform === 'android';

        // Desktop intentionally keeps its compact layout.
        if (!isMobile) return;

        try {
          WebApp.expand();
        } catch (e) {
          console.warn('Telegram expand unavailable:', e);
        }

        // Fullscreen is optional and depends on Telegram version.
        try {
          const telegram = WebApp as any;

          if (
            typeof telegram.requestFullscreen === 'function' &&
            (
              typeof telegram.isVersionAtLeast !== 'function' ||
              telegram.isVersionAtLeast('8.0')
            )
          ) {
            telegram.requestFullscreen();
          }
        } catch (e) {
          // The game must remain usable without fullscreen.
          console.warn('Telegram fullscreen unavailable:', e);
        }

        // Disable Telegram's vertical swipe-to-close gesture
        // only when the method exists on this client.
        try {
          const telegram = WebApp as any;

          if (
            typeof telegram.disableVerticalSwipes === 'function'
          ) {
            telegram.disableVerticalSwipes();
          }
        } catch (e) {
          console.warn('Vertical swipe control unavailable:', e);
        }
      } catch (e) {
        // The app should still attempt to load if Telegram
        // WebApp initialization is unavailable.
        console.warn('Telegram WebApp initialization failed:', e);
      }
    };

    initTelegram();

    const loadUser = async () => {
      const startTime = Date.now();

      try {
        const initData = WebApp.initData || '';
        const startParam =
          WebApp.initDataUnsafe?.start_param || '';

        const res = await fetch('/api/game?action=sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData, startParam }),
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        if (!mounted) return;

        if (data.user && data.user.id) {
          setUser(
            data.user,
            data.inventory || [],
            data.equipped || {
              engine: null,
              tires: null,
              ecu: null,
              suspension: null,
            }
          );

          if (
            typeof data.offlineEarnings === 'number' &&
            data.offlineEarnings > 0
          ) {
            setOfflineEarnings(data.offlineEarnings);
          }
        } else {
          setError(data.error || 'Не удалось загрузить профиль');
        }
      } catch (e) {
        if (!mounted) return;

        console.error('Ошибка sync:', e);
        setError('Ошибка сети. Проверьте интернет.');
      } finally {
        if (!mounted) return;

        const elapsed = Date.now() - startTime;
        const minTime = 2500;
        const remaining = Math.max(0, minTime - elapsed);

        readyTimeout = setTimeout(() => {
          if (mounted) setIsReady(true);
        }, remaining);
      }
    };

    loadTimeout = setTimeout(() => {
      void loadUser();
    }, 100);

    const syncInterval = setInterval(() => {
      syncTaps();
    }, 1000);

    return () => {
      mounted = false;

      if (loadTimeout) clearTimeout(loadTimeout);
      if (readyTimeout) clearTimeout(readyTimeout);

      clearInterval(syncInterval);
    };
  }, [setUser, syncTaps]);

  return (
    <>
      <AnimatePresence>
        {!isReady && <LoadingScreen />}
      </AnimatePresence>

      {isReady && (error || !user) && (
        <div className="app-error-screen">
          <h2>Ошибка загрузки</h2>
          <p>{error || 'Пользователь не найден'}</p>
          <button onClick={() => window.location.reload()}>
            Перезагрузить
          </button>
        </div>
      )}

      {isReady && !error && user && (
        <div className="game-wrapper">
          <div className="app-container">
            <main className="main-content">
              {activeTab === 'race' && <RaceScreen />}
              {activeTab === 'city' && <CityScreen />}
              {activeTab === 'garage' && <GarageScreen />}
              {activeTab === 'profile' && <ProfileScreen />}
            </main>

            <nav className="bottom-nav">
              <button
                className={`nav-btn ${
                  activeTab === 'race' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('race')}
              >
                <span className="nav-icon">🏁</span>
                <span className="nav-label">Гонка</span>
              </button>

              <button
                className={`nav-btn ${
                  activeTab === 'city' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('city')}
              >
                <span className="nav-icon">🏙️</span>
                <span className="nav-label">Город</span>
              </button>

              <button
                className={`nav-btn ${
                  activeTab === 'garage' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('garage')}
              >
                <span className="nav-icon">🔧</span>
                <span className="nav-label">Гараж</span>
              </button>

              <button
                className={`nav-btn ${
                  activeTab === 'profile' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-label">Профиль</span>
              </button>
            </nav>

            <AnimatePresence>
              {offlineEarnings > 0 && (
                <motion.div
                  className="offline-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="offline-modal"
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                  >
                    <h2>С возвращением!</h2>
                    <p>Пока вас не было, механики заработали:</p>

                    <div className="offline-amount">
                      +{offlineEarnings.toLocaleString('ru-RU')} 🪙
                    </div>

                    <button
                      className="offline-claim"
                      onClick={() => setOfflineEarnings(0)}
                    >
                      Забрать
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
