import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="announcement-bar"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 bg-[#2D7A22] rounded-full flex-shrink-0" />
          <span className="text-[#888880] text-[11px] font-normal tracking-wide">
            <strong className="text-[#F0EDE6] font-medium">NACOS Tech Fest '26</strong>
            {" "}— July 12–16, Main Auditorium.{" "}
            <Link
              to="/events"
              className="text-[#2D7A22] underline underline-offset-2 hover:text-[#3A9C2D] transition-colors font-medium ml-1"
            >
              Register Now →
            </Link>
          </span>

          <button
            onClick={() => setVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            aria-label="Dismiss announcement"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
