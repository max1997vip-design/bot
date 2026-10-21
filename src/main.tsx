// src/main.tsx (или src/App.tsx)
import './styles/loading.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './syltes/races.css';   
import './syltes/case.css';   

// Подключаем стили по порядку
import './styles/variables.css'; // Сначала переменные!
import './styles/base.css';
import './styles/animations.css';
import './styles/race.css';
import './styles/garage.css';
import './styles/profile.css';
import './styles/referral.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);