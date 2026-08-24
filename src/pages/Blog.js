import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import BlogCard from "../components/BlogCard";
import BlogReaderModal from "../components/BlogReaderModal";
import { Link, useLocation } from "react-router-dom";
import { INITIAL_BLOG_POSTS } from "../data/blogData";
import { useToast } from "../components/Toast";
import { getBlogs, resolveAssetUrl } from "../components/api";

const CATEGORIES = ["All", "News", "Events", "Tech Tips", "Student Life", "Saved"];

const Blog = () => {
  const showToast = useToast();
  const location = useLocation();
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPosts, setSavedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("saved_blogs") || "[]");
    } catch (e) {
      return [];
    }
  });

  const [blogPosts, setBlogPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("blogs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_BLOG_POSTS;
  });

  // Fetch latest blogs from NestJS backend
  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBlogPosts(data);
          localStorage.setItem("blogs", JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Could not fetch blogs from API, using fallback cache:", err.message);
      }
    };
    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to cross-tab and admin changes
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem("blogs");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setBlogPosts(parsed);
        }
      } catch (e) {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Check URL hash on load (e.g. /blog#nacos-welcome-2025)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const match = blogPosts.find((p) => (p.id || encodeURIComponent(p.title)) === targetId);
      if (match) setSelectedPost(match);
    }
  }, [location.hash, blogPosts]);

  // Keep savedPosts state synchronized with localStorage
  const handleBookmarkToggle = (post) => {
    const postKey = post.id || post.title;
    const exists = savedPosts.some((item) => (item.id || item.title) === postKey);
    let updated;
    if (exists) {
      updated = savedPosts.filter((item) => (item.id || item.title) !== postKey);
      setSavedPosts(updated);
      showToast("Article removed from saved bookmarks", "info");
    } else {
      updated = [...savedPosts, post];
      setSavedPosts(updated);
      showToast("Article saved to bookmarks!", "success");
    }
    localStorage.setItem("saved_blogs", JSON.stringify(updated));
  };

  // Filter pipeline
  const filteredPosts = useMemo(() => {
    let list = blogPosts;

    if (activeCategory === "Saved") {
      list = savedPosts;
    } else if (activeCategory !== "All") {
      list = list.filter((post) => post.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.author?.toLowerCase().includes(query) ||
          post.category?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return list;
  }, [blogPosts, savedPosts, activeCategory, searchQuery]);

  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] relative selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      
      {/* Full Article Reader Modal */}
      <BlogReaderModal
        post={selectedPost}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
      />

      {/* ====== PAGE HEADER ====== */}
      <section className="relative py-16 sm:py-24 z-10 overflow-hidden">
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-5 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] bg-white/[0.02] px-4 py-1.5 rounded-full text-[#888880] text-xs font-normal uppercase tracking-widest mb-4 sm:mb-6">
            Publications &amp; Insights
          </span>
          <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-6 leading-tight">
            NACOS <span className="font-medium text-[#2D7A22]">Blog &amp; Stories</span>
          </h1>
          <p className="text-[#888880] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Technical tutorials, hackathon recaps, career roadmaps, and campus stories curated by Bells computing scholars.
          </p>
        </motion.div>
      </section>

      {/* ====== FILTER & SEARCH TOOLBAR ====== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#111110] border border-[rgba(255,255,255,0.07)]">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#2D7A22] text-white shadow-[0_0_15px_rgba(45,122,34,0.35)]"
                      : "bg-white/[0.03] hover:bg-white/[0.06] text-[#888880] hover:text-[#F0EDE6] border border-[rgba(255,255,255,0.07)]"
                  }`}
                >
                  {cat === "Saved" && <i className="ti ti-bookmark text-xs" />}
                  {cat}
                  {cat === "Saved" && savedPosts.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">
                      {savedPosts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Real-time Search Input */}
          <div className="relative w-full md:w-72">
            <i className="ti ti-search absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#888880]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tags, authors..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-xs text-[#F0EDE6] placeholder-[#888880] focus:outline-none focus:border-[#2D7A22] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888880] hover:text-white text-xs"
              >
                <i className="ti ti-x" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ====== BLOG CONTENTS ====== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-20">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-2xl max-w-xl mx-auto px-6">
            <div className="w-14 h-14 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center mx-auto mb-4 text-[#888880]">
              <i className="ti ti-article-off text-2xl" />
            </div>
            <h3 className="font-display font-medium text-lg text-[#F0EDE6] mb-2">No articles found</h3>
            <p className="text-[#888880] text-xs font-light max-w-sm mx-auto mb-6">
              {searchQuery
                ? `No publication matched "${searchQuery}". Try searching for another topic or reset the category filter.`
                : activeCategory === "Saved"
                ? "You haven't bookmarked any articles yet. Click the bookmark icon on any post to save it for reading later."
                : "There are no published articles in this category at the moment."}
            </p>
            {(searchQuery || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="btn-outline text-xs px-5 py-2 rounded-lg"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Post (Only shown on "All" view with no active search) */}
            {activeCategory === "All" && !searchQuery && filteredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative glow-card overflow-hidden mb-10 sm:mb-12 group cursor-pointer border-[#2D7A22]/20 hover:border-[#2D7A22]/40 transition-all"
                onClick={() => setSelectedPost(filteredPosts[0])}
              >
                <div className="p-6 sm:p-8 md:p-10 grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#2D7A22]/15 text-[#3A9C2D] border border-[#2D7A22]/30 font-medium">
                        ✨ Featured Story
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-[#888880] font-normal">
                        {filteredPosts[0].category}
                      </span>
                    </div>

                    <h2 className="font-display font-medium text-[#F0EDE6] text-xl sm:text-2xl md:text-3xl leading-tight mb-3 sm:mb-4 group-hover:text-[#2D7A22] transition-colors">
                      {filteredPosts[0].title}
                    </h2>
                    
                    <p className="text-[#888880] leading-relaxed mb-6 font-light text-xs sm:text-sm line-clamp-3">
                      {filteredPosts[0].excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#888880]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-xs font-medium text-[#2D7A22]">
                          {filteredPosts[0].author?.[0] || "P"}
                        </div>
                        <span className="font-medium text-[#F0EDE6]">{filteredPosts[0].author}</span>
                      </div>
                      <span>·</span>
                      <span>{filteredPosts[0].date}</span>
                      <span>·</span>
                      <span>{filteredPosts[0].readTime}</span>
                    </div>
                  </div>

                  <div className="relative z-10 h-56 sm:h-72 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.07)]">
                    {filteredPosts[0].image ? (
                      <img
                        src={resolveAssetUrl(filteredPosts[0].image)}
                        alt={filteredPosts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A17] flex items-center justify-center">
                        <i className="ti ti-news text-7xl text-[#555550]" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Articles Grid */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-[#888880] font-normal">
                {activeCategory === "All" && !searchQuery
                  ? "All Publications"
                  : `Showing ${filteredPosts.length} article${filteredPosts.length === 1 ? "" : "s"}`}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {(activeCategory === "All" && !searchQuery ? filteredPosts.slice(1) : filteredPosts).map((post, i) => {
                const isBookmarked = savedPosts.some((item) => (item.id || item.title) === (post.id || post.title));
                return (
                  <BlogCard
                    key={post.id || post.title || i}
                    {...post}
                    delay={i * 0.04}
                    isBookmarked={isBookmarked}
                    onBookmarkToggle={() => handleBookmarkToggle(post)}
                    onClick={() => setSelectedPost(post)}
                  />
                );
              })}
            </div>
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
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-4 inline-block font-normal">
            Stay Connected
          </span>
          <h2 className="section-title mb-3">Never miss a publication</h2>
          <p className="section-subtitle mb-6 font-light">
            Receive exclusive event recaps, study vault updates, and tech roadmaps delivered directly to your inbox.
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
