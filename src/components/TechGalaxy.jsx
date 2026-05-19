import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";


// ─── Tech node data ──────────────────────────────────────────────────────────
const techData = [
  {
    id: "react",
    label: "React",
    color: "#61dafb",
    ring: 1,
    speed: 0.35,
    phaseOffset: 0,
    level: "Core Skill",
    description: "UI library for building interactive interfaces with a component-based architecture.",
    projects: ["This Portfolio", "Task Manager Pro", "Clipgen AI"],
  },
  {
    id: "threejs",
    label: "Three.js",
    color: "#ffffff",
    ring: 1,
    speed: 0.28,
    phaseOffset: Math.PI / 2,
    level: "Core Skill",
    description: "3D graphics library powering WebGL scenes, animations, and immersive experiences.",
    projects: ["This Portfolio", "3D Car Racing Game"],
  },
  {
    id: "nodejs",
    label: "Node.js",
    color: "#68a063",
    ring: 2,
    speed: 0.22,
    phaseOffset: 0.8,
    level: "Advanced",
    description: "Server-side JavaScript runtime for building scalable, high-performance backends.",
    projects: ["Chat to PDF", "InspireGem", "SaaS Platforms"],
  },
  {
    id: "mongodb",
    label: "MongoDB",
    color: "#47a248",
    ring: 2,
    speed: 0.2,
    phaseOffset: 2.1,
    level: "Advanced",
    description: "NoSQL document database for flexible, scalable data storage in modern apps.",
    projects: ["Chat to PDF", "InspireGem"],
  },
  {
    id: "reactnative",
    label: "React Native",
    color: "#61dafb",
    ring: 2,
    speed: 0.25,
    phaseOffset: 3.8,
    level: "Advanced",
    description: "Cross-platform mobile framework for building iOS & Android apps with React.",
    projects: ["Mobile Apps", "Expo Projects"],
  },
  {
    id: "nextjs",
    label: "Next.js",
    color: "#61dafb",
    ring: 2,
    speed: 0.18,
    phaseOffset: 5.2,
    level: "Advanced",
    description: "Full-stack React framework with SSR, SSG, and API routes built-in.",
    projects: ["AutoYT", "CanvasCraft", "Clipgen AI"],
  },
  {
    id: "python",
    label: "Python",
    color: "#3776ab",
    ring: 3,
    speed: 0.15,
    phaseOffset: 1.2,
    level: "Core Skill",
    description: "Versatile language for AI/ML scripting, automation, and backend services.",
    projects: ["AI Tools", "Data Scripts"],
  },
  {
    id: "ai",
    label: "AI / ML",
    color: "#d946ef",
    ring: 3,
    speed: 0.17,
    phaseOffset: 2.8,
    level: "Advanced",
    description: "Machine learning integrations using Gemini, OpenAI, and Together AI APIs.",
    projects: ["AutoYT", "InspireGem", "Synthara"],
  },
  {
    id: "tailwind",
    label: "Tailwind",
    color: "#38bdf8",
    ring: 3,
    speed: 0.14,
    phaseOffset: 4.4,
    level: "Core Skill",
    description: "Utility-first CSS framework for building modern, responsive UIs at speed.",
    projects: ["This Portfolio", "All Web Projects"],
  },
  {
    id: "typescript",
    label: "TypeScript",
    color: "#3178c6",
    ring: 3,
    speed: 0.16,
    phaseOffset: 0.4,
    level: "Core Skill",
    description: "Typed superset of JavaScript that catches bugs early and improves code quality.",
    projects: ["Modern Projects", "SaaS Platforms"],
  },
  {
    id: "express",
    label: "Express",
    color: "#888888",
    ring: 3,
    speed: 0.13,
    phaseOffset: 3.5,
    level: "Core Skill",
    description: "Minimalist Node.js web framework for building REST APIs and web servers.",
    projects: ["Backend APIs", "Full-Stack Projects"],
  },
  {
    id: "framer",
    label: "Framer Motion",
    color: "#e879f9",
    ring: 1,
    speed: 0.4,
    phaseOffset: Math.PI,
    level: "Advanced",
    description: "Production-ready animation library for React with physics-based motion.",
    projects: ["This Portfolio", "Interactive UIs"],
  },
];

