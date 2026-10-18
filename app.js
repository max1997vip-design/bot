document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    const userName = tg.initDataUnsafe?.user?.first_name || 'Игрок';
    const myId = tg.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;

    document.getElementById('user-name').textContent = `Привет, ${userName}!`;

    // === РЕАЛИСТИЧНЫЕ МАШИНЫ ===
    // Ссылки на PNG с прозрачным фоном
    const CARS = [
        { id: 'f1',     name: 'Болид F1',     img: 'https://pngimg.com/uploads/f1/f1_PNG14985.png', price: 0,     bonus: 0 },
        { id: 'sport',  name: 'Спорткар',     img: 'https://pngimg.com/uploads/porsche/porsche_PNG10625.png', price: 100,   bonus: 1 },
        { id: 'suv',    name: 'Внедорожник',  img: 'https://pngimg.com/uploads/suv/suv_PNG10034.png', price: 500,   bonus: 3 },
        { id: 'taxi',   name: 'Такси',        img: 'https://pngimg.com/uploads/taxi/taxi_PNG115.png', price: 2000,  bonus: 8 },
        { id: 'police', name: 'Патруль',      img: 'https://pngimg.com/uploads/police_car/police_car_PNG79.png', price: 8000,  bonus: 20 },
        { id: 'race',   name: 'Суперкар',     img: 'https://pngimg.com/uploads/ferrari/ferrari_PNG10276.png', price: 25000, bonus: 50 }
    ];

    const carImg = document.getElementById('car-img');
    const road = document.querySelector('.road');
    const moneyDisplay = document.getElementById('money-display');
    const clickPowerHint = document.getElementById('click-power-hint');
    const clickButton = document.getElementById('click-button');
    
    // Кнопки улучшений
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
        ownedCars: ['f1'],
        currentCar: 'f1'
    };

    let gameState = Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem('raceClickerSave') || '{}'));

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
        moneyDisplay.textContent = `💰 ${Math.floor(gameState.money)}`;
        clickPowerHint.textContent = `Сила клика: ${getClickPower()} · Автодоход: ${gameState.autoTurbo}/сек`;

        // Обновляем цены под картинками
        enginePriceText.textContent = `Цена: ${gameState.engineCost} (Клик: ${getClickPower()})`;
        btnEngine.disabled = gameState.money < gameState.engineCost;

        turboPriceText.textContent = gameState.autoTurbo > 0
            ? `Активно: +${gameState.autoTurbo}/сек`
            : `Цена: ${gameState.turboCost}`;
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
                <img src="${c.img}" alt="${c.name}">
                <span class="car-info">
                    <b>${c.name}</b>
                    <small>${owned ? (active ? '✅ Активна' : '👆 Выбрать') : `💰 ${c.price}`}</small>
                    ${c.bonus > 0 ? `<small class="bonus">+${c.bonus} к силе клика</small>` : ''}
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

    // === ЛОГИКА КЛИКА И 3D АНИМАЦИИ ===
    function playDriveAnimation() {
        carImg.classList.remove('driving');
        road.classList.remove('active');
        void carImg.offsetWidth; // Перезапуск анимации
        
        carImg.classList.add('driving');
        road.classList.add('active');

        setTimeout(() => {
            carImg.classList.remove('driving');
            road.classList.remove('active');
        }, 800);
    }

    clickButton.addEventListener('click', (e) => {
        const power = getClickPower();
        gameState.money += power;
        
        playDriveAnimation();
        
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

        updateUI();
        saveGame();
    });

    // === Магазин улучшений ===
    btnEngine.addEventListener('click', () => {
        if (gameState.money < gameState.engineCost) return;
        gameState.money -= gameState.engineCost;
        gameState.clickPower += 1;
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

    // === Автодоход ===
    setInterval(() => {
        if (gameState.autoTurbo > 0) {
            gameState.money += gameState.autoTurbo;
            playDriveAnimation();
            updateUI();
            saveGame();
        }
    }, 1000);

    // === Отправка очков на сервер ===
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

    // === Таблица лидеров ===
    leaderboardBtn.addEventListener('click', async () => {
        leaderboardModal.classList.remove('hidden');
        leaderboardList.textContent = 'Загрузка...';
        try {
            const r = await fetch('/api/leaderboard');
            const data = await r.json();
            if (!data.players || !data.players.length) {
                leaderboardList.textContent = 'Пока никого нет 😴';
                return;
            }
            leaderboardList.innerHTML = '';
            data.players.forEach((p, i) => {
                const row = document.createElement('div');
                row.className = 'leader-row' + (p.id === myId ? ' self' : '');
                row.innerHTML = `
                    <span class="rank">${['🥇','🥈','🥉'][i] || (i + 1)}</span>
                    <span class="name">${escapeHtml(p.name)}</span>
                    <span class="money">💰 ${p.money}</span>
                `;
                leaderboardList.appendChild(row);
            });
        } catch (e) {
            leaderboardList.textContent = 'Ошибка загрузки';
        }
    });

    closeLeaderboard.addEventListener('click', () => leaderboardModal.classList.add('hidden'));

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, ch => ({
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
        }[ch]));
    }

    // === Старт ===
    updateUI();
});