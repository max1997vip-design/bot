// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение на весь экран

// Получаем имя пользователя из Telegram
const userName = tg.initDataUnsafe?.user?.first_name || 'Игрок';
document.getElementById('user-name').textContent = `Привет, ${userName}!`;

// Получаем элементы
const scoreDisplay = document.getElementById('score-display');
const clickButton = document.getElementById('click-button');

// Загружаем сохраненный счет из localStorage
let score = parseInt(localStorage.getItem('clickerScore')) || 0;
scoreDisplay.textContent = score;

// Обработчик клика
clickButton.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    // Сохраняем счет
    localStorage.setItem('clickerScore', score);
    // Добавляем тактильный отклик (вибрацию), если доступно
    tg.HapticFeedback.impactOccurred('light');
});

// Сообщаем Telegram, что приложение готово
tg.ready();