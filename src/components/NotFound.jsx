import { Float, MeshDistortMaterial, Text, Stars, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { motion } from "framer-motion-3d";

const Scene = () => {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Float speed={5} rotationIntensity={2} floatIntensity={5}>
        <Text
          fontSize={2}
          color="#6366f1"
          position={[0, 1, 0]}
          maxWidth={10}
          textAlign="center"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZ9rib2c.woff"
        >
          404
        </Text>
      </Float>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Text
          fontSize={0.5}
          color="white"
          position={[0, -0.5, 0]}
          maxWidth={10}
          textAlign="center"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZ9rib2c.woff"
        >
          Lost in the Digital Void?
        </Text>
      </Float>
      <mesh position={[0, 0, -2]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#4338ca"
          speed={5}
          distort={0.5}
          radius={1}
        />
      </mesh>
      <OrbitControls enableZoom={false} />
    </>
  );
};

export const NotFound = () => {
  return (
    <div className="fixed inset-0 z-[999] bg-[#0f172a] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <div className="relative z-10 text-center mt-80 space-y-6">
        <p className="text-neutral-400 max-w-md mx-auto px-6">
          The page you are looking for doesn't exist or has been moved to another dimension.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95"
        >
          Return to Reality
        </button>
      </div>
    </div>
  );
};
