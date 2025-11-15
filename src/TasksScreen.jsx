import React from "react";
import { motion } from "framer-motion";

export default function TasksScreen() {
  return (
    <div className="nc-tasks-wrapper">
      <motion.div
        className="nc-tasks-card"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* HEADER */}
        <div className="nc-tasks-header">
          <div className="nc-tasks-icon-pill">
            <svg
              className="nc-tasks-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 7H17M7 12H17M7 17H13"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="nc-tasks-text">
            <h2 className="nc-tasks-title">Задания</h2>
            <p className="nc-tasks-subtitle">
              Выполняй задания, чтобы ускорить фарм ARTR и увеличить доход.
            </p>
          </div>
        </div>

        {/* SKELETON TASKS */}
        <div className="nc-tasks-list">
          {[1, 2, 3].map((i) => (
            <div className="nc-task-skeleton" key={i}>
              <div className="nc-task-skeleton-icon" />
              <div className="nc-task-skeleton-content">
                <div className="nc-task-skeleton-line long" />
                <div className="nc-task-skeleton-line short" />
              </div>
              <div className="nc-task-skeleton-badge" />
            </div>
          ))}
        </div>

        <div className="nc-tasks-footer-note">
          Новые задания появятся скоро. Следи за обновлениями, чтобы не упустить бонусы.
        </div>
      </motion.div>

      <TasksPremiumCSS />
    </div>
  );
}

function TasksPremiumCSS() {
  return (
    <style>{`
      .nc-tasks-wrapper {
        width: 100%;
        height: 100%;
        padding: 6px 4px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nc-tasks-card {
        width: 100%;
        max-width: 460px;
        border-radius: 22px;
        padding: 18px 16px 16px;
        background: radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 55%),
                    rgba(10, 12, 22, 0.96);
        border: 1px solid rgba(255,255,255,0.06);
        box-shadow: 0 18px 40px rgba(0,0,0,0.9);
      }

      .nc-tasks-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .nc-tasks-icon-pill {
        width: 40px;
        height: 40px;
        border-radius: 14px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nc-tasks-icon {
        opacity: 0.9;
      }

      .nc-tasks-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .nc-tasks-title {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
      }

      .nc-tasks-subtitle {
        font-size: 13px;
        color: rgba(255,255,255,0.6);
      }

      .nc-tasks-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;
      }

      .nc-task-skeleton {
        display: flex;
        align-items: center;
        padding: 10px 10px;
        border-radius: 14px;
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.04);
        overflow: hidden;
        position: relative;
      }

      .nc-task-skeleton::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        transform: translateX(-100%);
        animation: ncTaskShine 1.8s infinite;
        opacity: 0.4;
      }

      @keyframes ncTaskShine {
        to {
          transform: translateX(100%);
        }
      }

      .nc-task-skeleton-icon {
        width: 34px;
        height: 34px;
        border-radius: 12px;
        background: rgba(255,255,255,0.06);
        margin-right: 10px;
      }

      .nc-task-skeleton-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .nc-task-skeleton-line {
        height: 8px;
        border-radius: 999px;
        background: rgba(255,255,255,0.14);
      }

      .nc-task-skeleton-line.long {
        width: 70%;
      }

      .nc-task-skeleton-line.short {
        width: 40%;
      }

      .nc-task-skeleton-badge {
        width: 52px;
        height: 22px;
        border-radius: 999px;
        background: rgba(124, 236, 255, 0.09);
        border: 1px solid rgba(124, 236, 255, 0.5);
        margin-left: 10px;
      }

      .nc-tasks-footer-note {
        font-size: 11px;
        color: rgba(255,255,255,0.5);
        margin-top: 4px;
      }

      @media (max-width: 400px) {
        .nc-tasks-card {
          padding: 16px 12px 14px;
        }

        .nc-tasks-title {
          font-size: 17px;
        }

        .nc-tasks-subtitle {
          font-size: 12px;
        }
      }
    `}</style>
  );
}
