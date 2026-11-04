// src/components/AdminScreen.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import '../styles/admin.css';

type AdminTab = 'overview' | 'give' | 'flags' | 'users';

interface FeatureFlag {
  name: string;
  isEnabled: boolean;
  description?: string;
}

interface AdminUser {
  id: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  balance: number;
  starsBalance?: number;
  leaguePoints?: number;
  rating: number;
  isAdmin: boolean;
  isBanned: boolean;
}

interface AdminStats {
  totalUsers: number;
  totalBalance: number;
  avgRating: number;
  bannedUsers: number;
  totalStars: number;
  totalLeague: number;
}

export const AdminScreen: React.FC = () => {
  const adminGetData = useGameStore((s) => s.adminGetData);
  const adminAction = useGameStore((s) => s.adminAction);
  const user = useGameStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'error' } | null>(null);

  // Форма выдачи
  const [giveUserId, setGiveUserId] = useState('');
  const [giveType, setGiveType] = useState<'balance' | 'stars' | 'league'>('balance');
  const [giveAmount, setGiveAmount] = useState('');

  const isAdmin = user?.isAdmin || false;

  const showToast = (msg: string, type: 'ok' | 'error' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminGetData();
      if (data) {
        setFlags(data.flags || []);
        setUsers(data.users || []);

        const totalBalance = data.users.reduce((sum: number, u: any) => sum + (u.balance || 0), 0);
        const totalStars = data.users.reduce((sum: number, u: any) => sum + (u.starsBalance || 0), 0);
        const totalLeague = data.users.reduce((sum: number, u: any) => sum + (u.leaguePoints || 0), 0);
        const avgRating = data.users.length
          ? Math.round(data.users.reduce((sum: number, u: any) => sum + (u.rating || 0), 0) / data.users.length)
          : 0;
        const bannedUsers = data.users.filter((u: any) => u.isBanned).length;

        setStats({
          totalUsers: data.users.length,
          totalBalance,
          avgRating,
          bannedUsers,
          totalStars,
          totalLeague,
        });
      }
    } catch (e) {
      console.error(e);
      showToast('Ошибка загрузки', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const toggleFlag = async (name: string, current: boolean) => {
    if (actionLoading) return;
    setActionLoading(name);
    setFlags((prev) => prev.map((f) => (f.name === name ? { ...f, isEnabled: !current } : f)));
    const ok = await adminAction('toggleFeature', { name, isEnabled: !current });
    if (!ok) {
      setFlags((prev) => prev.map((f) => (f.name === name ? { ...f, isEnabled: current } : f)));
      showToast('Не удалось изменить флаг', 'error');
    } else {
      showToast(`Флаг "${name}" ${!current ? 'включён' : 'выключен'}`);
    }
    setActionLoading(null);
  };

  const banUser = async (userId: number, currentBan: boolean) => {
    if (actionLoading) return;
    setActionLoading(`ban_${userId}`);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: !currentBan } : u)));
    const ok = await adminAction(currentBan ? 'unbanUser' : 'banUser', { userId });
    if (!ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: currentBan } : u)));
      showToast('Не удалось изменить бан', 'error');
    } else {
      showToast(currentBan ? 'Пользователь разбанен' : 'Пользователь забанен');
    }
    setActionLoading(null);
  };

  const giveAdmin = async (userId: number, currentAdmin: boolean) => {
    if (actionLoading) return;
    setActionLoading(`admin_${userId}`);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: !currentAdmin } : u)));
    const ok = await adminAction(currentAdmin ? 'removeAdmin' : 'giveAdmin', { userId });
    if (!ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: currentAdmin } : u)));
      showToast('Не удалось изменить права', 'error');
    } else {
      showToast(currentAdmin ? 'Права сняты' : 'Права выданы');
    }
    setActionLoading(null);
  };

  const handleGive = async () => {
    const amount = parseInt(giveAmount, 10);
    const userId = parseInt(giveUserId, 10);
    if (!userId || !amount || amount <= 0) {
      showToast('Укажите ID и сумму', 'error');
      return;
    }
    if (actionLoading) return;
    setActionLoading('give');
    const ok = await adminAction('giveReward', {
      targetId: userId,
      type: giveType,
      amount,
    });
    if (ok) {
      showToast(`Выдано ${amount}`);
      setGiveAmount('');
      loadData();
    } else {
      showToast('Не удалось выдать', 'error');
    }
    setActionLoading(null);
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.id.toString().includes(q)
    );
  });

  if (!isAdmin) {
    return (
      <div className="admin-screen">
        <div className="admin-header"><h2>Админ</h2></div>
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <div style={{ color: '#ff4444', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Доступ запрещён
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-screen">
        <div className="admin-header"><h2>Админ</h2></div>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <h2>Админ</h2>
        <span className="admin-badge">ADMIN</span>
      </div>

      <div className="admin-tabs">
        {[
          { id: 'overview', label: '📊 Обзор' },
          { id: 'give', label: '💸 Выдать' },
          { id: 'flags', label: `🚩 Флаги` },
          { id: 'users', label: `👥 Игроки` },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as AdminTab)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* === ОБЗОР === */}
        {activeTab === 'overview' && stats && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Пользователей</div>
                <div className="admin-stat-value cyan">{stats.totalUsers}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Ср. рейтинг</div>
                <div className="admin-stat-value gold">{stats.avgRating}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Общий баланс</div>
                <div className="admin-stat-value green">{stats.totalBalance.toLocaleString()}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Всего звёзд</div>
                <div className="admin-stat-value gold">{stats.totalStars.toLocaleString()}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Очки лиги</div>
                <div className="admin-stat-value cyan">{stats.totalLeague.toLocaleString()}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Забанено</div>
                <div className="admin-stat-value red">{stats.bannedUsers}</div>
              </div>
            </div>

            <div className="admin-card">
              <h3>Быстрые действия</h3>
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <button className="admin-btn primary" onClick={loadData}>
                  🔄 Обновить данные
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* === ВЫДАТЬ === */}
        {activeTab === 'give' && (
          <motion.div key="give" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="admin-card">
              <h3>Начислить валюту</h3>

              <div className="admin-form-row">
                <label className="admin-form-label">ID пользователя</label>
                <input
                  className="admin-input"
                  type="number"
                  placeholder="Например: 123456789"
                  value={giveUserId}
                  onChange={(e) => setGiveUserId(e.target.value)}
                />
              </div>

              <div className="admin-form-row">
                <label className="admin-form-label">Тип валюты</label>
              </div>
              <div className="admin-currency-options">
                <div className={`admin-currency-option ${giveType === 'balance' ? 'active' : ''}`} onClick={() => setGiveType('balance')}>💰 Монеты</div>
                <div className={`admin-currency-option ${giveType === 'stars' ? 'active' : ''}`} onClick={() => setGiveType('stars')}>⭐ Звёзды</div>
                <div className={`admin-currency-option ${giveType === 'league' ? 'active' : ''}`} onClick={() => setGiveType('league')}>🏆 Лига</div>
              </div>

              <div className="admin-form-row">
                <label className="admin-form-label">Сумма</label>
                <input
                  className="admin-input"
                  type="number"
                  placeholder="Например: 1000"
                  value={giveAmount}
                  onChange={(e) => setGiveAmount(e.target.value)}
                />
              </div>

              <div className="admin-quick-amounts">
                {[100, 1000, 10000, 100000].map((v) => (
                  <button key={v} className="admin-quick-btn" onClick={() => setGiveAmount(String(v))}>
                    +{v >= 1000 ? `${v / 1000}K` : v}
                  </button>
                ))}
              </div>

              <div className="admin-form-actions">
                <button
                  className="admin-btn primary"
                  onClick={handleGive}
                  disabled={actionLoading === 'give' || !giveUserId || !giveAmount}
                >
                  {actionLoading === 'give' ? '⏳...' : '✅ Выдать'}
                </button>
              </div>
            </div>

            <div className="admin-card" style={{ color: '#666', fontSize: '12px', lineHeight: 1.5 }}>
              💡 Подсказка: ID можно найти во вкладке «👥 Игроки».
            </div>
          </motion.div>
        )}

        {/* === ФЛАГИ === */}
        {activeTab === 'flags' && (
          <motion.div key="flags" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {flags.length === 0 ? (
              <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Нет флагов
              </div>
            ) : (
              <div className="admin-card">
                {flags.map((flag) => (
                  <div key={flag.name} className="admin-flag-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-flag-name">{flag.name}</div>
                      {flag.description && <div className="admin-flag-desc">{flag.description}</div>}
                    </div>
                    <div
                      className={`admin-toggle ${flag.isEnabled ? 'on' : ''}`}
                      onClick={() => toggleFlag(flag.name, flag.isEnabled)}
                      style={{ opacity: actionLoading === flag.name ? 0.5 : 1 }}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* === ПОЛЬЗОВАТЕЛИ === */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <input
              className="admin-input"
              placeholder="🔍 Поиск по имени, username или ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '12px' }}
            />

            {filteredUsers.length === 0 ? (
              <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                {searchQuery ? 'Ничего не найдено' : 'Нет пользователей'}
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} className="admin-user-row">
                  <div className="admin-user-avatar" style={{ backgroundImage: u.photoUrl ? `url(${u.photoUrl})` : undefined }} />
                  <div className="admin-user-info">
                    <div className="admin-user-name">
                      {u.firstName || u.username || 'Безымянный'}
                      {u.isAdmin && <span style={{ color: '#00e5ff', marginLeft: '6px', fontSize: '10px' }}>ADMIN</span>}
                      {u.isBanned && <span style={{ color: '#ff4444', marginLeft: '6px', fontSize: '10px' }}>BAN</span>}
                    </div>
                    <div className="admin-user-id">ID: {u.id}</div>
                  </div>
                  <div className="admin-user-balance">{u.balance.toLocaleString()} 💰</div>
                  <div className="admin-user-actions">
                    <button
                      className="admin-icon-btn"
                      onClick={() => { setGiveUserId(String(u.id)); setActiveTab('give'); }}
                      title="Начислить валюту"
                    >
                      💸
                    </button>
                    <button
                      className="admin-icon-btn"
                      onClick={() => giveAdmin(u.id, u.isAdmin)}
                      disabled={actionLoading === `admin_${u.id}`}
                      title={u.isAdmin ? 'Снять админа' : 'Дать админа'}
                    >
                      {u.isAdmin ? '👑' : '⭐'}
                    </button>
                    <button
                      className="admin-icon-btn danger"
                      onClick={() => banUser(u.id, u.isBanned)}
                      disabled={actionLoading === `ban_${u.id}`}
                      title={u.isBanned ? 'Разбанить' : 'Забанить'}
                    >
                      {u.isBanned ? '✅' : '🚫'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className={`admin-toast ${toast.type === 'error' ? 'error' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};