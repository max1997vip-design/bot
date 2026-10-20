// src/components/LoadingScreen.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/loading.css';

const loadingTexts = [
  'ПРОГРЕВ ШИН...',
  'ЗАПРАВКА БАКА...',
  'ПОДКЛЮЧЕНИЕ К СЕРВЕРУ...',
  'СИНХРОНИЗАЦИЯ ДАННЫХ...',
  'ПОДГОТОВКА К ЗАЕЗДУ...'
];

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(100, prev + Math.floor(Math.random() * 2) + 3);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 500);
    return () => clearInterval(textInterval);
  }, []);

  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      // ВОТ ГЛАВНЫЙ ФИКС: добавляем pointerEvents: 'none'
      exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: 0.5 } }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
    > 
      <div className="loading-bg" />
      <div className="loading-overlay" />

      <div className="loading-content">
        <motion.h1 
          className="loading-logo"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          RACING<span>IDLE</span>
        </motion.h1>

        <div className="loading-bar-container">
          <motion.div 
            className="loading-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="loading-info">
          <motion.span 
            key={textIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="loading-text"
          >
            {loadingTexts[textIndex]}
          </motion.span>
          <span className="loading-percent">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};