import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useEffect, useRef, useState } from "react";
import { framerMotionConfig } from "../config";
import { Avatar } from "./Avatar";
import { Background } from "./Background";
import { Office } from "./Office";
import { Projects } from "./Projects";

// Lightweight floating shape for hero background
const FloatingShape = ({ position, geometry, color, speed = 1, scale = 1 }) => {
  const meshRef = useRef();
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + timeOffset.current;
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
    meshRef.current.position.x = position[0] + Math.cos(t * 0.3) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        wireframe
      />
    </mesh>
  );
};

export const Experience = (props) => {
  const { menuOpened, section: parentSection, setSection, performanceMode = false } = props;
  const { viewport } = useThree();

  const isMobile = window.innerWidth < 768;
  const isLowPower = performanceMode || isMobile;
  const responsiveRatio = viewport.width / 12;
  const officeScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9));

  const [localSection, setLocalSection] = useState(0);

  const cameraPositionX = useMotionValue(0);
  const cameraLookAtX = useMotionValue(0);

  useEffect(() => {
    animate(cameraPositionX, menuOpened ? -5 : 0, {
      ...framerMotionConfig,
    });
    animate(cameraLookAtX, menuOpened ? 5 : 0, {
      ...framerMotionConfig,
    });
  }, [menuOpened]);

  // Update section from parent
  useEffect(() => {
    if (parentSection !== undefined && parentSection !== localSection) {
      setLocalSection(parentSection);
    }
  }, [parentSection]);

  const characterContainerAboutRef = useRef();

  const [characterAnimation, setCharacterAnimation] = useState("Typing");
  useEffect(() => {
    setCharacterAnimation("Falling");
    setTimeout(() => {
      setCharacterAnimation(localSection === 0 ? "Typing" : "Standing");
    }, 600);
  }, [localSection]);

  const characterGroup = useRef();

  useFrame((state) => {
    // Check if refs exist before accessing
    if (!characterGroup.current) return;

    state.camera.position.x = cameraPositionX.get();
    state.camera.lookAt(cameraLookAtX.get(), 0, 0);

    // const position = new THREE.Vector3();
    if (localSection === 0 && characterContainerAboutRef.current) {
      characterContainerAboutRef.current.getWorldPosition(
        characterGroup.current.position
      );
    }
  });

  return (
    <>
      <Background section={localSection} />
      <motion.group
        ref={characterGroup}
        rotation={[-3.141592653589793, 1.2053981633974482, 3.141592653589793]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        animate={"" + localSection}
        transition={{
          duration: 0.6,
        }}
        variants={{
          0: {
            x: isMobile ? 0 : 2,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: Math.PI / 2,
            rotateZ: 0,
            scaleX: officeScaleRatio,
            scaleY: officeScaleRatio,
            scaleZ: officeScaleRatio,
          },
          1: {
            y: 0.5,
            x: isMobile ? 0.3 : -2,
            z: 5,
            rotateX: 0,
            rotateY: isMobile ? -Math.PI / 2 : Math.PI / 4,
            rotateZ: 0,
            scaleX: isMobile ? 1.2 : 1,
            scaleY: isMobile ? 1.2 : 1,
            scaleZ: isMobile ? 1.2 : 1,
          },
          2: {
            x: isMobile ? -1.4 : 2.5,
            y: 0.5,
            z: 4,
            rotateX: 0,
            rotateY: -Math.PI / 4,
            rotateZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
          3: {
            x: isMobile ? 1.4 : -2.5,
            y: 0.5,
            z: 4,
            rotateX: 0,
            rotateY: Math.PI / 4,
            rotateZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
          4: {
            y: 1,
            x: isMobile ? 1 : -2,
            z: isMobile ? 4 : 5,
            rotateX: 0,
            rotateY: Math.PI / 3,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          5: {
            y: 1,
            x: isMobile ? -1 : 2,
            z: isMobile ? 4 : 5,
            rotateX: 0,
            rotateY: -Math.PI / 6,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          6: {
            y: 1,
            x: isMobile ? 0 : -2.5,
            z: isMobile ? 5 : 6,
            rotateX: 0,
            rotateY: Math.PI / 4,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          7: {
            y: 1,
            x: isMobile ? 1.5 : 2,
            z: isMobile ? 4 : 5,
            rotateX: 0,
            rotateY: -Math.PI / 3,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          8: {
            y: 1,
            x: isMobile ? -1 : -2,
            z: isMobile ? 5 : 6,
            rotateX: 0,
            rotateY: Math.PI / 5,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          9: {
            y: 1,
            x: isMobile ? 0 : 1.5,
            z: isMobile ? 6 : 7,
            rotateX: 0,
            rotateY: -Math.PI / 6,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          10: {
            y: 1,
            x: isMobile ? 0 : 1.5,
            z: isMobile ? 6 : 7,
            rotateX: 0,
            rotateY: -Math.PI / 6,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          11: {
            y: 1,
            x: isMobile ? 0 : -1.5,
            z: isMobile ? 6 : 7,
            rotateX: 0,
            rotateY: Math.PI / 6,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          12: {
            y: 0.5,
            x: isMobile ? 0 : 2,
            z: isMobile ? 5 : 6,
            rotateX: 0,
            rotateY: -Math.PI / 4,
            rotateZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
          13: {
            y: 1,
            x: isMobile ? 0 : -2,
            z: isMobile ? 5 : 6,
            rotateX: 0,
            rotateY: Math.PI / 4,
            rotateZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
          14: {
            y: 0.5,
            x: isMobile ? 0 : 2.5,
            z: isMobile ? 5 : 7,
            rotateX: 0,
            rotateY: -Math.PI / 3,
            rotateZ: 0,
            scaleX: isMobile ? 0.9 : 1,
            scaleY: isMobile ? 0.9 : 1,
            scaleZ: isMobile ? 0.9 : 1,
          },
          15: {
            y: 1,
            x: isMobile ? 0 : -2,
            z: isMobile ? 5 : 6,
            rotateX: 0,
            rotateY: Math.PI / 5,
            rotateZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
        }}
      >
        <Avatar animation={characterAnimation} wireframe={localSection === 1} />
      </motion.group>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />

      {/* Hero background floating shapes - only visible at section 0, desktop only */}
      <motion.group
        animate={{ opacity: localSection === 0 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {!isLowPower && (
          <>
            <FloatingShape
              position={[-6, 2, -5]}
              geometry={<octahedronGeometry args={[1, 0]} />}
              color="#38bdf8"
              speed={0.6}
              scale={1.2}
            />
            <FloatingShape
              position={[7, -1, -6]}
              geometry={<icosahedronGeometry args={[1, 0]} />}
              color="#d946ef"
              speed={0.5}
              scale={1.5}
            />
            <FloatingShape
              position={[-4, -3, -8]}
              geometry={<torusGeometry args={[0.8, 0.3, 8, 16]} />}
              color="#38bdf8"
              speed={0.7}
              scale={1}
            />
            <FloatingShape
              position={[5, 4, -7]}
              geometry={<tetrahedronGeometry args={[1, 0]} />}
              color="#8b5cf6"
              speed={0.4}
              scale={1.3}
            />
          </>
        )}
      </motion.group>

      <motion.group
        position={[
          isMobile ? 0 : 2.5 * officeScaleRatio,
          isMobile ? -viewport.height / 6 : 0,
          2,
        ]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height / 6 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <Office section={localSection} setSection={setSection} />
        <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[0.07, 0.16, -0.57]}
          rotation={[-Math.PI, 0.42, -Math.PI]}
        ></group>
      </motion.group>

      {/* SKILLS */}
      <motion.group
        position={[
          0,
          isMobile ? -viewport.height : -1.5 * officeScaleRatio,
          -10,
        ]}
        animate={{
          z: localSection === 1 ? 0 : -10,
          y:
            localSection === 1
              ? -viewport.height
              : isMobile
              ? -viewport.height
              : -1.5 * officeScaleRatio,
        }}
      >
        <directionalLight position={[-5, 3, 5]} intensity={0.4} />
        <Float>
          <mesh position={[1, -3, -15]} scale={[2, 2, 2]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={0.4}
              speed={4}
              color={"red"}
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[3, 3, 3]} position={[3, 1, -18]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={1}
              speed={5}
              color="yellow"
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[1.4, 1.4, 1.4]} position={[-3, -1, -11]}>
            <boxGeometry />
            <MeshWobbleMaterial
              opacity={0.8}
              transparent
              factor={1}
              speed={5}
              color={"blue"}
            />
          </mesh>
        </Float>
      </motion.group>
      <Projects />
    </>
  );
};
