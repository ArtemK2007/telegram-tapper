import React from "react";
import { motion } from "framer-motion";
import tapImage from "./assets/tap.png";
import { Coins } from "lucide-react";

export default function TapperScreen({ points, energy, handleTap, MAX_ENERGY }) {
  const energyPercent = (energy / MAX_ENERGY) * 100;

  return (
    <motion.div
      className="tapper-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ----------------- SCORE PANEL ----------------- */}
      <motion.div
        className="tapper-score-panel"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Coins className="tapper-coins-icon" size={22} />
        <div className="tapper-score-value">{points.toLocaleString()}</div>
      </motion.div>

      {/* ----------------- TAP BUTTON AREA ----------------- */}
      <div className="tapper-center">
        <motion.button
          className={`tapper-button ${energy <= 0 ? "disabled" : ""}`}
          onClick={handleTap}
          disabled={energy <= 0}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: energy <= 0 ? 0.95 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          {/* ---------- НЕОНОВЫЙ КРУГ ПОД КНОПКОЙ ---------- */}
          <div className="tapper-button-circle" />

          <motion.img
            src={tapImage}
            alt="tap"
            className="tapper-button-img"
            draggable="false"
            animate={{
              filter:
                energy <= 0
                  ? "drop-shadow(0px 0px 3px rgba(255,50,50,0.4))"
                  : "drop-shadow(0px 0px 6px rgba(150,170,255,0.5))",
            }}
          />
          <div className="tapper-button-glow" />
        </motion.button>
      </div>

      {/* ----------------- ENERGY BAR ----------------- */}
      <motion.div
        className="tapper-energy-panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="tapper-energy-header">
          <span>⚡ Энергия</span>
          <span>
            {energy} / {MAX_ENERGY}
          </span>
        </div>

        <div className="tapper-energy-bar">
          <motion.div
            className="tapper-energy-fill"
            initial={{ width: 0 }}
            animate={{ width: `${energyPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      <TapperCSS />
    </motion.div>
  );
}

/* ------------------ CSS INSIDE COMPONENT ------------------ */

function TapperCSS() {
  return (
    <style>{`

    /* WRAPPER */
    .tapper-wrapper {
      width: 100%;
      height: 100%;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* SCORE PANEL */
    .tapper-score-panel {
      margin-top: 10px;
      padding: 10px 22px;
      border-radius: 16px;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(14px);
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 0 15px rgba(150,170,255,0.25);
      width: max-content;
      margin-left: auto;
      margin-right: auto;
    }

    .tapper-coins-icon {
      color: #d8e0ff;
      filter: drop-shadow(0 0 6px rgba(150,170,255,0.8));
    }

    .tapper-score-value {
      font-size: 24px;
      font-weight: 600;
      color: white;
      text-shadow: 0 0 12px rgba(150,170,255,0.7);
    }

    /* TAP BUTTON */
    .tapper-center {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }

    .tapper-button {
      position: relative;
      border: none;
      background: transparent;
      padding: 0;
      cursor: pointer;
      border-radius: 50%;
      outline: none;
    }

    .tapper-button.disabled {
      opacity: 0.6;
    }

    .tapper-button-img {
      width: 200px;
      height: 200px;
      user-select: none;
    }

    .tapper-button-circle {
      position: absolute;
      inset: 0;
      margin: auto;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(140,179,255,0.3), rgba(140,179,255,0.05));
      z-index: -2; /* позади glow и картинки */
      filter: blur(30px);
    }

    .tapper-button-glow {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(150,170,255,0.4), transparent 70%);
      filter: blur(25px);
      z-index: -1;
      pointer-events: none;
    }

    /* ENERGY PANEL */
    .tapper-energy-panel {
      padding: 16px;
      border-radius: 16px;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: inset 0 0 12px rgba(150,170,255,0.2);
      margin-bottom: 15px;
    }

    .tapper-energy-header {
      font-size: 16px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      text-shadow: 0 0 6px rgba(150,170,255,0.7);
    }

    .tapper-energy-bar {
      width: 100%;
      height: 14px;
      border-radius: 10px;
      background: rgba(255,255,255,0.1);
      overflow: hidden;
      position: relative;
    }

    .tapper-energy-fill {
      height: 14px;
      border-radius: 10px;
      background: linear-gradient(90deg, #8cb3ff, #c8d4ff);
      box-shadow: 0 0 12px rgba(150,170,255,0.8);
    }

  `}</style>
  );
}
