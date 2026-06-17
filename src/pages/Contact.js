import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "../components/Toast";

const InfoCard = ({ icon, title, lines }) => (
  <motion.div
    className="glow-card p-6 flex flex-col gap-3"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
  >
    <div className="w-12 h-12 rounded-xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-xl">
      {icon}
    </div>
    <h3 className="font-display font-medium text-[#F0EDE6] text-base">{title}</h3>
    {lines.map((line, i) => (
      <p key={i} className="text-[#888880] text-sm font-light">{line}</p>
    ))}
  </motion.div>
);

const Contact = () => {
  const showToast = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    showToast("Message sent successfully! We'll get back to you soon.", "success");
    setSent(true);
  };

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
            Reach Out
          </span>
          <h1 className="font-display font-medium text-5xl text-white mb-6 leading-tight">
            Get In <span className="font-medium text-[#2D7A22]">Touch</span>
          </h1>
          <p className="text-[#888880] text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Have questions, suggestions, or want to join NACOS Bells Chapter?
            We'd love to hear from you — don't hesitate to reach out!
          </p>
        </motion.div>
      </section>

      {/* ====== MAIN CONTENT ====== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            className="glow-card p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="font-display font-medium text-[#F0EDE6] text-xl mb-6">Send Us a Message</h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4 text-[#2D7A22]"><i className="ti ti-circle-check" /></div>
                <h3 className="font-display font-medium text-[#2D7A22] text-lg mb-2">Message Sent!</h3>
                <p className="text-[#888880] text-sm font-light">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 btn-outline"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="text-[#FF2D6B] text-xs bg-[#FF2D6B]/5 border border-[#FF2D6B]/25 rounded-md p-3">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-normal text-[#888880] mb-1.5 uppercase tracking-wide">
                      Full Name <span className="text-[#2D7A22]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] text-sm placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-normal text-[#888880] mb-1.5 uppercase tracking-wide">
                      Email <span className="text-[#2D7A22]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] text-sm placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-normal text-[#888880] mb-1.5 uppercase tracking-wide">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] text-sm placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-normal text-[#888880] mb-1.5 uppercase tracking-wide">
                    Message <span className="text-[#2D7A22]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] text-sm placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 transition-colors resize-none"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-2.5">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Info Cards */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-3 inline-block font-normal">Find Us</span>
              <h2 className="font-display font-medium text-white text-2xl mb-5">Contact Information</h2>
            </motion.div>

            <InfoCard
              icon={<i className="ti ti-map-pin text-[#888880]" />}
              title="Our Location"
              lines={[
                "Department of Computer & Information Sciences",
                "Bells University of Technology",
                "Km 8 Idiroko Road, Baban Ode, Ota, Ogun State",
              ]}
            />
            <InfoCard
              icon={<i className="ti ti-mail text-[#888880]" />}
              title="Email Us"
              lines={["nacos.bells@gmail.com", "For general enquiries and partnership requests"]}
            />
            <InfoCard
              icon={<i className="ti ti-clock text-[#888880]" />}
              title="Office Hours"
              lines={[
                "Monday – Friday: 9:00 AM – 5:00 PM (WAT)",
                "Check notice boards for executive office hours",
              ]}
            />

            {/* Social links */}
            <motion.div
              className="glow-card p-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#888880] mb-3">
                <i className="ti ti-world text-xl" />
              </div>
              <h3 className="font-display font-medium text-[#F0EDE6] text-base mb-3">Follow Us</h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Twitter/X", icon: <i className="ti ti-brand-x text-sm" />, href: "https://x.com/nacosbells" },
                  { label: "Instagram", icon: <i className="ti ti-camera text-sm" />, href: "https://instagram.com/nacosbells" },
                  { label: "LinkedIn", icon: <i className="ti ti-brand-linkedin text-sm" />, href: "https://linkedin.com/company/nacos-bells" },
                  { label: "WhatsApp", icon: <i className="ti ti-brand-whatsapp text-sm" />, href: "https://chat.whatsapp.com/nacos-bells-community" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.07)] bg-white/[0.02] text-xs text-[#888880] hover:text-[#F0EDE6] hover:bg-white/[0.04] transition-colors"
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== JOIN NACOS ====== */}
      <section className="relative z-10 py-16 border-t border-[rgba(255,255,255,0.07)] bg-[#111110]">
        <motion.div
          className="max-w-3xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="font-display font-medium text-3xl text-white mb-4">
            Ready to join NACOS Bells Chapter?
          </h2>
          <p className="text-[#888880] mb-6 font-light">
            Send us a message using the form above or speak to any of our executive members on campus.
            Membership is open to all Computer Science and related discipline students.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/#newsletter" className="btn-primary">Subscribe to Newsletter</a>
            <a
              href="https://www.nacos.org.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Visit National NACOS
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
