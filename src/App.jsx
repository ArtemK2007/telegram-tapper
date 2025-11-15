import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import TapperScreen from "./TapperScreen";
import TasksScreen from "./TasksScreen";
import NameModal from "./NameModal";
import { motion, AnimatePresence } from "framer-motion";

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
tg.setBackgroundColor("#000000");
tg.setHeaderColor("#000000");

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState("tapper");

  const [needsName, setNeedsName] = useState(false);

  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const MAX_ENERGY = 1000;

  const [tapsSinceLastSave, setTapsSinceLastSave] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((e) => (e < MAX_ENERGY ? e + 1 : e));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
  }, [tapsSinceLastSave, points, energy, user]);

  const handleTap = () => {
    if (energy <= 0) return;

    setPoints((p) => p + 1);
    setEnergy((e) => e - 1);
    setTapsSinceLastSave((x) => x + 1);

    tg.HapticFeedback.impactOccurred("medium");
  };

  if (loading || !user)
    return (
      <NotcoinBackground>
        <CenterMessage text="Загрузка..." />
        <NotcoinCSS />
      </NotcoinBackground>
    );

  if (needsName)
    return (
      <NotcoinBackground>
        <NameModal onSubmit={handleNameSubmit} isLoading={loading} />
        <NotcoinCSS />
      </NotcoinBackground>
    );

  const renderView = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
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
    <NotcoinBackground>
      {/* HEADER */}
      <motion.div
        className="nc-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="nc-header-left">
          <div className="nc-avatar-circle">
            <span>AR</span>
          </div>
          <div className="nc-player-info">
            <div className="nc-player-name">
              {user?.user_metadata?.username || "Игрок"}
            </div>
            <div className="nc-player-sub">ARTR Tap-to-Earn</div>
          </div>
        </div>

        <div className="nc-balance-pill">
          <div className="nc-balance-label">Баланс</div>
          <div className="nc-balance-row">
            <span className="nc-balance-value">
              {points.toLocaleString("ru-RU")}
            </span>
            <span className="nc-balance-token">ARTR</span>
          </div>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="nc-content">{renderView()}</div>

      {/* TABS */}
      <motion.div
        className="nc-tabs"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TabButton
          active={activeView === "tapper"}
          onClick={() => setActiveView("tapper")}
        >
          <span className="nc-tab-label-strong">Tap</span>
        </TabButton>

        <TabButton
          active={activeView === "tasks"}
          onClick={() => setActiveView("tasks")}
        >
          <span className="nc-tab-label-strong">Tasks</span>
        </TabButton>
      </motion.div>

      <NotcoinCSS />
    </NotcoinBackground>
  );
}

/* ------------ UI WRAPPERS ------------ */

function NotcoinBackground({ children }) {
  return <div className="nc-wrapper">{children}</div>;
}

function TabButton({ active, children, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onClick={onClick}
      className={`nc-tab-btn ${active ? "active" : ""}`}
    >
      {children}
    </motion.button>
  );
}

function CenterMessage({ text }) {
  return (
    <motion.div
      className="nc-center-message"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {text}
    </motion.div>
  );
}

/* ------------ CSS-IN-JS: ЧЁРНЫЙ ПРЕМИУМ ------------ */

function NotcoinCSS() {
  return (
    <style>{`
      :root {
        --nc-bg: #05070d;
        --nc-bg-soft: #0b0f1a;
        --nc-accent: #7cecff;
        --nc-accent-soft: rgba(124, 236, 255, 0.16);
        --nc-border-soft: rgba(255, 255, 255, 0.06);
        --nc-text-main: #ffffff;
        --nc-text-muted: #8b93af;
        --nc-tab-bg: rgba(7, 9, 18, 0.96);
        --nc-radius-lg: 20px;
        --nc-radius-pill: 999px;
      }

      .nc-wrapper {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: radial-gradient(circle at top, #101424 0%, #05060a 55%, #000000 100%);
        color: var(--nc-text-main);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        padding: env(safe-area-inset-top) 12px env(safe-area-inset-bottom);
        box-sizing: border-box;
      }

      .nc-wrapper::before {
        content: "";
        position: absolute;
        inset: -40%;
        background:
          radial-gradient(circle at 20% 0, rgba(106, 90, 205, 0.16), transparent 60%),
          radial-gradient(circle at 80% 0, rgba(0, 191, 255, 0.16), transparent 60%);
        opacity: 0.7;
        pointer-events: none;
        z-index: 0;
      }

      .nc-wrapper > * {
        position: relative;
        z-index: 1;
      }

      /* HEADER */

      .nc-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 8px 4px;
        margin-bottom: 6px;
      }

      .nc-header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .nc-avatar-circle {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 20%, #2f384a 0%, #111623 55%, #05070d 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 600;
        color: #cfd7ff;
        box-shadow:
          0 0 12px rgba(0, 0, 0, 0.9),
          0 0 0 1px rgba(255, 255, 255, 0.06);
      }

      .nc-player-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .nc-player-name {
        font-size: 13px;
        font-weight: 600;
      }

      .nc-player-sub {
        font-size: 11px;
        color: var(--nc-text-muted);
      }

      .nc-balance-pill {
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(10, 12, 22, 0.96);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 10px 24px rgba(0,0,0,0.9);
        min-width: 150px;
      }

      .nc-balance-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: rgba(255,255,255,0.45);
        margin-bottom: 2px;
      }

      .nc-balance-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .nc-balance-value {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
      }

      .nc-balance-token {
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

      /* CONTENT */

      .nc-content {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: stretch;
        padding: 4px 2px 10px;
      }

      /* TABS */

      .nc-tabs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 8px 8px;
        margin-bottom: 6px;
        border-radius: 18px;
        background: var(--nc-tab-bg);
        border: 1px solid var(--nc-border-soft);
        box-shadow: 0 -4px 22px rgba(0, 0, 0, 0.9);
      }

      .nc-tab-btn {
        flex: 1;
        border: none;
        outline: none;
        border-radius: 999px;
        padding: 8px 10px;
        background: transparent;
        color: var(--nc-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.18s ease-out, color 0.18s ease-out, transform 0.18s ease-out;
      }

      .nc-tab-label-strong {
        font-size: 13px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .nc-tab-btn.active {
        background: rgba(124, 236, 255, 0.09);
        color: var(--nc-text-main);
        box-shadow: 0 0 0 1px rgba(124, 236, 255, 0.55), 0 0 18px rgba(0, 0, 0, 0.9);
      }

      .nc-center-message {
        color: white;
        font-size: 20px;
        font-weight: 600;
        text-shadow: 0 0 12px rgba(255,255,255,0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
    `}</style>
  );
}
