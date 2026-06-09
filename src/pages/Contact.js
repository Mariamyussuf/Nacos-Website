import React, { useState } from "react";
import { motion } from "framer-motion";

const InfoCard = ({ icon, title, lines }) => (
  <motion.div
    className="card p-6 flex flex-col gap-3"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-12 h-12 rounded-xl bg-nacos-green-muted flex items-center justify-center text-2xl">
      {icon}
    </div>
    <h3 className="font-display font-bold text-nacos-green-dark text-base">{title}</h3>
    {lines.map((line, i) => (
      <p key={i} className="text-gray-500 text-sm">{line}</p>
    ))}
  </motion.div>
);

const Contact = () => {
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
    // Simulate submission
    setSent(true);
  };

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
            Reach Out
          </span>
          <h1 className="font-display font-extrabold text-5xl text-white mb-6">
            Get In <span className="text-shimmer">Touch</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Have questions, suggestions, or want to join NACOS Bells Chapter?
            We'd love to hear from you — don't hesitate to reach out!
          </p>
        </motion.div>
      </section>

      {/* ====== MAIN CONTENT ====== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            className="card p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-1 bg-gradient-to-r from-nacos-green to-nacos-gold -mx-8 -mt-8 mb-8 rounded-t-2xl" />
            <h2 className="font-display font-bold text-nacos-green-dark text-2xl mb-6">Send Us a Message</h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">✅</div>
                <h3 className="font-display font-bold text-nacos-green text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">
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
                  <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-nacos-green">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-nacos-green">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-nacos-green">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green transition-all resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message 🚀
                </button>
              </form>
            )}
          </motion.div>

          {/* Info Cards */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="nacos-badge mb-3 inline-block">Find Us</span>
              <h2 className="font-display font-bold text-nacos-green-dark text-2xl mb-5">Contact Information</h2>
            </motion.div>

            <InfoCard
              icon="📍"
              title="Our Location"
              lines={[
                "Department of Computer & Information Sciences",
                "Bells University of Technology",
                "Km 8 Idiroko Road, Baban Ode, Ota, Ogun State",
              ]}
            />
            <InfoCard
              icon="✉️"
              title="Email Us"
              lines={["nacos.bells@gmail.com", "For general enquiries and partnership requests"]}
            />
            <InfoCard
              icon="⏰"
              title="Office Hours"
              lines={["Monday – Friday: 9:00 AM – 5:00 PM (WAT)", "Check notice boards for exec office hours"]}
            />

            {/* Social links */}
            <motion.div
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-xl bg-nacos-green-muted flex items-center justify-center text-2xl mb-3">
                🌐
              </div>
              <h3 className="font-display font-bold text-nacos-green-dark text-base mb-3">Follow Us</h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Twitter/X", icon: "𝕏", color: "hover:bg-black hover:text-white" },
                  { label: "Instagram", icon: "📸", color: "hover:bg-pink-500 hover:text-white" },
                  { label: "LinkedIn", icon: "in", color: "hover:bg-blue-700 hover:text-white" },
                  { label: "WhatsApp", icon: "💬", color: "hover:bg-green-500 hover:text-white" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 transition-all duration-200 ${s.color}`}
                  >
                    <span>{s.icon}</span>
                    <span className="text-xs font-medium">{s.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== JOIN NACOS ====== */}
      <section className="bg-nacos-green-dark py-16">
        <motion.div
          className="max-w-3xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Ready to join NACOS Bells Chapter?
          </h2>
          <p className="text-gray-300 mb-6">
            Send us a message using the form above or speak to any of our executive members on campus.
            Membership is open to all Computer Science and related discipline students.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/" className="btn-secondary">🔔 Subscribe to Newsletter</a>
            <a
              href="https://www.nacos.org.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white/40 text-white hover:bg-white hover:text-nacos-green"
            >
              Visit National NACOS 🌍
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
