import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FINDER_SNACKS = [
  'You found a hidden file.',
  'ArhanOS feels more alive now.',
  'Try the Konami code anytime.',
  'The dock bounces if you keep exploring.'
];

const FinderEasterEggs = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(FINDER_SNACKS[0]);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setVisible(true), 15000);
    const timer = window.setInterval(() => {
      const next = FINDER_SNACKS[Math.floor(Math.random() * FINDER_SNACKS.length)];
      setMessage(next);
    }, 8000);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-4 bottom-4 z-[350] max-w-xs rounded-2xl border border-amber-400/30 bg-neutral-950/90 p-4 text-sm text-neutral-100 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
        >
          <div className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-300/70">Finder</div>
          <div>{message}</div>
          <button
            onClick={() => setVisible(false)}
            className="mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FinderEasterEggs;