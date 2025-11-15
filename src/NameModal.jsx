import React, { useState } from "react";

export default function NameModal({ onSubmit, isLoading }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && !isLoading) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="nm-overlay">
      <form onSubmit={handleSubmit} className="nm-card">
        <div className="nm-header">
          <div className="nm-icon-pill">
            <span className="nm-icon-circle">AR</span>
          </div>
          <div className="nm-header-text">
            <h2 className="nm-title">Создание профиля</h2>
            <p className="nm-subtitle">
              Укажи имя, под которым будешь фармить ARTR.
            </p>
          </div>
        </div>

        <div className="nm-field-block">
          <label className="nm-label" htmlFor="nm-name">
            Имя игрока
          </label>
          <input
            id="nm-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, ARTREX"
            required
            minLength={2}
            maxLength={20}
            className="nm-input"
            disabled={isLoading}
          />
          <div className="nm-hint">
            Можно изменить позже. Минимум 2, максимум 20 символов.
          </div>
        </div>

        <button
          type="submit"
          className="nm-button"
          disabled={isLoading || name.trim().length < 2}
        >
          {isLoading ? "Сохраняем..." : "Продолжить"}
        </button>

        <NameModalCSS />
      </form>
    </div>
  );
}

function NameModalCSS() {
  return (
    <style>{`
      .nm-overlay {
        position: fixed;
        inset: 0;
        /* убираем чёрный фон */
        background: transparent;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 16px;
        z-index: 50;
        pointer-events: none; /* чтобы клики шли только по карточке */
      }

      .nm-card {
        pointer-events: auto; /* кликабельная только карточка */
        width: 100%;
        max-width: 420px;
        border-radius: 22px;
        padding: 18px 18px 16px;
        background: radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 55%),
                    rgba(10, 12, 22, 0.98);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 24px 50px rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .nm-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;
      }

      .nm-icon-pill {
        width: 42px;
        height: 42px;
        border-radius: 16px;
        background: rgba(18,20,34,1);
        border: 1px solid rgba(255,255,255,0.06);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nm-icon-circle {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 20%, #2f384a 0%, #111623 55%, #05070d 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: #cfd7ff;
      }

      .nm-header-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .nm-title {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      }

      .nm-subtitle {
        font-size: 13px;
        color: rgba(255,255,255,0.6);
        margin: 0;
      }

      .nm-field-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .nm-label {
        font-size: 12px;
        color: rgba(255,255,255,0.75);
      }

      .nm-input {
        width: 100%;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(5,7,15,0.9);
        color: #ffffff;
        font-size: 14px;
        outline: none;
        transition: border-color 0.16s ease-out, box-shadow 0.16s ease-out, background 0.16s ease-out;
      }

      .nm-input::placeholder {
        color: rgba(255,255,255,0.28);
      }

      .nm-input:focus {
        border-color: rgba(124, 236, 255, 0.8);
        box-shadow: 0 0 0 1px rgba(124, 236, 255, 0.6), 0 0 16px rgba(0,0,0,0.9);
        background: rgba(8,10,20,1);
      }

      .nm-input:disabled {
        opacity: 0.6;
      }

      .nm-hint {
        font-size: 11px;
        color: rgba(255,255,255,0.45);
      }

      .nm-button {
        margin-top: 4px;
        width: 100%;
        border: none;
        border-radius: 999px;
        padding: 10px 14px;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        cursor: pointer;
        color: #05070d;
        background: linear-gradient(90deg, #4a8cff 0%, #7cecff 100%);
        box-shadow: 0 12px 28px rgba(0,0,0,0.9);
        transition: transform 0.12s ease-out, box-shadow 0.12s ease-out, opacity 0.12s ease-out;
      }

      .nm-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 16px 36px rgba(0,0,0,0.95);
      }

      .nm-button:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 10px 24px rgba(0,0,0,0.9);
      }

      .nm-button:disabled {
        opacity: 0.6;
        cursor: default;
      }

      @media (max-width: 400px) {
        .nm-card {
          padding: 16px 14px 14px;
        }

        .nm-title {
          font-size: 17px;
        }

        .nm-subtitle {
          font-size: 12px;
        }
      }
    `}</style>
  );
}
