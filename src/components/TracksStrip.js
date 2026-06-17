import React from "react";
import { motion } from "framer-motion";

const TRACKS = [
  {
    icon: "ti-code",
    title: "Software Engineering",
    desc: "Full-stack projects, open source, and production-grade systems.",
    badge: null,
  },
  {
    icon: "ti-brain",
    title: "AI & Intelligence",
    desc: "Machine learning, generative AI, and intelligent agents.",
    badge: "HOT",
  },
  {
    icon: "ti-palette",
    title: "UI/UX & Design",
    desc: "Figma systems, motion design, and user experience craft.",
    badge: null,
  },
  {
    icon: "ti-video",
    title: "Video & Motion",
    desc: "Premiere editing, DaVinci grading, and motion graphics.",
    badge: "NEW",
  },
  {
    icon: "ti-camera",
    title: "Photography & Media",
    desc: "Event coverage, visual branding, and media production.",
    badge: null,
  },
];

export default function TracksStrip() {
  return (
    <section className="relative z-10 py-14 border-b border-[rgba(255,255,255,0.07)] bg-[#0A0A08]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {TRACKS.map((track, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: idx * 0.05 }}
              className="track-card flex-1 min-w-[200px]"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <i className={`ti ${track.icon} text-lg text-[#555550]`} />
                <h3 className="text-sm font-medium text-[#F0EDE6]">{track.title}</h3>
                {track.badge && (
                  <span className="text-[9px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.02] text-[#888880] border border-[rgba(255,255,255,0.07)]">
                    {track.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#888880] leading-relaxed font-light">{track.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
