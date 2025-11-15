import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import TapperScreen from "./TapperScreen";
import TasksScreen from "./TasksScreen";
import NameModal from "./NameModal";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------ SAFE TELEGRAM API ------------------ */
const tg = window.Telegram?.WebApp ?? {
  ready: () => {},
  expand: () => {},
  disableVerticalSwipes: () => {},
  setHeaderColor: () => {},
  setBackgroundColor: () => {},
  colorScheme: "dark",
  HapticFeedback: { impactOccurred: () => {} },
};

tg.ready();
tg.expand();
tg.disableVerticalSwipes();

/* ------------------ MAIN APP ------------------ */

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState("tapper");

  const [needsName, setNeedsName] = useState(false);

  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const MAX_ENERGY = 1000;

  const [tapsSinceLastSave, setTapsSinceLastSave] = useState(0);

  /* ------------------ AUTH + LOAD DATA ------------------ */
  useEffect(() => {
    async function authenticate() {
      const { data: authData } = await supabase.auth.getUser();

      if (authData?.user) {
        setUser(authData.user);
        loadPlayer(authData.user.id);
      } else {
        const { data: newAuth } = await supabase.auth.signInAnonymously();
        if (newAuth?.user) {
          setUser(newAuth.user);
          loadPlayer(newAuth.user.id);
        } else {
          setLoading(false);
        }
      }
    }

    async function loadPlayer(id) {
      const { data, error } = await supabase
        .from("players")
        .select("username, points, energy_current")
        .eq("id", id)
        .single();

      if (data) {
        setPoints(data.points);
        setEnergy(data.energy_current);
        setNeedsName(false);
      } else if (error && error.code === "PGRST116") {
        setNeedsName(true);
      }

      setLoading(false);
    }

    authenticate();
  }, []);

  /* ------------------ NAME SUBMIT ------------------ */
  async function handleNameSubmit(username) {
    if (!user) return;

    setLoading(true);

    const { data: exists } = await supabase
      .from("players")
      .select("username")
      .eq("username", username);

    if (exists?.length > 0) {
      alert("Имя уже занято.");
      setLoading(false);
      return;
    }

    await supabase.from("players").insert({
      id: user.id,
      username,
      points: 0,
      energy_current: 1000,
    });

    setPoints(0);
    setEnergy(1000);
    setNeedsName(false);
    setLoading(false);
  }

  /* ------------------ ENERGY REGEN ------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((e) => (e < MAX_ENERGY ? e + 1 : e));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ------------------ BLOCK ZOOM ------------------ */
  useEffect(() => {
    const handleWheel = (e) => e.ctrlKey && e.preventDefault();
    const handleKey = (e) =>
      (e.ctrlKey || e.metaKey) &&
      ["+", "-", "="].includes(e.key) &&
      e.preventDefault();
    const handleTouch = (e) => e.touches.length > 1 && e.preventDefault();

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKey);
    document.addEventListener("touchmove", handleTouch, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  /* ------------------ SAVE DATA w/ DEBOUNCE ------------------ */
  useEffect(() => {
    if (!user || tapsSinceLastSave === 0) return;

    const timeout = setTimeout(async () => {
      setTapsSinceLastSave(0);

      await supabase
        .from("players")
        .update({
          points: points,
          energy_current: energy,
        })
        .eq("id", user.id);
    }, 800);

    return () => clearTimeout(timeout);
  }, [tapsSinceLastSave]);

  /* ------------------ TAP HANDLER ------------------ */
  const handleTap = () => {
    if (energy <= 0) return;

    setPoints((p) => p + 1);
    setEnergy((e) => e - 1);
    setTapsSinceLastSave((x) => x + 1);

    tg.HapticFeedback.impactOccurred("medium");
  };

  /* ------------------ UI STATES ------------------ */
  if (loading || !user)
    return (
      <NeonBackground>
        <CenterMessage text="Загрузка..." />
      </NeonBackground>
    );

  if (needsName)
    return (
      <NeonBackground>
        <NameModal onSubmit={handleNameSubmit} isLoading={loading} />
      </NeonBackground>
    );

  /* ------------------ MAIN VIEW ------------------ */
  const renderView = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ width: "100%", height: "100%" }}
        >
          {activeView === "tapper" && (
            <TapperScreen
              points={points}
              energy={energy}
              MAX_ENERGY={MAX_ENERGY}
              handleTap={handleTap}
            />
          )}

          {activeView === "tasks" && <TasksScreen />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <NeonBackground>
      {/* TOP BAR */}
      <motion.div
        className="top-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="top-title"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {activeView === "tapper" ? "Кликер" : "Задания"}
        </motion.div>

        {/* Underline glow */}
        <motion.div
          className="top-glow-line"
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </motion.div>

      {/* CONTENT */}
      <div className="content-area">{renderView()}</div>

      {/* BOTTOM TABS */}
      <motion.div
        className="bottom-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TabButton
          active={activeView === "tapper"}
          onClick={() => setActiveView("tapper")}
        >
          👆 Тапать
        </TabButton>

        <TabButton
          active={activeView === "tasks"}
          onClick={() => setActiveView("tasks")}
        >
          📋 Задания
        </TabButton>
      </motion.div>

      <NeonCSS />
    </NeonBackground>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

function NeonBackground({ children }) {
  return (
    <div className="neon-wrapper">
      {/* animated gradient */}
      <motion.div
        className="neon-gradient"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* film grain */}
      <div className="neon-noise" />

      {/* center glow */}
      <motion.div
        className="neon-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 1 }}
      />

      {children}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`tab-btn ${active ? "active" : ""}`}
    >
      {children}
    </motion.button>
  );
}

