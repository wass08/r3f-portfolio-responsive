import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Konami code sequence ─────────────────────────────────────────────────────
const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

// ─── Dev mode stats ───────────────────────────────────────────────────────────
const DEV_STATS = [
  { label: "GitHub Contributions", value: "1869+",  icon: "🔥" },
  { label: "Projects Completed",   value: "250+",   icon: "🚀" },
  { label: "Technologies",         value: "20+",    icon: "⚡" },
  { label: "Years Experience",     value: "3+",     icon: "📅" },
  { label: "Client Rating",        value: "10/10",  icon: "⭐" },
  { label: "Lines of Code",        value: "500K+",  icon: "💻" },
];

// ─── Hidden animations ────────────────────────────────────────────────────────
const HIDDEN_ANIM_MESSAGES = [
  "console.log('Arhan was here 👋');",
  "git commit -m 'chore: push limits'",
  "npm install confidence",
  "const future = await build();",
  "// TODO: take over the world",
  "throw new Error('Too much awesomeness');",
];

export function KonamiEasterEgg() {
  const [devMode, setDevMode] = useState(false);
  const [progress, setProgress] = useState(0); // how many keys matched so far
  const [floaters, setFloaters] = useState([]);

  // ── Konami key detection ──
  useEffect(() => {
    let seq = 0;

    const handleKey = (e) => {
      if (e.key === KONAMI[seq]) {
        seq++;
        setProgress(seq);
        if (seq === KONAMI.length) {
          seq = 0;
          setProgress(0);
          setDevMode(true);
          // spawn floating code messages
          const items = HIDDEN_ANIM_MESSAGES.map((msg, i) => ({
            id:   i,
            text: msg,
            x:    10 + Math.random() * 80,
            y:    10 + Math.random() * 80,
            duration: 3.5 + Math.random() * 2,
          }));
          setFloaters(items);
        }
      } else {
        seq = e.key === KONAMI[0] ? 1 : 0;
        setProgress(seq);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const closeDevMode = useCallback(() => setDevMode(false), []);

  return (
    <>
      {/* Subtle progress hint (only visible when typing the code) */}
      <AnimatePresence>
        {progress > 0 && !devMode && (
          <motion.div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] flex gap-1 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-violet-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {KONAMI.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  i < progress ? "bg-violet-500" : "bg-neutral-700"
                }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Mode Overlay */}
      <AnimatePresence>
        {devMode && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Neon background */}
            <motion.div
              className="absolute inset-0 bg-[#0a0014]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.97 }}
            />

            {/* Neon grid lines */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Floating code messages */}
            {floaters.map((f) => (
              <motion.div
                key={f.id}
                className="absolute font-mono text-sm text-violet-400/70 pointer-events-none select-none"
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -10, -30] }}
                transition={{ duration: f.duration, delay: f.id * 0.25 }}
              >
                {f.text}
              </motion.div>
            ))}

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-2xl border border-violet-500/60 bg-neutral-900/90 backdrop-blur-xl shadow-2xl shadow-violet-900/50 overflow-hidden"
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-violet-900/60 to-fuchsia-900/60 px-6 py-4 flex items-center justify-between border-b border-violet-500/30">
                <div>
                  <p className="text-xs font-mono text-violet-400 mb-0.5">// KONAMI CODE ACTIVATED</p>
                  <h2 className="text-xl font-bold text-white font-display">
                    🔓 Developer Mode
                  </h2>
                  <p className="text-xs text-violet-300/70 mt-0.5">
                    Welcome to Arhan's hidden lab.
                  </p>
                </div>
                <button
                  onClick={closeDevMode}
                  className="p-2 rounded-lg hover:bg-violet-800/40 text-violet-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Stats grid */}
              <div className="p-6">
                <p className="text-xs font-mono text-violet-500 mb-4 uppercase tracking-widest">
                  &gt; Portfolio Debug Panel
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {DEV_STATS.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="flex flex-col items-center p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                    >
                      <span className="text-2xl mb-1">{stat.icon}</span>
                      <span className="text-lg font-bold text-violet-300 font-mono">{stat.value}</span>
                      <span className="text-[10px] text-neutral-500 leading-tight mt-0.5">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Hidden animations list */}
                <div className="space-y-1.5 font-mono text-xs text-green-400/80">
                  {HIDDEN_ANIM_MESSAGES.slice(0, 3).map((msg, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                    >
                      <span className="text-violet-500">&gt; </span>{msg}
                    </motion.p>
                  ))}
                </div>

                <motion.button
                  onClick={closeDevMode}
                  className="mt-5 w-full py-2.5 rounded-xl bg-violet-700 hover:bg-violet-600 text-white font-semibold text-sm transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Exit Developer Mode
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default KonamiEasterEgg;
