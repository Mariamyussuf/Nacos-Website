import React from "react";
import ExecCard from "../components/ExecCard";
import { motion } from "framer-motion";

const executives = [
  { name: "Yussuf Mariam Agbeke", position: "President", initials: "YMA", color: 0 },
  { name: "Olayiwola Mubarak Oyinlola", position: "Vice President", initials: "OMO", color: 1 },
  { name: "Ogunwole Richard Olaoluwa", position: "General Secretary", initials: "ORO", color: 2 },
  { name: "Afolayan Aaliyah Omowunmi", position: "Asst. General Secretary", initials: "AAO", color: 3 },
  { name: "Abiola Fawziya Aderiike", position: "Financial Secretary", initials: "AFA", color: 4 },
  { name: "Ibiyemi Olakunle Nathaniel", position: "Asst. Financial Secretary", initials: "ION", color: 5 },
  { name: "Olapite Samuel Olaosebikan", position: "Sports Director", initials: "OSO", color: 0 },
  { name: "Elegbede Marvellous Iremide", position: "Asst. Sports Director", initials: "EMI", color: 1 },
  { name: "Ogundele Ademilade Ridwan", position: "PRO", initials: "OAR", color: 2 },
  { name: "Mafojuewo Oluwademilade Greatness", position: "Asst. PRO", initials: "MOG", color: 3 },
  { name: "Okechukwu David Chizuru", position: "Technical Director", initials: "ODC", color: 4 },
  { name: "Bello Oluwanifemi Simeon-Peter", position: "Welfare Secretary", initials: "BOS", color: 5 },
  { name: "Ufuah Grace Eboseremen", position: "Asst. Welfare Secretary", initials: "UGE", color: 0 },
  { name: "Eke Cornell Chukwudi", position: "Social Director", initials: "ECC", color: 1 },
  { name: "Ireoba Chisom Favour", position: "Asst. Social Director", initials: "ICF", color: 2 },
];

const Executives = () => {
  const president = executives[0];
  const vp = executives[1];
  const genSec = executives[2];
  const rest = executives.slice(3);

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
            Current Administration
          </span>
          <h1 className="font-display font-extrabold text-5xl text-white mb-6">
            Meet Our <span className="text-shimmer">Executives</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            The dedicated leaders steering NACOS Bells Chapter towards excellence, innovation, and unity.
          </p>
        </motion.div>
      </section>

      {/* ====== PRESIDENT ROW ====== */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="gold-badge">Exco Leadership</span>
          <div className="section-divider" />
          <h2 className="section-title">Principal Officers</h2>
        </motion.div>

        {/* President - centered hero card */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card p-8 flex flex-col items-center text-center group max-w-xs w-full relative overflow-hidden"
          >
            {/* Gold top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nacos-gold to-nacos-green" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-nacos-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nacos-gold-dark to-nacos-gold flex items-center justify-center mb-4 shadow-gold group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-display font-bold text-2xl">{president.initials}</span>
            </div>
            <span className="gold-badge mb-3">👑 {president.position}</span>
            <h3 className="font-display font-bold text-nacos-green-dark text-lg leading-snug">
              {president.name}
            </h3>
            <p className="text-gray-400 text-xs mt-2">NACOS Bells Chapter</p>
          </motion.div>
        </div>

        {/* VP and Gen Sec */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          {[vp, genSec].map((exec, i) => (
            <ExecCard key={exec.name} {...exec} delay={i * 0.1} />
          ))}
        </div>

        {/* ====== REST OF EXECUTIVES ====== */}
        <motion.div
          className="text-center mb-10 pt-8 border-t border-nacos-green/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="nacos-badge">Other Officers</span>
          <div className="section-divider" />
          <h2 className="section-title">Executive Council</h2>
          <p className="section-subtitle">The complete NACOS Bells Chapter executive team, working tirelessly for our members.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {rest.map((exec, i) => (
            <ExecCard key={exec.name} {...exec} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section className="bg-white py-16">
        <motion.div
          className="max-w-3xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="nacos-badge mb-4 inline-block">Get Involved</span>
          <h2 className="section-title mb-4">Want to be part of the team?</h2>
          <p className="section-subtitle mb-8">
            NACOS Bells welcomes students who are passionate about tech, community, and leadership.
            Elections for the next administration will be announced in due course.
          </p>
          <a href="/contact" className="btn-primary">
            Contact Us 💬
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Executives;
