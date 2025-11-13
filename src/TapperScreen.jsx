import React from 'react';
import tapImage from './assets/tap.png'; 
import './App.css'; // Оставляем стили для UI

// TapperScreen получает все нужные данные и функции через props
export default function TapperScreen({ points, energy, handleTap, MAX_ENERGY }) {
  
  // Здесь мы убрали все useState и useEffect (они остаются в App.jsx)

  return (
    <div className="game-screen">
      
      {/* Верхняя панель: Монеты (БЕЗ ИКОНКИ, так как иконка будет в App.jsx) */}
      <div className="header">
        <h1 className="score">{points.toLocaleString()}</h1>
      </div>

      {/* Центр: Кнопка тапа */}
      <div className="tap-area">
        <button 
          className="tap-button" 
          onClick={handleTap}
          disabled={energy <= 0}
        >
          <img src={tapImage} alt="Tap Me" draggable="false" />
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