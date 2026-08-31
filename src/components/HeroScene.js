import React, { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";

function useIsLight() {
  const [isLight, setIsLight] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("light")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}

// ─── Animated floating particles ───────────────────────────────────────────
function ParticleField({ count = 160, isLight }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 8,
        speed: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.035,
      });
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      const yOffset = Math.sin(t * p.speed + p.phase) * 0.5;
      const xOffset = Math.cos(t * p.speed * 0.7 + p.phase) * 0.3;

      dummy.position.set(p.x + xOffset, p.y + yOffset, p.z);
      dummy.scale.setScalar(p.scale * (1 + Math.sin(t * 2 + p.phase) * 0.3));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={isLight ? "#1E5014" : "#3DEB00"}
        transparent
        opacity={isLight ? 0.18 : 0.65}
      />
    </instancedMesh>
  );
}

// ─── Wireframe icosahedron ─────────────────────────────────────────────────
function WireframeShape({ isLight }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.08;
    meshRef.current.rotation.y = t * 0.12;
    meshRef.current.rotation.z = t * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[3.5, 0.5, -2]}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial
          color={isLight ? "#1E5014" : "#178905"}
          wireframe
          transparent
          opacity={isLight ? 0.12 : 0.22}
        />
      </mesh>
    </Float>
  );
}

// ─── Mouse-reactive camera ─────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Main Scene ────────────────────────────────────────────────────────────
export default function HeroScene() {
  const isLight = useIsLight();

  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={isLight ? 0.35 : 0.3} />

        {/* Starfield backdrop (dark mode only) */}
        {!isLight && (
          <Stars
            radius={50}
            depth={30}
            count={800}
            factor={2}
            saturation={0}
            fade
            speed={0.5}
          />
        )}

        {/* Floating green particles */}
        <ParticleField count={160} isLight={isLight} />

        {/* Wireframe icosahedron */}
        <WireframeShape isLight={isLight} />

        {/* Mouse parallax camera */}
        <CameraRig />
      </Canvas>
    </div>
  );
}
