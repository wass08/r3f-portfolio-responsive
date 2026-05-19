import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Simulation data ──────────────────────────────────────────────────────────

const SIMULATIONS = {
  autoyt: {
    name: "AutoYT",
    description: "AI-powered YouTube content automation pipeline",
    nodes: [
      { id: "user",      label: "User",           icon: "👤", x: 60,  y: 200, type: "user",     tech: "Web Browser", purpose: "Provides topic or keyword input", scaling: "N/A" },
      { id: "api",       label: "API Gateway",    icon: "🔀", x: 220, y: 200, type: "api",      tech: "Next.js API Routes", purpose: "Receives requests and routes them to services", scaling: "Edge functions / CDN" },
      { id: "gemini",    label: "Gemini AI",      icon: "🤖", x: 400, y: 120, type: "ai",       tech: "Google Gemini API", purpose: "Generates scripts and video outlines from the topic", scaling: "Async processing + queue workers" },
      { id: "script",    label: "Script Gen",     icon: "📝", x: 580, y: 120, type: "worker",   tech: "Node.js Worker", purpose: "Structures Gemini output into scene-by-scene scripts", scaling: "Horizontal worker pool" },
      { id: "scene",     label: "Scene Gen",      icon: "🎬", x: 580, y: 280, type: "worker",   tech: "Canvas API / FFMPEG", purpose: "Renders each script scene as a visual frame", scaling: "GPU-backed render farm" },
      { id: "composer",  label: "Video Composer", icon: "🎞️", x: 400, y: 280, type: "renderer", tech: "FFMPEG + Node.js", purpose: "Stitches rendered scenes into a final MP4 video", scaling: "Queue + blob storage" },
      { id: "storage",   label: "Storage",        icon: "🗄️", x: 400, y: 400, type: "storage",  tech: "Vercel Blob / S3", purpose: "Stores intermediate assets and final video files", scaling: "CDN-backed object storage" },
      { id: "youtube",   label: "YouTube Upload", icon: "▶️", x: 220, y: 400, type: "api",      tech: "YouTube Data API v3", purpose: "Uploads the composed video to the YouTube channel", scaling: "OAuth + rate limit handling" },
    ],
    edges: [
      { from: "user",     to: "api",      step: 1 },
      { from: "api",      to: "gemini",   step: 2 },
      { from: "gemini",   to: "script",   step: 3 },
      { from: "script",   to: "scene",    step: 4 },
      { from: "scene",    to: "composer", step: 5 },
      { from: "composer", to: "storage",  step: 5 },
      { from: "composer", to: "youtube",  step: 6 },
    ],
    steps: [
      { step: 1, label: 'User enters topic', description: '"Top AI tools for developers"', from: "user",     to: "api" },
      { step: 2, label: "AI analysis begins",   description: "User Input → Gemini AI",          from: "api",      to: "gemini" },
      { step: 3, label: "Script generation",    description: "Gemini → Script Generator",        from: "gemini",   to: "script" },
      { step: 4, label: "Scene rendering",      description: "Script → Scene Generator",         from: "script",   to: "scene" },
      { step: 5, label: "Video composition",    description: "Scenes → Video Composer",          from: "scene",    to: "composer" },
      { step: 6, label: "YouTube upload",       description: "Video → YouTube Upload",           from: "composer", to: "youtube" },
    ],
  },
  canvascraft: {
    name: "CanvasCraft",
    description: "AI-powered website builder using natural language",
    nodes: [
      { id: "user",    label: "User",          icon: "👤", x: 60,  y: 220, type: "user",    tech: "Web Browser", purpose: "Describes the website in plain English", scaling: "N/A" },
      { id: "gateway", label: "API Gateway",  icon: "🔀", x: 220, y: 220, type: "api",     tech: "Next.js API Routes", purpose: "Validates input and routes to AI service", scaling: "Edge functions" },
      { id: "ai",      label: "AI Engine",    icon: "🤖", x: 400, y: 140, type: "ai",      tech: "Google Gemini + OpenAI", purpose: "Generates HTML/CSS/JS code from description", scaling: "Rate-limited API pool" },
      { id: "parser",  label: "Code Parser",  icon: "⚙️", x: 580, y: 140, type: "worker",  tech: "Babel + esbuild", purpose: "Parses and validates generated code for safety", scaling: "In-memory sandbox" },
      { id: "preview", label: "Live Preview", icon: "🖥️", x: 580, y: 300, type: "renderer",tech: "iframe sandbox", purpose: "Renders the website in an isolated preview frame", scaling: "CSP sandbox policy" },
      { id: "db",      label: "Database",     icon: "💾", x: 400, y: 300, type: "database", tech: "MongoDB / Prisma", purpose: "Stores user projects and version history", scaling: "Replica set + indexes" },
      { id: "cdn",     label: "CDN / Deploy", icon: "🌐", x: 220, y: 380, type: "storage",  tech: "Vercel Edge", purpose: "Publishes the generated website to a live URL", scaling: "Global edge network" },
    ],
    edges: [
      { from: "user",    to: "gateway", step: 1 },
      { from: "gateway", to: "ai",      step: 2 },
      { from: "ai",      to: "parser",  step: 3 },
      { from: "parser",  to: "preview", step: 4 },
      { from: "gateway", to: "db",      step: 3 },
      { from: "parser",  to: "cdn",     step: 5 },
    ],
    steps: [
      { step: 1, label: "User describes website",  description: '"A landing page for my SaaS app"', from: "user",    to: "gateway" },
      { step: 2, label: "AI generation begins",    description: "Prompt → Gemini AI Engine",          from: "gateway", to: "ai" },
      { step: 3, label: "Code parsing",            description: "AI Output → Code Parser",            from: "ai",      to: "parser" },
      { step: 4, label: "Live preview renders",    description: "Parsed code → iframe sandbox",       from: "parser",  to: "preview" },
      { step: 5, label: "Deployment",              description: "Website → Vercel CDN",               from: "parser",  to: "cdn" },
    ],
  },
};

