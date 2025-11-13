import React, { useState, useEffect } from 'react';
// 👇 1. ИМПОРТИРУЕМ КАРТИНКУ
import tapImage from './assets/tap.png'; 
import './App.css'; // Убедись, что стили подключены (или index.css)

function App() {
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('points');
    return saved ? parseInt(saved) : 0;
  });

  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('energy');
    return saved ? parseInt(saved) : 1000;
  });

  const MAX_ENERGY = 1000;

  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
  }, [points, energy]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => (prev < MAX_ENERGY ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    if (energy <= 0) return;
    setPoints((prev) => prev + 1);
    setEnergy((prev) => prev - 1);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  // ...
  // 3. Регенерация энергии (восстанавливаем 1 ед. каждую секунду)
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        if (prevEnergy < MAX_ENERGY) {
          return prevEnergy + 1;
        }
        return prevEnergy;
      });
    }, 1000); 

    return () => clearInterval(interval); 
  }, []);

  // 👇 НОВЫЙ БЛОК: 4. Блокировка масштабирования и зума
  useEffect(() => {
    // 1. Блокировка зума колесом (Ctrl + Wheel)
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // 2. Блокировка зума кнопками (Ctrl + / Ctrl -)
    const handleKeydown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) && // Ctrl или Cmd (на Mac)
        (e.key === '+' || e.key === '-' || e.key === '=')
      ) {
        e.preventDefault();
      }
    };

    // 3. Блокировка жестов на тачпадах/экранах (Pinch-to-zoom)
    const handleTouchMove = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Добавляем слушателей
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Очистка при выходе
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []); // Пустой массив зависимостей означает, что код выполнится один раз при старте
  
  // ... (Дальше идет handleTap и return)

  return (
    <div className="game-container">
      
      <div className="header">
        <span className="coin-icon">💎</span>
        <h1 className="score">{points.toLocaleString()}</h1>
      </div>

      <div className="tap-area">
        {/* 👇 2. КНОПКА ТЕПЕРЬ СОДЕРЖИТ КАРТИНКУ */}
        <button 
          className="tap-button" 
          onClick={handleTap}
          disabled={energy <= 0}
        >
          <img src={tapImage} alt="Tap Me" draggable="false" />
        </button>
      </div>

      <div className="footer">
        <div className="energy-text">
          <span>⚡ Energy</span>
          <span>{energy} / {MAX_ENERGY}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(energy / MAX_ENERGY) * 100}%` }}
          ></div>
        </div>
      </div>

    </div>
  );
}

export default App;