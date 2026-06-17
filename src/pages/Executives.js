import React from "react";
import ExecCard from "../components/ExecCard";
import { motion } from "framer-motion";

const executives = [
  { name: "Yussuf Mariam Agbeke", position: "President", initials: "YMA" },
  { name: "Olayiwola Mubarak Oyinlola", position: "Vice President", initials: "OMO" },
  { name: "Ogunwole Richard Olaoluwa", position: "General Secretary", initials: "ORO" },
  { name: "Afolayan Aaliyah Omowunmi", position: "Asst. General Secretary", initials: "AAO" },
  { name: "Abiola Fawziya Aderiike", position: "Financial Secretary", initials: "AFA" },
  { name: "Ibiyemi Olakunle Nathaniel", position: "Asst. Financial Secretary", initials: "ION" },
  { name: "Olapite Samuel Olaosebikan", position: "Sports Director", initials: "OSO" },
  { name: "Elegbede Marvellous Iremide", position: "Asst. Sports Director", initials: "EMI" },
  { name: "Ogundele Ademilade Ridwan", position: "PRO", initials: "OAR" },
  { name: "Mafojuewo Oluwademilade Greatness", position: "Asst. PRO", initials: "MOG" },
  { name: "Okechukwu David Chizuru", position: "Technical Director", initials: "ODC" },
  { name: "Bello Oluwanifemi Simeon-Peter", position: "Welfare Secretary", initials: "BOS" },
  { name: "Ufuah Grace Eboseremen", position: "Asst. Welfare Secretary", initials: "UGE" },
  { name: "Eke Cornell Chukwudi", position: "Social Director", initials: "ECC" },
  { name: "Ireoba Chisom Favour", position: "Asst. Social Director", initials: "ICF" },
];

const Executives = () => {
  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] relative selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      {/* ====== PAGE HEADER ====== */}
      <section className="relative py-24 z-10 overflow-hidden">
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] bg-white/[0.02] px-4 py-1.5 rounded-full text-[#888880] text-xs font-normal uppercase tracking-widest mb-6">
            Current Administration
          </span>
          <h1 className="font-display font-medium text-5xl text-white mb-6 leading-tight">
            Meet Our <span className="font-medium text-[#2D7A22]">Executives</span>
          </h1>
          <p className="text-[#888880] text-lg leading-relaxed max-w-2xl mx-auto font-light">
            The dedicated leaders steering NACOS Bells Chapter towards excellence, innovation, and unity.
          </p>
        </motion.div>
      </section>

      {/* ====== UNIFIED EXECUTIVES GRID ====== */}
      <section className="relative z-10 py-12 max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {executives.map((exec, i) => (
            <ExecCard key={exec.name} {...exec} delay={i * 0.03} />
          ))}
        </div>
      </section>

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
