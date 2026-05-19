import React, { useEffect, useState } from 'react';
import { DesktopShell } from './DesktopShell';
import { MobileShell } from './MobileShell';

/**
 * Desktop Entry Point
 * Wraps desktop shell with any necessary providers and initialization
 * MobileShell available in src/core/MobileShell.jsx for adaptive layouts
 * In Phase 2, this is minimal - stores handle their own state
 * In future phases, could add: theme provider, analytics, etc
 */
export const DesktopEntry = () => {
  const [mode, setMode] = useState('desktop');

  useEffect(() => {
    const updateMode = () => {
      setMode(window.innerWidth < 640 ? 'mobile' : 'desktop');
    };

    updateMode();
    window.addEventListener('resize', updateMode);
    return () => window.removeEventListener('resize', updateMode);
  }, []);

  return mode === 'mobile' ? <MobileShell /> : <DesktopShell />;
};
