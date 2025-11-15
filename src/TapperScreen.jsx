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

    /* === PREMIUM NOTCOIN BLACK STYLE === */

    .tapper-wrapper {
      width: 100%;
      height: 100%;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* ----------------------------------------------
       SCORE PANEL — премиальное черное стекло
    ---------------------------------------------- */
    .tapper-score-panel {
      margin-top: 10px;
      padding: 10px 26px;
      border-radius: 18px;

      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(22px);

      display: flex;
      align-items: center;
      gap: 10px;

      border: 1px solid rgba(255,255,255,0.06);

      box-shadow:
        inset 0 0 20px rgba(255,255,255,0.03),
        0 4px 20px rgba(0,0,0,0.6);

      width: max-content;
      margin-left: auto;
      margin-right: auto;
    }

    .tapper-coins-icon {
      color: #fff;
      opacity: 0.85;
      filter: drop-shadow(0 0 6px rgba(255,255,255,0.25));
    }

    .tapper-score-value {
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.3px;
      text-shadow: 0 0 6px rgba(255,255,255,0.2);
    }

    /* ----------------------------------------------
       TAP BUTTON — монета как в NOTCOIN
    ---------------------------------------------- */
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
      opacity: 0.35;
      transition: 0.2s;
    }

    /* Монетка */
    .tapper-button-img {
      width: 210px;
      height: 210px;
      user-select: none;
      filter: drop-shadow(0 6px 18px rgba(0,0,0,0.7));
    }

    /* Подсветка круга под монетой (тонкая как у Notcoin) */
    .tapper-button-circle {
      position: absolute;
      inset: 0;
      margin: auto;
      width: 200px;
      height: 200px;
      border-radius: 50%;

      background: radial-gradient(
        circle,
        rgba(255,255,255,0.22) 0%,
        rgba(255,255,255,0.05) 55%,
        transparent 75%
      );

      filter: blur(28px);
      z-index: -2;
      opacity: 0.5;
    }

    /* Легкое premium-glow */
    .tapper-button-glow {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: radial-gradient(circle,
        rgba(255,255,255,0.25),
        transparent 70%
      );
      filter: blur(25px);
      z-index: -1;
      pointer-events: none;
      opacity: 0.55;
    }

    /* ----------------------------------------------
       ENERGY BAR — минимализм HK/Notcoin
    ---------------------------------------------- */

    .tapper-energy-panel {
      padding: 18px;
      border-radius: 18px;

      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(20px);

      border: 1px solid rgba(255,255,255,0.06);
      box-shadow:
        inset 0 0 20px rgba(255,255,255,0.03),
        0 0 20px rgba(0,0,0,0.4);

      margin-bottom: 10px;
    }

    .tapper-energy-header {
      font-size: 15px;
      color: rgba(255,255,255,0.85);
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      letter-spacing: 0.4px;
    }

    .tapper-energy-bar {
      width: 100%;
      height: 16px;
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      overflow: hidden;
      position: relative;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .tapper-energy-fill {
      height: 16px;
      border-radius: 12px;

      background: linear-gradient(
        90deg,
        rgba(255,255,255,0.9),
        rgba(255,255,255,0.65)
      );

      box-shadow:
        0 0 14px rgba(255,255,255,0.45),
        inset 0 0 10px rgba(255,255,255,0.3);
    }

  `}</style>
  );
}
