import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const EXPERIMENTS = [
  {
    id: 1,
    emoji: "🧪",
    title: "Neural Style Transfer",
    status: "Prototype",
    description:
      "Real-time artistic style transfer using TensorFlow.js running fully in the browser — no server required.",
    tags: ["TensorFlow.js", "WebGL", "Canvas API"],
    color: "from-pink-900/40 to-fuchsia-900/40",
    border: "border-pink-500/30",
    badge: "text-pink-300 bg-pink-500/10 border-pink-500/30",
  },
  {
    id: 2,
    emoji: "🎵",
    title: "AI Music Composer",
    status: "Concept",
    description:
      "Generates original music loops from a mood keyword using Magenta.js and Web Audio API.",
    tags: ["Magenta.js", "Web Audio API", "Gemini"],
    color: "from-violet-900/40 to-indigo-900/40",
    border: "border-violet-500/30",
    badge: "text-violet-300 bg-violet-500/10 border-violet-500/30",
  },
  {
    id: 3,
    emoji: "🌐",
    title: "3D Web OS",
    status: "Experiment",
    description:
      "A browser-based 3D operating system built with Three.js where apps float as panels in 3D space.",
    tags: ["Three.js", "React Three Fiber", "Jotai"],
    color: "from-cyan-900/40 to-blue-900/40",
    border: "border-cyan-500/30",
    badge: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  },
  {
    id: 4,
    emoji: "🤖",
    title: "Code Review Bot",
    status: "Alpha",
    description:
      "An AI pair programmer that reviews pull requests, explains code, and suggests refactors via GitHub Actions.",
    tags: ["GitHub API", "Gemini", "Node.js"],
    color: "from-green-900/40 to-teal-900/40",
    border: "border-green-500/30",
    badge: "text-green-300 bg-green-500/10 border-green-500/30",
  },
  {
    id: 5,
    emoji: "🔮",
    title: "Predictive UI",
    status: "Research",
    description:
      "An interface that predicts the user's next action and pre-renders likely paths using ML behaviour modelling.",
    tags: ["ML5.js", "React", "Framer Motion"],
    color: "from-amber-900/40 to-orange-900/40",
    border: "border-amber-500/30",
    badge: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  },
  {
    id: 6,
    emoji: "🕹️",
    title: "AR Portfolio",
    status: "Concept",
    description:
      "An augmented-reality version of this portfolio that overlays project cards on real-world surfaces via WebXR.",
    tags: ["WebXR", "Three.js", "A-Frame"],
    color: "from-red-900/40 to-rose-900/40",
    border: "border-red-500/30",
    badge: "text-red-300 bg-red-500/10 border-red-500/30",
  },
];

export function SecretLab({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] rounded-2xl border border-fuchsia-500/40 bg-neutral-950/95 backdrop-blur-xl shadow-2xl shadow-fuchsia-900/30 overflow-hidden flex flex-col"
        initial={{ scale: 0.88, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 40 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-900/30 to-violet-900/30 flex-shrink-0">
          <div>
            <p className="text-xs font-mono text-fuchsia-500 mb-0.5">// SECRET UNLOCKED 🔓</p>
            <h2 className="text-xl font-bold text-white font-display">
              🧬 AI Experiments Lab
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Experimental ideas, prototypes, and concept demos
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-fuchsia-800/30 text-neutral-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              className={`rounded-xl border ${exp.border} bg-gradient-to-br ${exp.color} p-4 space-y-2`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{exp.emoji}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${exp.badge}`}>
                  {exp.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">{exp.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{exp.description}</p>
              <div className="flex flex-wrap gap-1">
                {exp.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-neutral-800/60 text-neutral-400 border border-neutral-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-neutral-800 text-center text-xs text-neutral-600">
          These are experimental concepts by Arhan — not yet released publicly.
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SecretLab;
