import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="pt-16 bg-[#080808] min-h-screen text-[#E5E5E5] relative selection:bg-[#0CCF00] selection:text-[#080808] flex items-center justify-center">
    {/* Ambient background */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 dot-pattern" />
      <div className="blob blob-green w-[500px] h-[500px] top-[-100px] left-[-80px]" />
      <div className="blob blob-rose w-[600px] h-[600px] bottom-[-150px] right-[-120px]" style={{ animationDelay: "-8s" }} />
    </div>

    <motion.div
      className="relative z-10 text-center px-6 max-w-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-24 h-24 rounded-3xl bg-[#0CCF00]/10 border border-[#0CCF00]/20 flex items-center justify-center mx-auto mb-8">
        <i className="ti ti-error-404 text-[#0CCF00] text-5xl" />
      </div>

      <h1 className="font-display font-black text-7xl text-white mb-4">
        4<span className="text-[#0CCF00] glow-green">0</span>4
      </h1>
      <p className="text-[#999999] text-lg mb-2 font-display font-bold">
        Page Not Found
      </p>
      <p className="text-[#666666] text-sm mb-10 leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
        <Link to="/contact" className="btn-outline">
          Contact Us
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