// Connection pairs — IDs of techs that are commonly used together
const CONNECTIONS = [
  ["react", "nextjs"],
  ["react", "tailwind"],
  ["nodejs", "mongodb"],
  ["nodejs", "express"],
  ["nextjs", "typescript"],
  ["ai", "python"],
  ["react", "threejs"],
  ["reactnative", "react"],
];

// Ring radii
const RING_RADII = { 1: 3.5, 2: 6, 3: 8.5 };

// ─── Skill level badge colours ────────────────────────────────────────────────
const LEVEL_STYLES = {
  "Core Skill":   "bg-primary-500/20 text-primary-300 border-primary-500/30",
  "Advanced":     "bg-green-500/20 text-green-300 border-green-500/30",
  "Intermediate": "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

// ─── Skill level progress percentages ─────────────────────────────────────────
const LEVEL_PROGRESS = {
  "Core Skill":   92,
  "Advanced":     75,
  "Intermediate": 52,
};

// ─── Camera: gentle auto-orbit + pointer-driven vertical parallax ─────────────
const CameraController = () => {
  const angleRef = useRef(0);
  useFrame((state, delta) => {
    angleRef.current += delta * 0.055; // full orbit ≈ 114 s
    const dist = 14;
    const tx = Math.sin(angleRef.current) * dist;
    const tz = Math.cos(angleRef.current) * dist;
    const ty = 4 + state.pointer.y * 1.8; // subtle vertical parallax from cursor
    state.camera.position.x += (tx - state.camera.position.x) * 0.007;
    state.camera.position.z += (tz - state.camera.position.z) * 0.007;
    state.camera.position.y += (ty - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

// ─── Central core ────────────────────────────────────────────────────────────
const CoreSphere = ({ glowing = false }) => {
  const meshRef  = useRef();
  const glowRef  = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.x += 0.004;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
    if (glowRef.current) {
      const cur = glowRef.current.scale.x;
      const tgt = pulse * (glowing ? 2.2 : 1.7);
      glowRef.current.scale.setScalar(cur + (tgt - cur) * 0.08);
      const curOp = glowRef.current.material.opacity;
      glowRef.current.material.opacity = curOp + ((glowing ? 0.35 : 0.2) - curOp) * 0.08;
    }
    if (lightRef.current) {
      const tgt = glowing ? 5.0 : 2.5;
      lightRef.current.intensity += (tgt - lightRef.current.intensity) * 0.08;
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.8} roughness={0.1} metalness={0.9} wireframe />
      </mesh>
      <pointLight ref={lightRef} color="#38bdf8" intensity={2} distance={8} />
    </group>
  );
};

// ─── Individual tech node ─────────────────────────────────────────────────────
const TechNode = ({ tech, hovered, selected, onClick, onHover }) => {
  const groupRef   = useRef();
  const meshRef    = useRef();
  const ringRef    = useRef(); // spinning torus on hover
  const burstRef   = useRef(); // expand-and-fade ring on click
  const lightRef   = useRef(); // per-node point light
  const timeRef    = useRef(tech.phaseOffset);
  const popRef     = useRef(1);     // scale burst value (decays to 1)
  const burstTRef  = useRef(0);     // 0=idle, 0→1 during animation
  const prevSelRef = useRef(false); // detects leading edge of selection

  const isHovered  = hovered?.id  === tech.id;
  const isSelected = selected?.id === tech.id;
  const radius     = RING_RADII[tech.ring];
  const col        = useMemo(() => new THREE.Color(tech.color), [tech.color]);

  useFrame((state, delta) => {
    timeRef.current += tech.speed * 0.008;
    const t = timeRef.current;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 0.7 + tech.phaseOffset) * 0.6;
    if (groupRef.current) groupRef.current.position.set(x, y, z);

    // ── Click pop + burst ring (trigger on leading edge) ──────────────────
    if (isSelected && !prevSelRef.current) {
      popRef.current  = 2.1;
      burstTRef.current = 0.001;
    }
    prevSelRef.current = isSelected;

    // Pop scale decay
    if (popRef.current > 1) popRef.current = Math.max(1, popRef.current - delta * 5.5);

    // Burst ring expand + fade
    if (burstTRef.current > 0) {
      burstTRef.current = Math.min(1, burstTRef.current + delta * 2.2);
      if (burstRef.current) {
        burstRef.current.scale.setScalar(1 + burstTRef.current * 4.5);
        burstRef.current.material.opacity = (1 - burstTRef.current) * 0.55;
      }
      if (burstTRef.current >= 1) burstTRef.current = 0;
    }

    // ── Main sphere ──────────────────────────────────────────────────────
    if (meshRef.current) {
      const tgtEmissive = isHovered
        ? 1.8 + Math.sin(state.clock.elapsedTime * 4.5) * 0.5
        : isSelected ? 1.5 : 0.7;
      meshRef.current.material.emissiveIntensity +=
        (tgtEmissive - meshRef.current.material.emissiveIntensity) * 0.12;
      meshRef.current.scale.setScalar((isHovered ? 1.5 : 1) * popRef.current);
    }

    // ── Per-node glow light intensity ──────────────────────────────────
    if (lightRef.current) {
      const tgtIntensity = isHovered ? 1.5 : isSelected ? 1.2 : 0.3;
      lightRef.current.intensity += (tgtIntensity - lightRef.current.intensity) * 0.15;
    }

    // ── Hover orbit ring (spins + fades in) ───────────────────────────────
    if (ringRef.current) {
      const tgt = isHovered ? 0.85 : 0;
      ringRef.current.material.opacity += (tgt - ringRef.current.material.opacity) * 0.12;
      if (isHovered) ringRef.current.rotation.z += delta * 1.8;
    }

    // ── Per-node point light ─────────────────────────────────────────────
    if (lightRef.current) {
      const tgt = (isHovered || isSelected) ? 2.8 : 0;
      lightRef.current.intensity += (tgt - lightRef.current.intensity) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Hover orbit ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.46, 0.016, 8, 48]} />
        <meshBasicMaterial color={tech.color} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Click burst ring */}
      <mesh ref={burstRef}>
        <torusGeometry args={[0.4, 0.012, 6, 40]} />
        <meshBasicMaterial color={tech.color} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Per-node glow light - more prominent on hover/select */}
      <pointLight ref={lightRef} color={tech.color} intensity={isHovered ? 1.2 : isSelected ? 1.5 : 0.3} distance={4} />

      {/* Main sphere - enhanced for better visibility and interaction */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          document.body.style.cursor = 'pointer';
          onHover(tech); 
        }}
        onPointerOut={() => { 
          document.body.style.cursor = 'auto';
          onHover(null); 
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onClick(tech); 
        }}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.32, 18, 18]} />
        <meshStandardMaterial 
          color={col} 
          emissive={col} 
          emissiveIntensity={isHovered ? 1.8 : isSelected ? 1.5 : 0.6}
          roughness={0.15} 
          metalness={0.85}
          envMapIntensity={1}
        />
      </mesh>

      {/* Billboard label */}
      <Billboard>
        <Text
          position={[0, 0.55, 0]}
          fontSize={0.22}
          color={isHovered ? "#ffffff" : isSelected ? "#e0dcff" : "#cccccc"}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {tech.label}
        </Text>
      </Billboard>
    </group>
  );
};

