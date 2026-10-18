document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    const userName = tg.initDataUnsafe?.user?.first_name || 'Пилот';
    const myId = tg.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;

    document.getElementById('user-name').textContent = `Пилот: ${userName}`;

    const CARS = [
        { id: 'f1',     name: 'Болид F1',     img: 'https://freepngimg.com/thumb/car/12-2-car-png-hd.png', price: 0,     bonus: 0 },
        { id: 'sport',  name: 'Спорткар',     img: 'https://freepngimg.com/thumb/car/1-2-car-png-clipart.png', price: 100,   bonus: 1 },
        { id: 'suv',    name: 'Внедорожник',  img: 'https://freepngimg.com/thumb/car/4-2-car-png.png', price: 500,   bonus: 3 },
        { id: 'taxi',   name: 'Дрифт-Такси',  img: 'https://freepngimg.com/thumb/car/6-2-car-png-file.png', price: 2000,  bonus: 8 },
        { id: 'police', name: 'Патруль',      img: 'https://freepngimg.com/thumb/car/7-2-car-png-image.png', price: 8000,  bonus: 20 },
        { id: 'race',   name: 'Гиперкар',     img: 'https://freepngimg.com/thumb/car/9-2-car-png-pic.png', price: 25000, bonus: 50 }
    ];

    // DOM элементы
    const trackView = document.getElementById('track-view');
    const carImg = document.getElementById('car-img');
    const road = document.getElementById('road');
    const particlesContainer = document.getElementById('particles-container');
    const floatingTexts = document.getElementById('floating-texts');
    
    const moneyDisplay = document.getElementById('money-display');
    const clickPowerHint = document.getElementById('click-power-hint');
    
    const comboDisplay = document.getElementById('combo-display');
    const comboValue = document.getElementById('combo-value');
    
    const clickButton = document.getElementById('click-button');
    const btnEngine = document.getElementById('upgrade-engine');
    const btnTurbo = document.getElementById('upgrade-turbo');
    const enginePriceText = document.getElementById('engine-price');
    const turboPriceText = document.getElementById('turbo-price');

    const carsList = document.getElementById('cars-list');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const leaderboardModal = document.getElementById('leaderboard-modal');
    const leaderboardList = document.getElementById('leaderboard-list');
    const closeLeaderboard = document.getElementById('close-leaderboard');

    // === Стейт ===
    const DEFAULT_STATE = {
        money: 0,
        clickPower: 1,
        autoTurbo: 0,
        engineCost: 10,
        turboCost: 50,
        engineLevel: 1,
        ownedCars: ['f1'],
        currentCar: 'f1'
    };

    let gameState = Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem('raceClickerSave') || '{}'));

    // === Стейт Комбо ===
    let comboCount = 0;
    let lastClickTime = 0;
    let comboTimeout = null;
    const MAX_COMBO = 20; // Максимальный множитель x3 (20 * 0.1 + 1)

    function saveGame() {
        localStorage.setItem('raceClickerSave', JSON.stringify(gameState));
        scheduleScoreSubmit();
    }

    function getCurrentCar() {
        return CARS.find(c => c.id === gameState.currentCar) || CARS[0];
    }
    function getClickPower() {
        return gameState.clickPower + getCurrentCar().bonus;
    }

    // === UI ===
    function updateUI() {
        moneyDisplay.textContent = Math.floor(gameState.money).toLocaleString('ru-RU');
        clickPowerHint.textContent = `${getClickPower()}x`;

        enginePriceText.textContent = `Ур. ${gameState.engineLevel} · ${gameState.engineCost}💰`;
        btnEngine.disabled = gameState.money < gameState.engineCost;

        turboPriceText.textContent = gameState.autoTurbo > 0 ? `Активно: +${gameState.autoTurbo}/сек` : `Цена: ${gameState.turboCost}💰`;
        btnTurbo.disabled = gameState.money < gameState.turboCost || gameState.autoTurbo > 0;

        renderCars();
        applyCarVisual();
    }

    function applyCarVisual() {
        const c = getCurrentCar();
        carImg.src = c.img;
    }

    function renderCars() {
        carsList.innerHTML = '';
        CARS.forEach(c => {
            const owned = gameState.ownedCars.includes(c.id);
            const active = gameState.currentCar === c.id;
            const canBuy = !owned && gameState.money >= c.price;

            const btn = document.createElement('button');
            btn.className = 'car-btn' + (active ? ' active' : '');
            btn.disabled = !owned && !canBuy;
            
            btn.innerHTML = `
                <img src="${c.img}" alt="${c.name}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3204/3204071.png'">
                <span class="car-info">
                    <b>${c.name}</b>
                    <small>${owned ? (active ? '✅ В гараже' : '👆 Выбрать') : `Цена: ${c.price}💰`}</small>
                    ${c.bonus > 0 ? `<small class="bonus">+${c.bonus} к мощности</small>` : ''}
                </span>
            `;
            btn.addEventListener('click', () => selectOrBuyCar(c));
            carsList.appendChild(btn);
        });
    }

    function selectOrBuyCar(c) {
        if (gameState.ownedCars.includes(c.id)) {
            gameState.currentCar = c.id;
        } else if (gameState.money >= c.price) {
            gameState.money -= c.price;
            gameState.ownedCars.push(c.id);
            gameState.currentCar = c.id;
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        }
        updateUI();
        saveGame();
    }

    // === ВИЗУАЛЬНЫЕ ЭФФЕКТЫ ===
    function createFloatingText(x, y, amount, isCrit) {
        const el = document.createElement('div');
        el.className = `floating-text ${isCrit ? 'crit' : ''}`;
        el.textContent = `+${amount}`;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        floatingTexts.appendChild(el);
        setTimeout(() => el.remove(), 800);
    }

    function spawnParticles(isCrit) {
        const numParticles = isCrit ? 8 : 4;
        for (let i = 0; i < numParticles; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            // Случайное смещение по X
            const xOffset = (Math.random() - 0.5) * 60;
            p.style.setProperty('--x-dir', `${xOffset}px`);
            p.style.left = `calc(50% + ${xOffset}px)`;
            
            // Если крит, делаем частицы огненными (желтыми)
            if (isCrit) {
                p.style.background = '#ffd60a';
                p.style.width = '20px';
                p.style.height = '20px';
            }
            
            particlesContainer.appendChild(p);
            setTimeout(() => p.remove(), 500);
        }
    }

    function playDriveAnimation() {
        carImg.classList.remove('driving');
        road.classList.remove('active');
        void carImg.offsetWidth;
        
        carImg.classList.add('driving');
        road.classList.add('active');

        setTimeout(() => {
            carImg.classList.remove('driving');
            road.classList.remove('active');
        }, 600);
    }

    function triggerShake() {
        trackView.classList.remove('shake');
        void trackView.offsetWidth;
        trackView.classList.add('shake');
        setTimeout(() => trackView.classList.remove('shake'), 300);
    }

    function updateComboUI() {
        if (comboCount > 0) {
            const mult = (1 + comboCount * 0.1).toFixed(1);
            comboValue.textContent = mult;
            comboDisplay.classList.remove('combo-hidden');
        } else {
            comboDisplay.classList.add('combo-hidden');
        }
    }

    // === СИСТЕМА КЛИКОВ ===
    clickButton.addEventListener('click', (e) => {
        const now = Date.now();
        
        // Логика комбо
        if (now - lastClickTime < 800) {
            if (comboCount < MAX_COMBO) comboCount++;
        } else {
            comboCount = 0;
        }
        lastClickTime = now;
        
        // Сброс комбо через 1 секунду простоя
        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => {
            comboCount = 0;
            updateComboUI();
        }, 1000);
        
        updateComboUI();

        // Расчет крита
        const isCrit = Math.random() < 0.15; // 15% шанс
        const critMult = isCrit ? 5 : 1;
        const comboMult = 1 + (comboCount * 0.1);

        const basePower = getClickPower();
        const earnedMoney = Math.floor(basePower * comboMult * critMult);

        gameState.money += earnedMoney;
        
        // Визуальные эффекты
        playDriveAnimation();
        spawnParticles(isCrit);
        
        // Позиция для всплывающего текста (относительно трассы)
        const rect = clickButton.getBoundingClientRect();
        const trackRect = trackView.getBoundingClientRect();
        const textX = rect.left - trackRect.left + (Math.random() * 100 - 50); // Разброс
        const textY = rect.top - trackRect.top; // Над кнопкой

        createFloatingText(textX, textY, earnedMoney, isCrit);

        if (isCrit) {
            triggerShake();
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error'); // Сильная вибрация
        } else {
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        }

        updateUI();
        saveGame();
    });

    // === УЛУЧШЕНИЯ ===
    btnEngine.addEventListener('click', () => {
        if (gameState.money < gameState.engineCost) return;
        gameState.money -= gameState.engineCost;
        gameState.clickPower += 1;
        gameState.engineLevel += 1;
        gameState.engineCost = Math.floor(gameState.engineCost * 1.5);
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        updateUI();
        saveGame();
    });

    btnTurbo.addEventListener('click', () => {
        if (gameState.money < gameState.turboCost || gameState.autoTurbo > 0) return;
        gameState.money -= gameState.turboCost;
        gameState.autoTurbo = 1;
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        updateUI();
        saveGame();
    });

    // === АВТОДОХОД ===
    setInterval(() => {
        if (gameState.autoTurbo > 0) {
            gameState.money += gameState.autoTurbo;
            playDriveAnimation();
            updateUI();
            saveGame();
        }
    }, 1000);

    // === СЕРВЕР ===
    let scoreTimer = null;
    function scheduleScoreSubmit() {
        if (!tg.initData) return;
        if (scoreTimer) return;
        scoreTimer = setTimeout(() => {
            scoreTimer = null;
            submitScore();
        }, 4000);
    }

    async function submitScore() {
        try {
            await fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: tg.initData, money: Math.floor(gameState.money) })
            });
        } catch (e) { /* тихо */ }
    }

    // === ЛИДЕРЫ ===
    leaderboardBtn.addEventListener('click', async () => {
        leaderboardModal.classList.remove('hidden');
        leaderboardList.textContent = 'Загрузка...';
        try {
            const r = await fetch('/api/leaderboard');
            const data = await r.json();
            if (!data.players || !data.players.length) {
                leaderboardList.textContent = 'Трасса пуста...';
                return;
            }
            leaderboardList.innerHTML = '';
            data.players.forEach((p, i) => {
                const row = document.createElement('div');
                row.className = 'leader-row' + (p.id === myId ? ' self' : '');
                row.innerHTML = `
                    <span class="rank">#${i + 1}</span>
                    <span class="name">${escapeHtml(p.name)}</span>
                    <span class="money">💰 ${p.money.toLocaleString('ru-RU')}</span>
                `;
                leaderboardList.appendChild(row);
            });
        } catch (e) {
            leaderboardList.textContent = 'Ошибка связи с сервером';
        }
    });

    closeLeaderboard.addEventListener('click', () => leaderboardModal.classList.add('hidden'));

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, ch => ({
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
        }[ch]));
    }

    // === СТАРТ ===
    updateUI();
});