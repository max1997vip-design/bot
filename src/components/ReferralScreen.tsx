// src/components/ReferralScreen.tsx
import React from 'react';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';

const BOT_NAME = 'kliker_one_bot'; 

export const ReferralScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  
  if (!user) return null;

  const referralEarnings = user.referralEarnings || 0;
  
  // 👇 Убрали слэш /app перед ?startapp (если только ты не назвал Mini App "app" в BotFather)
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
    <div className="referral-overlay">
      <div className="referral-container">
        <div className="referral-topbar">
          <button className="referral-back" onClick={onClose} aria-label="Назад">←</button>
          <h2>Приглашай друзей</h2>
          <div style={{ width: 40 }} />
        </div>

        <div className="referral-header">
          <p>За каждого друга ты получаешь <strong className="text-green">50,000</strong> монет и <strong className="text-green">5%</strong> от каждого его клика!</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>Друг получает <strong className="text-green">10,000</strong> на старт.</p>
        </div>
        
        <div className="referral-stats-card">
          <div className="stat-row">
            <span>Заработано с рефералов:</span>
            <strong className="text-green">{referralEarnings.toLocaleString('ru-RU')} 🪙</strong>
          </div>
        </div>

        <div 
          onClick={handleCopy}
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '16px', 
            borderRadius: '12px', 
            wordBreak: 'break-all',
            fontSize: '13px',
            color: '#aaa',
            cursor: 'pointer',
            textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.2)'
          }}
        >
          {refLink}
        </div>

        <button onClick={handleShare} className="referral-btn" style={{ marginTop: '16px' }}>
          Поделиться ссылкой
        </button>
      </div>
    </div>
  );
};