// ─── Ring guides ─────────────────────────────────────────────────────────────
const OrbitRing = ({ radius }) => {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#38bdf8" opacity={0.08} transparent />
    </line>
  );
};

// ─── Connection line between two tech nodes ───────────────────────────────────
// Uses the same per-frame accumulation as TechNode to stay in sync.
// Adds: flow particle traveling A→B, smooth glow when either end is hovered.
const ConnectionLine = ({ nodeA, nodeB, isGlowing }) => {
  const lineRef    = useRef();
  const matRef     = useRef(); // lineBasicMaterial ref for opacity/colour
  const flowRef    = useRef(); // traveling dot mesh
  const flowMatRef = useRef(); // traveling dot material
  const timeA  = useRef(nodeA.phaseOffset);
  const timeB  = useRef(nodeB.phaseOffset);
  const flowT  = useRef(Math.random()); // stagger starting position per line

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 points × 3 coords
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    // Mirror TechNode exactly: accumulate per-frame, starting from phaseOffset
    timeA.current += nodeA.speed * 0.008;
    timeB.current += nodeB.speed * 0.008;
    flowT.current  = (flowT.current + delta * 0.38) % 1;

    const tA = timeA.current;
    const rA = RING_RADII[nodeA.ring];
    const xA = Math.cos(tA) * rA;
    const zA = Math.sin(tA) * rA;
    const yA = Math.sin(tA * 0.7 + nodeA.phaseOffset) * 0.6;

    const tB = timeB.current;
    const rB = RING_RADII[nodeB.ring];
    const xB = Math.cos(tB) * rB;
    const zB = Math.sin(tB) * rB;
    const yB = Math.sin(tB * 0.7 + nodeB.phaseOffset) * 0.6;

    if (lineRef.current) {
      const pos = lineRef.current.geometry.attributes.position;
      pos.setXYZ(0, xA, yA, zA);
      pos.setXYZ(1, xB, yB, zB);
      pos.needsUpdate = true;
    }

    // Traveling flow dot (interpolate A → B)
    if (flowRef.current) {
      const t = flowT.current;
      flowRef.current.position.set(
        xA + (xB - xA) * t,
        yA + (yB - yA) * t,
        zA + (zB - zA) * t
      );
      // Sinusoidal size pulse — biggest at midpoint
      flowRef.current.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.7);
    }

    // Smooth opacity + colour transition for line
    if (matRef.current) {
      const tgt = isGlowing ? 0.65 : 0.18;
      matRef.current.opacity += (tgt - matRef.current.opacity) * 0.09;
      matRef.current.color.set(isGlowing ? "#a78bfa" : "#38bdf8");
    }
    // Smooth opacity + colour for flow dot
    if (flowMatRef.current) {
      const tgt = isGlowing ? 1.0 : 0.65;
      flowMatRef.current.opacity += (tgt - flowMatRef.current.opacity) * 0.09;
      flowMatRef.current.color.set(isGlowing ? "#a78bfa" : "#38bdf8");
    }
  });

  return (
    <group>
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial ref={matRef} color="#38bdf8" opacity={0.18} transparent />
      </line>
      {/* Traveling dot */}
      <mesh ref={flowRef}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial ref={flowMatRef} color="#38bdf8" transparent opacity={0.65} depthWrite={false} />
      </mesh>
    </group>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────
const GalaxyScene = ({ onHover, onNodeClick, hovered, selected, isMobile }) => {
  const nodes = isMobile ? techData.filter((t) => t.ring < 3) : techData;
  const nodeMap = useMemo(() => Object.fromEntries(techData.map((t) => [t.id, t])), []);
  const activeConnections = useMemo(
    () =>
      CONNECTIONS.filter(
        ([a, b]) => nodes.find((n) => n.id === a) && nodes.find((n) => n.id === b)
      ),
    [nodes]
  );

  return (
    <>
      {/* Enhanced lighting for better node visibility and depth */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 8, 10]} intensity={1} />
      <pointLight position={[-10, -5, -10]} intensity={0.6} color="#0ea5e9" />
      <pointLight position={[0, 12, 0]} intensity={0.8} color="#8b5cf6" />

      {/* Starfield background - more visible */}
      <Stars radius={50} depth={30} count={isMobile ? 400 : 800} factor={3} saturation={0.2} fade={false} />

      {/* Auto-orbit + pointer parallax camera controller */}
      <CameraController />

      {/* Core — brightens when any node is hovered/selected */}
      <CoreSphere glowing={!!hovered || !!selected} />

      {/* Orbit ring guides */}
      {[3.5, 6, ...(isMobile ? [] : [8.5])].map((r) => (
        <OrbitRing key={r} radius={r} />
      ))}

      {/* Connection lines — glow when either endpoint is active */}
      {activeConnections.map(([a, b]) => (
        <ConnectionLine
          key={`${a}-${b}`}
          nodeA={nodeMap[a]}
          nodeB={nodeMap[b]}
          isGlowing={
            hovered?.id === a || hovered?.id === b ||
            selected?.id === a || selected?.id === b
          }
        />
      ))}

      {/* Tech nodes */}
      {nodes.map((tech) => (
        <TechNode
          key={tech.id}
          tech={tech}
          hovered={hovered}
          selected={selected}
          onHover={onHover}
          onClick={onNodeClick}
        />
      ))}
    </>
  );
};

