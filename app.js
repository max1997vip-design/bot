// Ждем загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    
    // Приветствие
    const userName = tg.initDataUnsafe?.user?.first_name || 'Игрок';
    document.getElementById('user-name').textContent = `Привет, ${userName}!`;

    // Элементы
    const car = document.getElementById('car');
    const moneyDisplay = document.getElementById('money-display');
    const clickButton = document.getElementById('click-button');
    const btnEngine = document.getElementById('upgrade-engine');
    const btnTurbo = document.getElementById('upgrade-turbo');

    // --- ИГРОВОЕ СОСТОЯНИЕ ---
    // Загружаем сохранение или начинаем с нуля
    let gameState = JSON.parse(localStorage.getItem('raceClickerSave')) || {
        money: 0,
        clickPower: 1,      // Сколько денег дает 1 клик
        autoTurbo: 0,       // Сколько денег капает в секунду
        carPosition: 0,     // Позиция машинки на треке (в пикселях)
        engineCost: 10,     // Цена улучшения двигателя
        turboCost: 50       // Цена турбо
    };

    // Функция для сохранения прогресса
    function saveGame() {
        localStorage.setItem('raceClickerSave', JSON.stringify(gameState));
    }

    // Функция для обновления интерфейса
    function updateUI() {
        moneyDisplay.textContent = `💰 ${Math.floor(gameState.money)}`;
        car.style.transform = `translateX(${gameState.carPosition}px)`;

        // Обновляем кнопки магазина
        btnEngine.textContent = `Улучшить двигатель (Цена: ${gameState.engineCost})`;
        btnEngine.disabled = gameState.money < gameState.engineCost;

        btnTurbo.textContent = gameState.autoTurbo > 0 
            ? `Турбо активно (Доход: ${gameState.autoTurbo}/сек)` 
            : `Купить турбо (Цена: ${gameState.turboCost})`;
        btnTurbo.disabled = gameState.money < gameState.turboCost || gameState.autoTurbo > 0;
    }

    // --- ОСНОВНАЯ МЕХАНИКА (КЛИК) ---
    clickButton.addEventListener('click', () => {
        // Начисляем деньги
        gameState.money += gameState.clickPower;
        
        // Двигаем машинку
        gameState.carPosition += gameState.clickPower * 2; // Визуальный сдвиг
        
        // Если машинка доехала до конца трека, возвращаем её в начало
        if (gameState.carPosition > (car.parentElement.clientWidth - 50)) {
            gameState.carPosition = 0;
        }

        // Виброотклик
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }

        updateUI();
        saveGame();
    });

    // --- МАГАЗИН УЛУЧШЕНИЙ ---
    
    // 1. Улучшение двигателя (больше денег за клик)
    btnEngine.addEventListener('click', () => {
        if (gameState.money >= gameState.engineCost) {
            gameState.money -= gameState.engineCost;
            gameState.clickPower += 1; // Увеличиваем силу клика
            gameState.engineCost = Math.floor(gameState.engineCost * 1.5); // Увеличиваем цену
            updateUI();
            saveGame();
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        }
    });

    // 2. Покупка турбо (автоматический доход)
    btnTurbo.addEventListener('click', () => {
        if (gameState.money >= gameState.turboCost && gameState.autoTurbo === 0) {
            gameState.money -= gameState.turboCost;
            gameState.autoTurbo = 1; // 1 монета в секунду
            updateUI();
            saveGame();
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        }
    });

    // --- АВТОМАТИЧЕСКИЙ ДОХОД (ТУРБО) ---
    setInterval(() => {
        if (gameState.autoTurbo > 0) {
            gameState.money += gameState.autoTurbo;
            // Автоматически двигаем машинку
            gameState.carPosition += gameState.autoTurbo * 2;
            if (gameState.carPosition > (car.parentElement.clientWidth - 50)) {
                gameState.carPosition = 0;
            }
            updateUI();
            saveGame();
        }
    }, 1000); // Выполняется каждую секунду

    // Инициализация
    updateUI();
    tg.ready();
});