// src/components/ReferralScreen.tsx
import React from 'react';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Gift, Copy, Share2, ArrowLeft, Users, TrendingUp, UserPlus } from 'lucide-react';
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
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent('Присоединяйся к гонкам! Получи 10,000 ₽ бонусом 🏎️💨')}`;
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
          <button className="referral-back" onClick={onClose}>
            <ArrowLeft size={18} />
          </button>
          <h2><Users size={18} /> ПРИГЛАШАЙ ДРУЗЕЙ</h2>
          <div style={{ width: 36 }} />
        </div>

        {/* Контент */}
        <div className="referral-content">
          {/* Бонус */}
          <div className="referral-bonus-card">
            <div className="bonus-icon"><Gift size={32} color="var(--accent)" /></div>
            <div className="bonus-text">
              <h3>Бонус за друга</h3>
              <p>Получай <strong>50,000 ₽</strong> и <strong>1%</strong> с каждого клика друга!</p>
            </div>
          </div>

          {/* Заработано */}
          <div className="referral-earnings-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="var(--success)" />
              <span className="earnings-label">Заработано с рефералов</span>
            </div>
            <span className="earnings-value">
              {referralEarnings.toLocaleString('ru-RU')}
              <span className="currency-ruble" style={{ marginLeft: 4 }}>₽</span>
            </span>
          </div>

          {/* Как это работает */}
          <div className="referral-how-it-works">
            <h4>Как это работает?</h4>
            <div className="how-step">
              <div className="how-step-num">1</div>
              <p>Отправь ссылку другу</p>
            </div>
            <div className="how-step">
              <div className="how-step-num">2</div>
              <p>Друг запускает игру и получает <strong>10,000 ₽</strong></p>
            </div>
            <div className="how-step">
              <div className="how-step-num">3</div>
              <p>Ты получаешь <strong>50,000 ₽</strong> + 1% с его кликов</p>
            </div>
          </div>

          {/* Ссылка */}
          <div className="referral-link-box" onClick={handleCopy}>
            <span className="link-text">{refLink}</span>
            <Copy size={16} color="var(--accent)" style={{ flexShrink: 0, marginLeft: 8 }} />
          </div>

          {/* 👇 Блок "Приглашённые друзья" — заполняет пустоту */}
          <div className="referral-friends-card">
            <div className="friends-header">
              <UserPlus size={16} color="var(--accent)" />
              <span>Приглашённые друзья</span>
            </div>
            <div className="friends-empty">
              <Users size={32} color="var(--text-muted)" />
              <p>Пока никого нет.<br />Отправь ссылку первым!</p>
            </div>
          </div>

          {/* Кнопки внизу */}
          <div className="referral-actions">
            <button onClick={handleCopy} className="referral-btn-copy">
              <Copy size={16} />
              СКОПИРОВАТЬ
            </button>
            <button onClick={handleShare} className="referral-btn-action">
              <Share2 size={16} />
              ПОДЕЛИТЬСЯ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};