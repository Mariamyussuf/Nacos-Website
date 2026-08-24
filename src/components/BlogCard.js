import React from "react";
import { motion } from "framer-motion";
import { resolveAssetUrl } from "./api";

const BlogCard = ({
  id,
  title,
  date,
  excerpt,
  category,
  author,
  readTime,
  delay = 0,
  image,
  onClick,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className="glow-card overflow-hidden group cursor-pointer flex flex-col justify-between h-full"
      onClick={onClick}
    >
      <div>
        {image ? (
          <div className="h-44 sm:h-48 w-full overflow-hidden border-b border-[rgba(255,255,255,0.07)] relative">
            <img
              src={resolveAssetUrl(image)}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#F0EDE6] border border-white/10 font-medium">
                {category}
              </span>
            </div>
            {onBookmarkToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle();
                }}
                title={isBookmarked ? "Remove Bookmark" : "Save Article"}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                  isBookmarked
                    ? "bg-[#2D7A22] text-white"
                    : "bg-black/60 text-white/80 hover:text-white hover:bg-black/80"
                }`}
              >
                <i className={isBookmarked ? "ti ti-bookmark-filled text-sm" : "ti ti-bookmark text-sm"} />
              </button>
            )}
          </div>
        ) : (
          <div className="p-5 sm:p-6 pb-0 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#888880] px-2.5 py-1 rounded-full bg-white/[0.03] border border-[rgba(255,255,255,0.07)] font-normal">
              {category}
            </span>
            {onBookmarkToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle();
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isBookmarked ? "text-[#2D7A22]" : "text-[#888880] hover:text-white"
                }`}
              >
                <i className={isBookmarked ? "ti ti-bookmark-filled text-sm" : "ti ti-bookmark text-sm"} />
              </button>
            )}
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Title */}
          <h3 className="font-display font-medium text-[#F0EDE6] text-base sm:text-lg leading-snug mb-2.5 group-hover:text-[#2D7A22] transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-[#888880] text-xs sm:text-[13px] leading-relaxed font-light line-clamp-3 mb-4">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Footer Meta & Read Action */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.07)] text-xs text-[#888880]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[10px] font-medium text-[#F0EDE6]">
              {author?.[0] || "N"}
            </div>
            <span className="font-light truncate max-w-[100px]">{author}</span>
          </div>

          <div className="flex items-center gap-2 text-[#555550]">
            <span>{readTime}</span>
            <span>·</span>
            <span className="text-[#2D7A22] font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Read <i className="ti ti-arrow-right text-[11px]" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
