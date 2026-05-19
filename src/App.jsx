import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DesktopEntry } from './core/DesktopEntry';
import { NotFound } from './components/NotFound';
import Resume from './components/Resume';
import { BlogDetail } from './components/BlogDetail';
import { useThemeStore } from './store/themeStore';
import { Analytics } from '@vercel/analytics/react';

/**
 * Main App Component
 * Router entry point - delegates to appropriate layout/page
 * 
 * Routes:
 * / - Desktop shell (new paradigm)
 * /resume - Resume page (preserved)
 * /blog/:id - Blog detail page (preserved)
 */
function App() {
  const theme = useThemeStore((state) => state.theme);

  // Apply theme to document root
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <>
      {/* Vercel Analytics */}
      <Analytics />

      {/* Router */}
      <Routes>
        {/* Main desktop app */}
        <Route path="/" element={<DesktopEntry />} />

        {/* Resume page (preserved from original) */}
        <Route path="/resume" element={<Resume />} />

        {/* Blog detail page (preserved from original) */}
        <Route path="/blog/:id" element={<BlogDetail />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
