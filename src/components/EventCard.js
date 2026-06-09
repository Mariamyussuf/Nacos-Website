import React from "react";
import { motion } from "framer-motion";

const statusColors = {
  upcoming: "bg-green-100 text-green-700",
  ongoing: "bg-amber-100 text-amber-700",
  past: "bg-gray-100 text-gray-600",
};

const categoryColors = {
  Workshop: "bg-blue-50 text-blue-600",
  Competition: "bg-purple-50 text-purple-600",
  Social: "bg-pink-50 text-pink-600",
  General: "bg-nacos-green-muted text-nacos-green",
  Seminar: "bg-teal-50 text-teal-600",
};

const EventCard = ({ title, date, venue, description, category, status, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay }}
      className="card card-hover p-6 flex flex-col gap-3"
    >
      {/* Top badges */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[category] || categoryColors.General}`}>
          {category}
        </span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[status] || statusColors.past}`}>
          {status}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-nacos-green-dark text-lg leading-snug">{title}</h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed flex-1">{description}</p>

      {/* Meta */}
      <div className="pt-3 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>📅</span>
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>📍</span>
          <span>{venue}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
