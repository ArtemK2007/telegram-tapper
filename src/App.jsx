import React, { useEffect } from 'react';

function App() {

  useEffect(() => {
    // 1. Функция блокировки зума колесом (Ctrl + Wheel)
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // 2. Функция блокировки зума кнопками (Ctrl + / Ctrl -)
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

    // Добавляем слушателей с параметром passive: false (важно для отмены событий)
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Очистка при выходе (хороший тон в React)
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="soon-container">
      <h1 className="title">
        SOON<span className="dots">...</span>
      </h1>
    </div>
  );
}

export default App;