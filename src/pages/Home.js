import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { subscribe } from "../components/api";
import { useToast } from "../components/Toast";
import LogoStrip from "../components/LogoStrip";
import TracksStrip from "../components/TracksStrip";
import TracksDeepDive from "../components/TracksDeepDive";
import InteractiveUniverse from "../components/InteractiveUniverse";
import GlowCard from "../components/GlowCard";
import NeonHeading from "../components/NeonHeading";
import HeroScene from "../components/HeroScene";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const STUDENT_PROJECTS = [
  {
    title: "Bells Course Planner",
    type: "AI & Software",
    desc: "An AI-powered academic advisor that maps optimal course pathways, class schedules, and graduation paths based on student performance.",
    tags: ["Next.js", "Python", "FastAPI", "OpenAI"],
    stars: 24,
  },
  {
    title: "Lumina Creator Hub",
    type: "Media & Videography",
    desc: "A matching platform for student photographers, videographers, and editors to showcase portfolios and secure event coverage gigs at Bells.",
    tags: ["React", "Cloudinary", "Node.js", "MongoDB"],
    stars: 35,
  },
  {
    title: "Nacos Space VR",
    type: "3D & Design",
    desc: "A virtual digital replica of the Bells department building. Students attend workshops and walk through lab spaces in VR.",
    tags: ["Three.js", "WebXR", "React", "Blender"],
    stars: 18,
  },
];

const GALLERY_ITEMS = [
  {
    title: "Eco-Crypt Data Cipher",
    category: "Research",
    desc: "Optimized cryptographic protocol for low-power IoT agricultural sensors on campus.",
    badge: "Paper Published",
  },
  {
    title: "FrameCut Video Library",
    category: "Media Tools",
    desc: "Open-source browser tool that auto-clips video lectures using AI-generated transcripts.",
    badge: "Active Tool",
  },
  {
    title: "Figma UI Kit v1.0",
    category: "Design",
    desc: "Accessible Design System and Component Library for educational and university web portals.",
    badge: "120+ Downloads",
  },
  {
    title: "Bells AI Bot Alpha",
    category: "AI Systems",
    desc: "Autonomous WhatsApp bot providing instant answers about timetables, class venues, and grades.",
    badge: "Beta Active",
  },
];

const TIMELINE_EVENTS = [
  {
    title: "NACOS Tech Fest '26",
    date: "July 12–16, 2026",
    venue: "Main Auditorium",
    desc: "5 days of coding hackathons, photography contests, design showcases, and talks from tech and media executives.",
    status: "upcoming",
    category: "Festival",
  },
  {
    title: "Bells Founders Pitch Night",
    date: "August 24, 2026",
    venue: "CIS Lecture Hall 2",
    desc: "Pitch your tech or media startup idea to seed investors and win project development grants.",
    status: "upcoming",
    category: "Competition",
  },
  {
    title: "UI/UX & Video Editing Bootcamp",
    date: "May 10–28, 2026",
    venue: "CIS Advanced Lab",
    desc: "3-week intensive: Figma wireframing, Premiere/DaVinci cutting, lighting basics, and micro-animations.",
    status: "past",
    category: "Workshop",
  },
  {
    title: "Creative Content Masterclass",
    date: "April 18, 2026",
    venue: "CIS Lecture Room 1",
    desc: "Writing technical scripts, shooting developer vlogs, and editing tech media podcasts.",
    status: "past",
    category: "Workshop",
  },
];

const TESTIMONIALS = [
  {
    name: "Tunde Alabi",
    role: "Core Developer",
    quote: "NACOS gave me my first open source PR approval, a community to review my code, and an internship lead — all in the same semester.",
    handle: "@tunde.dev",
  },
  {
    name: "Adaeze Okafor",
    role: "Media Producer & Creator",
    quote: "NACOS was the first community that valued technical video editing, photography, and visual branding as critical creative roles — not just extras.",
    handle: "@adaeze.creates",
  },
  {
    name: "Ibrahim Sani",
    role: "Product Designer",
    quote: "I don't write code, but designing Figma wireframes for the NACOS tech team boosted my portfolio enormously.",
    handle: "@ibrahim.ux",
  },
];