// ─── Tech Info Card (HTML overlay) ───────────────────────────────────────────
const TechInfoCard = ({ tech, onClose }) => (
  <AnimatePresence>
    {tech && (
      <motion.div
        key={tech.id}
        className="absolute top-4 left-4 z-10 w-72 rounded-2xl glass-morphism-dark border border-primary-500/40 p-6 pointer-events-auto shadow-2xl"
        initial={{ opacity: 0, scale: 0.85, x: -20, y: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, x: -20, y: -10 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
      >
        {/* Close button — rotates on hover */}
        <motion.button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100 p-1.5 rounded-lg hover:bg-primary-500/10 transition-all"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {/* Pulsing colour dot + name */}
        <div className="flex items-center gap-3 mb-4">
          <motion.span
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: tech.color }}
            animate={{ boxShadow: [`0 0 6px ${tech.color}66`, `0 0 18px ${tech.color}dd`, `0 0 6px ${tech.color}66`] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <h3 className="font-bold text-neutral-50 text-lg">{tech.label}</h3>
        </div>

        {/* Skill level badge + animated progress bar */}
        {tech.level && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${LEVEL_STYLES[tech.level] ?? LEVEL_STYLES["Intermediate"]}`}>
                {tech.level}
              </span>
              <span className="text-xs text-neutral-400 font-semibold">{LEVEL_PROGRESS[tech.level] ?? 52}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-800/60 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${tech.color}77, ${tech.color}ff)` }}
                initial={{ width: 0 }}
                animate={{ width: `${LEVEL_PROGRESS[tech.level] ?? 52}%` }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
              />
            </div>
          </div>
        )}

        <p className="text-neutral-300 text-sm leading-relaxed mb-4 font-light">{tech.description}</p>

        {/* Project chips — staggered spring entrance + hover lift */}
        {tech.projects?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-primary-400/90 uppercase tracking-wider mb-2.5">Used in</p>
            <div className="flex flex-wrap gap-2">
              {tech.projects.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, scale: 0.6, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 400, damping: 24 }}
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="text-xs px-2.5 py-1 bg-primary-500/15 border border-primary-500/35 text-primary-300 rounded-full cursor-default font-medium hover:bg-primary-500/25 transition-colors"
                >
                  {p}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Public component ─────────────────────────────────────────────────────────
const TechGalaxy = ({ performanceMode = false }) => {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
  }, [isMobile]);

  // Force 3D rendering for desktop, only use grid for very low-end devices
  const shouldUsePerformanceMode = performanceMode && isMobile;

  if (shouldUsePerformanceMode) {
    return (
      <div className="w-full grid grid-cols-3 sm:grid-cols-4 gap-3 py-8">
        {techData.map((tech, i) => (
          <motion.div
            key={tech.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
            whileHover={{ y: -4, scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl glass-morphism border border-neutral-700/30 hover:border-primary-500/30 transition-colors cursor-default"
          >
            <motion.span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tech.color }}
              animate={{ boxShadow: [`0 0 3px ${tech.color}50`, `0 0 10px ${tech.color}`, `0 0 3px ${tech.color}50`] }}
              transition={{ duration: 2 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-xs text-neutral-300 font-medium text-center">{tech.label}</span>
            {tech.level && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${LEVEL_STYLES[tech.level] ?? LEVEL_STYLES["Intermediate"]}`}>
                {tech.level}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  // Full 3D galaxy for all desktop devices
  return (
    <motion.div
      className="relative w-full"
      style={{ height: isMobile ? "360px" : "520px" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      data-cursor="canvas"
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 4, 14], fov: 55 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false
        }}
        dpr={dpr}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        onPointerMissed={() => setSelectedTech(null)}
      >
        <Suspense fallback={null}>
          <GalaxyScene
            onHover={setHoveredTech}
            onNodeClick={setSelectedTech}
            hovered={hoveredTech}
            selected={selectedTech}
            isMobile={isMobile}
          />
        </Suspense>
      </Canvas>

      <TechInfoCard tech={selectedTech} onClose={() => setSelectedTech(null)} />

      {/* Hint */}
      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p className="text-[10px] text-neutral-600">Click any node to explore · Auto-rotating</p>
      </motion.div>
    </motion.div>
  );
};

export default TechGalaxy;
