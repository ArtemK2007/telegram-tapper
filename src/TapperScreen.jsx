import React, { useState } from "react";
import { motion } from "framer-motion";
import tapImage from "./assets/tap.png";

export default function TapperScreen({ points, energy, handleTap, MAX_ENERGY }) {
  const energyPercent = (energy / MAX_ENERGY) * 100;
  const [floaters, setFloaters] = useState([]);

  const spawnFloater = () => {
    const id = Math.random();
    const x = 50 + (Math.random() * 30 - 15);
    setFloaters((p) => [...p, { id, x }]);
    setTimeout(() => {
      setFloaters((p) => p.filter((f) => f.id !== id));
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
      {/* BALANCE + ARTR */}
      <div className="tap-dark-score">
        <div className="tap-dark-score-label">Баланс</div>
        <div className="tap-dark-score-row">
          <span className="tap-dark-score-value">
            {points.toLocaleString("ru-RU")}
          </span>
          <span className="tap-dark-score-token">ARTR</span>
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
            <div className="tap-dark-coin-inner">
              <motion.img
                src={tapImage}
                alt="tap"
                draggable="false"
                className="tap-dark-coin-img"
                animate={{ scale: energy <= 0 ? 0.97 : 1 }}
              />
            </div>
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

      /* SCORE */

      .tap-dark-score {
        align-self: center;
        text-align: left;
        padding: 8px 18px;
        border-radius: 999px;
        background: rgba(10, 12, 22, 0.95);
        border: 1px solid rgba(255,255,255,0.06);
        box-shadow: 0 10px 24px rgba(0,0,0,0.9);
        min-width: 200px;
      }

      .tap-dark-score-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: rgba(255,255,255,0.45);
        margin-bottom: 2px;
      }

      .tap-dark-score-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .tap-dark-score-value {
        font-size: 24px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: 0.03em;
      }

      .tap-dark-score-token {
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #cfd7ff;
        background: rgba(34, 40, 70, 0.9);
        border: 1px solid rgba(143, 166, 255, 0.5);
        box-shadow: 0 0 12px rgba(40, 80, 190, 0.45);
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
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(80,140,255,0.22), transparent 70%);
        filter: blur(20px);
        z-index: 0;
      }

      .tap-dark-coin {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 20%, #2f384a 0%, #111623 55%, #05070d 100%);
        box-shadow:
          0 10px 28px rgba(0,0,0,0.95),
          0 0 0 1px rgba(255,255,255,0.07);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .tap-dark-coin::before {
        content: "";
        position: absolute;
        inset: 12px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.14);
        box-shadow: inset 0 0 14px rgba(0,0,0,0.9);
        opacity: 0.95;
      }

      .tap-dark-coin-inner {
        width: 68%;
        height: 68%;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 20%, #3b4760 0%, #161b28 50%, #05070d 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .tap-dark-coin-inner::before {
        content: "";
        position: absolute;
        inset: 12%;
        border-radius: 50%;
        border-top: 2px solid rgba(255,255,255,0.06);
        border-left: 1px solid rgba(255,255,255,0.05);
        border-right: 1px solid rgba(0,0,0,0.85);
        border-bottom: 2px solid rgba(0,0,0,1);
        opacity: 0.7;
      }

      .tap-dark-coin-img {
        width: 52%;
        height: 52%;
        object-fit: contain;
        position: relative;
        z-index: 1;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.9));
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
          width: 165px;
          height: 165px;
        }

        .tap-dark-coin-aura {
          width: 180px;
          height: 180px;
        }

        .tap-dark-score-value {
          font-size: 22px;
        }
      }
    `}</style>
  );
}
