import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { subscribe } from "../components/api";

/* ---------- Animated Counter ---------- */
const Counter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ---------- Pill Feature ---------- */
const FeaturePill = ({ icon, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex items-center gap-2 glass px-4 py-2 rounded-full text-white/90 text-sm font-medium"
  >
    <span>{icon}</span>
    <span>{text}</span>
  </motion.div>
);

/* ---------- Why Card ---------- */
const WhyCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay }}
    className="card card-hover p-8 flex flex-col gap-4"
  >
    <div className="w-14 h-14 rounded-2xl bg-nacos-green-muted flex items-center justify-center text-2xl">
      {icon}
    </div>
    <h3 className="font-display font-bold text-nacos-green-dark text-xl">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

/* ---------- Home Page ---------- */
const Home = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    try {
      const result = await subscribe(email);
      setMessage({ type: "success", text: result.message });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to subscribe. Please try again later.",
      });
    }
  };

  return (
    <div className="pt-16 bg-nacos-green-muted/30 min-h-screen">
      {/* ====== HERO ====== */}
      <section className="relative min-h-[92vh] bg-nacos-pattern flex items-center overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-white/5 pointer-events-none" />

        {/* Gold blob */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-nacos-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-nacos-green-light/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-nacos-gold text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 bg-nacos-gold rounded-full animate-pulse-slow" />
                Official Chapter — Bells University of Technology
              </span>
            </motion.div>

            <motion.h1
              className="font-display font-extrabold text-5xl md:text-6xl text-white leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Nigerian Association of{" "}
              <span className="text-shimmer">Computer Science</span> Students
            </motion.h1>

            <motion.p
              className="mt-6 text-gray-300 text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              NACOS Bells Chapter — a vibrant community of tech students at Bells University
              of Technology, Ota. We connect, innovate, and lead.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/contact" className="btn-secondary">
                Join NACOS 🚀
              </Link>
              <Link to="/events" className="btn-outline border-white/40 text-white hover:bg-white hover:text-nacos-green">
                View Events
              </Link>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <FeaturePill icon="🎓" text="Academic Excellence" />
              <FeaturePill icon="💡" text="Innovation Hub" />
              <FeaturePill icon="🤝" text="Strong Community" />
            </motion.div>
          </div>

          {/* Right: Logo */}
          <motion.div
            className="hidden md:flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-nacos-gold/20 blur-3xl scale-150" />
              <img
                src={logo}
                alt="NACOS Logo"
                className="relative w-72 h-72 object-contain drop-shadow-2xl animate-float"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-12 md:h-20" fill="#F5F9F6" fillOpacity="0.15">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="bg-white shadow-sm py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 200, suffix: "+", label: "Active Members" },
            { value: 12, suffix: "+", label: "Events Hosted" },
            { value: 3, suffix: " yrs", label: "Years Active" },
            { value: 8, suffix: "+", label: "Projects" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="font-display font-extrabold text-4xl text-nacos-green">
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-gray-500 text-sm mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== ABOUT NACOS ====== */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="nacos-badge">Who We Are</span>
          <div className="section-divider" />
          <h2 className="section-title">What is NACOS?</h2>
          <p className="section-subtitle">
            The Nigerian Association of Computer Science Students (NACOS) is the umbrella body for Computer Science
            students across Nigeria. Our Bells Chapter represents and serves students of the Department of Computer
            &amp; Information Sciences at Bells University of Technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <WhyCard
            icon="🎯"
            title="Our Mission"
            desc="To foster academic excellence, professional development, and a strong sense of community among Computer Science students at Bells University."
            delay={0}
          />
          <WhyCard
            icon="🌍"
            title="Our Vision"
            desc="To be the most impactful chapter of NACOS in Nigeria — bridging the gap between students and the tech industry."
            delay={0.1}
          />
          <WhyCard
            icon="⚡"
            title="Our Values"
            desc="Innovation, integrity, collaboration, and excellence are the core values that guide everything NACOS Bells Chapter does."
            delay={0.2}
          />
        </div>
      </section>

      {/* ====== WHY JOIN ====== */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="nacos-badge">Benefits</span>
            <div className="section-divider" />
            <h2 className="section-title">Why Join NACOS?</h2>
            <p className="section-subtitle">
              Being part of NACOS opens doors to opportunities you can't find anywhere else on campus.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🏆", title: "Competitions", desc: "Represent your department in hackathons, coding challenges, and tech competitions." },
              { icon: "🤝", title: "Networking", desc: "Connect with industry professionals, alumni, and fellow tech enthusiasts." },
              { icon: "📚", title: "Learning", desc: "Access workshops, seminars, and study resources tailored for CS students." },
              { icon: "💼", title: "Career Growth", desc: "Internship leads, CV reviews, and interview prep from those who've been there." },
            ].map((item, i) => (
              <WhyCard key={i} {...item} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA / NEWSLETTER ====== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-nacos-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-nacos-gold/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-badge mb-4 inline-block">Stay Updated</span>
            <h2 className="font-display font-extrabold text-4xl text-white mb-4">
              Never miss a thing
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to the NACOS Bells newsletter for event announcements, opportunities, and chapter news.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 max-w-sm px-5 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-nacos-gold text-sm"
              />
              <button
                type="submit"
                className="btn-secondary whitespace-nowrap"
              >
                Subscribe ✉️
              </button>
            </form>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-sm font-medium ${
                  message.type === "success" ? "text-nacos-gold-light" : "text-red-300"
                }`}
              >
                {message.text}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
