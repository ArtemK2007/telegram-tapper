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
    switch (activeView) {
      case "tapper":
        return (
          <TapperScreen
            points={points}
            energy={energy}
            MAX_ENERGY={MAX_ENERGY}
            handleTap={handleTap}
          />
        );

      case "tasks":
        return <TasksScreen />;

      default:
        return null;
    }
  };

  return (
    <NeonBackground>
      {/* TOP BAR */}
      <motion.div
        className="top-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="top-title">
          {activeView === "tapper" ? "Кликер" : "Задания"}
        </div>
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
      <motion.div
        className="neon-gradient"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="neon-noise" />

      {/* LIGHT GLOW */}
      <motion.div
        className="neon-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
      />

      {children}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
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
        fontSize: 24,
        fontWeight: 600,
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
      /* === PREMIUM NOTCOIN BLACK THEME === */

      .neon-wrapper {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #050506;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', Inter, sans-serif;
      }

      /* Smooth royal gradient */
      .neon-gradient {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 20%, #141418 0%, #050506 70%);
        background-size: 200% 200%;
        animation: gradientShift 16s ease-in-out infinite;
        z-index: 0;
      }

      @keyframes gradientShift {
        0% { background-position: 0% 0%; }
        50% { background-position: 100% 100%; }
        100% { background-position: 0% 0%; }
      }

      /* Very soft grain (premium, subtle) */
      .neon-noise {
        position: absolute;
        inset: 0;
        background-image: url('https://grainy-gradients.vercel.app/noise.svg');
        opacity: 0.06;
        mix-blend-mode: overlay;
        z-index: 1;
      }

      /* internal glow */
      .neon-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(255,255,255,0.09), transparent 60%);
        opacity: 0.1;
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

        background: rgba(15,15,20,0.45);
        backdrop-filter: blur(18px);

        border-bottom: 1px solid rgba(255,255,255,0.05);

        box-shadow:
          0 2px 12px rgba(0,0,0,0.6),
          inset 0 -1px 0 rgba(255,255,255,0.05);
      }

      .top-title {
        letter-spacing: 0.3px;
        font-size: 19px;
        font-weight: 600;
        color: #f4f4f5;
        text-shadow: 0 0 4px rgba(255,255,255,0.25);
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

      /* === BOTTOM TABS (Notcoin-like) === */

      .bottom-tabs {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 10px 0;
        display: flex;
        justify-content: space-around;
        z-index: 10;

        background: rgba(15,15,20,0.45);
        backdrop-filter: blur(25px);

        border-top: 1px solid rgba(255,255,255,0.05);
        box-shadow:
          0 -4px 16px rgba(0,0,0,0.45),
          inset 0 1px 0 rgba(255,255,255,0.05);
      }

      .tab-btn {
        background: rgba(255,255,255,0.03);
        border: none;
        padding: 10px 24px;
        color: rgba(255,255,255,0.6);
        font-size: 15px;
        font-weight: 500;
        border-radius: 14px;
        backdrop-filter: blur(12px);
        transition: 0.25s;
        box-shadow: inset 0 0 0 0 rgba(255,255,255,0.05);
      }

      .tab-btn:hover {
        background: rgba(255,255,255,0.06);
      }

      .tab-btn.active {
        color: #fff;
        background: rgba(255,255,255,0.09);
        border: 1px solid rgba(255,255,255,0.15);

        box-shadow:
          0 0 10px rgba(255,255,255,0.15),
          inset 0 0 12px rgba(255,255,255,0.15);

        transform: translateY(-2px);
      }
      `}
    </style>
  );
}
