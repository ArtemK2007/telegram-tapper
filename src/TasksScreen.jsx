import React from 'react';
import './App.css';

export default function TasksScreen() {
  return (
    <div className="tasks-wrapper">

      <div className="tasks-card">
        <div className="tasks-glow" />
        <h2 className="tasks-title">Задания скоро появятся</h2>
        <p className="tasks-subtitle">Подготовься, будет жарко 🔥</p>
      </div>

      <TasksCSS />
    </div>
  );
}

/* ------------------ INLINE CSS (NOTCOIN PREMIUM) ------------------ */

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
      background: transparent;
    }

    .tasks-card {
      width: 92%;
      padding: 40px 20px;
      border-radius: 22px;
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255,255,255,0.08);
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 25px rgba(120,140,255,0.15);
    }

    .tasks-glow {
      position: absolute;
      top: -30%;
      left: -30%;
      width: 160%;
      height: 160%;
      background: radial-gradient(circle, rgba(120,150,255,0.14), transparent 70%);
      filter: blur(60px);
      z-index: -1;
    }

    .tasks-title {
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
      text-shadow: 0 0 12px rgba(150,180,255,0.6);
    }

    .tasks-subtitle {
      font-size: 16px;
      color: #bbb;
      letter-spacing: 0.3px;
      text-shadow: 0 0 6px rgba(150,180,255,0.3);
    }

    `}</style>
  );
}
