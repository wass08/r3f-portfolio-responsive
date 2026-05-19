import React from 'react';

/**
 * About ArhanOS Modal App
 * Mimics "About This Mac" with system specs
 */
const AboutOSApp = ({ windowId }) => {
  return (
    <div className="flex h-full w-full flex-col bg-neutral-900 border-none">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: System Logo */}
        <div className="flex w-1/3 flex-col items-center justify-center bg-neutral-800/30 p-6">
          <div className="h-32 w-32 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-accent-600 shadow-xl shadow-primary-500/20 mb-4">
            <span className="text-5xl">💻</span>
          </div>
        </div>

        {/* Right Side: System Info */}
        <div className="flex flex-1 flex-col justify-center p-8 text-neutral-200">
          <div className="mb-6">
            <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-2">
              <span className="font-semibold">Arhan</span>OS
            </h1>
            <p className="mt-1 text-sm font-medium text-neutral-400">Version 1.0.0 (Phase 6)</p>
          </div>

          <div className="space-y-3 text-sm text-neutral-300">
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-medium text-neutral-500">Framework</span>
              <span>React 18 & Vite</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-medium text-neutral-500">State</span>
              <span>Zustand</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-medium text-neutral-500">Styling</span>
              <span>Tailwind CSS</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-medium text-neutral-500">Animations</span>
              <span>Framer Motion</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-medium text-neutral-500">Device</span>
              <span>Web Browser</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="rounded bg-white/5 py-1.5 px-4 text-xs font-medium text-white hover:bg-white/10 transition-colors border border-white/10">
              System Report...
            </button>
            <button className="rounded bg-white/5 py-1.5 px-4 text-xs font-medium text-white hover:bg-white/10 transition-colors border border-white/10">
              Software Update...
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-neutral-800/50 p-4 text-center text-xs text-neutral-500 border-t border-white/5">
        ™ and © {new Date().getFullYear()} Arhan Ansari. All Rights Reserved.
      </div>
    </div>
  );
};

export default AboutOSApp;