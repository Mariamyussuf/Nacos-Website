import React, { useState } from "react";
import { motion } from "framer-motion";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";

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
  const [expandedPost, setExpandedPost] = useState(null);
  const [blogPosts] = useState(() => {
    const saved = localStorage.getItem("blogs");
    return saved ? JSON.parse(saved) : posts;
  });

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
            Updates & Stories
          </span>
          <h1 className="font-display font-medium text-5xl text-white mb-6 leading-tight">
            NACOS <span className="font-medium text-[#2D7A22]">Blog</span>
          </h1>
          <p className="text-[#888880] text-lg leading-relaxed max-w-2xl mx-auto font-light">
            News, event recaps, tech tips, and stories from NACOS Bells Chapter.
            Stay in the loop with everything happening in our community.
          </p>
        </motion.div>
      </section>

      {/* ====== BLOG CONTENTS ====== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {blogPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-xl max-w-2xl mx-auto">
            <i className="ti ti-article-off text-4xl text-[#555550] mb-4 block" />
            <p className="text-[#888880] text-sm font-light">No articles published at this coordinate yet.</p>
          </div>
        ) : (
          <>
            {/* Featured Post (First Item) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative glow-card overflow-hidden mb-12 group cursor-pointer"
              onClick={() => setExpandedPost(expandedPost === 0 ? null : 0)}
            >
              <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                <div className="relative z-10">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-4 inline-block font-normal">✨ Featured Post</span>
                  <h2 className="font-display font-medium text-[#F0EDE6] text-2xl md:text-3xl leading-tight mb-4 group-hover:text-white transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-[#888880] leading-relaxed mb-6 font-light text-[13px]">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-[#888880] font-light">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center">
                        <span className="text-[#F0EDE6] text-xs font-normal">P</span>
                      </div>
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <span>·</span>
                    <span>{blogPosts[0].date}</span>
                    <span>·</span>
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center relative z-10">
                  {blogPosts[0].image ? (
                    <div className="w-64 h-40 rounded-xl border border-[rgba(255,255,255,0.07)] overflow-hidden">
                      <img src={blogPosts[0].image} alt={blogPosts[0].title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center">
                      <i className="ti ti-news text-7xl text-[#555550]" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* All Other Posts */}
            {blogPosts.length > 1 && (
              <>
                <div className="mb-12">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 font-normal">All Posts</p>
                  <div className="w-[60px] h-[0.5px] bg-[rgba(255,255,255,0.07)]" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.slice(1).map((post, i) => (
                    <BlogCard
                      key={i}
                      {...post}
                      image={post.image}
                      delay={i * 0.05}
                      expanded={expandedPost === i + 1}
                      onToggle={() => setExpandedPost(expandedPost === i + 1 ? null : i + 1)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* ====== NEWSLETTER CTA ====== */}
      <section className="relative z-10 py-16 border-t border-[rgba(255,255,255,0.07)] bg-[#111110]">
        <motion.div
          className="max-w-2xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-4 inline-block font-normal">Newsletter</span>
          <h2 className="section-title mb-3">Never miss a post</h2>
          <p className="section-subtitle mb-6 font-light">
            Get the latest news and updates from NACOS Bells Chapter straight to your inbox.
          </p>
          <Link to="/#newsletter" className="btn-primary">
            Subscribe to Newsletter
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Blog;
