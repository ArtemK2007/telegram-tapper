import React from 'react';
import { motion } from 'framer-motion'; // Импортируем motion для масштабирования

export default function TasksScreen() {
  return (
    <div className="tasks-wrapper">

      {/* Голографическая фоновая сетка */}
      <div className="tasks-bg-grid"></div>
      
      {/* 💥 ОБЕРТКА С МАСШТАБОМ 0.75 💥 */}
      <motion.div 
        className="tasks-scaled-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 0.75, opacity: 1 }} // Масштабирование до 0.75
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="tasks-card">

          {/* 3D ICON - Улучшенное неоновое свечение */}
          <div className="tasks-icon-wrapper">
            <div className="tasks-icon-glow"></div>
            <svg
              className="tasks-icon"
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 7H17M7 12H17M7 17H13"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Измененный заголовок и подзаголовок */}
          <h2 className="tasks-title">⚙️ ПОДГОТОВКА К ЗАПУСКУ</h2>
          <p className="tasks-subtitle">Получи максимум монет за выполнение следующих шагов:</p>

          {/* SKELETON LIST - Премиальная загрузка */}
          <div className="tasks-skeleton-list">

            {/* Увеличил количество скелетов для ощущения масштаба */}
            {[1, 2, 3].map((i) => (
              <div className="task-skeleton" key={i}>
                <div className="task-skeleton-icon"></div>
                <div className="task-skeleton-lines">
                  {/* Скелетные линии разных размеров для разнообразия */}
                  <div className={`task-skeleton-line ${i % 2 === 0 ? 'short' : 'long'}`}></div>
                  <div className={`task-skeleton-line ${i % 2 === 0 ? 'long' : 'short'}`}></div>
                </div>
              </div>
            ))}

          </div>

          {/* Pulse underline */}
          <div className="tasks-progress-pulse" />
        </div>
      </motion.div>
      {/* 💥 КОНЕЦ ОБЕРТКИ 💥 */}

      <TasksCSS />
    </div>
  );
}

function TasksCSS() {
  return (
    <style>{`
    
    /* === WRAPPER === */
    .tasks-wrapper {
      width: 100%;
      height: 100%;
      /* Убираем лишний padding, чтобы контент мог расширяться */
      padding: 0; 
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      overflow-y: auto; 
    }
    
    /* === SCALED CONTENT (НОВЫЙ КОНТЕЙНЕР ДЛЯ МАСШТАБА) === */
    .tasks-scaled-content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start; /* Выравниваем вверх, чтобы было место для скролла */
      padding: 50px 22px 20px 22px; /* Добавляем padding здесь, а не в wrapper */
      /* Центрирование и масштабирование будет обрабатывать framer-motion */
    }


    /* === 3D GRID BACKGROUND === */
    .tasks-bg-grid {
      position: absolute;
      inset: 0;
      /* Более контрастная и заметная сетка с голубым оттенком */
      background-image:
        linear-gradient(rgba(100,150,255,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(100,150,255,0.08) 1px, transparent 1px);
      background-size: 34px 34px;
      opacity: 0.35;
      pointer-events: none;
      z-index: -2;
      /* Добавляем легкое свечение для сетки */
      box-shadow: inset 0 0 50px rgba(0,0,0,0.8);
    }

    /* === CARD (Стекломорфизм) === */
    .tasks-card {
      width: 100%; 
      max-width: 450px;
      padding: 30px 18px 40px; 
      border-radius: 26px;
      
      /* Темный полупрозрачный фон + сильное размытие */
      background: rgba(10,10,25,0.7);
      backdrop-filter: blur(28px);
      border: 1px solid rgba(255,255,255,0.1);
      
      text-align: center;
      position: relative;
      overflow: hidden;
      /* Убрали анимацию cardFadeIn, т.к. ее заменила motion.div */
      
      /* Премиальное свечение карточки */
      box-shadow: 
        0 0 50px rgba(100,150,255,0.25), 
        inset 0 0 15px rgba(255,255,255,0.05); 
    }

    /* Удалили @keyframes cardFadeIn */

    /* === 3D ICON === */
    .tasks-icon-wrapper {
      width: 86px;
      height: 86px;
      border-radius: 26px;
      
      /* Глянцевый, приподнятый фон */
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255,255,255,0.15);
      
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      position: relative;
      
      /* Голографическое свечение и тень */
      box-shadow: 
        inset 0 0 25px rgba(135,206,250,0.3), 
        0 0 25px rgba(135,206,250,0.4); 
        
      animation: iconPop .55s ease;
    }

    @keyframes iconPop {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .tasks-icon {
      /* Интенсивное свечение иконки */
      filter: drop-shadow(0 0 12px rgba(135,206,250,1)); 
    }

    /* Glow behind icon */
    .tasks-icon-glow {
      position: absolute;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      /* Голубое неоновое свечение */
      background: radial-gradient(circle, rgba(135,206,250,0.6), transparent 70%);
      filter: blur(45px);
      z-index: -1;
      animation: glowPulse 4s infinite alternate ease-in-out;
    }

    @keyframes glowPulse {
      from { transform: scale(0.95); opacity: 0.5; }
      to { transform: scale(1.05); opacity: 0.7; }
    }

    /* === TITLE === */
    .tasks-title {
      font-size: 24px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 6px;
      /* Голубое неоновое свечение */
      text-shadow: 0 0 12px rgba(135,206,250,0.8), 0 0 2px rgba(255,255,255,0.5);
    }

    .tasks-subtitle {
      font-size: 15px;
      color: #aaa;
      margin-bottom: 30px; /* Увеличенный отступ */
    }

    /* === SKELETON LIST (Премиальная анимация загрузки) === */
    .tasks-skeleton-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 10px;
      width: 100%;
    }

    .task-skeleton {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      
      /* Более темный и прозрачный фон */
      background: rgba(255,255,255,0.03);
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(16px);
      
      position: relative;
      overflow: hidden;
      
      /* Тонкая неоновая рамка для скелета */
      box-shadow: 0 0 5px rgba(135,206,250,0.1);
    }

    /* Анимация "блеска" */
    .task-skeleton::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 50%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent); /* Более яркий блик */
      animation: skeletonShine 1.5s infinite; /* Более быстрое мерцание */
    }

    @keyframes skeletonShine {
      0% { transform: translateX(-150%); }
      100% { transform: translateX(300%); }
    }

    .task-skeleton-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: rgba(255,255,255,0.1);
      min-width: 44px;
    }

    .task-skeleton-lines {
      flex: 1;
    }

    .task-skeleton-line {
      height: 10px;
      border-radius: 6px;
      background: rgba(255,255,255,0.15); /* Чуть светлее */
      margin-bottom: 7px;
    }

    .task-skeleton-line.short { width: 45%; }
    .task-skeleton-line.long { width: 75%; }

    /* === PULSE LINE === */
    .tasks-progress-pulse {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      width: 100%;
      /* Яркое голубое свечение */
      background: linear-gradient(90deg, transparent, #87cefa, transparent);
      animation: progressPulse 2s infinite ease-in-out;
      opacity: 0.6;
      filter: blur(2px);
    }

    @keyframes progressPulse {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }

    `}</style>
  );
}