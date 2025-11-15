import React from 'react';
import './App.css';

export default function TasksScreen() {
  return (
    <div className="tasks-wrapper">

      {/* Фоновая сетка */}
      <div className="tasks-bg-grid"></div>

      <div className="tasks-card">

        {/* 3D ICON */}
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

        <h2 className="tasks-title">Задания скоро появятся</h2>
        <p className="tasks-subtitle">Список обновляется…</p>

        {/* SKELETON LIST */}
        <div className="tasks-skeleton-list">

          <div className="task-skeleton">
            <div className="task-skeleton-icon"></div>
            <div className="task-skeleton-lines">
              <div className="task-skeleton-line short"></div>
              <div className="task-skeleton-line long"></div>
            </div>
          </div>

          <div className="task-skeleton">
            <div className="task-skeleton-icon"></div>
            <div className="task-skeleton-lines">
              <div className="task-skeleton-line short"></div>
              <div className="task-skeleton-line long"></div>
            </div>
          </div>

          <div className="task-skeleton">
            <div className="task-skeleton-icon"></div>
            <div className="task-skeleton-lines">
              <div className="task-skeleton-line short"></div>
              <div className="task-skeleton-line long"></div>
            </div>
          </div>

        </div>

        {/* Pulse underline */}
        <div className="tasks-progress-pulse" />
      </div>

      <TasksCSS />
    </div>
  );
}

function TasksCSS() {
  return (
    <style>{`
    
    .tasks-wrapper {
      width: 100%;
      height: 100%;
      padding: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    /* GRID BACKGROUND */
    .tasks-bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 34px 34px;
      opacity: 0.2;
      pointer-events: none;
      z-index: -2;
    }

    /* CARD */
    .tasks-card {
      width: 92%;
      padding: 55px 18px 60px;
      border-radius: 26px;
      background: rgba(20,20,30,0.50);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,0.06);
      text-align: center;
      position: relative;
      overflow: hidden;
      animation: cardFadeIn .55s ease forwards;
      box-shadow: 0 0 35px rgba(100,120,255,0.18);
    }

    @keyframes cardFadeIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* 3D ICON */
    .tasks-icon-wrapper {
      width: 86px;
      height: 86px;
      border-radius: 26px;
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      position: relative;
      box-shadow: inset 0 0 25px rgba(120,150,255,0.2), 0 0 20px rgba(120,150,255,0.25);
      animation: iconPop .55s ease;
    }

    @keyframes iconPop {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .tasks-icon {
      filter: drop-shadow(0 0 10px rgba(150,170,255,0.8));
    }

    /* Glow behind icon */
    .tasks-icon-glow {
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(120,150,255,0.4), transparent 70%);
      filter: blur(40px);
      z-index: -1;
    }

    /* TITLE */
    .tasks-title {
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
      text-shadow: 0 0 10px rgba(150,180,255,0.7);
    }

    .tasks-subtitle {
      font-size: 15px;
      color: #aaa;
      margin-bottom: 26px;
    }

    /* SKELETON LIST */
    .tasks-skeleton-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin-top: 10px;
    }

    .task-skeleton {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
      background: rgba(255,255,255,0.04);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(12px);
      position: relative;
      overflow: hidden;
    }

    .task-skeleton::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
      animation: skeletonShine 1.8s infinite;
    }

    @keyframes skeletonShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .task-skeleton-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(255,255,255,0.08);
    }

    .task-skeleton-lines {
      flex: 1;
    }

    .task-skeleton-line {
      height: 10px;
      border-radius: 6px;
      background: rgba(255,255,255,0.12);
      margin-bottom: 6px;
    }

    .task-skeleton-line.short { width: 40%; }
    .task-skeleton-line.long { width: 70%; }

    /* PULSE LINE */
    .tasks-progress-pulse {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      width: 100%;
      background: linear-gradient(90deg, transparent, #8cb3ff, transparent);
      animation: progressPulse 2s infinite ease;
      opacity: 0.4;
    }

    @keyframes progressPulse {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    `}</style>
  );
}
