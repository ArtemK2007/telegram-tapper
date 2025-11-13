import React, { useState, useEffect } from 'react';

function App() {
  // 1. Состояние (State) - наша "оперативная память"
  // Читаем из localStorage при запуске, или ставим 0, если там пусто
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('points');
    return saved ? parseInt(saved) : 0;
  });

  // Энергия: макс 1000
  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('energy');
    return saved ? parseInt(saved) : 1000;
  });

  const MAX_ENERGY = 1000;

  // 2. Сохраняем данные в "память телефона" при каждом изменении
  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
  }, [points, energy]);

  // 3. Регенерация энергии (восстанавливаем 1 ед. каждую секунду)
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        if (prevEnergy < MAX_ENERGY) {
          return prevEnergy + 1;
        }
        return prevEnergy;
      });
    }, 1000); // 1000 мс = 1 секунда

    return () => clearInterval(interval); // Чистим таймер при выходе
  }, []);

  // 4. Функция клика (Тап)
  const handleTap = (e) => {
    // Если энергии нет - выходим
    if (energy <= 0) return;

    // Анимация клика (маленький визуальный эффект координат)
    // Тут можно добавить сложные анимации вылетающих цифр, пока просто логика

    // Обновляем состояния
    setPoints((prev) => prev + 1);
    setEnergy((prev) => prev - 1);

    // Вибрация телефона (работает на Android в Chrome/TG)
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
  };

  return (
    <div className="game-container">
      
      {/* Верхняя панель: Монеты */}
      <div className="header">
        <span className="coin-icon">💎</span>
        <h1 className="score">{points.toLocaleString()}</h1>
      </div>

      {/* Центр: Кнопка тапа */}
      <div className="tap-area">
        <button 
          className="tap-button" 
          onClick={handleTap}
          disabled={energy <= 0} // Блокируем, если нет энергии
        >
          TAP
        </button>
      </div>

      {/* Низ: Энергия */}
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