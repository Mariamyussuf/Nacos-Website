import React from "react";
import { motion } from "framer-motion";

const ExecCard = ({ name, position, initials, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className="glow-card p-4 sm:p-6 flex flex-col items-center text-center group"
    >
      {/* Avatar initials container */}
      <div
        className="exec-avatar w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105"
      >
        <span className="text-[#F0EDE6] font-display font-medium text-sm sm:text-lg exec-avatar-initials">
          {initials}
        </span>
      </div>

      {/* Position badge */}
      <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#888880] mb-2 sm:mb-3 font-normal line-clamp-1">
        {position}
      </span>

      {/* Name */}
      <h3 className="font-display font-medium text-[#F0EDE6] text-xs sm:text-sm leading-snug">
        {name}
      </h3>
    </motion.div>
  );
};

export default ExecCard;
