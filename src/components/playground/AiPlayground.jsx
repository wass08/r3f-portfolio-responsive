import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ShieldAlert, Youtube, Beaker } from "lucide-react";
import ResumeAnalyzerDemo from "./ResumeAnalyzerDemo";
import FraudDetectionDemo from "./FraudDetectionDemo";
import AutoYTGeneratorDemo from "./AutoYTGeneratorDemo";

const TABS = [
  {
    id: "resume",
    label: "Resume AI",
    icon: FileText,
    description: "AI-powered resume feedback & scoring",
    accent: "from-purple-500 to-violet-600",
  },
  {
    id: "fraud",
    label: "Fraud Detector",
    icon: ShieldAlert,
    description: "Real-time transaction risk analysis",
    accent: "from-red-500 to-orange-600",
  },
  {
    id: "autoyt",
    label: "AutoYT",
    icon: Youtube,
    description: "YouTube content strategy generator",
    accent: "from-red-600 to-rose-600",
  },
];

const AiPlayground = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("resume");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal — wrapper div owns all positioning so Framer Motion's inline
               transform doesn't overwrite Tailwind's translate classes */}
          <div className="fixed z-[70] inset-0 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="pointer-events-auto w-full md:max-w-[640px] md:max-h-[90vh] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-[0_0_60px_rgba(147,51,234,0.2)] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="AI Playground"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-700 to-blue-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Beaker size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">AI Playground</h2>
                  <p className="text-xs text-purple-200">Interactive live demos</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                aria-label="Close AI Playground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-1 p-2 bg-slate-900/50 border-b border-slate-700 flex-shrink-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white/10 text-white shadow"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-purple-400" : ""} />
                    <span className="hidden sm:block truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Description */}
            {(() => {
              const tab = TABS.find((t) => t.id === activeTab);
              if (!tab) return null;
              const Icon = tab.icon;
              return (
                <div className="px-6 pt-4 pb-0 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex p-1.5 rounded-lg bg-gradient-to-br ${tab.accent}`}>
                      <Icon size={14} className="text-white" />
                    </span>
                    <p className="text-sm font-semibold text-white">{tab.label}</p>
                    <span className="text-xs text-slate-400">— {tab.description}</span>
                  </div>
                </div>
              );
            })()}

            {/* Demo Content */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === "resume" && <ResumeAnalyzerDemo />}
                  {activeTab === "fraud" && <FraudDetectionDemo />}
                  {activeTab === "autoyt" && <AutoYTGeneratorDemo />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-700 bg-slate-900/40 flex-shrink-0">
              <p className="text-xs text-slate-500 text-center">
                Powered by{" "}
                <span className="text-purple-400 font-medium">Google Gemini 2.0</span>{" "}
                · Demo experience for Arhan's portfolio
              </p>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AiPlayground;
