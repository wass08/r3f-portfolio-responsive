import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CODE_SNIPPETS = [
  "const buildFuture = () => 'AI + Creativity'",
  'console.log("Welcome to my portfolio");',
  'import innovation from "mindset"',
  "await deploy({ passion: true });",
  "git push origin main --force-with-lease",
  "const stack = ['React','Next.js','Three.js'];",
  "npm run dream --watch",
  "while(true) { learn(); build(); }",
  'throw new AwesomeError("Too much cool");',
  "export default Arhan;",
];

const CLICK_TARGET = 5;
const RESET_DELAY  = 2000; // ms to reset click counter if no clicks
const SPAWN_COOLDOWN = 8000; // ms cooldown after spawning to prevent re-trigger

export function FloatingParticles() {
  const [particles, setParticles] = useState([]);
  const clickCountRef   = useRef(0);
  const resetTimerRef   = useRef(null);
  const removeTimerRef  = useRef(null);
  const cooldownTimerRef = useRef(null);
  const cooldownRef     = useRef(false);
  const nextId          = useRef(0);

  // Cleanup all timers on unmount
  useEffect(() => () => {
    clearTimeout(resetTimerRef.current);
    clearTimeout(removeTimerRef.current);
    clearTimeout(cooldownTimerRef.current);
  }, []);

  const spawnParticles = useCallback(() => {
    const spawned = CODE_SNIPPETS.map((text, i) => ({
      id:       nextId.current + i,
      text,
      x:        5 + Math.random() * 90,     // vw %
      y:        20 + Math.random() * 60,    // vh %
      delay:    i * 0.12,
      duration: 3.5 + Math.random() * 2.5,
    }));
    nextId.current += CODE_SNIPPETS.length;
    setParticles(prev => [...prev, ...spawned]);

    // Auto-remove after longest possible duration — track so we can cancel on unmount
    clearTimeout(removeTimerRef.current);
    removeTimerRef.current = setTimeout(() => {
      setParticles(prev =>
        prev.filter(p => !spawned.find(s => s.id === p.id))
      );
    }, 7000);
  }, []);

  const handleHeroClick = useCallback(() => {
    if (cooldownRef.current) return; // ignore clicks during cooldown

    clickCountRef.current++;

    // Reset timer
    clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, RESET_DELAY);

    if (clickCountRef.current >= CLICK_TARGET) {
      clickCountRef.current = 0;
      clearTimeout(resetTimerRef.current);
      cooldownRef.current = true;
      clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = setTimeout(() => { cooldownRef.current = false; }, SPAWN_COOLDOWN);
      spawnParticles();
    }
  }, [spawnParticles]);

  // Attach click listener to the hero section
  useEffect(() => {
    const hero = document.getElementById("section-0");
    if (!hero) return;
    hero.addEventListener("click", handleHeroClick);
    return () => hero.removeEventListener("click", handleHeroClick);
  }, [handleHeroClick]);

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed font-mono text-xs text-emerald-400/80 pointer-events-none select-none z-[150] whitespace-nowrap max-w-xs"
          style={{ left: `${p.x}vw`, top: `${p.y}vh` }}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -20, -50], scale: [0.8, 1, 1, 0.85] }}
          exit={{ opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
        >
          <span className="px-2 py-0.5 rounded bg-neutral-900/80 border border-emerald-500/25 shadow-lg shadow-emerald-900/20 backdrop-blur-sm">
            {p.text}
          </span>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export default FloatingParticles;
