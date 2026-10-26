import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLAN_CREATE_COST, CLAN_LEVELS, getClanStats } from '../config/clans';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/clan.css'; 

type Tab = 'main' | 'members' | 'chat' | 'manage' | 'boss';
const SLOT_COST = 250000; 

export const ClanScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useGameStore((s) => s.user);
  const clanInfo = useGameStore((s) => s.clanInfo);
  const clanMembers = useGameStore((s) => s.clanMembers);
  const clansList = useGameStore((s) => s.clansList);
  const clanMessages = useGameStore((s) => s.clanMessages);
  const hasUnreadClanMessages = useGameStore((s) => s.hasUnreadClanMessages);
  const markClanChatAsRead = useGameStore((s) => s.markClanChatAsRead);
  
  const clanBoss = useGameStore((s) => s.clanBoss);
  const bossDamageStats = useGameStore((s) => s.bossDamageStats);
  const fetchClanBoss = useGameStore((s) => s.fetchClanBoss);
  const attackClanBoss = useGameStore((s) => s.attackClanBoss);
  
  const fetchClan = useGameStore((s) => s.fetchClan);
  const fetchClans = useGameStore((s) => s.fetchClans);
  const createClan = useGameStore((s) => s.createClan);
  const joinClan = useGameStore((s) => s.joinClan);
  const clanAction = useGameStore((s) => s.clanAction);
  const fetchClanMessages = useGameStore((s) => s.fetchClanMessages);
  const sendClanMessage = useGameStore((s) => s.sendClanMessage);
  
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>('main');
  const [createName, setCreateName] = useState('');
  const [donateAmount, setDonateAmount] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isAttacking, setIsAttacking] = useState(false);
  const [damagePopup, setDamagePopup] = useState<{ id: number, amount: number } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    fetchClan().then(() => {
      const info = useGameStore.getState().clanInfo;
      if (!info) fetchClans();
      else fetchClanBoss();
    });
  }, [fetchClan, fetchClans, fetchClanBoss]);

  useEffect(() => {
    if (clanInfo) {
      if (activeTab === 'chat') fetchClanMessages();
      if (activeTab === 'boss') fetchClanBoss();
      
      const interval = setInterval(() => {
        if (activeTab === 'chat') fetchClanMessages();
        if (activeTab === 'boss') fetchClanBoss();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [clanInfo, activeTab, fetchClanMessages, fetchClanBoss]);

  useEffect(() => {
    if (activeTab === 'chat' && clanMessages.length > 0) markClanChatAsRead();
  }, [activeTab, clanMessages, markClanChatAsRead]);

  useEffect(() => {
    if (activeTab === 'chat') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [clanMessages, activeTab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const success = await sendClanMessage(chatInput);
    if (success) {
      setChatInput('');
      fetchClanMessages();
    } else alert('Ошибка отправки!');
  };

  const handleAttackBoss = async () => {
    if (isAttacking || cooldown || !clanBoss || clanBoss.currentHp <= 0) return;
    
    setIsAttacking(true);
    setCooldown(true);
    setIsShaking(true);
    
    const res = await attackClanBoss();
    
    if (res.success && res.damage) {
      setDamagePopup({ id: Date.now(), amount: res.damage });
      setTimeout(() => setDamagePopup(null), 800);
      
      if (res.isDefeated) {
        setTimeout(() => alert(`Босс повержен! Казне начислено ${res.reward?.toLocaleString('ru-RU')} ₵`), 500);
      }
    }
    
    setTimeout(() => setIsAttacking(false), 300);
    setTimeout(() => setIsShaking(false), 300);
    setTimeout(() => setCooldown(false), 1000); 
  };

  if (!clanInfo) {
    const filteredClans = clansList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="clan-screen-overlay">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="clan-container">
          <div className="clan-header">
            <div className="clan-title-wrap"><span className="clan-badge">🏰</span><h2 className="neon-text">КЛАНЫ</h2></div>
            <button onClick={onClose} className="btn-close">✕</button>
          </div>
          <div className="clan-card" style={{ padding: '15px' }}>
            <h3 className="neon-text">Создать свой клан</h3>
            <p className="clan-desc" style={{ marginBottom: '10px' }}>Стоимость: {CLAN_CREATE_COST.toLocaleString('ru-RU')} ₵</p>
            <div className="donate-inputs">
              <input value={createName} onChange={e => setCreateName(e.target.value)} placeholder="Название клана" className="clan-input" />
              <button className="btn-neon-cyan" onClick={async () => { if(await createClan(createName)) alert('Клан создан!'); else alert('Ошибка'); }}>СОЗДАТЬ</button>
            </div>
          </div>
          <div className="clan-search-section">
            <h3 style={{ color: '#fff', marginTop: '20px', marginBottom: '15px' }}>Поиск кланов</h3>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Введите название..." className="clan-input" style={{ marginBottom: '15px' }} />
            <div className="clans-list">
              {filteredClans.map((c: any) => {
                const stats = getClanStats(c.level);
                const maxM = (stats?.maxMembers || 5) + (c.extraSlots || 0);
                return (
                  <div key={c.id} className="clan-search-row">
                    <div className="clan-info">
                      <span className="clan-name-s">{c.name} <span className="clan-level-badge">LVL {c.level}</span></span>
                      <span className="clan-members-count">{c.memberCount} / {maxM} участников</span>
                    </div>
                    <button className={`btn-sm ${c.memberCount >= maxM ? 'btn-neon-red' : 'btn-neon-green'}`} disabled={c.memberCount >= maxM} onClick={async () => { if(await joinClan(c.name)) alert('Вы вступили!'); else alert('Ошибка'); }}>
                      {c.memberCount >= maxM ? 'ПОЛОН' : 'ВСТУПИТЬ'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isLeader = clanInfo.leaderId === user?.id;
  const myRole = clanMembers.find((m: any) => m.userId === user?.id)?.role;
  const nextLevelStats = getClanStats(clanInfo.level + 1);
  const isMaxLevel = !nextLevelStats || clanInfo.level >= CLAN_LEVELS.length;
  const upgradeCost = nextLevelStats?.upgradeCost || 0;
  const progressPercent = isMaxLevel ? 100 : Math.min(100, (clanInfo.balance / (upgradeCost || 1)) * 100);
  const canUpgrade = clanInfo.balance >= upgradeCost && !isMaxLevel;
  const canBuySlot = clanInfo.balance >= SLOT_COST && (clanInfo.extraSlots || 0) < 10;

  const bossHpPercent = clanBoss ? Math.max(0, (clanBoss.currentHp / clanBoss.maxHp) * 100) : 100;
  const bossHpColor = bossHpPercent > 50 ? '#00ff41' : bossHpPercent > 20 ? '#ffd700' : '#ff0055';

  return (
    <div className="clan-screen-overlay">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="clan-container" style={{ display: 'flex', flexDirection: 'column', height: '85vh' }}>
        
        <div className="clan-header">
          <div className="clan-title-wrap">
            <span className="clan-badge">🛡️</span>
            <h2 className="neon-text">{clanInfo.name}</h2>
            <span className="clan-level-badge">LVL {clanInfo.level}</span>
          </div>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="clan-tabs">
          <button className={activeTab === 'main' ? 'active' : ''} onClick={() => setActiveTab('main')}>ГЛАВНАЯ</button>
          <button className={activeTab === 'boss' ? 'active' : ''} onClick={() => setActiveTab('boss')}>БОСС</button>
          <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>
            ЧАТ {hasUnreadClanMessages && activeTab !== 'chat' && <span className="unread-badge" />}
          </button>
          {myRole !== 'member' && (
            <button className={activeTab === 'manage' ? 'active' : ''} onClick={() => setActiveTab('manage')}>УПРАВЛЕНИЕ</button>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            
            {activeTab === 'main' && (
              <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="clan-tab-content hide-scrollbar">
                 <div className="clan-info-grid">
                  <div className="clan-stat-box"><span className="stat-label">УРОВЕНЬ</span><span className="stat-value">{clanInfo.level}</span></div>
                  <div className="clan-stat-box clickable" onClick={() => setActiveTab('members')}><span className="stat-label">УЧАСТНИКИ</span><span className="stat-value">{clanMembers.length}<span className="stat-max">/{clanInfo.maxMembers}</span></span></div>
                  <div className="clan-stat-box full-width treasury-box"><span className="stat-label">КАЗНА КЛАНА</span><span className="stat-value gold">{clanInfo.balance.toLocaleString('ru-RU')} <span className="currency-icon">₵</span></span></div>
                </div>
                {isLeader && (
                  <div className="upgrade-section">
                    <div className="upgrade-header"><span className="upgrade-title">УРОВЕНЬ {clanInfo.level + 1}</span><span className={`upgrade-cost ${canUpgrade ? 'can-afford' : ''}`}>{isMaxLevel ? 'MAX' : `${upgradeCost.toLocaleString('ru-RU')} ₵`}</span></div>
                    {!isMaxLevel && (<div className="upgrade-progress-wrap"><div className="upgrade-progress-bar"><motion.div className="upgrade-progress-fill" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} /></div><span className="upgrade-progress-text">{Math.floor(progressPercent)}%</span></div>)}
                    <div className="upgrade-bonus"><span className="bonus-icon">⚡</span> Дает: +{nextLevelStats?.clickBonus || 0}% к силе клика</div>
                    <button className={`btn-neon-gold full-width ${!canUpgrade ? 'disabled' : ''}`} disabled={!canUpgrade} onClick={async () => { if(await clanAction('upgrade')) alert('Клан улучшен!'); }}>{isMaxLevel ? 'МАКС. УРОВЕНЬ' : (canUpgrade ? 'УЛУЧШИТЬ КЛАН' : '🔒 УЛУЧШИТЬ КЛАН')}</button>
                  </div>
                )}
                {isLeader && (
                  <div className="upgrade-section" style={{ borderColor: 'rgba(0, 191, 255, 0.3)', background: 'rgba(0, 191, 255, 0.05)' }}>
                    <div className="upgrade-header"><span className="upgrade-title" style={{ color: '#00bfff' }}>ДОП. МЕСТО ({(clanInfo.extraSlots || 0)}/10)</span><span className="upgrade-cost" style={{ color: '#00bfff' }}>{SLOT_COST.toLocaleString('ru-RU')} ₵</span></div>
                    <div className="upgrade-bonus" style={{ color: '#8892b0' }}>Увеличивает лимит на 1</div>
                    <button className={`btn-neon-cyan full-width ${!canBuySlot ? 'disabled' : ''}`} disabled={!canBuySlot} onClick={async () => { if(await clanAction('buySlot')) alert('Место куплено!'); }}>{canBuySlot ? 'КУПИТЬ МЕСТО' : '🔒 НЕДОСТАТОЧНО СРЕДСТВ'}</button>
                  </div>
                )}
                <div className="clan-donate-box">
                  <h4>Поддержать клан</h4>
                  <div className="quick-donate"><button onClick={() => setDonateAmount(1000)}>+1K</button><button onClick={() => setDonateAmount(10000)}>+10K</button><button onClick={() => setDonateAmount(100000)}>+100K</button><button onClick={() => setDonateAmount(user?.balance || 0)}>MAX</button></div>
                  <div className="donate-inputs"><input type="number" value={donateAmount} onChange={e => setDonateAmount(Number(e.target.value))} placeholder="Сумма" className="clan-input" /><button className="btn-neon-green" onClick={async () => { if(await clanAction('donate', Number(donateAmount))) { alert('Внесено!'); setDonateAmount(''); } }}>ВНЕСТИ</button></div>
                </div>
              </motion.div>
            )}

            {activeTab === 'boss' && (
              <motion.div 
                key="boss" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }} 
                className={`clan-tab-content hide-scrollbar boss-tab ${isShaking ? 'screen-shake' : ''}`}
              >
                {clanBoss ? (
                  <div className="boss-arena">
                    <div className="boss-scanlines"></div>
                    
                    <div className="boss-header">
                      <div className="boss-title-wrap">
                        <span className="boss-warning">⚠️</span>
                        <span className="boss-title">МЕГА-ТРАК</span>
                      </div>
                      <span className="boss-level-badge">УР. {clanBoss.level}</span>
                    </div>
                    
                    <div className="boss-visual-container">
                      <div className="boss-tech-ring outer"></div>
                      <div className="boss-tech-ring inner"></div>
                      <div className="boss-shadow"></div>

                      <motion.div 
                        className={`boss-avatar ${isAttacking ? 'hit' : ''}`}
                        animate={isAttacking ? { x: [-5, 5, -5, 5, 0], filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'] } : { y: [0, -5, 0] }}
                        transition={isAttacking ? { duration: 0.3 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <img src="/images/boss.png" alt="Mega Tractor Boss" className="boss-img" />
                      </motion.div>
                      
                      <AnimatePresence>
                        {damagePopup && (
                          <motion.div 
                            key={damagePopup.id}
                            initial={{ opacity: 1, y: 0, scale: 0.5 }}
                            animate={{ opacity: 0, y: -80, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            className="damage-popup"
                          >
                            -{damagePopup.amount}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="spark s1"></div>
                      <div className="spark s2"></div>
                      <div className="spark s3"></div>
                      <div className="spark s4"></div>
                    </div>

                    <div className="boss-hp-wrap">
                      <div className="boss-hp-bar">
                        <div className="boss-hp-markers"></div>
                        <motion.div 
                          className={`boss-hp-fill ${bossHpPercent < 20 ? 'pulse-danger' : ''}`}
                          style={{ background: bossHpColor, boxShadow: `0 0 25px ${bossHpColor}` }}
                          initial={{ width: '100%' }} 
                          animate={{ width: `${bossHpPercent}%` }} 
                        >
                          <div className="boss-hp-gloss"></div>
                        </motion.div>
                      </div>
                      <div className="boss-hp-text">
                        <span className="hp-current">{clanBoss.currentHp.toLocaleString('ru-RU')}</span>
                        <span className="hp-max">/ {clanBoss.maxHp.toLocaleString('ru-RU')} HP</span>
                      </div>
                    </div>

                    <div className="boss-stats-grid">
                      <div className="boss-stat-card">
                        <span className="b-stat-label">НАГРАДА</span>
                        <span className="b-stat-value gold">{(clanBoss.level * 100000).toLocaleString('ru-RU')} ₵</span>
                      </div>
                      <div className="boss-stat-card">
                        <span className="b-stat-label">ТВОЙ УРОН</span>
                        <span className="b-stat-value green">~{((user?.clickLevel || 1) * 500 + (user?.rating || 100) * 10).toLocaleString('ru-RU')}</span>
                      </div>
                    </div>

                    <button 
                      className={`boss-attack-btn ${clanBoss.currentHp <= 0 ? 'disabled' : ''}`}
                      disabled={clanBoss.currentHp <= 0 || isAttacking || cooldown}
                      onClick={handleAttackBoss}
                    >
                      <div className="btn-bg"></div>
                      <span className="btn-content">
                        {clanBoss.currentHp <= 0 ? 'ВОССТАНОВЛЕНИЕ...' : (
                          <><span style={{ fontSize: '22px', marginRight: '10px' }}>⚔️</span> АТАКОВАТЬ</>
                        )}
                      </span>
                    </button>

                    <div className="boss-damage-list">
                      <div className="b-damage-title">
                        <span>🏆 ТОП УРОНА</span>
                      </div>
                      {bossDamageStats && bossDamageStats.length > 0 ? (
                        bossDamageStats.map((stat, index) => (
                          <div key={stat.userId} className={`b-damage-row ${stat.userId === user?.id ? 'is-me' : ''}`}>
                            <span className="b-damage-rank">{index + 1}</span>
                            <span className="b-damage-name">{stat.firstName || 'Игрок'}</span>
                            <span className="b-damage-val">{stat.damage.toLocaleString('ru-RU')}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ textAlign: 'center', color: '#8892b0', fontSize: '12px', padding: '10px' }}>Пока никто не бил босса</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#8892b0', marginTop: '50px' }}>Загрузка...</div>
                )}
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="chat-messages hide-scrollbar">
                  {clanMessages.length === 0 && (<div style={{ textAlign: 'center', color: '#8892b0', marginTop: '20px' }}>Сообщений нет. Будьте первым!</div>)}
                  {clanMessages.map((msg: any) => {
                    const isMe = msg.userId === user?.id;
                    return (
                      <div key={msg.id} className={`chat-bubble-wrap ${isMe ? 'me' : ''}`}>
                        {!isMe && <div className="chat-author">{msg.firstName || 'Игрок'}</div>}
                        <div className={`chat-bubble ${isMe ? 'me' : ''}`}>{msg.message}</div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-area">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Написать..." className="clan-input" style={{ marginBottom: 0 }} maxLength={200} />
                  <button className="btn-neon-cyan" onClick={handleSendMessage} style={{ padding: '0 20px' }}>➤</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="clan-tab-content hide-scrollbar">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                  <button className="btn-sm btn-neon-cyan" style={{ padding: '6px 12px' }} onClick={() => setActiveTab('main')}>← НАЗАД</button>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>Состав клана</h3>
                </div>
                <div className="members-list">
                  {clanMembers.map((m: any) => (
                    <div key={m.userId} className="member-row">
                      <div className="member-avatar">{m.firstName?.[0] || 'И'}</div>
                      <div className="member-info">
                        <span className="member-name">{m.firstName || 'Игрок'}{m.role === 'leader' && ' 👑'}{m.role === 'officer' && ' ⭐'}</span>
                        <span className="member-donate">Вклад: {m.contribution?.toLocaleString('ru-RU') || 0} ₵</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'manage' && (
              <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="clan-tab-content hide-scrollbar">
                <div className="members-list">
                  {clanMembers.filter((m: any) => m.userId !== user?.id).map((m: any) => (
                    <div key={m.userId} className="member-row manage">
                      <div className="member-info"><span className="member-name">{m.firstName || 'Игрок'}</span><span className="member-role">{m.role}</span></div>
                      <div className="member-actions">
                        {myRole === 'leader' && (<><button className="btn-sm btn-neon-cyan" onClick={() => clanAction('setRole', undefined, m.userId, 'officer')}>⭐</button><button className="btn-sm btn-neon-pink" onClick={() => clanAction('setRole', undefined, m.userId, 'member')}>👤</button><button className="btn-sm btn-neon-pink" onClick={() => { if(confirm('Передать лидерство?')) clanAction('transfer', undefined, m.userId); }}>👑</button></>)}
                        <button className="btn-sm btn-neon-red" onClick={() => { if(confirm('Кикнуть?')) clanAction('kick', undefined, m.userId); }}>✖</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-neon-red full-width" style={{ marginTop: '20px' }} onClick={() => { if(confirm('Выйти из клана?')) clanAction('leave').then(() => onClose()); }}>ВЫЙТИ ИЗ КЛАНА</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};