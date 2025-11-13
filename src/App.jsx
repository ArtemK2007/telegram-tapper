import React, { useState, useEffect } from 'react';
// Импорт клиента Supabase и нового модального окна
import { supabase } from './supabaseClient'; 
import TapperScreen from './TapperScreen';
import TasksScreen from './TasksScreen';
import coinIconImage from './assets/coin.png'; 
import NameModal from './NameModal'; // 👈 ИМПОРТ МОДАЛЬНОГО ОКНА
import './App.css'; 

function App() {
  // 1. СОСТОЯНИЕ (State)
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [activeView, setActiveView] = useState('tapper'); 
  
  // Флаги для авторизации
  const [needsName, setNeedsName] = useState(false); // 👈 ФЛАГ: Просит имя
  
  // [GAME STATE]
  const [points, setPoints] = useState(0); 
  const [energy, setEnergy] = useState(1000);
  const MAX_ENERGY = 1000;
  const [tapsSinceLastSave, setTapsSinceLastSave] = useState(0); 

  // 2. БЛОКИ USEEFFECT и ЛОГИКА

  // 2.1. АВТОРИЗАЦИЯ И ЗАГРУЗКА ДАННЫХ (Главный useEffect)
  useEffect(() => {
    async function getAuth() {
      // 1. Проверка существующей сессии (Supabase сам ищет токен в localStorage)
      const { data: { user: existingUser } } = await supabase.auth.getUser();

      if (existingUser) {
        setUser(existingUser);
        await loadPlayerData(existingUser.id);
      } else {
        // 2. Если сессии нет, создаем анонимного пользователя
        const { data: { user: newUser } } = await supabase.auth.signInAnonymously();
        if (newUser) {
          setUser(newUser);
          // Продолжаем логику в loadPlayerData, где проверим наличие записи в таблице players
          await loadPlayerData(newUser.id);
        } else {
          setLoading(false); 
        }
      }
    }

    async function loadPlayerData(userId) {
      // 3. Загрузка данных игрока из таблицы players
      const { data, error } = await supabase
        .from('players')
        .select(`username, points, energy_current`)
        .eq('id', userId)
        .single(); 

      if (data) {
        setPoints(data.points);
        setEnergy(data.energy_current);
        setNeedsName(false); // Данные найдены, модал не нужен
      } else if (error && error.code === 'PGRST116') { 
        // 🛑 Ошибка 'PGRST116' (404 Not Found) - Игрока нет в таблице players. Просим имя.
        setNeedsName(true); 
      }
      setLoading(false);
    }
    
    // Запускаем процесс авторизации при старте
    getAuth(); 
  }, []); 

  // 2.2. Функция, которая вызывается после ввода имени
  async function handleNameSubmit(username) {
      if (!user) return; 
      setLoading(true);
      await initializeNewPlayer(user.id, username); // Запускаем инициализацию с именем
  }

  // 2.3. Функция инициализации НОВОГО игрока
  async function initializeNewPlayer(userId, username) {
      const { error } = await supabase
          .from('players')
          .insert({ 
              id: userId, 
              username: username, // ✅ ИСПОЛЬЗУЕМ ВВЕДЕННОЕ ИМЯ
              points: 0, 
              energy_current: 1000
          });
      
      if (!error) {
          setPoints(0);
          setEnergy(1000);
          setNeedsName(false); // Скрываем модальное окно
      }
      setLoading(false);
  }

  // 2.4. Регенерация энергии
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => (prevEnergy < MAX_ENERGY ? prevEnergy + 1 : prevEnergy));
    }, 1000); 
    return () => clearInterval(interval); 
  }, []);

  // 2.5. Блокировка масштабирования 
  useEffect(() => {
    const handleWheel = (e) => { if (e.ctrlKey) e.preventDefault(); };
    const handleKeydown = (e) => { 
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=') ) e.preventDefault(); 
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

  // 2.6. Сохранение данных в базу данных с Debounce
  useEffect(() => {
    // ВЫХОД: Если буфер пуст ИЛИ user не загружен
    if (tapsSinceLastSave === 0 || !user || loading) return;

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
        .eq('id', user.id); 

      if (error) {
        console.error('Ошибка сохранения:', error);
      }
    };
    
    const timeoutId = setTimeout(saveToDatabase, 800); // 800 мс Debounce

    return () => clearTimeout(timeoutId);

  }, [tapsSinceLastSave, user]); // Следим только за тапами и пользователем

  // 3. Функция клика (handleTap)
  const handleTap = () => {
    if (energy <= 0) return;
    
    setPoints((prev) => prev + 1);
    setEnergy((prev) => prev - 1);
    setTapsSinceLastSave((prev) => prev + 1); 

    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };
  
  // 4. ГЛАВНЫЙ РЕНДЕРИНГ (УСЛОВИЯ)
  
  // 4.1. ЭКРАН ЗАГРУЗКИ
  if (loading || !user) {
    return (
      <div className="game-container app-shell" style={{justifyContent: 'center'}}>
        <h1 style={{color: 'var(--color-accent-cyan)'}}>Загрузка данных...</h1>
      </div>
    );
  }

  // 4.2. ЭКРАН ВВОДА ИМЕНИ
  if (needsName) {
      return <NameModal onSubmit={handleNameSubmit} isLoading={loading} />;
  }
  
  // 4.3. ФУНКЦИЯ РЕНДЕРИНГА ГЛАВНОГО КОНТЕНТА
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

  // 5. ОСНОВНОЙ UI ИГРЫ
  return (
    <div className="game-container app-shell">
      
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