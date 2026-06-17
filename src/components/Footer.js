import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative w-full py-8 px-[48px] bg-[#0A0A08] border-t-[0.5px] border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row items-center justify-between gap-4">
    <span className="text-[12px] text-[#555550] font-normal">
      © 2026 NACOS Bells Chapter. All Rights Reserved.
    </span>
    <div className="flex items-center gap-6">
      <a
        href="https://instagram.com/nacosbells"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12px] text-[#555550] hover:text-[#888880] transition-colors font-normal"
      >
        Instagram
      </a>
      <a
        href="https://x.com/nacosbells"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12px] text-[#555550] hover:text-[#888880] transition-colors font-normal"
      >
        Twitter/X
      </a>
      <Link
        to="/contact"
        className="text-[12px] text-[#555550] hover:text-[#888880] transition-colors font-normal"
      >
        Contact
      </Link>
    </div>
  </footer>
);

export default Footer;
