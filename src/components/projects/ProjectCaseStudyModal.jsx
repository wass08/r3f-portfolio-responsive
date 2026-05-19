import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ProjectCaseStudyModal - Displays detailed project information
 * Extracted for better performance and maintainability
 */
export const ProjectCaseStudyModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Press Escape to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Memoize tabs to prevent recalculation
  const tabs = useMemo(() => {
    const t = [{ id: "overview", label: "Overview" }];
    if (project.architecture) t.push({ id: "architecture", label: "Architecture" });
    return t;
  }, [project.architecture]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-700/60 shadow-2xl"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header image */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-neutral-800/80 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="absolute bottom-4 left-5">
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
            {project.type && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                  project.type === "original"
                    ? "bg-green-500/80 text-white"
                    : project.type === "client"
                      ? "bg-purple-500/80 text-white"
                      : "bg-blue-500/80 text-white"
                }`}
              >
                {project.type === "original"
                  ? "✨ Original"
                  : project.type === "client"
                    ? "👨‍💼 Client Work"
                    : "🎨 Inspired"}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="flex border-b border-neutral-800 px-6 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-primary-400 text-primary-300"
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Overview */}
              <div>
                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2">Overview</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">{project.description}</p>
              </div>

              {/* Tech Stack */}
              {project.technologies && (
                <div>
                  <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2">
                  Category
                </h3>
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-full capitalize">
                  {project.category || "Web"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-neutral-700/50">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 btn-gradient-primary text-white rounded-xl text-sm font-semibold"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Live Demo
                </a>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === "architecture" && project.architecture && (
            <ArchitectureDiagram architecture={project.architecture} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * ArchitectureDiagram - Render system architecture layers
 */
const ArchitectureDiagram = ({ architecture }) => {
  if (!architecture?.layers) return null;

  return (
    <div className="space-y-4">
      {architecture.layers.map((layer, idx) => (
        <motion.div
          key={layer.id}
          className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">{layer.icon}</div>
            <div>
              <h4 className="font-semibold text-primary-300 mb-1">{layer.label}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed mb-2">{layer.description}</p>
              {layer.tech && (
                <div className="flex flex-wrap gap-1">
                  {layer.tech.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-neutral-900 text-neutral-300 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
