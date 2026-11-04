// src/components/AdminScreen.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { useGameStore } from '../store/gameStore';
import '../styles/admin.css';

type AdminTab = 'flags' | 'users';

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
  rating: number;
  isAdmin: boolean;
  isBanned: boolean;
}

export const AdminScreen: React.FC = () => {
  const adminGetData = useGameStore((s) => s.adminGetData);
  const adminAction = useGameStore((s) => s.adminAction);
  const user = useGameStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<AdminTab>('flags');
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Проверка прав
  const isAdmin = user?.isAdmin || false;

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminGetData();
      if (data) {
        setFlags(data.flags || []);
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
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

    // Оптимистичное обновление
    setFlags((prev) =>
      prev.map((f) => (f.name === name ? { ...f, isEnabled: !current } : f))
    );

    const ok = await adminAction('toggleFlag', { name, isEnabled: !current });
    if (!ok) {
      // Откат при ошибке
      setFlags((prev) =>
        prev.map((f) => (f.name === name ? { ...f, isEnabled: current } : f))
      );
    }
    setActionLoading(null);
  };

  const banUser = async (userId: number, currentBan: boolean) => {
    if (actionLoading) return;
    setActionLoading(`ban_${userId}`);

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: !currentBan } : u))
    );

    const ok = await adminAction(currentBan ? 'unbanUser' : 'banUser', { userId });
    if (!ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: currentBan } : u))
      );
    }
    setActionLoading(null);
  };

  const giveAdmin = async (userId: number, currentAdmin: boolean) => {
    if (actionLoading) return;
    setActionLoading(`admin_${userId}`);

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isAdmin: !currentAdmin } : u))
    );

    const ok = await adminAction(currentAdmin ? 'removeAdmin' : 'giveAdmin', { userId });
    if (!ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isAdmin: currentAdmin } : u))
      );
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

  // === Проверка доступа ===
  if (!isAdmin) {
    return (
      <div className="admin-screen">
        <div className="admin-header">
          <h2>Админ</h2>
        </div>
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <div style={{ color: '#ff4444', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Доступ запрещён
          </div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
            У вас нет прав администратора
          </div>
        </div>
      </div>
    );
  }

  // === Загрузка ===
  if (loading) {
    return (
      <div className="admin-screen">
        <div className="admin-header">
          <h2>Админ</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          Загрузка данных...
        </div>
      </div>
    );
  }

  // === Основной экран ===
  return (
    <div className="admin-screen">
      <div className="admin-header">
        <h2>Админ</h2>
        <span className="admin-badge">ADMIN</span>
      </div>

      {/* Вкладки */}
      <div className="admin-tabs">
        <div
          className={`admin-tab ${activeTab === 'flags' ? 'active' : ''}`}
          onClick={() => setActiveTab('flags')}
        >
          🚩 Флаги ({flags.length})
        </div>
        <div
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Пользователи ({users.length})
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* === ФЛАГИ === */}
        {activeTab === 'flags' && (
          <motion.div
            key="flags"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {flags.length === 0 ? (
              <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Нет доступных флагов
              </div>
            ) : (
              <div className="admin-card">
                {flags.map((flag) => (
                  <div key={flag.name} className="admin-flag-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-flag-name">{flag.name}</div>
                      {flag.description && (
                        <div className="admin-flag-desc">{flag.description}</div>
                      )}
                    </div>
                    <div
                      className={`admin-toggle ${flag.isEnabled ? 'on' : ''}`}
                      onClick={() => toggleFlag(flag.name, flag.isEnabled)}
                      style={{
                        opacity: actionLoading === flag.name ? 0.5 : 1,
                        cursor: actionLoading ? 'wait' : 'pointer',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* === ПОЛЬЗОВАТЕЛИ === */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Поиск */}
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
                  <div
                    className="admin-user-avatar"
                    style={{ backgroundImage: u.photoUrl ? `url(${u.photoUrl})` : undefined }}
                  />
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
    </div>
  );
};