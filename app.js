document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    const userName = tg.initDataUnsafe?.user?.first_name || 'Игрок';
    const myId = tg.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;

    document.getElementById('user-name').textContent = `Привет, ${userName}!`;

    // === Машины ===
    const CARS = [
        { id: 'f1',     name: 'Болид',        emoji: '🏎️', price: 0,     bonus: 0,  color: '#ff3b30' },
        { id: 'sport',  name: 'Спорткар',     emoji: '🚗', price: 100,   bonus: 1,  color: '#ff2d55' },
        { id: 'suv',    name: 'Внедорожник',  emoji: '🚙', price: 500,   bonus: 3,  color: '#34c759' },
        { id: 'taxi',   name: 'Такси',        emoji: '🚕', price: 2000,  bonus: 8,  color: '#ffcc00' },
        { id: 'police', name: 'Патруль',      emoji: '🚓', price: 8000,  bonus: 20, color: '#007aff' },
        { id: 'race',   name: 'Гоночный',     emoji: '🏁', price: 25000, bonus: 50, color: '#af52de' }
    ];

    const car = document.getElementById('car');
    const moneyDisplay = document.getElementById('money-display');
    const clickPowerHint = document.getElementById('click-power-hint');
    const clickButton = document.getElementById('click-button');
    const btnEngine = document.getElementById('upgrade-engine');
    const btnTurbo = document.getElementById('upgrade-turbo');
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
        carPosition: 0,
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
        car.style.transform = `translateX(${gameState.carPosition}px)`;

        btnEngine.textContent = `⚙️ Двигатель (${gameState.engineCost})`;
        btnEngine.disabled = gameState.money < gameState.engineCost;

        btnTurbo.textContent = gameState.autoTurbo > 0
            ? `🔥 Турбо активно: +${gameState.autoTurbo}/сек`
            : `🔥 Купить турбо (${gameState.turboCost})`;
        btnTurbo.disabled = gameState.money < gameState.turboCost || gameState.autoTurbo > 0;

        renderCars();
        applyCarVisual();
    }

    function applyCarVisual() {
        const c = getCurrentCar();
        car.textContent = c.emoji;
        car.style.setProperty('--car-glow', c.color);
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
                <span class="car-emoji" style="--glow:${c.color}">${c.emoji}</span>
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

    // === Клик ===
    clickButton.addEventListener('click', (e) => {
        const power = getClickPower();
        gameState.money += power;
        gameState.carPosition += power * 2;

        const maxX = car.parentElement.clientWidth - 60;
        if (gameState.carPosition > maxX) gameState.carPosition = 0;

        spawnPopFloat(e, power);
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

        updateUI();
        saveGame();
    });

    function spawnPopFloat(e, amount) {
        const pop = document.createElement('div');
        pop.className = 'pop-float';
        pop.textContent = `+${amount}`;
        const rect = clickButton.getBoundingClientRect();
        pop.style.left = (e.clientX - rect.left - 15) + 'px';
        pop.style.top  = '10px';
        clickButton.parentElement.appendChild(pop);
        pop.style.position = 'fixed';
        pop.style.left = e.clientX + 'px';
        pop.style.top = e.clientY + 'px';
        setTimeout(() => pop.remove(), 800);
    }

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
            gameState.carPosition += gameState.autoTurbo * 2;
            const maxX = car.parentElement.clientWidth - 60;
            if (gameState.carPosition > maxX) gameState.carPosition = 0;
            updateUI();
            saveGame();
        }
    }, 1000);

    // === Отправка очков на сервер (троттлинг) ===
    let scoreTimer = null;
    function scheduleScoreSubmit() {
        if (!tg.initData) return;           // локально / вне Telegram — не шлём
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