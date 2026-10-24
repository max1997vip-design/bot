
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

type FullscreenWebApp = typeof WebApp & {
  version?: string;
  isFullscreen?: boolean;
  requestFullscreen?: () => void;
  disableVerticalSwipes?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('race');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineEarnings, setOfflineEarnings] = useState(0);

  const setUser = useGameStore((state) => state.setUser);
  const syncTaps = useGameStore((state) => state.syncTaps);
  const user = useGameStore((state) => state.user);

  useEffect(() => {
    const webApp = WebApp as FullscreenWebApp;

    let cancelled = false;
    let readyTimeout: ReturnType<typeof setTimeout> | undefined;

    webApp.ready();

    const platform = webApp.platform;
    const isMobile = platform === 'ios' || platform === 'android';

    if (isMobile) {
      try {
        webApp.setHeaderColor?.('#000000');
        webApp.setBackgroundColor?.('#000000');

        webApp.expand();
        webApp.disableVerticalSwipes?.();

        const version = Number(webApp.version || '0');

        if (
          version >= 8 &&
          typeof webApp.requestFullscreen === 'function' &&
          !webApp.isFullscreen
        ) {
          webApp.requestFullscreen();
        }
      } catch (e) {
        console.error('[Telegram] Ошибка настройки экрана:', e);
      }
    }

    const loadUser = async () => {
      const startTime = Date.now();

      try {
        const initData = webApp.initData || '';
        const startParam =
          webApp.initDataUnsafe?.start_param || '';

        const res = await fetch('/api/game?action=sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData,
            startParam,
          }),
        });

        if (!res.ok) {
          throw new Error(`Ошибка сервера: ${res.status}`);
        }

        const data = await res.json();

        if (cancelled) return;

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

          if (data.offlineEarnings > 0) {
            setOfflineEarnings(data.offlineEarnings);
          }
        } else {
          setError(
            data.error || 'Не удалось загрузить профиль'
          );
        }
      } catch (e) {
        console.error('Ошибка sync:', e);

        if (!cancelled) {
          setError(
            'Ошибка сети. Проверьте интернет и попробуйте снова.'
          );
        }
      } finally {
        if (!cancelled) {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 1500 - elapsed);

          readyTimeout = setTimeout(() => {
            if (!cancelled) {
              setIsReady(true);
            }
          }, remaining);
        }
      }
    };

    const loadTimeout = setTimeout(loadUser, 100);
    const syncInterval = setInterval(() => syncTaps(), 1000);

    return () => {
      cancelled = true;

      clearTimeout(loadTimeout);
      clearInterval(syncInterval);

      if (readyTimeout) {
        clearTimeout(readyTimeout);
      }
    };
  }, [setUser, syncTaps]);

  const reloadApp = () => {
    window.location.reload();
  };

  return (
    <>
      <AnimatePresence>
        {!isReady && <LoadingScreen />}
      </AnimatePresence>

      {isReady && (error || !user) && (
        <div className="app-error">
          <h2>Ошибка загрузки</h2>
          <p>{error || 'Пользователь не найден'}</p>
          <button onClick={reloadApp}>
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
                    className="offline-card"
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                  >
                    <h2>С возвращением!</h2>

                    <p>
                      Пока вас не было, механики заработали:
                    </p>

                    <div className="offline-amount">
                      +{offlineEarnings.toLocaleString('ru-RU')} 🪙
                    </div>

                    <button
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
