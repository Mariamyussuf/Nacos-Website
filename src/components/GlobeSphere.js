import React, { useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";

// ─── Wireframe Sphere ──────────────────────────────────────────────────────
function Sphere() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshBasicMaterial
          color="#178905"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Inner sphere for subtle glow depth */}
      <mesh ref={useRef()}>
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial
          color="#3DEB00"
          wireframe
          transparent
          opacity={0.09}
        />
      </mesh>
    </Float>
  );
}

// ─── Mouse parallax camera ─────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Exported Component ────────────────────────────────────────────────────
/**
 * Animated wireframe sphere for the About page header.
 * Represents the "global" reach of computing education.
 * Lightweight — ~500 polygons, transparent background.
 */
export default function GlobeSphere({ className = "" }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.2} />
        <Sphere />
        <CameraRig />
      </Canvas>
    </div>
  );
}
