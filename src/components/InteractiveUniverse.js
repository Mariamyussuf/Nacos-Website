import React, { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const GREEN = "#2D7A22";
const GREEN_BRIGHT = "#3A9C2D";

const WORLDS = [
  { id: "ai",       name: "AI & Intelligence",     tablerIcon: "ti-brain",       desc: "Generative AI, Machine Learning, Deep Learning, and Python models. We build intelligent agents and explore cognitive systems.", pos: [-3.5, 1.8, 0] },
  { id: "software", name: "Software Engineering",  tablerIcon: "ti-code",        desc: "Write clean code, architect scalable systems, contribute to open source, and ship full-stack web, mobile, and desktop applications.", pos: [-0.5, 2.5, -1] },
  { id: "design",   name: "UI/UX & Design",        tablerIcon: "ti-palette",     desc: "Craft beautiful interfaces in Figma, build design systems, master colour theory, and orchestrate smooth user experiences.", pos: [3, 1.6, 0.5] },
  { id: "data",     name: "Data & Analytics",      tablerIcon: "ti-chart-bar",   desc: "Extract meaning from complex datasets. Master SQL, pandas, ML diagnostics, data stories, and predictive pipelines.", pos: [-4, -1, 1] },
  { id: "video",    name: "Video & Motion",        tablerIcon: "ti-video",       desc: "For videographers and editors. Record visual sequences, direct events, master cutting in Premiere/DaVinci, and design motion graphics.", pos: [-1.5, -2, 0.5] },
  { id: "photo",    name: "Photography & Media",   tablerIcon: "ti-camera",      desc: "For tech photographers and digital publishers. Manage photo shoots, cover campus events, edit assets, and curate media platforms.", pos: [1.5, -2.2, -0.5] },
  { id: "startups", name: "Startups & Product",    tablerIcon: "ti-rocket",      desc: "Build MVP products, pitch ideas, brainstorm sustainable business models, and learn what it takes to launch a tech startup.", pos: [4, -0.8, -1] },
  { id: "cyber",    name: "Cybersecurity",         tablerIcon: "ti-shield-lock", desc: "Secure networks, audit applications for vulnerabilities, practice ethical hacking, compete in CTFs, and defend systems.", pos: [3.5, 0, 1.5] },
  { id: "writing",  name: "Writing & Content",     tablerIcon: "ti-pencil",      desc: "Demystify complex tech. Publish developer docs, technical blogs, run tutorials, and orchestrate podcast scripts and media copy.", pos: [0, 0, 0] },
];

const CONNECTIONS = [
  [0,1],[0,3],[0,8],
  [1,2],[1,7],[1,8],
  [2,4],[2,6],[2,7],
  [3,5],[3,8],
  [4,5],[4,8],
  [5,6],[5,8],
  [6,8],[7,8],
];

// ─── 3D Node ───────────────────────────────────────────────────────────────
function Node3D({ world, isHovered, isSelected, onHover, onSelect }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle pulse on hover/select
    const scale = isHovered || isSelected ? 1.3 + Math.sin(t * 3) * 0.1 : 1;
    meshRef.current.scale.setScalar(scale);

    if (glowRef.current) {
      glowRef.current.scale.setScalar(isHovered || isSelected ? 2.5 + Math.sin(t * 2) * 0.3 : 1.5);
      glowRef.current.material.opacity = isHovered || isSelected ? 0.15 : 0.03;
    }
  });

  return (
    <Float speed={1.5 + Math.random()} rotationIntensity={0} floatIntensity={0.3}>
      <group position={world.pos}>
        {/* Glow sphere (outer) */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial
            color={GREEN_BRIGHT}
            transparent
            opacity={0.03}
          />
        </mesh>

        {/* Core node sphere */}
        <mesh
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); onHover(world.id); }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => { e.stopPropagation(); onSelect(world); }}
        >
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color={isHovered || isSelected ? GREEN_BRIGHT : "#888880"}
            transparent
            opacity={isHovered || isSelected ? 1 : 0.6}
          />
        </mesh>

        {/* Label */}
        <Html
          position={[0, 0.35, 0]}
          center
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span
            className="text-[9px] font-normal tracking-wider uppercase select-none"
            style={{
              color: isHovered || isSelected ? "#F0EDE6" : "#888880",
              textShadow: "0 0 8px rgba(0,0,0,0.8)",
              transition: "color 0.2s",
            }}
          >
            {world.name.split(" ")[0]}
          </span>
        </Html>
      </group>
    </Float>
  );
}

