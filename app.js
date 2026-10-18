document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    const userName = tg.initDataUnsafe?.user?.first_name || 'Пилот';
    const myId = tg.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;

    document.getElementById('user-name').textContent = `Пилот: ${userName}`;

    // === МАШИНЫ С НАДЕЖНЫХ ИСТОЧНИКОВ ===
    const CARS = [
        { id: 'f1',     name: 'Болид F1',     img: 'https://freepngimg.com/thumb/car/12-2-car-png-hd.png', price: 0,     bonus: 0 },
        { id: 'sport',  name: 'Спорткар',     img: 'https://freepngimg.com/thumb/car/1-2-car-png-clipart.png', price: 100,   bonus: 1 },
        { id: 'suv',    name: 'Внедорожник',  img: 'https://freepngimg.com/thumb/car/4-2-car-png.png', price: 500,   bonus: 3 },
        { id: 'taxi',   name: 'Дрифт-Такси',  img: 'https://freepngimg.com/thumb/car/6-2-car-png-file.png', price: 2000,  bonus: 8 },
        { id: 'police', name: 'Патруль',      img: 'https://freepngimg.com/thumb/car/7-2-car-png-image.png', price: 8000,  bonus: 20 },
        { id: 'race',   name: 'Гиперкар',     img: 'https://freepngimg.com/thumb/car/9-2-car-png-pic.png', price: 25000, bonus: 50 }
    ];

    const carImg = document.getElementById('car-img');
    const road = document.querySelector('.road');
    const moneyDisplay = document.getElementById('money-display');
    const clickPowerHint = document.getElementById('click-power-hint');
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

        // Обновляем цены в карточках улучшений
        enginePriceText.textContent = `Ур. ${gameState.engineLevel} · ${gameState.engineCost}💰`;
        btnEngine.disabled = gameState.money < gameState.engineCost;

        turboPriceText.textContent = gameState.autoTurbo > 0
            ? `Активно: +${gameState.autoTurbo}/сек`
            : `Цена: ${gameState.turboCost}💰`;
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
            
            // Добавляем onerror прямо в HTML-строку для надежности
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

    // === АНИМАЦИЯ ЕЗДЫ ===
    function playDriveAnimation() {
        carImg.classList.remove('driving');
        road.classList.remove('active');
        void carImg.offsetWidth; // Сброс анимации
        
        carImg.classList.add('driving');
        road.classList.add('active');

        setTimeout(() => {
            carImg.classList.remove('driving');
            road.classList.remove('active');
        }, 700);
    }

    clickButton.addEventListener('click', () => {
        const power = getClickPower();
        gameState.money += power;
        
        playDriveAnimation();
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

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