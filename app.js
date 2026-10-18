document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    // --- КОНФИГУРАЦИЯ МАШИН (ЛОКАЛЬНЫЕ ПУТИ) ---
    // ВАЖНО: Когда скачаешь свои картинки, положи их в папку assets и замени ссылки!
    const CARS = [
        { id: 'start', name: 'Старая классика', img: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png', price: 0, bonus: 0 },
        { id: 'sport', name: 'Спорткар', img: 'https://cdn-icons-png.flaticon.com/512/3204/3204071.png', price: 1000, bonus: 5 },
        { id: 'suv', name: 'Внедорожник', img: 'https://cdn-icons-png.flaticon.com/512/3097/3097192.png', price: 5000, bonus: 20 },
        { id: 'hyper', name: 'Гиперкар', img: 'https://cdn-icons-png.flaticon.com/512/3204/3204073.png', price: 25000, bonus: 100 }
    ];

    // --- СОСТОЯНИЕ ИГРЫ ---
    const DEFAULT_STATE = {
        money: 0,
        clickBase: 1,
        engineLevel: 1,
        engineCost: 10,
        autoIncome: 0,
        turboLevel: 0,
        turboCost: 50,
        ownedCars: ['start'],
        currentCar: 'start'
    };

    let state = JSON.parse(localStorage.getItem('turboClickerSave')) || DEFAULT_STATE;
    
    // Нитро
    let isNitroActive = false;
    let nitroCooldown = false;

    // DOM Элементы
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
        leaderboardBtn: document.getElementById('btn-leaderboard'),
        leaderboardModal: document.getElementById('leaderboard-modal'),
        leaderboardList: document.getElementById('leaderboard-list'),
        closeLeaderboard: document.getElementById('close-leaderboard'),
        floatingTexts: document.getElementById('floating-texts')
    };

    // Имя пользователя
    if (tg.initDataUnsafe?.user?.first_name) {
        els.userName.textContent = tg.initDataUnsafe.user.first_name;
    }

    // --- ЛОГИКА ---
    function getCarBonus() {
        return CARS.find(c => c.id === state.currentCar).bonus;
    }

    function getTotalClickPower() {
        let power = state.clickBase + (state.engineLevel - 1) * 2 + getCarBonus();
        if (isNitroActive) power *= 10;
        return power;
    }

    function updateUI() {
        els.money.textContent = Math.floor(state.money).toLocaleString('ru-RU');
        els.clickPower.textContent = `+${getTotalClickPower()}`;
        els.autoPower.textContent = `+${state.autoIncome}/с`;
        
        // Обновление тюнинга
        els.engineLevel.textContent = state.engineLevel;
        els.enginePrice.textContent = `${state.engineCost} 💰`;
        els.upgradeEngine.style.opacity = state.money >= state.engineCost ? '1' : '0.5';

        els.turboLevel.textContent = state.turboLevel;
        els.turboPrice.textContent = `${state.turboCost} 💰`;
        els.upgradeTurbo.style.opacity = state.money >= state.turboCost ? '1' : '0.5';

        // Обновление машины
        const currentCarData = CARS.find(c => c.id === state.currentCar);
        els.carImg.src = currentCarData.img;
        els.carImg.onerror = () => { els.carImg.src = 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png'; }; // Заглушка

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
                } else {
                    return; // Не хватает денег
                }
                saveGame();
                updateUI();
            });
            els.carsList.appendChild(card);
        });
    }

    function saveGame() {
        localStorage.setItem('turboClickerSave', JSON.stringify(state));
        submitScore();
    }

    // --- КЛИКИ ---
    els.btnClick.addEventListener('click', (e) => {
        const earned = getTotalClickPower();
        state.money += earned;
        
        // Анимация машины
        els.carContainer.classList.remove('tap-anim');
        void els.carContainer.offsetWidth;
        els.carContainer.classList.add('tap-anim');

        // Всплывающий текст
        const floatEl = document.createElement('div');
        floatEl.className = 'floating-text';
        floatEl.textContent = `+${earned}`;
        
        // Позиция относительно трассы
        const rect = els.btnClick.getBoundingClientRect();
        const trackRect = els.carContainer.parentElement.getBoundingClientRect();
        floatEl.style.left = `calc(50% + ${(Math.random() - 0.5) * 60}px)`;
        floatEl.style.bottom = `120px`;
        
        els.floatingTexts.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 600);

        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        
        updateUI();
        saveGame();
    });

    // --- НИТРО ---
    els.btnNitro.addEventListener('click', () => {
        if (isNitroActive || nitroCooldown) return;

        isNitroActive = true;
        nitroCooldown = true;
        els.btnNitro.classList.add('active');
        els.btnNitro.disabled = true;
        updateUI();

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');

        // Конец действия нитро
        setTimeout(() => {
            isNitroActive = false;
            els.btnNitro.classList.remove('active');
            updateUI();
            
            // Кулдаун
            setTimeout(() => {
                nitroCooldown = false;
                els.btnNitro.disabled = false;
            }, 5000); // 5 секунд кулдаун для теста (можно увеличить)
            
        }, 10000); // 10 секунд действия
    });

    // --- УЛУЧШЕНИЯ ---
    els.upgradeEngine.addEventListener('click', () => {
        if (state.money >= state.engineCost) {
            state.money -= state.engineCost;
            state.engineLevel++;
            state.engineCost = Math.floor(state.engineCost * 1.8);
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            updateUI();
            saveGame();
        }
    });

    els.upgradeTurbo.addEventListener('click', () => {
        if (state.money >= state.turboCost) {
            state.money -= state.turboCost;
            state.turboLevel++;
            state.autoIncome += 1; // +1 к авто-доходу за уровень
            state.turboCost = Math.floor(state.turboCost * 2);
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            updateUI();
            saveGame();
        }
    });

    // --- АВТОДОХОД ---
    setInterval(() => {
        if (state.autoIncome > 0) {
            state.money += state.autoIncome;
            updateUI();
            // Не сохраняем в localStorage каждую секунду, только раз в 5 секунд (оптимизация)
        }
    }, 1000);

    // --- НАВИГАЦИЯ ---
    document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            // Кнопки
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Экраны
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            
            if (tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
        });
    });

    // --- ЛИДЕРБОРД ---
    els.leaderboardBtn.addEventListener('click', async () => {
        els.leaderboardModal.classList.remove('hidden');
        els.leaderboardList.innerHTML = 'Загрузка...';
        try {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            
            if (!data.players || data.players.length === 0) {
                els.leaderboardList.innerHTML = '<div style="text-align:center; padding: 20px; color: gray;">Пока никого нет</div>';
                return;
            }

            els.leaderboardList.innerHTML = '';
            data.players.forEach((p, i) => {
                const isSelf = p.id === String(tg.initDataUnsafe?.user?.id);
                const el = document.createElement('div');
                el.className = `leader-item ${isSelf ? 'self' : ''}`;
                el.innerHTML = `
                    <span class="name">#${i + 1} ${p.name}</span>
                    <span class="score">${p.money.toLocaleString('ru-RU')} 💰</span>
                `;
                els.leaderboardList.appendChild(el);
            });
        } catch (e) {
            els.leaderboardList.innerHTML = '<div style="text-align:center; padding: 20px; color: red;">Ошибка сети</div>';
        }
    });

    els.closeLeaderboard.addEventListener('click', () => {
        els.leaderboardModal.classList.add('hidden');
    });

    // --- СЕРВЕР ---
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
        }, 3000); // Отправляем раз в 3 секунды после последнего клика
    }

    // Старт
    updateUI();
});