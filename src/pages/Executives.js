import React from "react";
import ExecCard from "../components/ExecCard";
import { motion } from "framer-motion";

const executiveHierarchy = {
  president: { name: "Yussuf Mariam Agbeke", position: "President", initials: "YMA", featured: true, badge: "Executive Head" },
  principalOfficers: [
    { name: "Olayiwola Mubarak Oyinlola", position: "Vice President", initials: "OMO", badge: "Executive Office" },
    { name: "Ogunwole Richard Olaoluwa", position: "General Secretary", initials: "ORO", badge: "Executive Office" },
  ],
  secretariatAndFinance: [
    { name: "Afolayan Aaliyah Omowunmi", position: "Asst. General Secretary", initials: "AAO" },
    { name: "Abiola Fawziya Aderiike", position: "Financial Secretary", initials: "AFA" },
    { name: "Ibiyemi Olakunle Nathaniel", position: "Asst. Financial Secretary", initials: "ION" },
  ],
  technicalAndMedia: [
    { name: "Okechukwu David Chizuru", position: "Technical Director", initials: "ODC" },
    { name: "Ogundele Ademilade Ridwan", position: "PRO", initials: "OAR" },
    { name: "Mafojuewo Oluwademilade Greatness", position: "Asst. PRO", initials: "MOG" },
  ],
  welfareSportsAndSocial: [
    { name: "Bello Oluwanifemi Simeon-Peter", position: "Welfare Secretary", initials: "BOS" },
    { name: "Ufuah Grace Eboseremen", position: "Asst. Welfare Secretary", initials: "UGE" },
    { name: "Olapite Samuel Olaosebikan", position: "Sports Director", initials: "OSO" },
    { name: "Elegbede Marvellous Iremide", position: "Asst. Sports Director", initials: "EMI" },
    { name: "Eke Cornell Chukwudi", position: "Social Director", initials: "ECC" },
    { name: "Ireoba Chisom Favour", position: "Asst. Social Director", initials: "ICF" },
  ],
};

const TierHeader = ({ badge, title, subtitle }) => (
  <div className="text-center mb-8 sm:mb-10">
    <span className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] bg-white/[0.02] px-3.5 py-1 rounded-full text-[#888880] text-[10px] sm:text-xs font-normal uppercase tracking-widest mb-3">
      {badge}
    </span>
    <h2 className="font-display font-medium text-xl sm:text-2xl text-white mb-2">{title}</h2>
    {subtitle && <p className="text-[#888880] text-xs sm:text-sm font-light max-w-xl mx-auto">{subtitle}</p>}
  </div>
);

const Executives = () => {
  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] relative selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      {/* ====== PAGE HEADER ====== */}
      <section className="relative py-16 sm:py-24 z-10 overflow-hidden">
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-5 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] bg-white/[0.02] px-4 py-1.5 rounded-full text-[#888880] text-xs font-normal uppercase tracking-widest mb-4 sm:mb-6">
            Current Administration
          </span>
          <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-6 leading-tight">
            Executive <span className="font-medium text-[#2D7A22]">Council</span>
          </h1>
          <p className="text-[#888880] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            The governing structure and student leadership steering NACOS Bells Chapter towards excellence, innovation, and unity.
          </p>
        </motion.div>
      </section>

      {/* ====== HIERARCHICAL EXECUTIVES CONTAINER ====== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24 pb-20">
        
        {/* TIER 1: EXECUTIVE PRESIDENCY & PRINCIPAL OFFICERS */}
        <section>
          <TierHeader
            badge="Tier 01"
            title="Office of the President &amp; Principal Leadership"
            subtitle="The executive leadership providing visionary direction and institutional governance."
          />

          {/* Featured President Card */}
          <div className="max-w-md mx-auto mb-6 sm:mb-8">
            <ExecCard {...executiveHierarchy.president} delay={0.05} />
          </div>

          {/* Vice President & General Secretary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {executiveHierarchy.principalOfficers.map((exec, i) => (
              <ExecCard key={exec.name} {...exec} delay={0.1 + i * 0.05} />
            ))}
          </div>
        </section>

        {/* TIER 2: SECRETARIAT & FINANCIAL ADMINISTRATION */}
        <section className="pt-8 border-t border-[rgba(255,255,255,0.07)]">
          <TierHeader
            badge="Tier 02"
            title="Secretariat &amp; Financial Directorate"
            subtitle="Managing administrative documentation, communications, and institutional budgeting."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6 max-w-5xl mx-auto">
            {executiveHierarchy.secretariatAndFinance.map((exec, i) => (
              <ExecCard key={exec.name} {...exec} delay={i * 0.05} />
            ))}
          </div>
        </section>

        {/* TIER 3: TECHNICAL & PUBLIC RELATIONS */}
        <section className="pt-8 border-t border-[rgba(255,255,255,0.07)]">
          <TierHeader
            badge="Tier 03"
            title="Technology &amp; Media Directorate"
            subtitle="Leading software innovation, developer tracks, brand identity, and public communications."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6 max-w-5xl mx-auto">
            {executiveHierarchy.technicalAndMedia.map((exec, i) => (
              <ExecCard key={exec.name} {...exec} delay={i * 0.05} />
            ))}
          </div>
        </section>

        {/* TIER 4: STUDENT WELFARE, SPORTS & SOCIAL AFFAIRS */}
        <section className="pt-8 border-t border-[rgba(255,255,255,0.07)]">
          <TierHeader
            badge="Tier 04"
            title="Welfare, Sports &amp; Social Life"
            subtitle="Championing student wellness, recreational sports competitions, community hangouts, and social events."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6 max-w-5xl mx-auto">
            {executiveHierarchy.welfareSportsAndSocial.map((exec, i) => (
              <ExecCard key={exec.name} {...exec} delay={i * 0.04} />
            ))}
          </div>
        </section>

      </div>

      {/* ====== BOTTOM CTA ====== */}
      <section className="relative z-10 py-16 border-t border-[rgba(255,255,255,0.07)] bg-[#111110]">
        <motion.div
          className="max-w-3xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-4 inline-block font-normal">Get Involved</span>
          <h2 className="section-title mb-4">Want to be part of the team?</h2>
          <p className="section-subtitle mb-8 font-light">
            NACOS Bells welcomes students who are passionate about tech, community, and leadership.
            Elections for the next administration will be announced in due course.
          </p>
          <a href="/contact" className="btn-primary">
            Contact Us
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Executives;