// ─── Connection Lines ──────────────────────────────────────────────────────
function ConnectionLines({ hoveredNode }) {
  const geometryRef = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = [];
    const col = [];
    CONNECTIONS.forEach(([fi, ti]) => {
      const from = WORLDS[fi].pos;
      const to = WORLDS[ti].pos;
      pos.push(...from, ...to);
      // Default dim color
      col.push(1, 1, 1, 1, 1, 1);
    });
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    };
  }, []);

  useFrame(() => {
    if (!geometryRef.current) return;
    const colorAttr = geometryRef.current.getAttribute("color");
    if (!colorAttr) return;

    CONNECTIONS.forEach(([fi, ti], idx) => {
      const active = hoveredNode === WORLDS[fi].id || hoveredNode === WORLDS[ti].id;
      const r = active ? 0.18 : 0.3;
      const g = active ? 0.61 : 0.3;
      const b = active ? 0.13 : 0.3;

      colorAttr.setXYZ(idx * 2, r, g, b);
      colorAttr.setXYZ(idx * 2 + 1, r, g, b);
    });
    colorAttr.needsUpdate = true;
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.25} />
    </lineSegments>
  );
}

// ─── Auto-rotating camera rig ──────────────────────────────────────────────
function AutoOrbit() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const radius = 8;
    camera.position.x = Math.sin(t * 0.08) * radius;
    camera.position.z = Math.cos(t * 0.08) * radius;
    camera.position.y = Math.sin(t * 0.05) * 1.5 + 1;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Main Export ───────────────────────────────────────────────────────────
export default function InteractiveUniverse() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleHover = useCallback((id) => setHoveredNode(id), []);
  const handleSelect = useCallback((world) => setSelectedNode(world), []);

  return (
    <div className="relative w-full h-[440px] sm:h-[520px] md:h-[600px] bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-2xl sm:rounded-3xl overflow-hidden select-none">
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 1, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#111110"]} />
        <ambientLight intensity={0.3} />

        {/* Star backdrop */}
        <Stars radius={30} depth={20} count={400} factor={1.5} saturation={0} fade speed={0.3} />

        {/* Connection lines */}
        <ConnectionLines hoveredNode={hoveredNode} />

        {/* Nodes */}
        {WORLDS.map((world) => (
          <Node3D
            key={world.id}
            world={world}
            isHovered={hoveredNode === world.id}
            isSelected={selectedNode?.id === world.id}
            onHover={handleHover}
            onSelect={handleSelect}
          />
        ))}

        {/* Auto orbit camera */}
        <AutoOrbit />
      </Canvas>

      {/* Detail panel overlay (stays as Framer Motion HTML) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-4 sm:right-4 md:left-auto md:right-5 md:w-80 z-20 rounded-2xl p-4 sm:p-5 bg-[#111110]/95 backdrop-blur-[20px] border border-[rgba(255,255,255,0.07)] shadow-2xl"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border border-[rgba(255,255,255,0.07)] bg-white/[0.02]"
                >
                  <i className={`ti ${selectedNode.tablerIcon} text-sm`} style={{ color: GREEN }} />
                </div>
                <div>
                  <h3 className="text-[#F0EDE6] font-display font-medium text-xs leading-tight">{selectedNode.name}</h3>
                  <span className="text-[9px] uppercase font-normal tracking-wider text-[#888880]">
                    NACOS Path
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <i className="ti ti-x text-sm" />
              </button>
            </div>

            <p className="text-[#888880] text-[12px] leading-relaxed mb-4 font-light">{selectedNode.desc}</p>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="flex-1 py-2 bg-white/[0.03] hover:bg-white/[0.06] text-[#888880] hover:text-white rounded-lg text-[10px] font-normal border border-[rgba(255,255,255,0.07)] transition-all"
              >
                Dismiss
              </button>
              <Link
                to="/resources"
                onClick={() => setSelectedNode(null)}
                style={{ backgroundColor: GREEN }}
                className="flex-1 text-center py-2 rounded-lg text-[10px] font-normal text-white transition-all hover:bg-[#3A9C2D]"
              >
                View Opportunities →
              </Link>
            </div>
          </motion.div>
        )}

        {!selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-5 w-full text-center z-10 pointer-events-none"
          >
            <p className="text-[#555550] text-[10px] tracking-widest uppercase font-normal">
              Tap a node to explore
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
