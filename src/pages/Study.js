import React from "react";
import { motion } from "framer-motion";

const Study = () => {
  const courses = [
    {
      title: "Computer Science",
      description:
        "Explore the foundations of computing, algorithms, and software development. Our program prepares students for careers in software engineering, data science, and AI.",
      requirements: [
        "5 O'Level credits in Mathematics, English, Chemistry, Physics, and one other science subject.",
        "UTME Subjects: Use of English, Mathematics, Physics, and Chemistry.",
      ],
    },
    {
      title: "Information Technology",
      description:
        "Learn to manage and analyze information systems critical for modern businesses. This program focuses on IT management, data systems, and business analytics.",
      requirements: [
        "5 O'Level credits in Mathematics, English, Economics, Physics, and one other science subject.",
        "UTME Subjects: Use of English, Mathematics, Physics, and one of Biology, Chemistry, or Economics.",
      ],
    },
    {
      title: "Cybersecurity",
      description:
        "Our Cybersecurity program equips you with the skills needed to protect organizations from cyber threats. Learn about network security, ethical hacking, and cryptography to defend critical systems.",
      requirements: [
        "5 O'Level credits in Mathematics, English, Physics, Chemistry, and one other science subject.",
        "UTME Subjects: Use of English, Mathematics, Physics, and one of Chemistry, Computer Studies, or Economics.",
      ],
    },
    {
      title: "Data Science",
      description:
        "The Data Science program teaches students how to analyze and interpret complex data. Gain skills in machine learning, statistics, and data visualization to solve real-world problems using data.",
      requirements: [
        "5 O'Level credits in Mathematics, English, Physics, Chemistry, and one other science subject.",
        "UTME Subjects: Use of English, Mathematics, Physics, and one of Computer Studies, Economics, or Geography.",
      ],
    },
  ];

  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      {/* Header */}
      <section className="relative py-24 z-10 overflow-hidden text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] bg-white/[0.02] px-4 py-1.5 rounded-full text-[#888880] text-xs font-normal uppercase tracking-widest mb-6">
            Academic Pathways
          </span>
          <h1 className="font-display font-medium text-5xl text-white mb-6 leading-tight">
            Our <span className="font-medium text-[#2D7A22]">Programmes</span>
          </h1>
          <p className="text-[#888880] text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Choose from our world-class programmes designed to equip you with the
            skills and knowledge needed to excel in your chosen computing field.
          </p>
        </motion.div>
      </section>

      {/* Courses Section */}
      <motion.section
        className="py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
      >
        {courses.map((course, index) => (
          <motion.div
            key={index}
            className="bg-[#111110] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] p-8 rounded-xl transition-all duration-300 flex flex-col justify-between group"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 * index }}
            whileHover={{ y: -4 }}
          >
            <div>
              <h3 className="text-xl font-display font-medium text-white mb-4 border-b border-[rgba(255,255,255,0.07)] pb-3 group-hover:text-[#2D7A22] transition-colors">{course.title}</h3>
              <p className="text-[#888880] text-sm leading-relaxed mb-6 font-light">{course.description}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-[#F0EDE6] uppercase tracking-wider mb-3.5">
                Admission Requirements
              </h4>
              <ul className="space-y-2.5 text-xs text-[#888880] font-light">
                {course.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A22] shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Resources Section */}
      <motion.section
        className="py-20 border-t border-[rgba(255,255,255,0.07)] bg-[#111110]/30 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-display font-medium text-white mb-4">
            Additional Resources
          </h2>
          <p className="text-[#888880] text-sm max-w-lg mx-auto mb-8 font-light leading-relaxed">
            Explore more about the national computing network and resources available to help you succeed.
          </p>
          <div className="flex justify-center mt-8">
            <a
              href="https://www.nacos.org.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Visit National NACOS Website
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Study;
