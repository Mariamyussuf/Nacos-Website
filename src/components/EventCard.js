import React from "react";
import { motion } from "framer-motion";

const EventCard = ({ title, date, venue, description, category, status, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className="card p-6 flex flex-col gap-3 relative overflow-hidden group"
    >
      {/* Top badges */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded border border-[rgba(255,255,255,0.07)] bg-white/[0.02] text-[#888880]">
          {category}
        </span>
        <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded border border-[rgba(255,255,255,0.07)] bg-white/[0.02] text-[#888880]">
          {status}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-medium text-[#F0EDE6] text-base leading-snug transition-colors mt-2 group-hover:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#888880] text-[13px] leading-relaxed flex-1 font-light">
        {description}
      </p>

      {/* Meta */}
      <div className="pt-3 border-t border-[rgba(255,255,255,0.07)] space-y-1.5 mt-2">
        <div className="flex items-center gap-2 text-xs text-[#888880] font-light">
          <i className="ti ti-calendar text-xs" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#888880] font-light">
          <i className="ti ti-map-pin text-xs" />
          <span>{venue}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
