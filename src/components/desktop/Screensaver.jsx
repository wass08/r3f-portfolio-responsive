import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSystemStateStore } from '../../store/systemStateStore';

// Simple floating clock screensaver like macOS Sonoma
const Screensaver = () => {
  const { screensaverActive, deactivateScreensaver, recordUserActivity } = useSystemStateStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!screensaverActive) return;
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [screensaverActive]);

  useEffect(() => {
    if (!screensaverActive) return;
    const handleActivity = () => {
      deactivateScreensaver();
      recordUserActivity();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [screensaverActive, deactivateScreensaver, recordUserActivity]);

  if (!screensaverActive) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-black cursor-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {/* Dynamic background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-[12vw] font-extralight tracking-tighter text-white drop-shadow-2xl">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className="text-2xl font-light text-white/70 tracking-widest uppercase mt-4">
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </motion.div>
  );
};

export default Screensaver;