import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

const FEATURES_LIST = [
  { id: 'casino', name: '🎰 Казино' },
  { id: 'business', name: '💼 Бизнесы' },
  { id: 'workshop', name: '🔧 Мастерская' },
  { id: 'clans', name: '🏰 Кланы' },
  { id: 'pass', name: '🏁 Пропуск' },
];

export const AdminScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const adminGetData = useGameStore((s) => s.adminGetData);
  const adminAction = useGameStore((s) => s.adminAction);

  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [users, setUsers] = useState<any[]>([]);
  
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');
  const [itemId, setItemId] = useState('engine_5');

  const loadData = async () => {
    const data = await adminGetData();
    if (data) {
      const flagsMap: Record<string, boolean> = {};
      data.flags.forEach((f: any) => flagsMap[f.name] = f.isEnabled);
      setFlags(flagsMap);
      setUsers(data.users);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggle = async (name: string, currentStatus: boolean) => {
    await adminAction('toggleFeature', { name, isEnabled: !currentStatus });
    loadData();
  };

  const handleGive = async (type: 'balance' | 'item') => {
    if (!targetId) return alert('Введите ID игрока');
    const payload = type === 'balance' 
      ? { targetId, type, amount: Number(amount) }
      : { targetId, type, itemId };
    
    if (await adminAction('giveReward', payload)) {
      alert('Успешно выдано!');
      loadData();
    } else {
      alert('Ошибка выдачи');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#111', zIndex: 2000, overflowY: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#ff4444', margin: 0 }}>🛠️ Админ Панель</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Закрыть</button>
        </div>

        <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Управление фичами</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
          {FEATURES_LIST.map(f => {
            const isEnabled = flags[f.id] !== false;
            return (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#222', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#fff' }}>{f.name}</span>
                <button 
                  onClick={() => handleToggle(f.id, isEnabled)}
                  style={{ background: isEnabled ? '#00FF41' : '#333', color: isEnabled ? '#000' : '#888', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>
            );
          })}
        </div>

        <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Выдача ресурсов</h3>
        <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
          <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '10px' }}>
            Последние игроки: {users.map(u => `${u.firstName} (${u.id})`).join(', ')}
          </div>
          <input value={targetId} onChange={e => setTargetId(e.target.value)} placeholder="ID Игрока" style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '6px' }} />
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Сумма монет" type="number" style={{ flex: 1, padding: '10px', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '6px' }} />
            <button onClick={() => handleGive('balance')} style={{ background: '#ffd700', color: '#000', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Выдать 🪙</button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={itemId} onChange={e => setItemId(e.target.value)} style={{ flex: 1, padding: '10px', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '6px' }}>
              <option value="engine_5">Двигатель F1 (Легенда)</option>
              <option value="tires_5">Нано-резина (Легенда)</option>
              <option value="ecu_5">ИИ-Управление (Легенда)</option>
              <option value="susp_5">Подвеска F1 (Легенда)</option>
            </select>
            <button onClick={() => handleGive('item')} style={{ background: '#b000ff', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Выдать 🔧</button>
          </div>
        </div>
      </div>
    </div>
  );
};