const KEYWORDS = ["Explore", "Build", "Design", "Research", "Shoot", "Edit", "Innovate"];

const EYEBROW_TEXT = "Where Technology Meets Talent";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BELLS_LETTERS = "Bells.".split("");

export default function Home() {
  const showToast = useToast();
  const [email,      setEmail]      = useState("");
  const [message,    setMessage]    = useState(null);
  const [tickerIdx,  setTickerIdx]  = useState(0);
  const [eyebrow,    setEyebrow]    = useState("");
  const [caretOn,    setCaretOn]    = useState(true);
  const eyebrowDone  = useRef(false);

  // ── GSAP refs ──
  const heroRef        = useRef(null);
  const bellsRef       = useRef(null);
  const scrollHintRef  = useRef(null);
  const timelineRef    = useRef(null);
  const progressRef    = useRef(null);
  const statsRef       = useRef(null);

  // ── GSAP: Hero "Bells." character split animation ──
  useEffect(() => {
    if (!bellsRef.current) return;
    const chars = bellsRef.current.querySelectorAll(".gsap-char");

    const ctx = gsap.context(() => {
      gsap.set(chars, {
        opacity: 0,
        y: 40,
        rotateX: -90,
        filter: "blur(8px)",
      });

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.4,
      });
    }, bellsRef.current);

    return () => ctx.revert();
  }, []);

  // ── GSAP: Hero scroll parallax — headline drifts up as user scrolls ──
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".gsap-hero-content", {
        y: -60,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, heroRef.current);

    return () => ctx.revert();
  }, []);

  // ── GSAP: Scroll hint pulsing animation ──
  useEffect(() => {
    if (!scrollHintRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(scrollHintRef.current, {
        opacity: 0.3,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, scrollHintRef.current);
    return () => ctx.revert();
  }, []);

  // ── GSAP: Timeline scroll-scrubbed progress line ──
  useEffect(() => {
    if (!timelineRef.current || !progressRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: 0.3,
          },
        }
      );

      // Pulse timeline dots when they enter viewport
      const dots = timelineRef.current.querySelectorAll(".gsap-timeline-dot");
      dots.forEach((dot) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: dot,
            start: "top 75%",
            once: true,
          },
        });
      });
    }, timelineRef.current);

    return () => ctx.revert();
  }, []);

  // ── GSAP: Stats counter-up animation ──
  useEffect(() => {
    if (!statsRef.current) return;

    const ctx = gsap.context(() => {
      const counters = statsRef.current.querySelectorAll(".gsap-counter");
      counters.forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          snap: { val: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = obj.val + (el.dataset.suffix || "");
          },
        });
      });
    }, statsRef.current);

    return () => ctx.revert();
  }, []);

  // Terminal typewriter for eyebrow
  useEffect(() => {
    let i = 0;
    const speed = 38;
    const timer = setInterval(() => {
      if (i < EYEBROW_TEXT.length) {
        setEyebrow(EYEBROW_TEXT.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        eyebrowDone.current = true;
      }
    }, speed);
    return () => clearInterval(timer);
  }, []);

  // Blinking caret
  useEffect(() => {
    const id = setInterval(() => setCaretOn(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Rotating ticker
  useEffect(() => {
    const id = setInterval(() => setTickerIdx(i => (i + 1) % KEYWORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    try {
      const result = await subscribe(email);
      setMessage({ type: "success", text: result.message || "Successfully subscribed!" });
      setEmail("");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to subscribe. Try again." });
    }
  };

  return (
    <div className="bg-[#0A0A08] min-h-screen text-[#F0EDE6] overflow-x-hidden selection:bg-[#2D7A22] selection:text-[#F0EDE6] relative">

      {/* ====== HERO ====== */}
      <motion.section
        initial="hidden" animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative min-h-screen flex flex-col justify-between bg-[#0A0A08] overflow-hidden pt-28 pb-12 sm:pb-16 px-5 sm:px-8 md:px-12 lg:pt-36 lg:pb-20"
        ref={heroRef}
      >
        <HeroScene />
        <div className="gsap-hero-content flex-1 flex flex-col justify-center max-w-2xl mt-4 sm:mt-8 relative z-10">
          {/* Eyebrow — terminal typewriter */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#3A9C2D] font-normal">
              {eyebrow}
              <span
                style={{
                  display: "inline-block",
                  width: "1px",
                  height: "0.9em",
                  background: caretOn ? "#3A9C2D" : "transparent",
                  marginLeft: "2px",
                  verticalAlign: "middle",
                  transition: "background 0.1s",
                }}
              />
            </span>
          </div>

          {/* Headline — NACOS fades in, Bells. letters stagger-reveal with GSAP */}
          <h1 className="font-display text-[#F0EDE6] text-[clamp(2.5rem,6.5vw,5.5rem)] font-light tracking-[-0.03em] leading-[1.05] mb-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              NACOS{" "}
            </motion.span>
            <span
              ref={bellsRef}
              className="font-medium inline-flex text-[#2D7A22] bells-text"
              style={{
                perspective: "600px",
              }}
            >
              {BELLS_LETTERS.map((char, i) => (
                <span
                  key={i}
                  className="gsap-char"
                  style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>

          {/* keyframes for dark mode */}
          <style>{`
            :not(.light) .bells-text {
              animation: bellsGlow 3.5s ease-in-out infinite;
            }
            .light .bells-text {
              filter: none !important;
              animation: none !important;
            }
            @keyframes bellsGlow {
              0%,100% { filter: drop-shadow(0 0 8px rgba(61,235,0,0.30)); }
              50%      { filter: drop-shadow(0 0 20px rgba(61,235,0,0.55)); }
            }
          `}</style>

          {/* Keyword Ticker */}
          <div className="h-8 flex items-center gap-2 mb-6 sm:mb-8 text-xs sm:text-sm font-light text-[#888880]">
            <span>We exist to</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-[#F0EDE6] font-display font-medium text-sm sm:text-base"
              >
                {KEYWORDS[tickerIdx]}.
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Subtext */}
          <p className="text-[14px] sm:text-[16px] font-light text-[#888880] max-w-[440px] leading-[1.7] mb-6 sm:mb-8">
            Developing future-focused software engineering, design, and cybersecurity leaders at Bells University.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              to="/contact"
              style={{ background: "#2D7A22" }}
              className="text-[#F0EDE6] hover:bg-[#3A9C2D] font-normal text-[13px] px-5 py-2.5 rounded-[6px] transition-colors duration-200"
            >
              Join NACOS
            </Link>
            <a
              href="#tracks-deep-dive"
              className="text-[#888880] hover:text-[#F0EDE6] transition-colors duration-200 text-[13px] font-normal flex items-center gap-1.5 py-2"
            >
              Explore tracks <span>→</span>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-auto pt-8 sm:pt-10 gap-6 relative z-10">
          {/* Bottom-left: Scroll hint */}
          <div ref={scrollHintRef} className="hidden sm:flex items-center gap-3">
            <span className="w-10 h-[0.5px] bg-[#555550]" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] font-normal">
              Scroll to explore
            </span>
          </div>

          {/* Bottom-right: Stats stack */}
          <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-4 sm:gap-0 sm:space-y-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-[rgba(255,255,255,0.07)]">
            <div className="sm:w-[120px] sm:border-t-[0.5px] sm:border-[rgba(255,255,255,0.07)] sm:pt-3">
              <p className="font-display font-light text-xl sm:text-[28px] text-[#F0EDE6] leading-none mb-1">500+</p>
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.18em] text-[#555550] font-normal">Members</p>
            </div>
            <div className="sm:w-[120px] sm:border-t-[0.5px] sm:border-[rgba(255,255,255,0.07)] sm:pt-3">
              <p className="font-display font-light text-xl sm:text-[28px] text-[#F0EDE6] leading-none mb-1">6</p>
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.18em] text-[#555550] font-normal">Tracks</p>
            </div>
            <div className="sm:w-[120px] sm:border-t-[0.5px] sm:border-[rgba(255,255,255,0.07)] sm:pt-3">
              <p className="font-display font-light text-xl sm:text-[28px] text-[#F0EDE6] leading-none mb-1">2026/27</p>
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.18em] text-[#555550] font-normal">Session</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ====== TRACKS STRIP ====== */}
      <TracksStrip />

      {/* ====== LOGO STRIP ====== */}
      <LogoStrip />

      {/* ====== TRACKS DEEP DIVE ====== */}
      <div id="tracks-deep-dive">
        <TracksDeepDive />
      </div>

      {/* ====== INTERACTIVE UNIVERSE ====== */}
      <section className="relative z-10 py-16 sm:py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">The Map</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="Interactive Universe." dim="Technology is a living web of collaborative creativity. Select a node to explore connections." />
          </div>
          <InteractiveUniverse />
        </div>
      </section>

      {/* ====== STUDENT PROJECTS ====== */}
      <section className="relative z-10 py-16 sm:py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">Student Builds</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="What Students Are Creating." dim="Real-world platforms, VR environments, and production tools built by Bells computing students." />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDENT_PROJECTS.map((project, idx) => (
              <GlowCard key={idx} className="p-6 flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded border border-[rgba(255,255,255,0.07)] bg-white/[0.02] text-[#888880]">
                      {project.type}
                    </span>
                    <span className="text-[#888880] text-xs flex items-center gap-1 font-light">
                      <i className="ti ti-star-filled text-xs text-[#2D7A22]" /> {project.stars}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-base text-[#F0EDE6] mb-2">{project.title}</h3>
                  <p className="text-[#888880] text-xs leading-relaxed font-light">{project.desc}</p>
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-normal px-2 py-0.5 rounded border border-[rgba(255,255,255,0.05)] bg-white/[0.01] text-[#555550]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => showToast(`Details for ${project.title} coming soon!`, "info")}
                    className="w-full py-2 rounded bg-white/[0.02] hover:bg-[#2D7A22] border border-[rgba(255,255,255,0.07)] hover:border-transparent text-[#888880] hover:text-white font-normal text-xs transition-colors duration-300"
                  >
                    Inspect Project →
                  </button>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INNOVATION GALLERY ====== */}
      <section className="relative z-10 py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">Portfolio</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="Innovation Gallery." dim="Student-led tech startups, open-source initiatives, design systems, and published research papers." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {GALLERY_ITEMS.map((item, idx) => (
              <GlowCard key={idx} className="p-5 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-normal uppercase tracking-wider text-[#888880]">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.07)] bg-white/[0.02] text-[#888880]">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-[#F0EDE6] text-sm mb-2">{item.title}</h3>
                  <p className="text-[#888880] text-xs leading-relaxed font-light">{item.desc}</p>
                </div>
                <button
                  className="text-xs font-normal mt-4 text-left text-[#888880] hover:text-[#F0EDE6] transition-colors"
                  onClick={() => showToast(`Case study for ${item.title} coming soon!`, "info")}
                >
                  Read Case Study →
                </button>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ====== EVENTS TIMELINE ====== */}
      <section className="relative z-10 py-16 sm:py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">Calendar</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="Events in Motion." dim="Stay track-aligned with hackathons, professional bootcamps, pitch nights, and masterclasses." />
          </div>

          <div ref={timelineRef} className="relative max-w-3xl mx-auto">
            {/* Vertical timeline track (background) */}
            <div className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-1/2 w-[0.5px] bg-[rgba(255,255,255,0.07)]" />
            {/* GSAP scroll-scrubbed progress fill */}
            <div
              ref={progressRef}
              className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-1/2 w-[1.5px] -translate-x-[0.25px] bg-[#2D7A22] origin-top"
              style={{ scaleY: 0 }}
            />

            <div className="space-y-8 sm:space-y-10">
              {TIMELINE_EVENTS.map((event, idx) => {
                const isEven = idx % 2 === 0;
                const isPast = event.status === "past";

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isEven ? -15 : 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className={`relative flex md:flex-row flex-col ${isEven ? "md:justify-start" : "md:justify-end"}`}
                  >
                    {/* Node Dot — GSAP pulsed on scroll */}
                    <div
                      className="gsap-timeline-dot absolute left-3 sm:left-4 md:left-1/2 -translate-x-1/2 w-2 h-2 rounded-full top-5 z-10 border-2 border-[#0A0A08]"
                      style={{ backgroundColor: isPast ? "#555550" : "#2D7A22" }}
                    />

                    <div className={`w-full md:w-[46%] pl-8 sm:pl-10 md:pl-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}>
                      <GlowCard className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-normal uppercase tracking-wider text-[#888880]">
                            {event.category}
                          </span>
                          <span className={`text-[10px] font-normal px-2 py-0.5 rounded-full border ${isPast ? "border-[rgba(255,255,255,0.07)] bg-white/[0.01] text-[#555550]" : "border-[#2D7A22]/30 bg-[#2D7A22]/5 text-[#3A9C2D]"}`}>
                            {event.status}
                          </span>
                        </div>
                        <h3 className="font-display font-medium text-[#F0EDE6] text-sm mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] text-[#555550] mb-3 font-normal">
                          <span>{event.date}</span>
                          <span>·</span>
                          <span>{event.venue}</span>
                        </div>
                        <p className="text-[#888880] text-xs leading-relaxed font-light">{event.desc}</p>
                      </GlowCard>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====== COMMUNITY & IMPACT ====== */}
      <section className="relative z-10 py-16 sm:py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">Impact</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="Our Vibrant Community." dim="Meet the members building portfolios, collaborative projects, and career opportunities at NACOS Bells." />
          </div>

          {/* Stats strip */}
          <div ref={statsRef} className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center mb-14 sm:mb-20">
            {[
              { target: 200, suffix: "+", label: "Active Members" },
              { target: 12,  suffix: "",  label: "Yearly Events" },
              { target: 40,  suffix: "+", label: "Student Projects" },
              { target: 9,   suffix: "",  label: "Tech Tracks" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 border border-[rgba(255,255,255,0.07)] rounded-xl bg-[#111110]"
              >
                <p
                  className="gsap-counter text-2xl sm:text-3xl font-display font-light text-[#F0EDE6]"
                  data-target={s.target}
                  data-suffix={s.suffix}
                >
                  0{s.suffix}
                </p>
                <p className="text-[10px] sm:text-xs text-[#555550] font-normal mt-1.5 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <GlowCard
                key={idx}
                className="p-6 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <span className="text-[#2D7A22] text-2xl font-serif block mb-3 leading-none opacity-40">"</span>
                  <p className="text-[#888880] text-sm leading-relaxed italic mb-6 font-light">"{t.quote}"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.07)] mt-4">
                  <div>
                    <h4 className="text-[#F0EDE6] font-display font-medium text-sm">{t.name}</h4>
                    <span className="text-[10px] text-[#555550] font-normal">{t.role}</span>
                  </div>
                  <span
                    className="text-[10px] font-normal px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.07)] bg-white/[0.02] text-[#888880]"
                  >
                    {t.handle}
                  </span>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ====== NEWSLETTER / CTA ====== */}
      <section id="newsletter" className="relative z-10 py-20 sm:py-32 bg-section-dark border-t border-[rgba(255,255,255,0.07)] flex items-center">
        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-4 sm:mb-6 inline-block font-normal">Stay Connected</span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mb-4">Never Miss an Opportunity</h2>
            <p className="text-[#888880] text-sm mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed font-light">
              Get instant updates on technical bootcamps, hackathon registrations, creative portfolio reviews, and exclusive career events.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your student email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email address for newsletter subscription"
                className="flex-1 px-4 sm:px-5 py-3 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 text-sm transition-colors"
              />
              <button
                type="submit"
                style={{ backgroundColor: "#2D7A22" }}
                className="text-[#F0EDE6] hover:bg-[#3A9C2D] font-normal text-sm px-6 py-3 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-sm font-normal ${message.type === "success" ? "text-[#3A9C2D]" : "text-[#FF2D6B]"}`}
              >
                {message.text}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
