import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NeonHeading from "./NeonHeading";

const TRACKS = [
  {
    id: "software",
    label: "Software Engineering",
    icon: "ti-code",
    bright: "Software Engineering.",
    dim: "Build full-stack applications, contribute to open source, and ship production-grade systems.",
    tabs: [
      { label: "What You'll Learn", items: ["Full-Stack Web Development (React, Node, Express)", "Git & GitHub Workflows & Collaboration", "REST APIs & Database Design", "CI/CD and Deployment Pipelines", "Clean Code & Architecture Patterns"] },
      { label: "Projects Built", items: ["Bells Course Planner — AI-powered academic advisor", "Campus Events Platform — Real-time event management", "Open Source Contribution — PR reviews and merging"] },
    ],
    stats: [{ value: "40+", label: "Projects Shipped" }, { value: "12", label: "Active Repos" }, { value: "200+", label: "PRs Merged" }],
  },
  {
    id: "ai",
    label: "AI & Intelligence",
    icon: "ti-brain",
    bright: "AI & Intelligence.",
    dim: "Train machine learning models, build intelligent agents, and explore the frontier of generative AI.",
    tabs: [
      { label: "What You'll Learn", items: ["Python for ML & Data Science", "TensorFlow / PyTorch Model Training", "Generative AI & LLM Integration", "Computer Vision & NLP Projects", "AI Ethics & Responsible Deployment"] },
      { label: "Labs & Tools", items: ["Google Colab Workshops", "Kaggle Competition Teams", "Hugging Face Model Deployments"] },
    ],
    stats: [{ value: "15+", label: "Models Trained" }, { value: "3", label: "Papers Published" }, { value: "50+", label: "AI Builders" }],
  },
  {
    id: "design",
    label: "UI/UX & Design",
    icon: "ti-palette",
    bright: "UI/UX & Design.",
    dim: "Craft beautiful interfaces in Figma, build design systems, and orchestrate smooth user experiences.",
    tabs: [
      { label: "What You'll Learn", items: ["Figma Wireframing & Prototyping", "Design Systems & Component Libraries", "Color Theory & Typography", "Motion Design & Micro-animations", "User Research & Usability Testing"] },
      { label: "Deliverables", items: ["Figma UI Kit v1.0 — 120+ downloads", "Bells Portal Redesign Concept", "Design Critiques & Portfolio Reviews"] },
    ],
    stats: [{ value: "120+", label: "Kit Downloads" }, { value: "8", label: "Design Sprints" }, { value: "30+", label: "Designers" }],
  },
  {
    id: "video",
    label: "Video & Motion",
    icon: "ti-video",
    bright: "Video & Motion.",
    dim: "Record cinematic sequences, master editing in Premiere and DaVinci, and create stunning motion graphics.",
    tabs: [
      { label: "What You'll Learn", items: ["Video Editing (Premiere Pro / DaVinci Resolve)", "Cinematography & Lighting Basics", "After Effects Motion Graphics", "YouTube Production & Vlogs", "Color Grading & Sound Design"] },
      { label: "Productions", items: ["NACOS Tech Fest Event Coverage", "Developer Vlogs & Tutorial Series", "FrameCut Video Library — AI-powered lecture clips"] },
    ],
    stats: [{ value: "25+", label: "Videos Produced" }, { value: "5K+", label: "Total Views" }, { value: "15+", label: "Videographers" }],
  },
  {
    id: "photo",
    label: "Photography & Media",
    icon: "ti-camera",
    bright: "Photography & Media.",
    dim: "Cover campus events, manage visual assets, curate media platforms, and build your creative portfolio.",
    tabs: [
      { label: "What You'll Learn", items: ["Event Photography & Composition", "Photo Editing (Lightroom / Photoshop)", "Visual Branding & Asset Management", "Media Publishing & Social Content", "Portfolio Curation & Presentation"] },
      { label: "Highlights", items: ["Annual Campus Photo Exhibition", "NACOS Media Kit & Brand Guidelines", "Live Event Coverage Teams"] },
    ],
    stats: [{ value: "500+", label: "Photos Captured" }, { value: "10+", label: "Events Covered" }, { value: "20+", label: "Photographers" }],
  },
];

export default function TracksDeepDive() {
  const [activeTrack, setActiveTrack] = useState(TRACKS[0].id);
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = useRef({});

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTrack(entry.target.id);
            setActiveTab(0);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-20% 0px -20% 0px" }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToTrack = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative z-10">
      {TRACKS.map((track, idx) => {
        const currentTab = activeTrack === track.id ? activeTab : 0;

        return (
          <section
            key={track.id}
            id={track.id}
            ref={(el) => (sectionRefs.current[track.id] = el)}
            className="min-h-screen py-24 md:py-32 bg-section-dark border-b border-[rgba(255,255,255,0.05)]"
          >
            <div className="max-w-7xl mx-auto px-5">
              <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                {/* Sticky sidebar nav */}
                <div className="md:w-56 flex-shrink-0">
                  <div className="md:sticky md:top-28">
                    <nav className="space-y-1">
                      {TRACKS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => scrollToTrack(t.id)}
                          className={`sidebar-nav-item w-full text-left font-normal ${
                            activeTrack === t.id ? "active" : ""
                          }`}
                        >
                          {activeTrack === t.id ? t.label : t.label.split(" ")[0]}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Content area */}
                <div className="flex-1 max-w-3xl">
                  {/* Decorative dot-matrix icon */}
                  <div className="mb-8">
                    <div className="dot-matrix-icon text-[#555550]">
                      {Array.from({ length: 25 }, (_, i) => <span key={i} />)}
                    </div>
                  </div>

                  {/* Two-tone heading */}
                  <div className="mb-10">
                    <NeonHeading bright={track.bright} dim={track.dim} />
                  </div>

                  {/* Tab toggles */}
                  <div className="flex gap-1 mb-8">
                    {track.tabs.map((tab, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => setActiveTab(tIdx)}
                        className={`px-5 py-2.5 text-sm font-normal rounded-lg border transition-all duration-200 ${
                          currentTab === tIdx
                            ? "bg-white/10 text-white border-white/15"
                            : "bg-transparent text-white/30 border-white/8 hover:text-white/50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div
                    key={`${track.id}-${currentTab}`}
                    className="rounded-xl border p-6 md:p-8 mb-10 bg-[#111110] border-[rgba(255,255,255,0.07)]"
                  >
                    <ul className="space-y-3">
                      {track.tabs[currentTab]?.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#2D7A22]" />
                          <span className="text-sm leading-relaxed text-[#888880] font-light">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-8">
                    {track.stats.map((stat, sIdx) => (
                      <div key={sIdx}>
                        <p className="text-3xl font-display font-light text-[#F0EDE6]">
                          {stat.value}
                        </p>
                        <p className="text-xs font-normal mt-1 uppercase tracking-wide text-[#555550]">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
