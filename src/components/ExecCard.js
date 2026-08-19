import React from "react";
import { motion } from "framer-motion";

const ExecCard = ({ name, position, initials, delay = 0, featured = false, badge = null }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={`glow-card p-4 sm:p-6 flex flex-col items-center text-center group transition-all duration-300 ${
        featured
          ? "border-[#2D7A22]/40 bg-[#2D7A22]/[0.03] shadow-[0_0_30px_rgba(45,122,34,0.15)]"
          : ""
      }`}
    >
      {/* Optional Badge */}
      {badge && (
        <span className="text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2D7A22]/15 text-[#3A9C2D] border border-[#2D7A22]/30 mb-3 font-medium">
          {badge}
        </span>
      )}

      {/* Avatar initials container */}
      <div
        className={`exec-avatar rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105 ${
          featured
            ? "w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#2D7A22]/60 shadow-[0_0_20px_rgba(45,122,34,0.3)]"
            : "w-14 h-14 sm:w-20 sm:h-20"
        }`}
      >
        <span
          className={`text-[#F0EDE6] font-display font-medium exec-avatar-initials ${
            featured ? "text-lg sm:text-2xl text-[#3A9C2D]" : "text-sm sm:text-lg"
          }`}
        >
          {initials}
        </span>
      </div>

      {/* Position badge */}
      <span
        className={`uppercase mb-2 sm:mb-3 line-clamp-1 ${
          featured
            ? "text-[10px] sm:text-xs tracking-[0.2em] text-[#3A9C2D] font-medium"
            : "text-[9px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] text-[#888880] font-normal"
        }`}
      >
        {position}
      </span>

      {/* Name */}
      <h3
        className={`font-display font-medium leading-snug ${
          featured
            ? "text-[#F0EDE6] text-base sm:text-lg"
            : "text-[#F0EDE6] text-xs sm:text-sm"
        }`}
      >
        {name}
      </h3>
    </motion.div>
  );
};

export default ExecCard;
