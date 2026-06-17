import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const GREEN = "#2D7A22";

const WORLDS = [
  { id: "ai",       name: "AI & Intelligence",     tablerIcon: "ti-brain",       desc: "Generative AI, Machine Learning, Deep Learning, and Python models. We build intelligent agents and explore cognitive systems.", x: 15, y: 25 },
  { id: "software", name: "Software Engineering",  tablerIcon: "ti-code",        desc: "Write clean code, architect scalable systems, contribute to open source, and ship full-stack web, mobile, and desktop applications.", x: 45, y: 15 },
  { id: "design",   name: "UI/UX & Design",        tablerIcon: "ti-palette",     desc: "Craft beautiful interfaces in Figma, build design systems, master colour theory, and orchestrate smooth user experiences.", x: 75, y: 20 },
  { id: "data",     name: "Data & Analytics",      tablerIcon: "ti-chart-bar",   desc: "Extract meaning from complex datasets. Master SQL, pandas, ML diagnostics, data stories, and predictive pipelines.", x: 10, y: 65 },
  { id: "video",    name: "Video & Motion",        tablerIcon: "ti-video",       desc: "For videographers and editors. Record visual sequences, direct events, master cutting in Premiere/DaVinci, and design motion graphics.", x: 32, y: 78 },
  { id: "photo",    name: "Photography & Media",   tablerIcon: "ti-camera",      desc: "For tech photographers and digital publishers. Manage photo shoots, cover campus events, edit assets, and curate media platforms.", x: 58, y: 76 },
  { id: "startups", name: "Startups & Product",    tablerIcon: "ti-rocket",      desc: "Build MVP products, pitch ideas, brainstorm sustainable business models, and learn what it takes to launch a tech startup.", x: 82, y: 65 },
  { id: "cyber",    name: "Cybersecurity",         tablerIcon: "ti-shield-lock", desc: "Secure networks, audit applications for vulnerabilities, practice ethical hacking, compete in CTFs, and defend systems.", x: 80, y: 42 },
  { id: "writing",  name: "Writing & Content",     tablerIcon: "ti-pencil",      desc: "Demystify complex tech. Publish developer docs, technical blogs, run tutorials, and orchestrate podcast scripts and media copy.", x: 48, y: 48 },
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

export default function InteractiveUniverse() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const [hoveredNode,  setHoveredNode]  = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const mousePosRef = useRef({ x: -999, y: -999 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const hoveredNodeRef = useRef(hoveredNode);
  useEffect(() => { hoveredNodeRef.current = hoveredNode; }, [hoveredNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width  = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const currentHover = hoveredNodeRef.current;

      // Connecting lines
      CONNECTIONS.forEach(([fi, ti]) => {
        const from = WORLDS[fi];
        const to   = WORLDS[ti];
        const fx   = (from.x / 100) * w;
        const fy   = (from.y / 100) * h;
        const tx   = (to.x   / 100) * w;
        const ty   = (to.y   / 100) * h;

        const active = currentHover === from.id || currentHover === to.id;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);

        if (active) {
          ctx.strokeStyle = GREEN;
          ctx.lineWidth   = 1;
          ctx.globalAlpha = 0.5;
        } else {
          ctx.strokeStyle = "rgba(255,255,255,0.04)";
          ctx.lineWidth   = 0.5;
          ctx.globalAlpha = 1;
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      raf = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mousePosRef.current = { x: -999, y: -999 }; }}
      className="relative w-full h-[600px] bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-3xl overflow-hidden select-none"
    >
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Nodes */}
      {WORLDS.map((world, idx) => {
        const isHovered  = hoveredNode  === world.id;
        const isSelected = selectedNode?.id === world.id;

        return (
          <motion.div
            key={world.id}
            className="absolute z-10"
            style={{ left: `${world.x}%`, top: `${world.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: isSelected ? 1.08 : isHovered ? 1.04 : 1,
              y: [0, Math.sin(idx * 1.3) * 4, 0],
            }}
            transition={{
              opacity: { duration: 0.4, delay: idx * 0.05 },
              scale:   { duration: 0.2 },
              y:       { duration: 4 + (idx % 3) * 0.8, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <button
              onMouseEnter={() => setHoveredNode(world.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(world)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-200"
              style={{
                backgroundColor: isHovered || isSelected ? "rgba(45, 122, 34, 0.08)" : "rgba(16,16,15,0.92)",
                borderColor:      isHovered || isSelected ? GREEN : "rgba(255,255,255,0.08)",
                backdropFilter:   "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <i className={`ti ${world.tablerIcon} text-xs`} style={{ color: isHovered || isSelected ? GREEN : "#888880" }} />
              <span className="text-[10px] font-normal tracking-wider uppercase text-[#F0EDE6]">
                {world.name.split(" ")[0]}
              </span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isHovered || isSelected ? GREEN : "rgba(255,255,255,0.15)" }} />
            </button>
          </motion.div>
        );
      })}

      {/* Detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute bottom-5 left-4 right-4 md:left-auto md:right-5 md:w-80 z-20 rounded-2xl p-5 bg-[#111110]/95 backdrop-blur-[20px] border border-[rgba(255,255,255,0.07)]"
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
                  <span
                    className="text-[9px] uppercase font-normal tracking-wider text-[#888880]"
                  >
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
