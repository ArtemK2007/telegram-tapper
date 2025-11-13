import React, { useState, useEffect } from 'react';
// Импортируем обе страницы
import TapperScreen from './TapperScreen';
import TasksScreen from './TasksScreen';
import coinIconImage from './assets/coin.png'; 
import './App.css'; // Общие стили для всего

function App() {
  // 1. СОСТОЯНИЕ (State)
  // [ACTIVE VIEW] - Храним, какая страница активна
  const [activeView, setActiveView] = useState('tapper'); // Начинаем с тапалки

// [GAME STATE] - Вся логика игры остается здесь, чтобы работать в фоне
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('points');
    const parsedValue = parseInt(saved);
    // Если saved существует и parsedValue - это число, возвращаем его, иначе 0
    return (saved && !isNaN(parsedValue)) ? parsedValue : 0; 
  });

  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('energy');
    const parsedValue = parseInt(saved);
    // То же самое для энергии, но если нет, то 1000
    return (saved && !isNaN(parsedValue)) ? parsedValue : 1000;
  });
  const MAX_ENERGY = 1000;

  const [tapsSinceLastSave, setTapsSinceLastSave] = useState(0);

  // 2. ВСЕ USEEFFECT И ЛОГИКА ОСТАЮТСЯ ЗДЕСЬ

  // Сохранение данных в localStorage
  useEffect(() => {
    // 🛑 ИСПРАВЛЕНИЕ: Проверяем, что переменные не undefined перед вызовом .toString()
    if (points !== undefined && energy !== undefined) {
      localStorage.setItem('points', points.toString());
      localStorage.setItem('energy', energy.toString());
    }
  }, [points, energy]);

  // Регенерация энергии
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => (prevEnergy < MAX_ENERGY ? prevEnergy + 1 : prevEnergy));
    }, 1000); 
    return () => clearInterval(interval); 
  }, []);

  // Блокировка масштабирования (ВАЖНО! Оставляем здесь)
// 3. Сохранение данных в базу данных с Debounce
  useEffect(() => {
    // Если буфер пуст или пользователь еще не загружен, выходим
    if (tapsSinceLastSave === 0 || !user) return;

    // Функция, которая делает POST-запрос в Supabase
    const saveToDatabase = async () => {
      // Суммируем текущие очки и сбрасываем счетчик буфера
      const finalPoints = points; 
      const finalEnergy = energy;

      // Сбрасываем счетчик буфера *перед* отправкой, чтобы не было дублей
      setTapsSinceLastSave(0); 

      console.log(`Отправка в БД: ${finalPoints} pts, ${finalEnergy} energy`);

      // 🛑 Отправляем данные на сервер
      const { error } = await supabase
        .from('players')
        .update({ 
          points: finalPoints,
          energy_current: finalEnergy 
        })
        .eq('id', user.id); 

      if (error) {
        // Если ошибка, возвращаем очки обратно в буфер (упрощенная логика)
        console.error('Ошибка сохранения:', error);
        // setTapsSinceLastSave(prev => prev + (finalPoints - points)); 
      }
    };
    
    // 🛑 DEBOUNCE LOGIC: Таймер для отложенной отправки
    const timeoutId = setTimeout(saveToDatabase, 3000); // Отправляем через 3 секунды бездействия

    // Очистка таймера: если клик произошел снова, мы отменяем предыдущую отправку
    return () => clearTimeout(timeoutId);

  // Этот useEffect сработает, когда изменится tapsSinceLastSave, points или energy
  }, [tapsSinceLastSave, points, energy, user]);
  
  // Функция клика передается в TapperScreen
  const handleTap = () => {
    if (energy <= 0) return;
    
    // Увеличиваем монеты и тратим энергию (Локально)
    setPoints((prev) => prev + 1);
    setEnergy((prev) => prev - 1);
    
    // 👇 Увеличиваем счетчик кликов в буфере
    setTapsSinceLastSave((prev) => prev + 1); 

    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  // 3. ФУНКЦИЯ РЕНДЕРИНГА (РОУТЕР)
  const renderView = () => {
    if (activeView === 'tapper') {
      return (
        <TapperScreen 
          points={points} 
          energy={energy} 
          handleTap={handleTap} 
          MAX_ENERGY={MAX_ENERGY} 
        />
      );
    } else if (activeView === 'tasks') {
      return <TasksScreen />;
    }
  };

  return (
    <div className="game-container app-shell">
      
      {/* 4. ВЕРХНИЙ ИНТЕРФЕЙС (Общий для всех страниц) */}
      <div className="top-ui">
          <img src={coinIconImage} alt="Coin" className="coin-icon" />
          <div className="view-title">{activeView === 'tapper' ? 'Клик' : 'Задания'}</div>
      </div>

      {/* 5. ОБЛАСТЬ СТРАНИЦ */}
      <div className="content-area">
        {renderView()}
      </div>

      {/* 6. НИЖНЯЯ ПАНЕЛЬ НАВИГАЦИИ */}
      <div className="tab-bar">
        <button 
          className={`tab-button ${activeView === 'tapper' ? 'active' : ''}`}
          onClick={() => setActiveView('tapper')}
        >
          <span role="img" aria-label="tap">👆</span>
          Тапать
        </button>
        <button 
          className={`tab-button ${activeView === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveView('tasks')}
        >
          <span role="img" aria-label="tasks">📋</span>
          Задания
        </button>
      </div>
    </div>
  );
}

export default App;