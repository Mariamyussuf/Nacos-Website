import React from "react";
import { motion } from "framer-motion";

const ExecCard = ({ name, position, initials, color, delay = 0 }) => {
  const gradients = [
    "from-nacos-green to-nacos-green-light",
    "from-nacos-gold-dark to-nacos-gold",
    "from-emerald-700 to-emerald-500",
    "from-amber-700 to-amber-500",
    "from-teal-700 to-teal-500",
    "from-green-800 to-green-600",
  ];

  const gradient = gradients[color % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay }}
      className="card card-hover p-6 flex flex-col items-center text-center group"
    >
      {/* Avatar */}
      <div
        className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <span className="text-white font-display font-bold text-xl">
          {initials}
        </span>
      </div>

      {/* Position badge */}
      <span className="nacos-badge mb-3">{position}</span>

      {/* Name */}
      <h3 className="font-display font-bold text-nacos-green-dark text-base leading-snug">
        {name}
      </h3>

      {/* Decorative line */}
      <div className="mt-3 w-8 h-0.5 bg-gradient-to-r from-nacos-green to-nacos-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default ExecCard;
