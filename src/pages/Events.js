import React, { useState } from "react";
import { motion } from "framer-motion";
import EventCard from "../components/EventCard";

const events = [
  {
    title: "NACOS Welcome Week 2025",
    date: "February 10, 2025",
    venue: "Main Auditorium, Bells University",
    description: "Annual welcome gathering for new and returning NACOS members. Featuring introductions, chapter updates, and social activities.",
    category: "Social",
    status: "past",
  },
  {
    title: "Tech Talk: AI & The Future of Computing",
    date: "March 5, 2025",
    venue: "ICT Lecture Hall, Block C",
    description: "An insightful seminar on Artificial Intelligence trends and their impact on the computing landscape. Guest speakers from industry included.",
    category: "Seminar",
    status: "past",
  },
  {
    title: "NACOS Coding Challenge 2025",
    date: "April 20, 2025",
    venue: "Computer Lab 1 & 2, Bells University",
    description: "An exciting inter-departmental coding competition testing problem-solving skills. Open to all CS and IT students.",
    category: "Competition",
    status: "past",
  },
  {
    title: "Web Development Bootcamp",
    date: "May 14–16, 2025",
    venue: "ICT Centre, Bells University",
    description: "A 3-day intensive hands-on workshop covering HTML, CSS, JavaScript, and React. Perfect for beginners and intermediate developers.",
    category: "Workshop",
    status: "past",
  },
  {
    title: "NACOS End-of-Year Gala 2025",
    date: "June 28, 2025",
    venue: "Multipurpose Hall, Bells University",
    description: "Celebrate another great year with your fellow NACOS members. Awards, performances, dinner, and networking.",
    category: "Social",
    status: "upcoming",
  },
  {
    title: "Cybersecurity Awareness Workshop",
    date: "July 12, 2025",
    venue: "Seminar Room B, Faculty of Sciences",
    description: "Practical workshop on online safety, ethical hacking basics, and how to protect your digital identity.",
    category: "Workshop",
    status: "upcoming",
  },
];

const categories = ["All", "Workshop", "Competition", "Social", "Seminar", "General"];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? events
    : events.filter((e) => e.category === activeCategory);

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
            What's Happening
          </span>
          <h1 className="font-display font-extrabold text-5xl text-white mb-6">
            NACOS <span className="text-shimmer">Events</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            From workshops to competitions, from seminars to socials — there's always something happening
            at NACOS Bells Chapter. Don't miss out!
          </p>
        </motion.div>
      </section>

      {/* ====== FILTERS ====== */}
      <section className="bg-white shadow-sm sticky top-16 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-nacos-green text-white shadow-nacos"
                  : "bg-gray-100 text-gray-600 hover:bg-nacos-green-muted hover:text-nacos-green"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ====== EVENTS GRID ====== */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p className="font-medium">No events in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <EventCard key={i} {...event} delay={i * 0.07} />
            ))}
          </div>
        )}
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section className="bg-nacos-green-dark py-16">
        <motion.div
          className="max-w-3xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Want to suggest an event?
          </h2>
          <p className="text-gray-300 mb-6">
            Have an idea for a workshop, seminar, or social event? Reach out to our PRO team — we'd love to hear from you!
          </p>
          <a href="/contact" className="btn-secondary">
            Get In Touch 💬
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Events;