const NODE_COLORS = {
  user:     { bg: "bg-blue-500/20",   border: "border-blue-500/60",   glow: "#3b82f6",  text: "text-blue-300" },
  api:      { bg: "bg-purple-500/20", border: "border-purple-500/60", glow: "#a855f7",  text: "text-purple-300" },
  ai:       { bg: "bg-pink-500/20",   border: "border-pink-500/60",   glow: "#ec4899",  text: "text-pink-300" },
  worker:   { bg: "bg-amber-500/20",  border: "border-amber-500/60",  glow: "#f59e0b",  text: "text-amber-300" },
  renderer: { bg: "bg-green-500/20",  border: "border-green-500/60",  glow: "#22c55e",  text: "text-green-300" },
  storage:  { bg: "bg-cyan-500/20",   border: "border-cyan-500/60",   glow: "#06b6d4",  text: "text-cyan-300" },
  database: { bg: "bg-teal-500/20",   border: "border-teal-500/60",   glow: "#14b8a6",  text: "text-teal-300" },
  queue:    { bg: "bg-orange-500/20", border: "border-orange-500/60", glow: "#f97316",  text: "text-orange-300" },
};

const TRAFFIC_LEVELS = ["Low", "Medium", "High", "Viral"];

// ─── SVG diagram ─────────────────────────────────────────────────────────────

function getNodeCenter(node) {
  return { x: node.x + 60, y: node.y + 30 };
}

