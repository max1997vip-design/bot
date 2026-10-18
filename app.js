document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    const userName = tg.initDataUnsafe?.user?.first_name || 'Пилот';
    const myId = tg.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;
    document.getElementById('user-name').textContent = `Пилот: ${userName}`;

    // === ВАШИ КАРТИНКИ ===
    // Замените пути в img на ваши локальные файлы (например, 'assets/cars/f1.png')
    const CARS = [
        { id: 'f1',     name: 'Болид F1',     img: 'https://cdn-icons-png.flaticon.com/512/3204/3204071.png', price: 0,     bonus: 0 },
        { id: 'sport',  name: 'Спорткар',     img: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png', price: 100,   bonus: 1 },
        { id: 'suv',    name: 'Внедорожник',  img: 'https://cdn-icons-png.flaticon.com/512/3097/3097192.png', price: 500,   bonus: 3 },
        { id: 'taxi',   name: 'Дрифт-Такси',  img: 'https://cdn-icons-png.flaticon.com/512/3097/3097185.png', price: 2000,  bonus: 8 },
        { id: 'police', name: 'Патруль',      img: 'https://cdn-icons-png.flaticon.com/512/3097/3097176.png', price: 8000,  bonus: 20 },
        { id: 'race',   name: 'Гиперкар',     img: 'https://cdn-icons-png.flaticon.com/512/3204/3204073.png', price: 25000, bonus: 50 }
    ];

    // DOM
    const trackView = document.getElementById('track-view');
    const carImg = document.getElementById('car-img');
    const road = document.getElementById('road');
    const speedLines = document.getElementById('speed-lines');
    const particlesContainer = document.getElementById('particles-container');
    const floatingTexts = document.getElementById('floating-texts');
    const moneyDisplay = document.getElementById('money-display');
    const clickPowerHint = document.getElementById('click-power-hint');
    const comboDisplay = document.getElementById('combo-display');
    const comboValue = document.getElementById('combo-value');
    const overdriveText = document.getElementById('overdrive-text');
    const distanceValue = document.getElementById('distance-value');
    const progressFill = document.getElementById('progress-fill');
    const clickButton = document.getElementById('click-button');

    // Модалки и магазин
    const offlineModal = document.getElementById('offline-modal');
    const offlineEarnings = document.getElementById('offline-earnings');
    const offlineTime = document.getElementById('offline-time');
    const claimOffline = document.getElementById('claim-offline');
    const btnEngine = document.getElementById('upgrade-engine');
    const btnTurbo = document.getElementById('upgrade-turbo');
    const enginePriceText = document.getElementById('engine-price');
    const turboPriceText = document.getElementById('turbo-price');
    const carsList = document.getElementById('cars-list');

    // Стейт
    const DEFAULT_STATE = {
        money: 0, clickPower: 1, autoTurbo: 0, engineCost: 10, turboCost: 50, engineLevel: 1,
        ownedCars: ['f1'], currentCar: 'f1', distance: 0, lastSaved: Date.now()
    };
    let gameState = Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem('raceClickerSave') || '{}'));

    let comboCount = 0;
    let lastClickTime = 0;
    let comboTimeout = null;
    const MAX_COMBO = 20;

    // === ОФФЛАЙН ДОХОД ===
    function checkOfflineIncome() {
        if (gameState.autoTurbo > 0 && gameState.lastSaved) {
            const now = Date.now();
            const diffSeconds = Math.floor((now - gameState.lastSaved) / 1000);
            
            // Максимум 4 часа оффлайна
            const earnedSeconds = Math.min(diffSeconds, 4 * 3600);
            const earnedMoney = earnedSeconds * gameState.autoTurbo;

            if (earnedMoney > 0) {
                offlineEarnings.textContent = `+${earnedMoney.toLocaleString('ru-RU')} 💰`;
                offlineTime.textContent = `за ${(earnedSeconds / 3600).toFixed(1)} ч.`;
                offlineModal.classList.remove('hidden');
                
                claimOffline.onclick = () => {
                    gameState.money += earnedMoney;
                    offlineModal.classList.add('hidden');
                    updateUI();
                    saveGame();
                };
            }
        }
    }

    function saveGame() {
        gameState.lastSaved = Date.now();
        localStorage.setItem('raceClickerSave', JSON.stringify(gameState));
        scheduleScoreSubmit();
    }

    function getCurrentCar() { return CARS.find(c => c.id === gameState.currentCar) || CARS[0]; }
    function getClickPower() { return gameState.clickPower + getCurrentCar().bonus; }

    function updateUI() {
        moneyDisplay.textContent = Math.floor(gameState.money).toLocaleString('ru-RU');
        clickPowerHint.textContent = `${getClickPower()}x`;

        // Дистанция (каждые 1000 метров = новый уровень)
        distanceValue.textContent = `${Math.floor(gameState.distance)} м`;
        const nextMilestone = Math.ceil(gameState.distance / 1000) * 1000;
        const prevMilestone = nextMilestone - 1000;
        const progressPercent = ((gameState.distance - prevMilestone) / 1000) * 100;
        progressFill.style.width = `${Math.max(0, progressPercent)}%`;

        enginePriceText.textContent = `Ур. ${gameState.engineLevel} · ${gameState.engineCost}💰`;
        btnEngine.disabled = gameState.money < gameState.engineCost;

        turboPriceText.textContent = gameState.autoTurbo > 0 ? `Активно: +${gameState.autoTurbo}/сек` : `Цена: ${gameState.turboCost}💰`;
        btnTurbo.disabled = gameState.money < gameState.turboCost || gameState.autoTurbo > 0;

        renderCars();
        carImg.src = getCurrentCar().img;
    }

    function renderCars() {
        carsList.innerHTML = '';
        CARS.forEach(c => {
            const owned = gameState.ownedCars.includes(c.id);
            const active = gameState.currentCar === c.id;
            const btn = document.createElement('button');
            btn.className = 'car-btn' + (active ? ' active' : '');
            btn.disabled = !owned && gameState.money < c.price;
            
            // Если картинки не грузятся, onerror вернет стандартную
            btn.innerHTML = `
                <img src="${c.img}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3204/3204071.png'">
                <span class="car-info">
                    <b>${c.name}</b>
                    <small>${owned ? (active ? '✅ В гараже' : '👆 Выбрать') : `Цена: ${c.price}💰`}</small>
                    ${c.bonus > 0 ? `<small class="bonus">+${c.bonus} к мощности</small>` : ''}
                </span>
            `;
            btn.onclick = () => {
                if (owned) gameState.currentCar = c.id;
                else if (gameState.money >= c.price) {
                    gameState.money -= c.price;
                    gameState.ownedCars.push(c.id);
                    gameState.currentCar = c.id;
                }
                updateUI(); saveGame();
            };
            carsList.appendChild(btn);
        });
    }

    function updateComboUI() {
        if (comboCount > 0) {
            comboValue.textContent = (1 + comboCount * 0.1).toFixed(1);
            comboDisplay.classList.remove('combo-hidden');
        } else {
            comboDisplay.classList.add('combo-hidden');
            trackView.classList.remove('overdrive');
            overdriveText.classList.add('hidden');
            speedLines.classList.remove('active');
        }

        // Включаем Overdrive при максимальном комбо
        if (comboCount >= MAX_COMBO) {
            trackView.classList.add('overdrive');
            overdriveText.classList.remove('hidden');
            speedLines.classList.add('active');
        }
    }

    // Клик
    clickButton.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime < 800) {
            if (comboCount < MAX_COMBO) comboCount++;
        } else {
            comboCount = 0;
        }
        lastClickTime = now;
        
        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => {
            comboCount = 0;
            updateComboUI();
        }, 1000);

        updateComboUI();

        const isOverdrive = comboCount >= MAX_COMBO;
        const isCrit = Math.random() < 0.15; // 15% шанс крита
        const critMult = isCrit ? 5 : 1;
        const overdriveMult = isOverdrive ? 2 : 1;
        const comboMult = 1 + (comboCount * 0.1);

        const earnedMoney = Math.floor(getClickPower() * comboMult * critMult * overdriveMult);
        gameState.money += earnedMoney;
        
        // Дистанция растет от кликов
        gameState.distance += getClickPower() * comboMult;

        // Визуал
        carImg.classList.remove('driving');
        void carImg.offsetWidth;
        carImg.classList.add('driving');
        
        if (isCrit || isOverdrive) {
            trackView.classList.remove('shake');
            void trackView.offsetWidth;
            trackView.classList.add('shake');
            setTimeout(() => trackView.classList.remove('shake'), 300);
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
        } else {
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        }

        // Всплывающий текст над машиной
        const el = document.createElement('div');
        el.className = `floating-text ${isCrit || isOverdrive ? 'crit' : ''}`;
        el.textContent = `+${earnedMoney}`;
        el.style.left = `${50 + (Math.random() * 20 - 10)}%`;
        el.style.top = `100px`;
        floatingTexts.appendChild(el);
        setTimeout(() => el.remove(), 800);

        updateUI();
        saveGame();
    });

    // Улучшения
    btnEngine.onclick = () => {
        if (gameState.money < gameState.engineCost) return;
        gameState.money -= gameState.engineCost;
        gameState.clickPower += 1;
        gameState.engineLevel += 1;
        gameState.engineCost = Math.floor(gameState.engineCost * 1.5);
        updateUI(); saveGame();
    };

    btnTurbo.onclick = () => {
        if (gameState.money < gameState.turboCost || gameState.autoTurbo > 0) return;
        gameState.money -= gameState.turboCost;
        gameState.autoTurbo = 1;
        updateUI(); saveGame();
    };

    // Автодоход
    setInterval(() => {
        if (gameState.autoTurbo > 0) {
            gameState.money += gameState.autoTurbo;
            gameState.distance += gameState.autoTurbo * 2;
            updateUI();
            saveGame();
        }
    }, 1000);

    // Сервер (лидерборд)
    let scoreTimer = null;
    function scheduleScoreSubmit() {
        if (!tg.initData) return;
        if (scoreTimer) return;
        scoreTimer = setTimeout(() => {
            scoreTimer = null;
            fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: tg.initData, money: Math.floor(gameState.money) })
            }).catch(()=>{});
        }, 4000);
    }

    document.getElementById('leaderboard-btn').onclick = async () => {
        const mod = document.getElementById('leaderboard-modal');
        const list = document.getElementById('leaderboard-list');
        mod.classList.remove('hidden');
        list.textContent = 'Загрузка...';
        try {
            const r = await fetch('/api/leaderboard');
            const data = await r.json();
            if (!data.players || !data.players.length) { list.textContent = 'Трасса пуста...'; return; }
            list.innerHTML = '';
            data.players.forEach((p, i) => {
                const row = document.createElement('div');
                row.className = 'leader-row' + (p.id === myId ? ' self' : '');
                row.innerHTML = `<span>#${i + 1} ${p.name}</span><span>💰 ${p.money.toLocaleString('ru-RU')}</span>`;
                list.appendChild(row);
            });
        } catch (e) { list.textContent = 'Ошибка сервера'; }
    };

    document.getElementById('close-leaderboard').onclick = () => document.getElementById('leaderboard-modal').classList.add('hidden');

    // Инициализация
    checkOfflineIncome();
    updateUI();
});