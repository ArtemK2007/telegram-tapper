import React, { useState, useEffect } from 'react';
// 1. ИМПОРТ SUPABASE КЛИЕНТА
import { supabase } from './supabaseClient'; 
import TapperScreen from './TapperScreen';
import TasksScreen from './TasksScreen';
import coinIconImage from './assets/coin.png'; 
import './App.css'; 

function App() {
  // 1. СОСТОЯНИЕ (State)
  // 👇 НОВОЕ: User и Loading состояния для Supabase
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  
  const [activeView, setActiveView] = useState('tapper'); 

  // [GAME STATE]
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('points');
    const parsedValue = parseInt(saved);
    return (saved && !isNaN(parsedValue)) ? parsedValue : 0; 
  });

  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('energy');
    const parsedValue = parseInt(saved);
    return (saved && !isNaN(parsedValue)) ? parsedValue : 1000;
  });
  const MAX_ENERGY = 1000;

  const [tapsSinceLastSave, setTapsSinceLastSave] = useState(0); 

  // 2. БЛОКИ USEEFFECT и ЛОГИКА

  // 2.1. АВТОРИЗАЦИЯ И ЗАГРУЗКА ДАННЫХ (Главный useEffect)
  useEffect(() => {
    async function getAuth() {
      // 1. Авторизация (signInAnonymously - временно, для TWA)
      const { data: { user } } = await supabase.auth.signInAnonymously();

      if (user) {
        setUser(user);
        await loadPlayerData(user.id);
      } else {
        setLoading(false); 
      }
    }

    async function loadPlayerData(userId) {
      // 2. Загрузка данных игрока
      const { data, error } = await supabase
        .from('players')
        .select(`points, energy_current`)
        .eq('id', userId)
        .single(); 

      if (data) {
        setPoints(data.points);
        setEnergy(data.energy_current);
      } else if (error && error.code === 'PGRST116') { // Игрок не найден
        await initializeNewPlayer(userId);
      }
      setLoading(false);
    }
    
    async function initializeNewPlayer(userId) {
      const { error } = await supabase
        .from('players')
        .insert({ 
          id: userId, 
          username: 'Anonymous', 
          points: 0, 
          energy_current: 1000
        });
      
      if (!error) {
        setPoints(0);
        setEnergy(1000);
      }
    }

    getAuth(); // Запускаем процесс авторизации при старте
  }, []); 

  // 2.2. Регенерация энергии
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => (prevEnergy < MAX_ENERGY ? prevEnergy + 1 : prevEnergy));
    }, 1000); 
    return () => clearInterval(interval); 
  }, []);

  // 2.3. Блокировка масштабирования (ВОССТАНОВЛЕНО!)
  useEffect(() => {
    const handleWheel = (e) => { if (e.ctrlKey) e.preventDefault(); };
    const handleKeydown = (e) => { 
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) e.preventDefault(); 
    };
    const handleTouchMove = (e) => { if (e.touches.length > 1) e.preventDefault(); };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 2.4. Сохранение данных в базу данных с Debounce
  useEffect(() => {
    // ВЫХОД: Если буфер пуст ИЛИ user не загружен
    if (tapsSinceLastSave === 0 || !user) return;

    const saveToDatabase = async () => {
      const finalPoints = points; 
      const finalEnergy = energy;

      setTapsSinceLastSave(0); // Сбрасываем буфер

      console.log(`Отправка в БД: ${finalPoints} pts, ${finalEnergy} energy`);

      // 🛑 Отправляем данные на сервер
      const { error } = await supabase
        .from('players')
        .update({ 
          points: finalPoints,
          energy_current: finalEnergy 
        })
        .eq('id', user.id); // 👈 ИСПОЛЬЗУЕМ user.id!

      if (error) {
        console.error('Ошибка сохранения:', error);
      }
    };
    
    const timeoutId = setTimeout(saveToDatabase, 3000); // Отправляем через 3 секунды

    return () => clearTimeout(timeoutId);

  // Следим за user, tapsSinceLastSave, points, energy
  }, [tapsSinceLastSave, points, energy, user]); 

  // 3. Функция клика (handleTap)
  const handleTap = () => {
    if (energy <= 0) return;
    
    setPoints((prev) => prev + 1);
    setEnergy((prev) => prev - 1);
    setTapsSinceLastSave((prev) => prev + 1); 

    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };
  
  // 4. ЭКРАН ЗАГРУЗКИ
  if (loading || !user) {
    return (
      <div className="game-container app-shell" style={{justifyContent: 'center'}}>
        <h1 style={{color: 'var(--color-accent-cyan)'}}>Загрузка данных...</h1>
      </div>
    );
  }

  // 5. ФУНКЦИЯ РЕНДЕРИНГА (РОУТЕР)
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
      
      {/* 6. РЕНДЕРИНГ ОСНОВНОГО UI (УДАЛЕНО СОХРАНЕНИЕ В localStorage) */}
      <div className="top-ui">
          <img src={coinIconImage} alt="Coin" className="coin-icon" />
          <div className="view-title">{activeView === 'tapper' ? 'Клик' : 'Задания'}</div>
      </div>

      <div className="content-area">
        {renderView()}
      </div>

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