function SimGraph({ sim, activeStep, selectedNode, onNodeClick, traffic }) {
  const extraNodes = [];
  if (traffic >= 2) {
    extraNodes.push({
      id: "lb", label: "Load Balancer", icon: "⚖️", x: 300, y: 470, type: "api",
      tech: "Application Load Balancer",
      purpose: "Distributes incoming requests across multiple servers to improve reliability and throughput",
      scaling: "Auto-scales with traffic via additional backend instances",
    });
  }
  if (traffic >= 3) {
    extraNodes.push({
      id: "queue", label: "Job Queue", icon: "📋", x: 500, y: 470, type: "queue",
      tech: "Distributed message queue (e.g. BullMQ / Redis)",
      purpose: "Buffers and schedules background jobs for asynchronous processing",
      scaling: "Horizontally scalable via additional queue partitions and workers",
    });
    extraNodes.push({
      id: "srv2", label: "Server 2", icon: "🖥️", x: 640, y: 470, type: "worker",
      tech: "Additional application server instance",
      purpose: "Processes workload in parallel with the primary server to handle higher traffic",
      scaling: "Scale out by adding more worker servers behind the load balancer",
    });
  }

  const allNodes = [...sim.nodes, ...extraNodes];

  return (
    <div className="overflow-x-auto">
    <div className="relative" style={{ minHeight: 520, minWidth: 760 }}>
      {/* SVG edges */}
      <svg className="absolute inset-0 pointer-events-none" width="760" height="560" style={{ zIndex: 0 }}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
          </marker>
          <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {sim.edges.map((edge, i) => {
          const fromNode = allNodes.find(n => n.id === edge.from);
          const toNode   = allNodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const fc = getNodeCenter(fromNode);
          const tc = getNodeCenter(toNode);
          const isActive = activeStep !== null && edge.step <= activeStep;
          const isCurrentStep = activeStep === edge.step;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={fc.x} y1={fc.y} x2={tc.x} y2={tc.y}
                stroke={isActive ? "#a78bfa" : "#374151"}
                strokeWidth={isCurrentStep ? 3 : isActive ? 2 : 1.5}
                strokeDasharray={isActive ? "none" : "6 4"}
                markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
                filter={isCurrentStep ? "url(#glow)" : "none"}
                opacity={isActive ? 1 : 0.4}
              />
              {/* Animated data packet */}
              {isCurrentStep && (
                <motion.circle
                  r={5}
                  fill="#a78bfa"
                  filter="url(#glow)"
                  initial={{ cx: fc.x, cy: fc.y, opacity: 0 }}
                  animate={{ cx: tc.x, cy: tc.y, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
                />
              )}
            </g>
          );
        })}

        {/* Extra scaling arrows */}
        {traffic >= 2 && (
          <g>
            <line x1={360} y1={480} x2={360} y2={440} stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.5} markerEnd="url(#arrow-active)" />
          </g>
        )}
      </svg>

      {/* Nodes */}
      {allNodes.map((node, i) => {
        const colors   = NODE_COLORS[node.type] || NODE_COLORS.worker;
        const isActive = activeStep !== null && sim.edges.some(e => (e.from === node.id || e.to === node.id) && e.step <= activeStep);
        const isSel    = selectedNode?.id === node.id;

        return (
          <motion.div
            key={node.id}
            className={`absolute flex flex-col items-center justify-center gap-1 w-24 h-14 rounded-xl border cursor-pointer select-none transition-all duration-300
              ${colors.bg} ${colors.border}
              ${isActive ? "shadow-lg" : "opacity-60"}
              ${isSel ? "ring-2 ring-white/50 scale-105" : ""}
            `}
            style={{
              left: node.x,
              top: node.y,
              boxShadow: isActive ? `0 0 18px ${colors.glow}55` : "none",
              zIndex: 10,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 * i }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNodeClick(node)}
          >
            <span className="text-xl leading-none">{node.icon}</span>
            <span className={`text-[10px] font-semibold ${colors.text} text-center leading-tight px-1`}>
              {node.label}
            </span>
          </motion.div>
        );
      })}
    </div>
    </div>
  );
}

// ─── Node detail panel ────────────────────────────────────────────────────────

