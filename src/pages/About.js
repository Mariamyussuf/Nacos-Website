import React from "react";
import { motion } from "framer-motion";
import seminar from "../assets/seminar.JPG";
import lab from "../assets/lab.JPG";

const SectionHeader = ({ badge, title, subtitle }) => (
  <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
  >
    <span className="inline-block px-3 py-1 bg-white/[0.02] border border-[rgba(255,255,255,0.07)] text-[#888880] text-[11px] font-normal uppercase tracking-[0.18em] rounded-full">{badge}</span>
    <div className="w-[40px] h-[0.5px] bg-[rgba(255,255,255,0.07)] mx-auto mt-4 mb-6" />
    <h2 className="section-title">{title}</h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </motion.div>
);

const ValueCard = ({ icon, title, text, delay }) => (
  <motion.div
    className="glow-card p-7"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
  >
    <div className="w-12 h-12 rounded-xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-xl mb-4">
      {icon}
    </div>
    <h3 className="font-display font-medium text-[#F0EDE6] text-base mb-2">{title}</h3>
    <p className="text-[#888880] text-sm leading-relaxed font-light">{text}</p>
  </motion.div>
);

const About = () => {
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
            Who We Are
          </span>
          <h1 className="font-display font-medium text-5xl text-white mb-6 leading-tight">
            About NACOS <span className="font-medium text-[#2D7A22]">Bells Chapter</span>
          </h1>
          <p className="text-[#888880] text-lg leading-relaxed max-w-2xl mx-auto font-light">
            The official student representative body and governing association of the College of Computing (COLCOMP) at
            Bells University of Technology, Ota. We bridge the gap between academic excellence and active student life,
            coordinating tech innovation, social events, and student welfare.
          </p>
        </motion.div>
      </section>

      {/* ====== MANDATE ====== */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block px-3 py-1 bg-white/[0.02] border border-[rgba(255,255,255,0.07)] text-[#888880] text-[11px] font-normal uppercase tracking-[0.18em] rounded-full mb-4">Representative Body</span>
            <h2 className="section-title mb-4">Official College Mandate</h2>
            <div className="space-y-4 text-[#888880] leading-relaxed text-sm font-light">
              <p>
                As the primary student representative body for the College of Computing, NACOS Bells Chapter
                unifies, represents, and advocates for all computing students. We serve as the active link between
                the student body and faculty leadership, ensuring a supportive and engaging environment.
              </p>
              <p>
                Our mandate balances rigorous technical and academic development with active social events, sports,
                and community outreach. From coding hackathons and technical bootcamps to social hangouts, sports competitions,
                and welfare initiatives, we ensure every student has a platform to thrive academically and socially.
              </p>
              <p>
                Every student registered under any of the departments in the College of Computing is
                automatically represented by NACOS, supported by our student legislative and executive councils.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.07)]">
              <img src={seminar} alt="NACOS Academic Seminar" className="w-full h-72 object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl overflow-hidden border-4 border-[#0A0A08] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              <img src={lab} alt="Computing Lab" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== VISION & MISSION ====== */}
      <section className="relative z-10 py-20 border-t border-[rgba(255,255,255,0.07)] bg-[#111110]/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            badge="Our Purpose"
            title="Vision &amp; Mission"
            subtitle="The academic and institutional goals guiding NACOS Bells Chapter's governing policies."
          />

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="relative glow-card p-8 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-white mb-5 relative z-10">
                <i className="ti ti-eye text-xl text-[#2D7A22]" />
              </div>
              <h3 className="font-display font-medium text-[#F0EDE6] text-xl mb-3 relative z-10">Our Vision</h3>
              <p className="text-[#888880] leading-relaxed relative z-10 font-light text-sm">
                To build an internationally recognized center of academic excellence and technical capability
                where every computing student is empowered to innovate and lead.
              </p>
            </motion.div>

            <motion.div
              className="relative glow-card p-8 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-white mb-5 relative z-10">
                <i className="ti ti-target text-xl text-[#2D7A22]" />
              </div>
              <h3 className="font-display font-medium text-[#F0EDE6] text-xl mb-3 relative z-10">Our Mission</h3>
              <p className="text-[#888880] leading-relaxed relative z-10 font-light text-sm">
                To implement rigorous academic mentorship, professional skills acquisition, and structured student
                advocacy, aligning with global benchmarks for computing education.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== CORE VALUES ====== */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Our Principles"
          title="Core Values"
          subtitle="The professional and academic foundations upheld by all members of the governing association."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueCard icon={<i className="ti ti-bulb text-[#888880]" />} title="Innovation" text="We advocate for creative technical solutions and practical problem-solving in computing." delay={0} />
          <ValueCard icon={<i className="ti ti-users text-[#888880]" />} title="Academic Unity" text="We maintain a coordinated network of support across all three departments." delay={0.05} />
          <ValueCard icon={<i className="ti ti-award text-[#888880]" />} title="Excellence" text="We uphold top-tier standards in examinations, laboratory research, and design." delay={0.1} />
          <ValueCard icon={<i className="ti ti-shield-lock text-[#888880]" />} title="Professionalism" text="We promote accountability, ethical standards, and academic integrity." delay={0.15} />
        </div>
      </section>

      {/* ====== DEPARTMENTS & ACADEMIC PROGRAMMES ====== */}
      <section className="relative z-10 py-20 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            badge="Academic Offerings"
            title="Departments &amp; Programmes"
            subtitle="Accredited degree courses administered under the College of Computing Science."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {/* Department 1 */}
            <motion.div
              className="glow-card p-8 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div>
                <span className="text-[11px] font-normal uppercase tracking-wider text-[#888880] block mb-2">Department 01</span>
                <h3 className="font-display font-medium text-[#F0EDE6] text-lg mb-4 border-b border-[rgba(255,255,255,0.07)] pb-3">
                  Department of Computer Sciences
                </h3>
                <p className="text-[#888880] text-sm mb-6 leading-relaxed font-light">
                  Focusing on foundational algorithms, software engineering principles, and computational analytics.
                </p>
                <div className="space-y-3">
                  <span className="text-[9px] font-normal text-[#555550] uppercase tracking-widest block">Degrees Offered</span>
                  <div className="flex flex-col gap-2">
                    {["B.Tech. Computer Science", "B.Tech. Software Engineering", "B.Tech. Data Science"].map((deg) => (
                      <div key={deg} className="flex items-center gap-3 bg-[#1A1A17]/50 p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A22] shrink-0" />
                        <span className="text-[#F0EDE6] text-xs font-normal">{deg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Department 2 */}
            <motion.div
              className="glow-card p-8 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
            >
              <div>
                <span className="text-[11px] font-normal uppercase tracking-wider text-[#888880] block mb-2">Department 02</span>
                <h3 className="font-display font-medium text-[#F0EDE6] text-lg mb-4 border-b border-[rgba(255,255,255,0.07)] pb-3">
                  Department of Information Technology
                </h3>
                <p className="text-[#888880] text-sm mb-6 leading-relaxed font-light">
                  Managing enterprise database structures, library science systems, and information networks.
                </p>
                <div className="space-y-3">
                  <span className="text-[9px] font-normal text-[#555550] uppercase tracking-widest block">Degrees Offered</span>
                  <div className="flex flex-col gap-2">
                    {["B.Tech. Information Technology", "B.Sc. Library & Information Science"].map((deg) => (
                      <div key={deg} className="flex items-center gap-3 bg-[#1A1A17]/50 p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A22] shrink-0" />
                        <span className="text-[#F0EDE6] text-xs font-normal">{deg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Department 3 */}
            <motion.div
              className="glow-card p-8 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            >
              <div>
                <span className="text-[11px] font-normal uppercase tracking-wider text-[#888880] block mb-2">Department 03</span>
                <h3 className="font-display font-medium text-[#F0EDE6] text-lg mb-4 border-b border-[rgba(255,255,255,0.07)] pb-3">
                  Department of Cyber Security
                </h3>
                <p className="text-[#888880] text-sm mb-6 leading-relaxed font-light">
                  Defending assets, analyzing system risks, and practicing security audit methodologies.
                </p>
                <div className="space-y-3">
                  <span className="text-[9px] font-normal text-[#555550] uppercase tracking-widest block">Degrees Offered</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-[#1A1A17]/50 p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A22] shrink-0" />
                      <span className="text-[#F0EDE6] text-xs font-normal">B.Tech. Cyber Security</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== ACADEMIC LEADERSHIP ====== */}
      <section className="relative z-10 py-24 border-t border-[rgba(255,255,255,0.07)] bg-[#111110]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            badge="Academic Leadership"
            title="COLCOMP &amp; Faculty Support"
            subtitle="NACOS Bells Chapter is proudly affiliated with the College of Computing Science (COLCOMP)."
          />

          {/* DEAN / COLLEGE CARD (Hero) */}
          <div className="flex justify-center mb-16">
            <motion.div
              className="glow-card p-8 max-w-lg w-full text-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="w-20 h-20 rounded-2xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-105 relative z-10">
                <i className="ti ti-school text-[#2D7A22] text-3xl" />
              </div>

              <span className="inline-block px-3 py-1 bg-white/[0.02] border border-[rgba(255,255,255,0.07)] text-[#888880] text-[10px] font-normal uppercase tracking-[0.16em] rounded-full mb-3 relative z-10">College Dean</span>
              <h3 className="font-display font-medium text-white text-xl mb-1 relative z-10">Dr. Adegoke</h3>
              <p className="text-[#2D7A22] text-xs font-normal uppercase tracking-wider mb-4 relative z-10">Dean, College of Computing Science (COLCOMP)</p>
              <p className="text-[#888880] text-sm leading-relaxed max-w-md mx-auto relative z-10 font-light">
                Providing vision, strategic leadership, and academic guidance for all departments under the College of Computing Science.
              </p>
            </motion.div>
          </div>

          {/* HODs (Heads of Departments) */}
          <div className="mb-16">
            <motion.h3
              className="text-center font-display text-sm font-medium text-[#888880] mb-8 tracking-wider uppercase"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Heads of Departments
            </motion.h3>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Ezike",
                  role: "Head of Department",
                  dept: "Department of Computer Sciences",
                  desc: "Overseeing B.Tech Computer Science, Software Engineering, and Data Science programs.",
                  icon: "ti ti-cpu"
                },
                {
                  name: "Dr. Oluwatosin A.E.",
                  role: "Head of Department",
                  dept: "Department of Information Technology",
                  desc: "Overseeing B.Tech Information Technology and B.Sc Library &amp; Information Science programs.",
                  icon: "ti ti-network"
                },
                {
                  name: "Dr. Adeyiga",
                  role: "Head of Department",
                  dept: "Department of Cyber Security",
                  desc: "Overseeing B.Tech Cyber Security program, fostering cyber defense expertise.",
                  icon: "ti ti-shield-lock"
                }
              ].map((hod, i) => (
                <motion.div
                  key={hod.name}
                  className="glow-card p-6 relative overflow-hidden group flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.05 }}
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center mb-5 text-[#888880] group-hover:scale-105 transition-transform duration-300 relative z-10">
                      <i className={`${hod.icon} text-lg`} />
                    </div>

                    <h4 className="font-display font-medium text-white text-base mb-1 relative z-10">{hod.name}</h4>
                    <p className="text-[#2D7A22] text-[10px] font-normal uppercase tracking-wider mb-3 relative z-10">{hod.role}</p>
                    <h5 className="text-[#888880] font-normal text-xs mb-2 relative z-10">{hod.dept}</h5>
                  </div>

                  <p className="text-[#888880] text-xs leading-relaxed mt-2 relative z-10 font-light">{hod.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* STAFF ADVISORS */}
          <div>
            <motion.h3
              className="text-center font-display text-sm font-medium text-[#888880] mb-8 tracking-wider uppercase"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              NACOS Staff Advisors
            </motion.h3>

            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: "Dr. Mrs. Ogunbiyi", role: "Staff Advisor", icon: "ti ti-user-check" },
                { name: "Dr. Achaz", role: "Staff Advisor", icon: "ti ti-user-check" },
                { name: "Mrs. Adewunmi", role: "Staff Advisor", icon: "ti ti-user-check" }
              ].map((advisor, i) => (
                <motion.div
                  key={advisor.name}
                  className="glow-card p-5 text-center relative overflow-hidden group"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.05 }}
                >
                  <div className="w-12 h-12 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center mx-auto mb-4 group-hover:bg-white/[0.02] transition-colors duration-300 relative z-10">
                    <i className={`${advisor.icon} text-[#888880] text-base`} />
                  </div>
                  <h4 className="font-display font-medium text-white text-sm mb-1 relative z-10">{advisor.name}</h4>
                  <p className="text-[#555550] text-xs relative z-10 font-light">{advisor.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
