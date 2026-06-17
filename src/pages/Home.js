import React, { useState, useEffect, useRef } from "react";
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

const letterVariants = {
  hidden: { opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.35 + i * 0.07,
    },
  }),
};

export default function Home() {
  const showToast = useToast();
  const [email,      setEmail]      = useState("");
  const [message,    setMessage]    = useState(null);
  const [tickerIdx,  setTickerIdx]  = useState(0);
  const [eyebrow,    setEyebrow]    = useState("");
  const [caretOn,    setCaretOn]    = useState(true);
  const eyebrowDone  = useRef(false);

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
        style={{ padding: "120px 48px 80px" }}
        className="relative min-h-screen flex flex-col justify-between bg-[#0A0A08] overflow-hidden"
      >
        <div className="flex-1 flex flex-col justify-center max-w-2xl mt-8">
          {/* Eyebrow — terminal typewriter */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#3A9C2D] font-normal">
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

          {/* Headline — NACOS fades in, Bells. letters stagger-reveal with glow */}
          <h1 className="font-display text-[#F0EDE6] text-[clamp(3rem,7vw,6rem)] font-light tracking-[-0.03em] leading-[1.05] mb-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              NACOS{" "}
            </motion.span>
            <span
              className="font-medium inline-flex"
              style={{
                filter: "drop-shadow(0 0 18px rgba(58,156,45,0.45))",
                animation: "bellsGlow 3.5s ease-in-out infinite",
              }}
            >
              {BELLS_LETTERS.map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* keyframes injected once */}
          <style>{`
            @keyframes bellsGlow {
              0%,100% { filter: drop-shadow(0 0 10px rgba(58,156,45,0.30)); }
              50%      { filter: drop-shadow(0 0 28px rgba(58,156,45,0.65)); }
            }
          `}</style>

          {/* Keyword Ticker */}
          <div className="h-8 flex items-center gap-2 mb-8 text-sm font-light text-[#888880]">
            <span>We exist to</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-[#F0EDE6] font-display font-medium text-base"
              >
                {KEYWORDS[tickerIdx]}.
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Subtext */}
          <p className="text-[16px] font-light text-[#888880] max-w-[440px] leading-[1.7] mb-8">
            Developing future-focused software engineering, design, and cybersecurity leaders at Bells University.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-6">
            <Link
              to="/contact"
              style={{ background: "#2D7A22" }}
              className="text-[#F0EDE6] hover:bg-[#3A9C2D] font-normal text-[13px] px-5 py-2.5 rounded-[6px] transition-colors duration-200"
            >
              Join NACOS
            </Link>
            <a
              href="#tracks-deep-dive"
              className="text-[#888880] hover:text-[#F0EDE6] transition-colors duration-200 text-[13px] font-normal flex items-center gap-1.5"
            >
              Explore tracks <span>→</span>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-end justify-between mt-auto pt-10">
          {/* Bottom-left: Scroll hint */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-[0.5px] bg-[#555550]" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] font-normal">
              Scroll to explore
            </span>
          </div>

          {/* Bottom-right: Stats stack */}
          <div className="flex flex-col items-end text-right space-y-4">
            <div className="w-[120px] border-t-[0.5px] border-[rgba(255,255,255,0.07)] pt-3">
              <p className="font-display font-light text-[28px] text-[#F0EDE6] leading-none mb-1">500+</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#555550] font-normal">Members</p>
            </div>
            <div className="w-[120px] border-t-[0.5px] border-[rgba(255,255,255,0.07)] pt-3">
              <p className="font-display font-light text-[28px] text-[#F0EDE6] leading-none mb-1">6</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#555550] font-normal">Tracks</p>
            </div>
            <div className="w-[120px] border-t-[0.5px] border-[rgba(255,255,255,0.07)] pt-3">
              <p className="font-display font-light text-[28px] text-[#F0EDE6] leading-none mb-1">2026/27</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#555550] font-normal">Session</p>
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
      <section className="relative z-10 py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">The Map</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="Interactive Universe." dim="Technology is a living web of collaborative creativity. Select a node to explore connections." />
          </div>
          <InteractiveUniverse />
        </div>
      </section>

      {/* ====== STUDENT PROJECTS ====== */}
      <section className="relative z-10 py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">Student Builds</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="What Students Are Creating." dim="Real-world platforms, VR environments, and production tools built by Bells computing students." />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <section className="relative z-10 py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">Calendar</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="Events in Motion." dim="Stay track-aligned with hackathons, professional bootcamps, pitch nights, and masterclasses." />
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical timeline track */}
            <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-[0.5px] bg-[rgba(255,255,255,0.07)]" />

            <div className="space-y-10">
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
                    {/* Node Dot */}
                    <div
                      className="absolute left-4 md:left-1/2 -translate-x-1/2 w-2 h-2 rounded-full top-5 z-10 border-2 border-[#0A0A08]"
                      style={{ backgroundColor: isPast ? "#555550" : "#2D7A22" }}
                    />

                    <div className={`w-full md:w-[46%] pl-10 md:pl-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}>
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
                        <div className="flex flex-wrap gap-3 text-[10px] text-[#555550] mb-3 font-normal">
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
      <section className="relative z-10 py-24 bg-section-dark border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block">Impact</span>
            <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mb-6" />
            <NeonHeading bright="Our Vibrant Community." dim="Meet the members building portfolios, collaborative projects, and career opportunities at NACOS Bells." />
          </div>

          {/* Stats strip */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-20">
            {[
              { value: "200+", label: "Active Members" },
              { value: "12",   label: "Yearly Events" },
              { value: "40+",  label: "Student Projects" },
              { value: "9",    label: "Tech Tracks" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.05 }}
                className="p-5 border border-[rgba(255,255,255,0.07)] rounded-xl bg-[#111110]"
              >
                <p className="text-3xl font-display font-light text-[#F0EDE6]">{s.value}</p>
                <p className="text-xs text-[#555550] font-normal mt-1.5 uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Testimonial grid */}
          <div className="grid md:grid-cols-3 gap-6">
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
      <section id="newsletter" className="relative z-10 py-32 bg-section-dark border-t border-[rgba(255,255,255,0.07)] flex items-center">
        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-6 inline-block font-normal">Stay Connected</span>
            <h2 className="text-3xl font-display font-medium text-white mb-4">Never Miss an Opportunity</h2>
            <p className="text-[#888880] text-sm mb-10 max-w-lg mx-auto leading-relaxed font-light">
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
                className="flex-1 px-5 py-3 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 text-sm transition-colors"
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