function CenterMessage({ text }) {
  return (
    <motion.div
      style={{
        color: "white",
        fontSize: 26,
        fontWeight: 600,
        textShadow: "0 0 12px rgba(255,255,255,0.3)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {text}
    </motion.div>
  );
}

/* ------------------ CSS ------------------ */

function NeonCSS() {
  return (
    <style>
      {`
      /* === PREMIUM VISION PRO × NOTCOIN STYLE === */

      .neon-wrapper {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #000;
        color: #fff;
      }

      .neon-gradient {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 20%, #101018 0%, #000 70%);
        background-size: 200% 200%;
        z-index: 0;
      }

      .neon-noise {
        position: absolute;
        inset: 0;
        background-image: url('https://grainy-gradients.vercel.app/noise.svg');
        opacity: 0.06;
        mix-blend-mode: overlay;
        z-index: 1;
      }

      .neon-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(255,255,255,0.09), transparent 70%);
        z-index: 2;
      }

      /* === TOP BAR === */

      .top-bar {
        position: absolute;
        top: 0;
        width: 100%;
        padding: 18px 0;
        text-align: center;
        z-index: 10;

        background: rgba(5,5,10,0.45);
        backdrop-filter: blur(20px);

        border-bottom: 1px solid rgba(255,255,255,0.05);
        box-shadow:
          0 2px 12px rgba(0,0,0,0.7),
          inset 0 -1px 0 rgba(255,255,255,0.05);
      }

      .top-title {
        letter-spacing: 0.3px;
        font-size: 20px;
        font-weight: 600;
        color: #f8f8f9;
        text-shadow: 0 0 6px rgba(255,255,255,0.25);
      }

      .top-glow-line {
        width: 60%;
        height: 2px;
        margin: 6px auto 0 auto;
        border-radius: 100px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255,255,255,0.4),
          transparent
        );
        filter: blur(4px);
      }

      /* === CONTENT AREA === */

      .content-area {
        position: absolute;
        top: 70px;
        bottom: 90px;
        left: 0;
        right: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;

        z-index: 5;
      }

      /* === BOTTOM TABS === */

      .bottom-tabs {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 14px 0;
        display: flex;
        justify-content: space-around;
        z-index: 10;

        background: rgba(5,5,10,0.5);
        backdrop-filter: blur(26px);

        border-top: 1px solid rgba(255,255,255,0.05);

        box-shadow:
          0 -4px 16px rgba(0,0,0,0.55),
          inset 0 1px 0 rgba(255,255,255,0.05);
      }

      .tab-btn {
        background: rgba(255,255,255,0.035);
        border: none;
        padding: 10px 24px;
        color: rgba(255,255,255,0.65);
        font-size: 15px;
        font-weight: 500;
        border-radius: 14px;
        backdrop-filter: blur(14px);
        transition: 0.25s;
        box-shadow: inset 0 0 0 0 rgba(255,255,255,0.08);
      }

      .tab-btn:hover {
        background: rgba(255,255,255,0.07);
      }

      .tab-btn.active {
        color: #fff;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.18);

        box-shadow:
          0 0 12px rgba(255,255,255,0.18),
          inset 0 0 14px rgba(255,255,255,0.2);

        transform: translateY(-2px);
      }
      `}
    </style>
  );
}
