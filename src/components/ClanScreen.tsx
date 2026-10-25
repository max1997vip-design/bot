import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLAN_CREATE_COST, CLAN_LEVELS, getClanStats } from '../config/clans';

export const ClanScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const clanInfo = useGameStore((s) => s.clanInfo);
  const clanMembers = useGameStore((s) => s.clanMembers);
  const fetchClan = useGameStore((s) => s.fetchClan);
  const createClan = useGameStore((s) => s.createClan);
  const joinClan = useGameStore((s) => s.joinClan);
  const clanAction = useGameStore((s) => s.clanAction);

  const [createName, setCreateName] = useState('');
  const [joinName, setJoinName] = useState('');
  const [donateAmount, setDonateAmount] = useState<number | ''>('');

  useEffect(() => {
    fetchClan();
  }, [fetchClan]);

  if (!clanInfo) {
    return (
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#111', zIndex: 1000, 
        padding: '20px', paddingTop: 'calc(20px + var(--tg-safe-top, 0px))', // 👈 Отступ для Telegram
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
      }}>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>🏰 Кланы</h2>
        
        <div style={{ background: '#222', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '400px', marginBottom: '20px' }}>
          <h3 style={{ color: '#ffd700', marginTop: 0 }}>Создать клан</h3>
          <p style={{ color: '#888', fontSize: '12px' }}>Стоимость: {CLAN_CREATE_COST.toLocaleString('ru-RU')} 🪙</p>
          <input 
            value={createName} onChange={e => setCreateName(e.target.value)}
            placeholder="Название клана" 
            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '6px' }}
          />
          <button 
            onClick={async () => { if(await createClan(createName)) alert('Клан создан!'); else alert('Ошибка (возможно, название занято или мало монет)'); }}
            style={{ width: '100%', padding: '10px', background: '#ffd700', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >СОЗДАТЬ</button>
        </div>

        <div style={{ background: '#222', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
          <h3 style={{ color: '#00bfff', marginTop: 0 }}>Вступить в клан</h3>
          <input 
            value={joinName} onChange={e => setJoinName(e.target.value)}
            placeholder="Название клана" 
            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '6px' }}
          />
          <button 
            onClick={async () => { if(await joinClan(joinName)) alert('Вы вступили!'); else alert('Ошибка (не найден или переполнен)'); }}
            style={{ width: '100%', padding: '10px', background: '#00bfff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >ВСТУПИТЬ</button>
        </div>

        <button onClick={onClose} style={{ marginTop: '20px', background: 'transparent', color: '#888', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Закрыть</button>
      </div>
    );
  }

  const isLeader = clanInfo.leaderId === user?.id;
  const nextLevelStats = getClanStats(clanInfo.level + 1);
  
  // 👇 ПРОВЕРКА НА МАКСИМАЛЬНЫЙ УРОВЕНЬ
  // Если nextLevelStats вернул undefined или достигнут конец массива уровней, блокируем кнопку
  const isMaxLevel = !nextLevelStats || clanInfo.level >= CLAN_LEVELS.length;

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#111', zIndex: 1000, overflowY: 'auto', 
      padding: '20px', paddingTop: 'calc(20px + var(--tg-safe-top, 0px))' // 👈 Отступ для Telegram
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#00bfff', margin: 0 }}>🏰 {clanInfo.name}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Закрыть</button>
        </div>

        <div style={{ background: '#222', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>Уровень клана: {clanInfo.level}</div>
          <div style={{ color: '#aaa', fontSize: '13px', marginTop: '5px' }}>
            Бонус к клику для всех: +{clanInfo.clickBonus}% <br/>
            Участники: {clanMembers.length} / {clanInfo.maxMembers} <br/>
            Казна: {clanInfo.balance.toLocaleString('ru-RU')} 🪙
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input 
            type="number" value={donateAmount} onChange={e => setDonateAmount(Number(e.target.value))}
            placeholder="Сумма" 
            style={{ flex: 1, padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px' }}
          />
          <button 
            onClick={async () => { if(await clanAction('donate', Number(donateAmount))) alert('Пожертвовано!'); }}
            style={{ padding: '10px 20px', background: '#00FF41', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >ДОНАТ</button>
        </div>

        {isLeader && (
          <button 
            onClick={async () => { 
              if (isMaxLevel) return; // 👈 Защита от клика
              if(await clanAction('upgrade')) alert('Клан улучшен!'); 
              else alert('Не хватает денег в казне!'); 
            }}
            disabled={isMaxLevel || clanInfo.balance < (nextLevelStats?.upgradeCost || 0)}
            style={{ 
              width: '100%', padding: '12px', 
              background: isMaxLevel ? '#444' : '#ffd700', 
              color: isMaxLevel ? '#888' : '#000', 
              border: 'none', borderRadius: '6px', fontWeight: 'bold', 
              cursor: isMaxLevel ? 'not-allowed' : 'pointer', 
              marginBottom: '20px' 
            }}
          >
            {isMaxLevel 
              ? 'МАКСИМАЛЬНЫЙ УРОВЕНЬ' 
              : `УЛУЧШИТЬ ДО ${clanInfo.level + 1} УР. (Цена: ${nextLevelStats?.upgradeCost?.toLocaleString('ru-RU') || 0} 🪙)`
            }
          </button>
        )}

        <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Участники</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {clanMembers.map((m: any) => (
            <div key={m.userId} style={{ display: 'flex', justifyContent: 'space-between', background: '#222', padding: '12px', borderRadius: '8px' }}>
              <div style={{ color: '#fff' }}>{m.firstName || 'Игрок'} {m.role === 'leader' && '👑'}</div>
              <div style={{ color: '#888', fontSize: '12px' }}>{m.balance.toLocaleString('ru-RU')} 🪙</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};