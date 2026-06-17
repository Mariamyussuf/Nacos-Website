import React from "react";
import { motion } from "framer-motion";

const BlogCard = ({ title, date, excerpt, category, author, readTime, delay = 0, expanded, onToggle, image }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className="glow-card overflow-hidden group cursor-pointer flex flex-col justify-between"
      onClick={onToggle}
    >
      {image && (
        <div className="h-44 w-full overflow-hidden border-b border-[rgba(255,255,255,0.07)]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        {/* Category */}
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-3 inline-block font-normal">
          {category}
        </span>

        {/* Title */}
        <h3 className="font-display font-medium text-[#F0EDE6] text-base leading-snug mb-2 group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className={`text-[#888880] text-[13px] leading-relaxed font-light ${expanded ? "" : "line-clamp-3"}`}>
          {excerpt}
        </p>

        {expanded && (
          <p className="text-[#2D7A22] text-xs font-normal mt-3">
            ↑ Click to collapse
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center">
              <span className="text-[#F0EDE6] text-xs font-normal">{author?.[0]}</span>
            </div>
            <span className="text-xs text-[#888880] font-light">{author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#555550]">
            <span className="flex items-center"><i className="ti ti-calendar mr-1" /> {date}</span>
            <span className="flex items-center"><i className="ti ti-clock mr-1" /> {readTime}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
