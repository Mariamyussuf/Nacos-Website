import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";
import { resolveAssetUrl } from "./api";

export default function BlogReaderModal({ post, isOpen, onClose, onSelectPost }) {
  const showToast = useToast();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!post) return;
    try {
      const saved = JSON.parse(localStorage.getItem("saved_blogs") || "[]");
      setIsSaved(saved.some((item) => (item.id || item.title) === (post.id || post.title)));
    } catch (e) {
      setIsSaved(false);
    }
  }, [post]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const toggleSave = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_blogs") || "[]");
      const postKey = post.id || post.title;
      const exists = saved.some((item) => (item.id || item.title) === postKey);
      let updated;
      if (exists) {
        updated = saved.filter((item) => (item.id || item.title) !== postKey);
        setIsSaved(false);
        showToast("Article removed from saved bookmarks", "info");
      } else {
        updated = [...saved, post];
        setIsSaved(true);
        showToast("Article saved to your bookmarks!", "success");
      }
      localStorage.setItem("saved_blogs", JSON.stringify(updated));
    } catch (e) {
      showToast("Could not update bookmarks", "error");
    }
  };

  const copyArticleLink = () => {
    const url = `${window.location.origin}/blog#${post.id || encodeURIComponent(post.title)}`;
    navigator.clipboard.writeText(url);
    showToast("Article link copied to clipboard!", "success");
  };

  const shareWhatsApp = () => {
    const text = `Read "${post.title}" on NACOS Bells Blog: ${window.location.origin}/blog`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareTwitter = () => {
    const text = `Check out "${post.title}" via @nacosbells: ${window.location.origin}/blog`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Helper to render formatted markdown-like content blocks
  const renderFormattedContent = (contentStr) => {
    if (!contentStr) return <p className="text-[#888880] text-sm font-light leading-relaxed">{post.excerpt}</p>;

    const lines = contentStr.split("\n");
    const elements = [];
    let currentList = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${idx}`} className="space-y-2 mb-5 pl-5 list-disc text-[#888880] text-sm font-light leading-relaxed">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
          currentList = [];
        }
        return;
      }

      if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="font-display font-medium text-lg sm:text-xl text-[#F0EDE6] mt-6 mb-3 text-white">
            {trimmed.replace("### ", "")}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="font-display font-medium text-xl sm:text-2xl text-[#F0EDE6] mt-8 mb-4 text-white">
            {trimmed.replace("## ", "")}
          </h2>
        );
      } else if (trimmed.startsWith("> ")) {
        elements.push(
          <blockquote
            key={idx}
            className="my-5 p-4 rounded-lg bg-[#1A1A17] border-l-4 border-[#2D7A22] text-[#F0EDE6] text-sm italic font-light leading-relaxed"
          >
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      } else if (trimmed.startsWith("1. ") || trimmed.startsWith("2. ") || trimmed.startsWith("3. ") || trimmed.startsWith("4. ") || trimmed.startsWith("5. ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        currentList.push(trimmed.replace(/^(\d+\.|-|\*)\s*/, ""));
      } else {
        elements.push(
          <p key={idx} className="text-[#888880] text-sm sm:text-[15px] font-light leading-relaxed mb-4">
            {trimmed}
          </p>
        );
      }
    });

    if (currentList.length > 0) {
      elements.push(
        <ul key="list-end" className="space-y-2 mb-5 pl-5 list-disc text-[#888880] text-sm font-light leading-relaxed">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-3xl bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Top Bar / Header Action Controls */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-[rgba(255,255,255,0.07)] bg-[#111110]/95 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D7A22]/15 text-[#3A9C2D] border border-[#2D7A22]/30 text-[10px] sm:text-xs uppercase tracking-widest font-medium">
                {post.category}
              </span>
              <span className="text-[#888880] text-xs font-light">· {post.readTime}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Bookmark button */}
              <button
                onClick={toggleSave}
                title={isSaved ? "Remove from bookmarks" : "Save article"}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all ${
                  isSaved
                    ? "bg-[#2D7A22] text-white border-[#2D7A22]"
                    : "bg-white/[0.04] text-[#888880] hover:text-white border-[rgba(255,255,255,0.07)]"
                }`}
              >
                <i className={isSaved ? "ti ti-bookmark-filled text-sm" : "ti ti-bookmark text-sm"} />
              </button>

              {/* Share link button */}
              <button
                onClick={copyArticleLink}
                title="Copy Article Link"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] flex items-center justify-center transition-all"
              >
                <i className="ti ti-link text-sm" />
              </button>

              {/* Close button */}
              <button
                onClick={onClose}
                title="Close Reader"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] flex items-center justify-center transition-all ml-1"
              >
                <i className="ti ti-x text-sm" />
              </button>
            </div>
          </div>

          {/* Scrollable Reader Content */}
          <div className="overflow-y-auto px-5 sm:px-8 md:px-10 py-6 sm:py-8 space-y-6">
            
            {/* Title & Author Info */}
            <div>
              <h1 className="font-display font-medium text-2xl sm:text-3xl md:text-4xl text-[#F0EDE6] text-white leading-tight mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-3 py-3 border-y border-[rgba(255,255,255,0.07)]">
                <div className="w-10 h-10 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-sm font-medium text-[#2D7A22]">
                  {post.author?.[0] || "N"}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#F0EDE6] text-white">{post.author}</h4>
                  <p className="text-xs text-[#888880] font-light">
                    {post.authorRole || "NACOS Contributor"} · Published on {post.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Image (if available) */}
            {post.image && (
              <div className="w-full h-56 sm:h-80 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.07)]">
                <img src={resolveAssetUrl(post.image)} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Formatted Article Body */}
            <div className="article-body">
              {renderFormattedContent(post.content || post.excerpt)}
            </div>

            {/* Tags Strip */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#888880] mr-1">Tags:</span>
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-md bg-[#1A1A17] text-xs text-[#888880] border border-[rgba(255,255,255,0.07)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Share & Engagement Bar */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-[#F0EDE6] text-white mb-0.5">Found this article valuable?</h4>
                <p className="text-xs text-[#888880] font-light">Share it with your classmates and fellow computing students.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={shareWhatsApp}
                  className="px-3.5 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <i className="ti ti-brand-whatsapp text-sm" /> WhatsApp
                </button>
                <button
                  onClick={shareTwitter}
                  className="px-3.5 py-2 rounded-lg bg-[#1DA1F2]/15 hover:bg-[#1DA1F2]/25 text-[#1DA1F2] border border-[#1DA1F2]/30 text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <i className="ti ti-brand-twitter text-sm" /> Share
                </button>
                <button
                  onClick={copyArticleLink}
                  className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#F0EDE6] border border-[rgba(255,255,255,0.1)] text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <i className="ti ti-link text-sm" /> Copy
                </button>
              </div>
            </div>

          </div>

          {/* Footer Close Action */}
          <div className="px-5 sm:px-8 py-3.5 border-t border-[rgba(255,255,255,0.07)] bg-[#111110] flex justify-between items-center text-xs text-[#888880]">
            <span>NACOS Bells Publications · College of Computing</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[#F0EDE6] border border-[rgba(255,255,255,0.08)] transition-all font-normal"
            >
              Back to Blog
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
