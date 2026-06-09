import React from "react";
import { motion } from "framer-motion";
import seminar from "../assets/seminar.JPG";
import lab from "../assets/lab.JPG";

const SectionHeader = ({ badge, title, subtitle }) => (
  <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <span className="nacos-badge">{badge}</span>
    <div className="section-divider" />
    <h2 className="section-title">{title}</h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </motion.div>
);

const ValueCard = ({ icon, title, text, delay }) => (
  <motion.div
    className="card card-hover p-7"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="w-12 h-12 rounded-xl bg-nacos-green-muted flex items-center justify-center text-2xl mb-4">
      {icon}
    </div>
    <h3 className="font-display font-bold text-nacos-green-dark text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
  </motion.div>
);

const About = () => {
  return (
    <div className="pt-16 bg-nacos-green-muted/20 min-h-screen">
      {/* ====== PAGE HEADER ====== */}
      <section className="relative bg-nacos-pattern py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-nacos-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-nacos-green-light/20 blur-2xl pointer-events-none" />

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-nacos-gold text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 bg-nacos-gold rounded-full animate-pulse-slow" />
            Who We Are
          </span>
          <h1 className="font-display font-extrabold text-5xl text-white mb-6">
            About NACOS <span className="text-shimmer">Bells Chapter</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            We are the official chapter of the Nigerian Association of Computer Science Students at
            Bells University of Technology, Ota — a community built on excellence, innovation, and unity.
          </p>
        </motion.div>
      </section>

      {/* ====== HISTORY ====== */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="nacos-badge mb-4 inline-block">Our Story</span>
            <h2 className="section-title mb-4">A Chapter Built to Last</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
              <p>
                NACOS Bells Chapter was established to give Computer Science students at Bells
                University of Technology a strong, organized voice and platform for academic
                and professional growth.
              </p>
              <p>
                Since our founding, we have organized seminars, workshops, coding bootcamps,
                and social events that foster both technical skills and meaningful connections
                among our members.
              </p>
              <p>
                Today, NACOS Bells Chapter stands as one of the most active student associations
                on campus, representing hundreds of students from Computer Science and related disciplines.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-nacos">
              <img src={seminar} alt="NACOS Seminar" className="w-full h-72 object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl overflow-hidden shadow-lg border-4 border-white">
              <img src={lab} alt="Lab" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== VISION & MISSION ====== */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            badge="Our Purpose"
            title="Vision & Mission"
            subtitle="The guiding principles that drive NACOS Bells Chapter forward every day."
          />

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="relative card card-hover p-8 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-nacos-green/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="w-14 h-14 rounded-2xl bg-nacos-green flex items-center justify-center text-2xl mb-5 shadow-nacos">
                🔭
              </div>
              <h3 className="font-display font-bold text-nacos-green-dark text-2xl mb-3">Our Vision</h3>
              <p className="text-gray-500 leading-relaxed">
                To be the most impactful and forward-thinking NACOS chapter in Nigeria — a hub where
                technology meets opportunity and every student can grow into a global tech leader.
              </p>
            </motion.div>

            <motion.div
              className="relative card card-hover p-8 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-nacos-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="w-14 h-14 rounded-2xl bg-nacos-gold flex items-center justify-center text-2xl mb-5 shadow-gold">
                🎯
              </div>
              <h3 className="font-display font-bold text-nacos-green-dark text-2xl mb-3">Our Mission</h3>
              <p className="text-gray-500 leading-relaxed">
                To foster academic excellence, professional development, and a united community among
                Computer Science students at Bells University — through events, mentorship, and collaboration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== CORE VALUES ====== */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Our Core Values"
          title="What Drives Us"
          subtitle="The principles that every NACOS Bells member upholds in their academic and professional life."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueCard icon="💡" title="Innovation" text="We embrace new ideas, technologies, and creative problem-solving approaches." delay={0} />
          <ValueCard icon="🤝" title="Community" text="We build strong bonds of brotherhood and sisterhood among all members." delay={0.1} />
          <ValueCard icon="🏅" title="Excellence" text="We pursue the highest standards in everything — academically and beyond." delay={0.2} />
          <ValueCard icon="🔒" title="Integrity" text="We lead with honesty, accountability, and transparency at all times." delay={0.3} />
        </div>
      </section>

      {/* ====== PATRON / ADVISORS ====== */}
      <section className="bg-nacos-green-dark py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-badge mb-4 inline-block">Faculty Support</span>
            <div className="section-divider" />
            <h2 className="font-display font-extrabold text-4xl text-white mb-4">Our Patron &amp; Advisors</h2>
            <p className="text-gray-300 mb-10">
              NACOS Bells Chapter is supported by dedicated faculty members who guide and mentor our students.
            </p>
          </motion.div>

          <motion.div
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-nacos-gold/20 border-2 border-nacos-gold/40 flex items-center justify-center text-2xl mx-auto mb-4">
              🎓
            </div>
            <h3 className="font-display font-bold text-white text-xl mb-1">Department of Computer &amp; Information Sciences</h3>
            <p className="text-nacos-gold text-sm font-medium mb-3">Bells University of Technology, Ota</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Our chapter is proudly affiliated with and supported by the Department of Computer &amp; Information Sciences.
              Faculty members serve as advisors, mentors, and advocates for NACOS members.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
