import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getBanner } from "./api";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [banner, setBanner] = useState({
    enabled: true,
    badge: "NACOS Tech Fest '26",
    text: "— July 12–16, Main Auditorium.",
    linkText: "Register Now →",
    linkUrl: "/events",
    accentColor: "green",
  });

  const loadBanner = async () => {
    try {
      const data = await getBanner();
      if (data) {
        setBanner(data);
      }
    } catch (e) {
      console.warn("Could not load banner settings:", e);
    }
  };

  useEffect(() => {
    loadBanner();

    const handleUpdate = () => {
      loadBanner();
    };

    window.addEventListener("bannerUpdated", handleUpdate);
    return () => window.removeEventListener("bannerUpdated", handleUpdate);
  }, []);

  if (!visible || banner.enabled === false) return null;

  // Theme styling based on accentColor
  const themeStyles = {
    green: {
      dot: "bg-[#2D7A22]",
      link: "text-[#2D7A22] hover:text-[#3A9C2D]",
      barBorder: "border-[rgba(45,122,34,0.2)]",
    },
    amber: {
      dot: "bg-[#F59E0B]",
      link: "text-[#F59E0B] hover:text-[#FBBF24]",
      barBorder: "border-[rgba(245,158,11,0.2)]",
    },
    cyan: {
      dot: "bg-[#06B6D4]",
      link: "text-[#06B6D4] hover:text-[#22D3EE]",
      barBorder: "border-[rgba(6,182,212,0.2)]",
    },
    coral: {
      dot: "bg-[#F43F5E]",
      link: "text-[#F43F5E] hover:text-[#FB7185]",
      barBorder: "border-[rgba(244,63,94,0.2)]",
    },
  };

  const currentTheme = themeStyles[banner.accentColor] || themeStyles.green;
  const isExternalLink = banner.linkUrl && (banner.linkUrl.startsWith("http://") || banner.linkUrl.startsWith("https://"));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`announcement-bar relative border-b ${currentTheme.barBorder}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 pr-8 pl-3 sm:px-4">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentTheme.dot}`} />
          <span className="text-[#888880] text-[11px] font-normal tracking-wide text-center">
            {banner.badge && (
              <strong className="text-[#F0EDE6] font-medium mr-1">{banner.badge}</strong>
            )}
            <span>{banner.text}</span>
            {banner.linkText && banner.linkUrl && (
              isExternalLink ? (
                <a
                  href={banner.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline underline-offset-2 transition-colors font-medium ml-1.5 ${currentTheme.link}`}
                >
                  {banner.linkText}
                </a>
              ) : (
                <Link
                  to={banner.linkUrl}
                  className={`underline underline-offset-2 transition-colors font-medium ml-1.5 ${currentTheme.link}`}
                >
                  {banner.linkText}
                </Link>
              )
            )}
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
