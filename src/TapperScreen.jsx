import React, { useState } from "react";
import { motion } from "framer-motion";
import tapImage from "./assets/tap.png";
import { Coins } from "lucide-react";

export default function TapperScreen({ points, energy, handleTap, MAX_ENERGY }) {
  const energyPercent = (energy / MAX_ENERGY) * 100;

  // ------- ЛЕТАЮЩИЕ +1 ЭФФЕКТЫ -------
  const [floaters, setFloaters] = useState([]);

  const spawnFloater = () => {
    const id = Math.random();
    const x = 50 + (Math.random() * 40 - 20);
    setFloaters((p) => [...p, { id, x }]);
    setTimeout(() => {
      setFloaters((p) => p.filter((f) => f.id !== id));
    }, 900);
  };

  const onTap = () => {
    spawnFloater();
    handleTap();
  };

  return (
    <motion.div
      className="tapper-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ✔ ПАРАЛЛАКСОВЫЙ ПЛАЗМЕННЫЙ ФОН */}
      <div className="tapper-bg" />

      {/* ----------------- SCORE PANEL ----------------- */}
      <motion.div
        className="tapper-score-panel"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Coins className="tapper-coins-icon" size={24} />
        <div className="tapper-score-value">{points.toLocaleString()}</div>
      </motion.div>

      {/* ----------------- TAP BUTTON AREA ----------------- */}
      <div className="tapper-center">
        <motion.button
          className={`tapper-button ${energy <= 0 ? "disabled" : ""}`}
          onClick={onTap}
          disabled={energy <= 0}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: energy <= 0 ? 0.94 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          {/* ПЛАЗМЕННОЕ ЯДРО */}
          <div className="plasma-core" />

          {/* УДАРНАЯ ВОЛНА */}
          <motion.div
            className="tap-wave"
            animate={{ scale: [0.7, 1.6], opacity: [0.45, 0] }}
            transition={{ duration: 0.6 }}
            key={points}
          />

          {/* НЕОНОВОЕ КОЛЬЦО */}
          <div className="tapper-button-circle" />

          <motion.img
            src={tapImage}
            alt="tap"
            className="tapper-button-img"
            draggable="false"
            animate={{
              filter:
                energy <= 0
                  ? "drop-shadow(0px 0px 4px rgba(255,50,50,0.5))"
                  : "drop-shadow(0px 0px 10px rgba(80,170,255,0.9))",
            }}
          />

          {/* ОБЪЁМНОЕ СВЕЧЕНИЕ */}
          <div className="tapper-button-glow" />
        </motion.button>

        {/* ЛЕТАЮЩИЕ +1 */}
        {floaters.map((f) => (
          <motion.div
            key={f.id}
            className="floater"
            initial={{ opacity: 1, y: 0, x: f.x }}
            animate={{ opacity: 0, y: -90 }}
            transition={{ duration: 0.8 }}
          >
            +1
          </motion.div>
        ))}
      </div>

      {/* ----------------- ENERGY BAR ----------------- */}
      <motion.div
        className="tapper-energy-panel"
        initial={{ opacity: 0, y: 12 }}
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

/* === UNIVERSAL PREMIUM TON / NOTCOIN STYLE === */

body {
  overflow: hidden;
}

.tapper-wrapper {
  width: 100%;
  height: 100%;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

/* -------------------------------------------------
   ПЛАЗМЕННЫЙ АНИМИРОВАННЫЙ ФОН
------------------------------------------------- */
.tapper-bg {
  position: absolute;
  inset: 0;
  z-index: -5;

  background: radial-gradient(circle at 50% 70%, #0c1624, #05070c 70%);
  opacity: 1;
  filter: blur(4px);
}

.tapper-bg::before {
  content: "";
  position: absolute;
  inset: -40%;
  background: conic-gradient(
    from 0deg,
    rgba(0,150,255,0.15),
    rgba(0,0,0,0.1),
    rgba(0,150,255,0.25),
    rgba(0,0,0,0.1),
    rgba(0,150,255,0.15)
  );
  animation: spin 22s linear infinite;
  mix-blend-mode: screen;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* -------------------------------------------------
   SCORE PANEL
------------------------------------------------- */
.tapper-score-panel {
  margin-top: 10px;
  padding: 10px 26px;
  border-radius: 18px;

  background: rgba(255,255,255,0.05);
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
  color: #cdd8ff;
  opacity: 0.85;
  filter: drop-shadow(0 0 5px rgba(140,170,255,0.4));
}

.tapper-score-value {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
  text-shadow: 0 0 6px rgba(140,170,255,0.35);
}

/* -------------------------------------------------
   TAP BUTTON / REACTOR CORE
------------------------------------------------- */
.tapper-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  position: relative;
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

/* ПЛАЗМЕННОЕ ЯДРО (ВНУТРИ КНОПКИ) */
.plasma-core {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(50,150,255,0.25),
    rgba(0,0,0,0.4) 70%
  );
  filter: blur(35px);
  animation: corePulse 4s infinite ease-in-out;
  z-index: -3;
}

@keyframes corePulse {
  0% { transform: scale(1); opacity: 0.45; }
  50% { transform: scale(1.18); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0.45; }
}

/* УДАРНАЯ ВОЛНА */
.tap-wave {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 2px solid rgba(100,170,255,0.4);
  z-index: -1;
}

/* НЕОНОВОЕ КОЛЬЦО */
.tapper-button-circle {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 210px;
  height: 210px;
  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(100,170,255,0.35) 0%,
    rgba(100,170,255,0.05) 55%,
    transparent 75%
  );

  filter: blur(28px);
  z-index: -2;
  opacity: 0.6;
}

/* КНОПКА / КАРТИНКА */
.tapper-button-img {
  width: 210px;
  height: 210px;
  user-select: none;
  z-index: 3;
  filter: drop-shadow(0 6px 18px rgba(0,0,0,0.7));
}

/* ГЛОУ */
.tapper-button-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(150,170,255,0.3),
    transparent 70%
  );
  filter: blur(26px);
  z-index: -1;
}

/* -------------------------------------------------
   FLOATING +1
------------------------------------------------- */
.floater {
  position: absolute;
  font-size: 28px;
  font-weight: 700;
  color: #cfe2ff;
  text-shadow: 0 0 6px rgba(150,170,255,0.9);
  pointer-events: none;
}

/* -------------------------------------------------
   ENERGY BAR
------------------------------------------------- */
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
    rgba(140,200,255,0.9),
    rgba(180,210,255,0.65)
  );

  box-shadow:
    0 0 14px rgba(150,170,255,0.45),
    inset 0 0 10px rgba(150,170,255,0.3);
}

`}</style>
  );
}
