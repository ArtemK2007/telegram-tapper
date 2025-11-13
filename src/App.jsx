import React, { useState, useEffect } from 'react';
import tapImage from './assets/tap.png'; 
import './App.css'; 

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

  // 1. Сохранение данных в localStorage (Память)
  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
  }, [points, energy]);

  // 2. Регенерация энергии (восстанавливаем 1 ед. каждую секунду)
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
  }, []); // Выполняется один раз при старте

  // 3. Блокировка масштабирования и зума (Наш новый блок)
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        // console.log("!!! Z O O M attempt detected !!!"); // <-- Можно удалить после диагностики
        e.preventDefault();
      }
    };

    const handleKeydown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === '+' || e.key === '-' || e.key === '=')
      ) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []); // Выполняется один раз при старте
  
  // 4. Функция клика
  const handleTap = () => {
    if (energy <= 0) return;
    setPoints((prev) => prev + 1);
    setEnergy((prev) => prev - 1);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  return (
    <div className="game-container">
      
      <div className="header">
        <span className="coin-icon">💎</span>
        <h1 className="score">{points.toLocaleString()}</h1>
      </div>

      <div className="tap-area">
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