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
        width: 280px; /* увеличено */
        height: 280px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(80,140,255,0.22), transparent 70%);
        filter: blur(24px);
        z-index: 0;
      }

      .tap-dark-coin {
        width: 250px; /* увеличено ~1.4x */
        height: 250px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 20%, #2f384a 0%, #111623 55%, #05070d 100%);
        box-shadow:
          0 14px 36px rgba(0,0,0,0.95),
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
        inset: 16px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.14);
        box-shadow: inset 0 0 16px rgba(0,0,0,0.9);
        opacity: 0.95;
      }

      .tap-dark-coin-inner {
        width: 72%;
        height: 72%;
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
        width: 92%;
        height: 92%;
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
          width: 210px;
          height: 210px;
        }

        .tap-dark-coin-aura {
          width: 240px;
          height: 240px;
        }
      }
    `}</style>
  );
}
