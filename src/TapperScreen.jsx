import React, { useState } from "react";
import { motion } from "framer-motion";
import tapImage from "./assets/tap.png";

export default function TapperScreen({ points, energy, handleTap, MAX_ENERGY }) {
  const energyPercent = (energy / MAX_ENERGY) * 100;
  const [floaters, setFloaters] = useState([]);

  const spawnFloater = () => {
    const id = Math.random();
    const x = 50 + (Math.random() * 30 - 15);
    setFloaters((prev) => [...prev, { id, x }]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== id));
    }, 700);
  };

  const onTap = () => {
    if (energy <= 0) return;
    spawnFloater();
    handleTap();
  };

  return (
    <motion.div
      className="tap-dark-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* BALANCE над кнопкой */}
      <div className="tap-dark-balance">
        <div className="tap-dark-balance-label">Баланс</div>
        <div className="tap-dark-balance-row">
          <span className="tap-dark-balance-value">
            {points.toLocaleString("ru-RU")}
          </span>
          <span className="tap-dark-balance-token">ARTR</span>
        </div>
      </div>

      {/* COIN */}
      <div className="tap-dark-center">
        <motion.button
          className={`tap-dark-coin-btn ${energy <= 0 ? "disabled" : ""}`}
          onClick={onTap}
          disabled={energy <= 0}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <div className="tap-dark-coin-aura" />
          <div className="tap-dark-coin">
            <motion.img
              src={tapImage}
              alt="tap"
              draggable="false"
              className="tap-dark-coin-img"
              animate={{ scale: energy <= 0 ? 0.97 : 1 }}
            />
          </div>
        </motion.button>

        {floaters.map((f) => (
          <motion.div
            key={f.id}
            className="tap-dark-floater"
            initial={{ opacity: 0.9, y: 0, x: `${f.x}%` }}
            animate={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.7 }}
          >
            +1
          </motion.div>
        ))}
      </div>

      {/* ENERGY */}
      <div className="tap-dark-energy">
        <div className="tap-dark-energy-head">
          <span className="tap-dark-energy-title">Энергия</span>
          <span className="tap-dark-energy-value">
            {energy} / {MAX_ENERGY}
          </span>
        </div>
        <div className="tap-dark-energy-bar">
          <motion.div
            className="tap-dark-energy-fill"
            initial={{ width: 0 }}
            animate={{ width: `${energyPercent}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>

      <TapDarkCSS />
    </motion.div>
  );
}

function TapDarkCSS() {
  return (
    <style>{`
      .tap-dark-wrapper {
        width: 100%;
        height: 100%;
        padding: 8px 6px 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      /* BALANCE над монетой */

      .tap-dark-balance {
        align-self: center;
        margin-bottom: 4px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(10, 12, 22, 0.96);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 10px 24px rgba(0,0,0,0.9);
        min-width: 0;
      }

      .tap-dark-balance-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: rgba(255,255,255,0.45);
        margin-bottom: 2px;
      }

      .tap-dark-balance-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .tap-dark-balance-value {
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
      }

      .tap-dark-balance-token {
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #cfd7ff;
        background: rgba(34, 40, 70, 0.9);
        border: 1px solid rgba(143, 166, 255, 0.5);
      }

      /* COIN */

      .tap-dark-center {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .tap-dark-coin-btn {
        border: none;
        background: transparent;
        padding: 0;
        cursor: pointer;
        outline: none;
        position: relative;
      }

      .tap-dark-coin-btn.disabled {
        cursor: default;
        opacity: 0.55;
      }

      .tap-dark-coin-aura {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(80,140,255,0.16), transparent 70%);
        filter: blur(24px);
        z-index: 0;
      }

      .tap-dark-coin {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: #111623;
        box-shadow:
          0 16px 40px rgba(0,0,0,0.95),
          0 0 0 1px rgba(255,255,255,0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .tap-dark-coin::before {
        content: "";
        position: absolute;
        inset: 10px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.10);
        opacity: 0.9;
      }

      .tap-dark-coin-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: relative;
        z-index: 1;
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.95));
      }

      /* FLOATERS */

      .tap-dark-floater {
        position: absolute;
        font-size: 18px;
        font-weight: 600;
        color: #e5ecff;
      }

      /* ENERGY */

      .tap-dark-energy {
        padding: 10px 12px 6px;
        border-radius: 16px;
        background: rgba(7, 9, 18, 0.96);
        border: 1px solid rgba(255,255,255,0.06);
        box-shadow: 0 10px 24px rgba(0,0,0,0.9);
      }

      .tap-dark-energy-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 12px;
      }

      .tap-dark-energy-title {
        font-weight: 600;
        color: #ffffff;
      }

      .tap-dark-energy-value {
        color: rgba(255,255,255,0.7);
      }

      .tap-dark-energy-bar {
        width: 100%;
        height: 8px;
        border-radius: 999px;
        background: rgba(255,255,255,0.04);
        overflow: hidden;
      }

      .tap-dark-energy-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #4a8cff 0%, #7cecff 100%);
        box-shadow: 0 0 16px rgba(90,150,255,0.6);
      }

      @media (max-width: 400px) {
        .tap-dark-coin {
          width: 260px;
          height: 260px;
        }

        .tap-dark-coin-aura {
          width: 280px;
          height: 280px;
        }
      }
    `}</style>
  );
}
