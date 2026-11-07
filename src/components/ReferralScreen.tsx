// src/components/ReferralScreen.tsx
import React, { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Gift, Copy, Share2, ArrowLeft, Users, TrendingUp, UserPlus } from 'lucide-react';
import '../styles/referral.css';

const BOT_NAME = 'kliker_one_bot'; 

export const ReferralScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const referrals = useGameStore((s) => s.referrals);
  const fetchReferrals = useGameStore((s) => s.fetchReferrals);
  
  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

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
        <div className="referral-topbar">
          <button className="referral-back" onClick={onClose}>
            <ArrowLeft size={18} />
          </button>
          <h2><Users size={18} /> ПРИГЛАШАЙ ДРУЗЕЙ</h2>
          <div style={{ width: 36 }} />
        </div>

        <div className="referral-content">
          <div className="referral-bonus-card">
            <div className="bonus-icon"><Gift size={32} color="var(--accent)" /></div>
            <div className="bonus-text">
              <h3>Бонус за друга</h3>
              <p>Получай <strong>50,000 ₽</strong> и <strong>1%</strong> с каждого клика друга!</p>
            </div>
          </div>

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

          <div className="referral-link-box" onClick={handleCopy}>
            <span className="link-text">{refLink}</span>
            <Copy size={16} color="var(--accent)" style={{ flexShrink: 0, marginLeft: 8 }} />
          </div>

          {/* 👇 БЛОК ДРУЗЕЙ */}
          <div className="referral-friends-card">
            <div className="friends-header">
              <UserPlus size={16} color="var(--accent)" />
              <span>Приглашённые друзья</span>
              <span className="friends-count">{referrals.length}</span>
            </div>

            {referrals.length === 0 ? (
              <div className="friends-empty">
                <Users size={32} color="var(--text-muted)" />
                <p>Пока никого нет.<br />Отправь ссылку первым!</p>
              </div>
            ) : (
              <div className="friends-list">
                {referrals.map((ref: any) => (
                  <div key={ref.id} className="friend-row">
                    {ref.photoUrl ? (
                      <img src={ref.photoUrl} alt="" className="friend-avatar" />
                    ) : (
                      <div className="friend-avatar-placeholder">
                        {(ref.firstName?.[0] || 'Г').toUpperCase()}
                      </div>
                    )}
                    <div className="friend-info">
                      <div className="friend-name">
                        {[ref.firstName, ref.lastName].filter(Boolean).join(' ') || ref.username || 'Гонщик'}
                      </div>
                      <div className="friend-date">
                        С {new Date(ref.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <div className="friend-earned">
                      {Math.floor((ref.totalEarned || 0) * 0.01).toLocaleString('ru-RU')}
                      <span className="currency-ruble sm" style={{ marginLeft: 2 }}>₽</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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