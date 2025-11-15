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
    }, 850);
  };

  const onTap = () => {
    if (energy > 0) {
      spawnFloater();
      handleTap();
    }
  };

  return (
    <motion.div
      className="tapper-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ЕДИНЫЙ ГОЛОГРАФИЧЕСКИЙ ФОН */}
      <div className="tapper-bg-grid" />

      {/* ----------------- SCORE PANEL (СНОВА ПЕРЕДЕЛАНО) ----------------- */}
      <motion.div
        className="tapper-score-panel"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Coins className="tapper-coins-icon" size={26} />
        <div className="tapper-score-value">{points.toLocaleString()}</div>
        
        {/* УДАЛИЛ: Голографический обвод */}
      </motion.div>

      {/* ----------------- TAP BUTTON AREA ----------------- */}
      <div className="tapper-center">
        <motion.button
          className={`tapper-button ${energy <= 0 ? "disabled" : ""}`}
          onClick={onTap}
          disabled={energy <= 0}
          whileTap={{ scale: 0.88 }}
          animate={{ scale: energy <= 0 ? 0.92 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          {/* ПЛАЗМЕННОЕ ЯДРО */}
          <div className="plasma-core" />

          {/* УДАРНАЯ ВОЛНА */}
          <motion.div
            className="tap-wave"
            animate={{ scale: [0.7, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 0.45 }}
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
                  ? "drop-shadow(0px 0px 8px rgba(255,50,50,0.8)) hue-rotate(20deg)"
                  : "drop-shadow(0px 0px 16px rgba(80,170,255,1))",
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
            animate={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.85 }}
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
          <span className="energy-header-text">⚡ ЭНЕРГИЯ</span>
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
    ГОЛОГРАФИЧЕСКИЙ ФОН
------------------------------------------------- */
.tapper-bg-grid {
  position: absolute;
  inset: 0;
  z-index: -5;

  background: radial-gradient(
    circle at 50% 20%,
    rgba(100,100,120,0.3) 0%,
    rgba(10,10,15,1) 45%,
    rgba(0,0,0,1) 100%
  );
  
  background-image:
    linear-gradient(rgba(100,150,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100,150,255,0.08) 1px, transparent 1px);
  background-size: 34px 34px;
  opacity: 0.35;
  filter: blur(0.5px);
  
  box-shadow: inset 0 0 50px rgba(0,0,0,0.8);
}


/* -------------------------------------------------
    SCORE PANEL (ПЕРЕДЕЛАННЫЙ ГЛЯНЦЕВЫЙ СЛИТОК)
------------------------------------------------- */
.tapper-score-panel {
  position: relative; 
  margin-top: 10px;
  padding: 12px 28px;
  border-radius: 20px;

  /* Небольшая, чистая прозрачность */
  background: rgba(255,255,255,0.1); 
  backdrop-filter: blur(18px); 

  display: flex;
  align-items: center;
  gap: 12px;

  /* Толстая, заметная рамка */
  border: 2px solid rgba(255,255,255,0.3); 
  
  box-shadow:
    inset 0 0 40px rgba(255,255,255,0.15), /* Мощный внутренний блик */
    0 8px 30px rgba(0,0,0,0.8); /* Глубокая тень */

  width: max-content;
  margin-left: auto;
  margin-right: auto;
  z-index: 10;
  overflow: hidden;
  
  /* Добавляем внутренний глянцевый градиент для объема */
  background-image: linear-gradient(
    180deg, 
    rgba(255,255,255,0.15) 0%, 
    rgba(255,255,255,0) 50%
  );
}

/* УДАЛИЛ: score-panel-glow-border и @keyframes glowMove */

.tapper-coins-icon {
  color: #aed9ff;
  opacity: 0.95;
  /* Усилил свечение иконки */
  filter: drop-shadow(0 0 10px rgba(135,206,250,1));
}

.tapper-score-value {
  font-size: 30px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
  /* Усилил свечение текста */
  text-shadow: 0 0 12px rgba(140,170,255,0.9);
}

/* -------------------------------------------------
    TAP BUTTON / REACTOR CORE (Размеры оставлены максимальными)
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
  touch-action: manipulation;
}

.tapper-button.disabled {
  opacity: 0.4;
  transition: 0.3s;
}

/* ПЛАЗМЕННОЕ ЯДРО (ВНУТРИ КНОПКИ) */
.plasma-core {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 350px; 
  height: 350px; 
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(50,150,255,0.35),
    rgba(0,0,0,0.5) 75%
  );
  filter: blur(55px);
  animation: corePulse 3s infinite alternate ease-in-out;
  z-index: -3;
}

@keyframes corePulse {
  0% { transform: scale(0.95); opacity: 0.55; }
  100% { transform: scale(1.25); opacity: 0.8; }
}

/* УДАРНАЯ ВОЛНА */
.tap-wave {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 350px; 
  height: 350px; 
  border-radius: 50%;
  border: 4px solid rgba(135,206,250,0.7);
  box-shadow: 0 0 25px rgba(135,206,250,0.5);
  z-index: -1;
}

/* НЕОНОВОЕ КОЛЬЦО */
.tapper-button-circle {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 300px;
  height: 300px;
  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(100,170,255,0.4) 0%,
    rgba(100,170,255,0.1) 60%,
    transparent 80%
  );

  filter: blur(45px);
  z-index: -2;
  opacity: 0.8;
}

/* КНОПКА / КАРТИНКА */
.tapper-button-img {
  width: 300px;
  height: 300px;
  user-select: none;
  z-index: 3;
  box-shadow: inset 0 0 20px rgba(255,255,255,0.1);
  border-radius: 50%;
}

/* ГЛОУ */
.tapper-button-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(150,170,255,0.4),
    transparent 80%
  );
  filter: blur(35px);
  z-index: -1;
}

/* -------------------------------------------------
    FLOATING +1
------------------------------------------------- */
.floater {
  position: absolute;
  font-size: 32px;
  font-weight: 800;
  color: #e0f0ff;
  text-shadow: 0 0 10px rgba(150,170,255,1);
  pointer-events: none;
}

/* -------------------------------------------------
    ENERGY BAR
------------------------------------------------- */
.tapper-energy-panel {
  padding: 16px;
  border-radius: 18px;

  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(24px);

  border: 1px solid rgba(255,255,255,0.1);
  box-shadow:
    inset 0 0 20px rgba(255,255,255,0.05),
    0 0 30px rgba(0,0,0,0.5);

  margin-bottom: 10px;
  z-index: 10;
}

.tapper-energy-header {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  letter-spacing: 0.6px;
}

.energy-header-text {
    text-shadow: 0 0 4px rgba(150,170,255,0.4);
}

.tapper-energy-bar {
  width: 100%;
  height: 18px;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255,255,255,0.1);
}

.tapper-energy-fill {
  height: 100%;
  border-radius: 12px;

  background: linear-gradient(
    90deg,
    #4a90e2 0%,
    #7bc0ff 100%
  );

  box-shadow:
    0 0 18px rgba(100,170,255,0.6),
    inset 0 0 10px rgba(255,255,255,0.2);
}

`}</style>
  );
}