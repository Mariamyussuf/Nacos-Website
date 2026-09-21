import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";
import { resolveAssetUrl } from "./api";

export default function BlogReaderModal({ post, isOpen, onClose }) {
  const showToast = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!post) return;
    try {
      const saved = JSON.parse(localStorage.getItem("saved_blogs") || "[]");
      setIsSaved(saved.some((item) => (item.id || item.title) === (post.id || post.title)));
    } catch (e) { setIsSaved(false); }
    setReadProgress(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [post]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) { setReadProgress(100); return; }
    setReadProgress(Math.min(100, Math.round((scrollTop / maxScroll) * 100)));
  };

  const toggleSave = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_blogs") || "[]");
      const key = post.id || post.title;
      const exists = saved.some((item) => (item.id || item.title) === key);
      const updated = exists
        ? saved.filter((item) => (item.id || item.title) !== key)
        : [...saved, post];
      localStorage.setItem("saved_blogs", JSON.stringify(updated));
      setIsSaved(!exists);
      showToast(exists ? "Removed from bookmarks" : "Article saved to bookmarks!", exists ? "info" : "success");
    } catch (e) { showToast("Could not update bookmarks", "error"); }
  };

  const getShareUrl = () =>
    `${window.location.origin}/blog#${post.id || encodeURIComponent(post.title)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    showToast("Article link copied!", "success");
  };

  const shareWhatsApp = () => {
    const text = `📖 "${post.title}" — NACOS Bells Blog:\n${getShareUrl()}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${post.title}" by @nacosbells`)}&url=${encodeURIComponent(getShareUrl())}`,
      "_blank"
    );
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`, "_blank");
  };

  // ── Markdown-like renderer ────────────────────────────────────────────────

  const renderContent = (contentStr) => {
    if (!contentStr) return <p className="text-[#9A9790] text-lg leading-[1.85] font-light">{post.excerpt}</p>;

    const lines = contentStr.split("\n");
    const elements = [];
    let listItems = [];
    let listType = null; // "ul" | "ol"

    const flushList = (key) => {
      if (!listItems.length) return;
      const Tag = listType === "ol" ? "ol" : "ul";
      elements.push(
        <Tag
          key={key}
          className={`mb-6 pl-6 space-y-2 text-[#9A9790] text-[16.5px] leading-[1.85] font-light ${listType === "ol" ? "list-decimal" : "list-disc"}`}
        >
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(`list-${idx}`);
        return;
      }

      // Headings
      if (trimmed.startsWith("#### ")) {
        flushList(`list-${idx}`);
        elements.push(
          <h4 key={idx} className="font-display font-semibold text-lg text-[#F0EDE6] mt-8 mb-3">
            {trimmed.slice(5)}
          </h4>
        );
      } else if (trimmed.startsWith("### ")) {
        flushList(`list-${idx}`);
        elements.push(
          <h3 key={idx} className="font-display font-semibold text-xl sm:text-2xl text-[#F0EDE6] mt-10 mb-4">
            {trimmed.slice(4)}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList(`list-${idx}`);
        elements.push(
          <h2 key={idx} className="font-display font-semibold text-2xl sm:text-3xl text-white mt-12 mb-5 pb-3 border-b border-[rgba(255,255,255,0.07)]">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        flushList(`list-${idx}`);
        elements.push(
          <h1 key={idx} className="font-display font-bold text-3xl text-white mt-12 mb-6">
            {trimmed.slice(2)}
          </h1>
        );
      // Blockquote
      } else if (trimmed.startsWith("> ")) {
        flushList(`list-${idx}`);
        elements.push(
          <blockquote
            key={idx}
            className="my-8 pl-5 border-l-4 border-[#2D7A22] bg-[#2D7A22]/5 rounded-r-xl py-4 pr-5"
          >
            <p className="text-[#C8C5BE] text-lg italic font-light leading-relaxed">
              {trimmed.slice(2)}
            </p>
          </blockquote>
        );
      // Code block (single line with backtick)
      } else if (trimmed.startsWith("`") && trimmed.endsWith("`") && trimmed.length > 2) {
        flushList(`list-${idx}`);
        elements.push(
          <code key={idx} className="block my-4 px-5 py-3.5 rounded-xl bg-[#0E0E0C] border border-[rgba(255,255,255,0.07)] text-[#4ade80] text-sm font-mono leading-relaxed whitespace-pre-wrap">
            {trimmed.slice(1, -1)}
          </code>
        );
      // Horizontal rule
      } else if (trimmed === "---" || trimmed === "***") {
        flushList(`list-${idx}`);
        elements.push(<hr key={idx} className="my-10 border-[rgba(255,255,255,0.07)]" />);
      // Unordered list
      } else if (/^[-*•]\s/.test(trimmed)) {
        if (listType !== "ul") { flushList(`list-before-${idx}`); listType = "ul"; }
        listItems.push(trimmed.replace(/^[-*•]\s+/, ""));
      // Ordered list
      } else if (/^\d+\.\s/.test(trimmed)) {
        if (listType !== "ol") { flushList(`list-before-${idx}`); listType = "ol"; }
        listItems.push(trimmed.replace(/^\d+\.\s+/, ""));
      // Bold text check for paragraph inline bold
      } else {
        flushList(`list-${idx}`);
        // Parse inline **bold** and *italic*
        const parsed = trimmed
          .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#F0EDE6] font-semibold">$1</strong>')
          .replace(/\*(.+?)\*/g, '<em class="italic text-[#C8C5BE]">$1</em>');
        elements.push(
          <p
            key={idx}
            className="text-[#9A9790] text-[16.5px] leading-[1.85] font-light mb-5"
            dangerouslySetInnerHTML={{ __html: parsed }}
          />
        );
      }
    });

    flushList("list-final");
    return elements;
  };

  const coverImage = resolveAssetUrl(post.image);

  return (
    <AnimatePresence>
      {/* Full-screen overlay */}
      <motion.div
        key="blog-reader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-[#0A0A08] flex flex-col"
      >
        {/* ── Reading progress bar ─────────────────────────────────────── */}
        <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-[rgba(255,255,255,0.04)]">
          <motion.div
            className="h-full bg-[#2D7A22] shadow-[0_0_12px_#2D7A22]"
            style={{ width: `${readProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* ── Top navigation bar ───────────────────────────────────────── */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A08]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            {/* Left: Back + category */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-[#888880] hover:text-white text-xs transition-colors shrink-0 group"
              >
                <i className="ti ti-arrow-left group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Blog</span>
              </button>
              <div className="w-px h-4 bg-[rgba(255,255,255,0.1)]" />
              <span className="px-2.5 py-0.5 rounded-full bg-[#2D7A22]/15 text-[#4ade80] border border-[#2D7A22]/30 text-[10px] uppercase tracking-widest font-medium truncate">
                {post.category}
              </span>
              {readProgress > 2 && (
                <span className="hidden sm:inline text-[10px] text-[#555550] font-mono">
                  {readProgress}%
                </span>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSave}
                title={isSaved ? "Remove bookmark" : "Save article"}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all text-sm ${
                  isSaved
                    ? "bg-[#2D7A22] border-[#2D7A22] text-white"
                    : "border-[rgba(255,255,255,0.08)] text-[#888880] hover:text-white hover:border-[rgba(255,255,255,0.2)]"
                }`}
              >
                <i className={isSaved ? "ti ti-bookmark-filled" : "ti ti-bookmark"} />
              </button>
              <button
                onClick={copyLink}
                title="Copy link"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)] text-[#888880] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-all text-sm"
              >
                <i className="ti ti-link" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)] text-[#888880] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-all text-sm ml-1"
              >
                <i className="ti ti-x" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Scrollable article body ───────────────────────────────────── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto pt-14"
        >
          {/* Hero cover image */}
          {coverImage && (
            <div className="w-full h-64 sm:h-80 md:h-[440px] overflow-hidden relative">
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* gradient fade to body */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A08]" />
            </div>
          )}

          {/* Article container */}
          <div className="max-w-2xl mx-auto px-5 sm:px-6 pb-24">
            {/* Category + read time pill */}
            <div className="flex items-center gap-3 mt-10 mb-5">
              <span className="text-[10px] uppercase tracking-widest text-[#888880] font-medium">{post.readTime}</span>
              <span className="text-[rgba(255,255,255,0.12)]">·</span>
              <span className="text-[10px] uppercase tracking-widest text-[#888880] font-medium">{post.date}</span>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-6 tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt / lede */}
            {post.excerpt && (
              <p className="text-[#888880] text-lg sm:text-xl leading-relaxed font-light mb-8 border-l-2 border-[#2D7A22]/40 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Author card */}
            <div className="flex items-center gap-3 py-4 border-y border-[rgba(255,255,255,0.07)] mb-10">
              <div className="w-10 h-10 rounded-full bg-[#2D7A22]/15 border border-[#2D7A22]/25 flex items-center justify-center text-sm font-semibold text-[#4ade80] shrink-0">
                {post.author?.[0]?.toUpperCase() || "N"}
              </div>
              <div>
                <p className="text-[#F0EDE6] text-sm font-medium leading-tight">{post.author}</p>
                <p className="text-[#666660] text-xs font-light mt-0.5">{post.authorRole || "NACOS Contributor"}</p>
              </div>
            </div>

            {/* Article body */}
            <div className="article-body">
              {renderContent(post.content || post.excerpt)}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.08)] text-xs text-[#888880]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share footer */}
            <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-[#111110] border border-[rgba(255,255,255,0.07)]">
              <p className="text-[#F0EDE6] text-sm font-medium mb-1">Found this useful?</p>
              <p className="text-[#666660] text-xs mb-4 font-light">Share it with your classmates and fellow computing students.</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/25 text-xs font-medium transition-all"
                >
                  <i className="ti ti-brand-whatsapp text-sm" /> WhatsApp
                </button>
                <button
                  onClick={shareTwitter}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/25 text-xs font-medium transition-all"
                >
                  <i className="ti ti-brand-twitter text-sm" /> X / Twitter
                </button>
                <button
                  onClick={shareLinkedIn}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#70B5F9] border border-[#0A66C2]/25 text-xs font-medium transition-all"
                >
                  <i className="ti ti-brand-linkedin text-sm" /> LinkedIn
                </button>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.08)] text-xs font-medium transition-all"
                >
                  <i className="ti ti-copy text-sm" /> Copy Link
                </button>
              </div>
            </div>

            {/* Back button */}
            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 text-[#555550] hover:text-[#888880] text-xs transition-colors"
              >
                <i className="ti ti-arrow-left text-xs" /> Back to all articles
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
