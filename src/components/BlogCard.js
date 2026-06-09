import React from "react";
import { motion } from "framer-motion";

const BlogCard = ({ title, date, excerpt, category, author, readTime, delay = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay }}
      className="card card-hover overflow-hidden group cursor-pointer"
    >
      {/* Top color bar */}
      <div className="h-1.5 bg-gradient-to-r from-nacos-green to-nacos-gold" />

      <div className="p-6">
        {/* Category */}
        <span className="nacos-badge mb-3 inline-block">{category}</span>

        {/* Title */}
        <h3 className="font-display font-bold text-nacos-green-dark text-lg leading-snug mb-2 group-hover:text-nacos-green transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{excerpt}</p>

        {/* Meta */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-nacos-green to-nacos-gold flex items-center justify-center">
              <span className="text-white text-xs font-bold">{author?.[0]}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">{author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>📅 {date}</span>
            <span>⏱ {readTime}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