function NodeDetail({ node, onClose }) {
  const colors = NODE_COLORS[node.type] || NODE_COLORS.worker;
  return (
    <motion.div
      className={`absolute right-2 top-2 sm:right-4 sm:top-4 w-52 sm:w-64 rounded-xl sm:rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-md p-3 sm:p-4 shadow-2xl z-20 max-h-48 overflow-y-auto`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{node.icon}</span>
          <span className={`font-bold ${colors.text}`}>{node.label}</span>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 transition-colors p-1">✕</button>
      </div>
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-neutral-500 uppercase tracking-wider font-semibold">Tech</span>
          <p className="text-neutral-200 mt-0.5">{node.tech}</p>
        </div>
        <div>
          <span className="text-neutral-500 uppercase tracking-wider font-semibold">Purpose</span>
          <p className="text-neutral-200 mt-0.5">{node.purpose}</p>
        </div>
        <div>
          <span className="text-neutral-500 uppercase tracking-wider font-semibold">Scaling</span>
          <p className="text-neutral-200 mt-0.5">{node.scaling}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

const SystemDesignLab = React.forwardRef(function SystemDesignLab(_props, ref) {
  const [activeSimKey, setActiveSimKey] = useState("autoyt");
  const [activeStep, setActiveStep]     = useState(null);
  const [running, setRunning]           = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [traffic, setTraffic]           = useState(0);
  const intervalRef = useRef(null);

  const sim = SIMULATIONS[activeSimKey];

  // Cleanup interval on unmount
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const runSimulation = useCallback((simToRun) => {
    if (running) return;
    clearInterval(intervalRef.current);
    setRunning(true);
    setActiveStep(0);
    setSelectedNode(null);
    let step = 1;
    const totalSteps = simToRun.steps.length;

    intervalRef.current = setInterval(() => {
      if (step > totalSteps) {
        clearInterval(intervalRef.current);
        setActiveStep(totalSteps + 1); // sentinel → triggers "complete" callout
        setRunning(false);
        return;
      }
      setActiveStep(step);
      step++;
    }, 900);
  }, [running]);

  const resetSimulation = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setActiveStep(null);
    setSelectedNode(null);
  }, []);

  const currentStepData = sim.steps.find(s => s.step === activeStep) || null;

  return (
    <section
      ref={ref}
      id="section-16"
      className="relative min-h-screen w-full section-padding flex flex-col justify-center py-20"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent -z-10" />

      <div className="max-w-6xl mx-auto w-full space-y-10 px-4">
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-2"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>🔬</span> System Design Lab
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Architecture Simulator
          </motion.h2>
          <motion.p
            className="text-neutral-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            Visualize how my projects work internally with live step-by-step simulations.
            Click any node to inspect its architecture details.
          </motion.p>
        </div>

        {/* Project selector */}
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(SIMULATIONS).map(([key, s]) => (
            <motion.button
              key={key}
              onClick={() => { setActiveSimKey(key); resetSimulation(); }}
              className={`px-5 py-2 rounded-xl font-semibold text-sm border transition-all duration-200
                ${activeSimKey === key
                  ? "border-violet-500 bg-violet-500/20 text-violet-200"
                  : "border-neutral-700/50 bg-neutral-800/30 text-neutral-400 hover:border-violet-500/50 hover:text-violet-300"
                }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {s.name}
            </motion.button>
          ))}
        </div>

        {/* Main card */}
        <motion.div
          className="glass-morphism rounded-2xl border border-neutral-700/40 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Card header */}
          <div className="px-6 py-4 border-b border-neutral-700/40 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-neutral-100 text-lg">{sim.name}</h3>
              <p className="text-xs text-neutral-500">{sim.description}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Traffic slider */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 whitespace-nowrap">Traffic:</span>
                <div className="flex gap-1">
                  {TRAFFIC_LEVELS.map((lvl, i) => (
                    <button
                      key={lvl}
                      onClick={() => setTraffic(i)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all duration-150
                        ${traffic === i
                          ? "bg-violet-600 text-white"
                          : "bg-neutral-800 text-neutral-500 hover:text-neutral-300"
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {activeStep !== null && (
                <button
                  onClick={resetSimulation}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  ↺ Reset
                </button>
              )}

              {/* Run */}
              <motion.button
                onClick={() => runSimulation(sim)}
                disabled={running}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all duration-200
                  ${running
                    ? "bg-violet-700/40 text-violet-400 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                  }`}
                whileHover={running ? {} : { scale: 1.05 }}
                whileTap={running ? {} : { scale: 0.95 }}
              >
                {running ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-violet-300 animate-pulse" />
                    Simulating…
                  </>
                ) : (
                  <>▶ Run Simulation</>
                )}
              </motion.button>
            </div>
          </div>

          {/* Graph area */}
          <div className="relative p-4 bg-neutral-900/50" style={{ minHeight: 540 }}>
            <SimGraph
              sim={sim}
              activeStep={activeStep}
              selectedNode={selectedNode}
              onNodeClick={setSelectedNode}
              traffic={traffic}
            />

            {/* Node detail panel */}
            <AnimatePresence>
              {selectedNode && (
                <NodeDetail
                  key={selectedNode.id}
                  node={selectedNode}
                  onClose={() => setSelectedNode(null)}
                />
              )}
            </AnimatePresence>

            {/* Traffic scaling indicator */}
            <AnimatePresence>
              {traffic >= 2 && (
                <motion.div
                  className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  ⚡ {traffic === 3 ? "Viral load — scaling triggered!" : "High traffic — load balancer active"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step progress bar */}
          <div className="px-6 py-4 border-t border-neutral-700/40">
            <div className="flex items-start gap-4">
              {/* Steps */}
              <div className="flex-1">
                <div className="flex gap-2 flex-wrap mb-3">
                  {sim.steps.map((s) => (
                    <div
                      key={s.step}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-300
                        ${activeStep !== null && s.step <= activeStep
                          ? "bg-violet-500/20 border border-violet-500/50 text-violet-300"
                          : "bg-neutral-800/50 border border-neutral-700/30 text-neutral-600"
                        }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold
                        ${activeStep !== null && s.step <= activeStep ? "bg-violet-500 text-white" : "bg-neutral-700 text-neutral-500"}`}>
                        {s.step}
                      </span>
                      {s.label}
                    </div>
                  ))}
                </div>

                {/* Current step callout */}
                <AnimatePresence mode="wait">
                  {currentStepData ? (
                    <motion.div
                      key={currentStepData.step}
                      className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/30"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <span className="text-violet-400 font-bold text-xs w-5 h-5 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                        {currentStepData.step}
                      </span>
                      <div>
                        <p className="text-violet-200 font-semibold text-sm">{currentStepData.label}</p>
                        <p className="text-violet-400/70 text-xs">{currentStepData.description}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="idle"
                      className="text-neutral-600 text-sm italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {activeStep !== null && activeStep > sim.steps.length
                        ? "✅ Simulation complete — click a node to inspect its details"
                        : "Press ▶ Run Simulation to start the architecture walkthrough"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-neutral-500">
          {Object.entries(NODE_COLORS).map(([type, colors]) => (
            <span key={type} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${colors.border} ${colors.bg} ${colors.text}`}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
});

export default SystemDesignLab;
