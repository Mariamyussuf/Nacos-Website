import React from "react";
import { motion } from "framer-motion";

const ExecCard = ({ name, position, initials, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className="glow-card p-6 flex flex-col items-center text-center group"
    >
      {/* Avatar initials container */}
      <div
        style={{
          backgroundColor: "#1A1A17",
          border: "0.5px solid rgba(255, 255, 255, 0.07)",
        }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
      >
        <span className="text-[#F0EDE6] font-display font-medium text-lg">
          {initials}
        </span>
      </div>

      {/* Position badge */}
      <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-3 font-normal">
        {position}
      </span>

      {/* Name */}
      <h3 className="font-display font-medium text-[#F0EDE6] text-sm leading-snug">
        {name}
      </h3>
    </motion.div>
  );
};

export default ExecCard;
