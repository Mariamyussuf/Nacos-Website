import React from "react";
import { motion } from "framer-motion";
import BlogCard from "../components/BlogCard";

const posts = [
  {
    title: "NACOS Bells Chapter Kicks Off 2025 with a Bang!",
    date: "Feb 12, 2025",
    category: "News",
    author: "PRO Team",
    readTime: "3 min read",
    excerpt:
      "The new academic year started in style as NACOS Bells Chapter welcomed over 200 students at its annual Welcome Week event. From exciting introductions to fun socials, it was a week to remember.",
  },
  {
    title: "Highlights from the NACOS Coding Challenge 2025",
    date: "Apr 25, 2025",
    category: "Events",
    author: "Tech Director",
    readTime: "4 min read",
    excerpt:
      "The 2025 NACOS Coding Challenge saw over 60 participants compete across 3 rounds of algorithmic problem-solving. Here's a full recap of the winners, challenges, and the incredible energy in the room.",
  },
  {
    title: "5 Tech Skills Every CS Student Should Learn in 2025",
    date: "Mar 20, 2025",
    category: "Tech Tips",
    author: "NACOS Bells",
    readTime: "6 min read",
    excerpt:
      "Whether you're in your 100 or 400 level, these five in-demand tech skills will make you stand out to employers and open doors to internships and freelance opportunities.",
  },
  {
    title: "How to Make the Most of Your Time in NACOS",
    date: "Jan 30, 2025",
    category: "Student Life",
    author: "Gen Sec",
    readTime: "5 min read",
    excerpt:
      "Being in NACOS is more than just attending events. Here are practical ways to maximize your membership — from taking on leadership roles to representing NACOS at national competitions.",
  },
  {
    title: "Web Dev Bootcamp 2025: A Student's Perspective",
    date: "May 18, 2025",
    category: "Events",
    author: "Welfare Team",
    readTime: "4 min read",
    excerpt:
      "One of our members shares their experience from the 3-day Web Development Bootcamp — what they learned, what surprised them, and why every CS student should attend next time.",
  },
  {
    title: "Meet Your 2025 NACOS Bells Executives",
    date: "Jan 10, 2025",
    category: "News",
    author: "PRO Team",
    readTime: "3 min read",
    excerpt:
      "A new executive council has been sworn in! Get to know the 15 dedicated student leaders who will be steering the NACOS Bells Chapter ship this year and their plans for the chapter.",
  },
];

const Blog = () => {
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
            Updates & Stories
          </span>
          <h1 className="font-display font-extrabold text-5xl text-white mb-6">
            NACOS <span className="text-shimmer">Blog</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            News, event recaps, tech tips, and stories from NACOS Bells Chapter.
            Stay in the loop with everything happening in our community.
          </p>
        </motion.div>
      </section>

      {/* ====== FEATURED POST ====== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative card overflow-hidden mb-12 group cursor-pointer"
        >
          <div className="h-2 bg-gradient-to-r from-nacos-green via-nacos-gold to-nacos-green-light" />
          <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="gold-badge mb-4 inline-block">✨ Featured Post</span>
              <h2 className="font-display font-extrabold text-nacos-green-dark text-3xl md:text-4xl leading-tight mb-4 group-hover:text-nacos-green transition-colors">
                {posts[0].title}
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">{posts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-nacos-green flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span>{posts[0].author}</span>
                </div>
                <span>·</span>
                <span>{posts[0].date}</span>
                <span>·</span>
                <span>{posts[0].readTime}</span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-nacos-pattern flex items-center justify-center shadow-nacos">
                <span className="text-7xl">📰</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ====== BLOG GRID ====== */}
        <div className="mb-8">
          <span className="nacos-badge">All Posts</span>
          <div className="section-divider" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post, i) => (
            <BlogCard key={i} {...post} delay={i * 0.07} />
          ))}
        </div>
      </section>

      {/* ====== NEWSLETTER CTA ====== */}
      <section className="bg-white py-16">
        <motion.div
          className="max-w-2xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="nacos-badge mb-4 inline-block">Newsletter</span>
          <h2 className="section-title mb-3">Never miss a post</h2>
          <p className="section-subtitle mb-6">
            Get the latest news and updates from NACOS Bells Chapter straight to your inbox.
          </p>
          <a href="/" className="btn-primary">
            Subscribe to Newsletter ✉️
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Blog;
