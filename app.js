document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    // ====================================================
    // ВАШ TELEGRAM ID (Узнать можно у бота @userinfobot)
    // ====================================================
    const ADMIN_ID = '123456789'; // <-- ЗАМЕНИТЕ НА ВАШ ID!

    // --- КОНФИГУРАЦИЯ МАШИН ---
    const CARS = [
        { id: 'start', name: 'Старая классика', img: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png', price: 0, bonus: 0 },
        { id: 'sport', name: 'Спорткар', img: 'https://cdn-icons-png.flaticon.com/512/3204/3204071.png', price: 1000, bonus: 5 },
        { id: 'suv', name: 'Внедорожник', img: 'https://cdn-icons-png.flaticon.com/512/3097/3097192.png', price: 5000, bonus: 20 },
        { id: 'hyper', name: 'Гиперкар', img: 'https://cdn-icons-png.flaticon.com/512/3204/3204073.png', price: 25000, bonus: 100 }
    ];

    const DEFAULT_STATE = {
        money: 0, clickBase: 1, engineLevel: 1, engineCost: 10, autoIncome: 0,
        turboLevel: 0, turboCost: 50, ownedCars: ['start'], currentCar: 'start'
    };

    let state = JSON.parse(localStorage.getItem('turboClickerSave')) || DEFAULT_STATE;
    let isNitroActive = false;
    let nitroCooldown = false;

    // DOM
    const els = {
        money: document.getElementById('money-display'),
        userName: document.getElementById('user-name'),
        carImg: document.getElementById('car-img'),
        carContainer: document.getElementById('car-container'),
        clickPower: document.getElementById('click-power-display'),
        autoPower: document.getElementById('auto-power-display'),
        btnClick: document.getElementById('click-button'),
        btnNitro: document.getElementById('nitro-btn'),
        
        engineLevel: document.getElementById('engine-level'),
        enginePrice: document.getElementById('engine-price'),
        upgradeEngine: document.getElementById('upgrade-engine'),
        
        turboLevel: document.getElementById('turbo-level'),
        turboPrice: document.getElementById('turbo-price'),
        upgradeTurbo: document.getElementById('upgrade-turbo'),
        
        carsList: document.getElementById('cars-list'),
        leaderboardModal: document.getElementById('leaderboard-modal'),
        leaderboardList: document.getElementById('leaderboard-list'),
        closeLeaderboard: document.getElementById('close-leaderboard'),
        floatingTexts: document.getElementById('floating-texts'),

        // Профиль
        profileAvatar: document.getElementById('profile-avatar'),
        profileName: document.getElementById('profile-name'),
        profileId: document.getElementById('profile-id'),
        statTotalMoney: document.getElementById('stat-total-money'),
        statCars: document.getElementById('stat-cars'),
        
        // Админка
        adminPanel: document.getElementById('admin-panel')
    };

    // Инициализация профиля пользователя
    const user = tg.initDataUnsafe?.user;
    if (user) {
        els.userName.textContent = user.first_name;
        els.profileName.textContent = `${user.first_name} ${user.last_name || ''}`;
        els.profileId.textContent = `ID: ${user.id} ${user.username ? '(@' + user.username + ')' : ''}`;
        if (user.photo_url) {
            els.profileAvatar.src = user.photo_url;
        }

        // Проверка на Админа
        if (String(user.id) === ADMIN_ID) {
            els.adminPanel.classList.remove('hidden');
            initAdminPanel();
        }
    }

    // Логика
    function getCarBonus() { return CARS.find(c => c.id === state.currentCar).bonus; }
    function getTotalClickPower() {
        let power = state.clickBase + (state.engineLevel - 1) * 2 + getCarBonus();
        if (isNitroActive) power *= 10;
        return power;
    }

    function updateUI() {
        els.money.textContent = Math.floor(state.money).toLocaleString('ru-RU');
        els.clickPower.textContent = `+${getTotalClickPower()}`;
        els.autoPower.textContent = `+${state.autoIncome}/с`;
        
        els.engineLevel.textContent = state.engineLevel;
        els.enginePrice.textContent = `${state.engineCost} 💰`;
        els.upgradeEngine.style.opacity = state.money >= state.engineCost ? '1' : '0.5';

        els.turboLevel.textContent = state.turboLevel;
        els.turboPrice.textContent = `${state.turboCost} 💰`;
        els.upgradeTurbo.style.opacity = state.money >= state.turboCost ? '1' : '0.5';

        const currentCarData = CARS.find(c => c.id === state.currentCar);
        els.carImg.src = currentCarData.img;
        els.carImg.onerror = () => { els.carImg.src = 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png'; };

        // Обновление профиля
        els.statTotalMoney.textContent = Math.floor(state.money).toLocaleString('ru-RU');
        els.statCars.textContent = `${state.ownedCars.length} / ${CARS.length}`;

        renderGarage();
    }

    function renderGarage() {
        els.carsList.innerHTML = '';
        CARS.forEach(car => {
            const isOwned = state.ownedCars.includes(car.id);
            const isActive = state.currentCar === car.id;
            
            const card = document.createElement('div');
            card.className = `car-card ${isActive ? 'active' : ''}`;
            card.innerHTML = `
                <img src="${car.img}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3097/3097180.png'">
                <div class="car-card-info">
                    <h3>${car.name}</h3>
                    <p>+${car.bonus} к силе клика</p>
                </div>
                <button class="car-card-btn">
                    ${isActive ? 'Выбрана' : (isOwned ? 'Выбрать' : `${car.price} 💰`)}
                </button>
            `;

            card.addEventListener('click', () => {
                if (isActive) return;
                if (isOwned) {
                    state.currentCar = car.id;
                } else if (state.money >= car.price) {
                    state.money -= car.price;
                    state.ownedCars.push(car.id);
                    state.currentCar = car.id;
                    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
                } else { return; }
                saveGame(); updateUI();
            });
            els.carsList.appendChild(card);
        });
    }

    function saveGame() {
        localStorage.setItem('turboClickerSave', JSON.stringify(state));
        submitScore();
    }

    // Клик
    els.btnClick.addEventListener('click', () => {
        const earned = getTotalClickPower();
        state.money += earned;
        
        els.carContainer.classList.remove('tap-anim');
        void els.carContainer.offsetWidth;
        els.carContainer.classList.add('tap-anim');

        const floatEl = document.createElement('div');
        floatEl.className = 'floating-text';
        floatEl.textContent = `+${earned}`;
        floatEl.style.left = `calc(50% + ${(Math.random() - 0.5) * 60}px)`;
        floatEl.style.bottom = `120px`;
        
        els.floatingTexts.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 600);

        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        
        updateUI(); saveGame();
    });

    // Нитро
    els.btnNitro.addEventListener('click', () => {
        if (isNitroActive || nitroCooldown) return;
        isNitroActive = true; nitroCooldown = true;
        els.btnNitro.classList.add('active');
        els.btnNitro.disabled = true;
        updateUI();

        setTimeout(() => {
            isNitroActive = false;
            els.btnNitro.classList.remove('active');
            updateUI();
            setTimeout(() => {
                nitroCooldown = false;
                els.btnNitro.disabled = false;
            }, 5000);
        }, 10000);
    });

    // Улучшения
    els.upgradeEngine.addEventListener('click', () => {
        if (state.money >= state.engineCost) {
            state.money -= state.engineCost;
            state.engineLevel++;
            state.engineCost = Math.floor(state.engineCost * 1.8);
            updateUI(); saveGame();
        }
    });

    els.upgradeTurbo.addEventListener('click', () => {
        if (state.money >= state.turboCost) {
            state.money -= state.turboCost;
            state.turboLevel++;
            state.autoIncome += 1;
            state.turboCost = Math.floor(state.turboCost * 2);
            updateUI(); saveGame();
        }
    });

    // Автодоход
    setInterval(() => {
        if (state.autoIncome > 0) {
            state.money += state.autoIncome;
            updateUI();
        }
    }, 1000);

    // Навигация
    document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            if (tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
        });
    });

    // ==========================================
    // АДМИН ПАНЕЛЬ (Логика кнопок)
    // ==========================================
    function initAdminPanel() {
        document.getElementById('admin-add-money').onclick = () => {
            state.money += 1000000;
            updateUI(); saveGame();
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        };

        document.getElementById('admin-unlock-cars').onclick = () => {
            state.ownedCars = CARS.map(c => c.id);
            updateUI(); saveGame();
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        };

        document.getElementById('admin-reset').onclick = () => {
            if (confirm('Вы уверены, что хотите сбросить ВЕСЬ прогресс?')) {
                localStorage.removeItem('turboClickerSave');
                location.reload();
            }
        };
    }

    // --- СЕРВЕР (Сохранение и Лидерборд) ---
    let scoreTimeout;
    function submitScore() {
        if (!tg.initData) return;
        clearTimeout(scoreTimeout);
        scoreTimeout = setTimeout(async () => {
            try {
                await fetch('/api/score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ initData: tg.initData, money: Math.floor(state.money) })
                });
            } catch(e) {}
        }, 3000);
    }

    // Старт
    updateUI();
});