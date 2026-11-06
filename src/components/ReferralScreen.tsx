// src/components/ReferralScreen.tsx
import React from 'react';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import '../styles/referral.css';

const BOT_NAME = 'kliker_one_bot'; 

export const ReferralScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  
  if (!user) return null;

  const referralEarnings = user.referralEarnings || 0;
  const refLink = `https://t.me/${BOT_NAME}?startapp=ref_${user.id}`; 

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    WebApp.HapticFeedback?.notificationOccurred('success');
    WebApp.showAlert('Ссылка скопирована!');
  };

  const handleShare = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent('Присоединяйся к гонкам! Получи 10,000 монет бонусом 🏎️💨')}`;
    WebApp.openTelegramLink(shareUrl);
  };

  return (
    <motion.div 
      className="referral-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="referral-container">
        {/* Шапка */}
        <div className="referral-topbar">
          <button className="referral-back" onClick={onClose}>←</button>
          <h2>ПРИГЛАШАЙ ДРУЗЕЙ</h2>
          <div style={{ width: 36 }} />
        </div>

        {/* Контент */}
        <div className="referral-content">
          
          {/* Карточка с бонусами */}
          <div className="referral-bonus-card">
            <div className="bonus-icon">🎁</div>
            <div className="bonus-text">
              <h3>Бонус за друга</h3>
              <p>Получай <strong>50,000</strong> монет и <strong>5%</strong> с кликов друга!</p>
            </div>
          </div>

          {/* Баланс рефералов */}
          <div className="referral-earnings-card">
            <span className="earnings-label">Заработано с рефералов</span>
            <span className="earnings-value">{referralEarnings.toLocaleString('ru-RU')} 🪙</span>
          </div>

          {/* Ссылка */}
          <div className="referral-link-box" onClick={handleCopy}>
            <span className="link-text">{refLink}</span>
            <span className="copy-icon">📋</span>
          </div>

          {/* Кнопка */}
          <button onClick={handleShare} className="referral-btn-action">
            ПОДЕЛИТЬСЯ ССЫЛКОЙ
          </button>

        </div>
      </div>
    </motion.div>
  );
};