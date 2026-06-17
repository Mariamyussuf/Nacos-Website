import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/nacos-logo.png";
import AnnouncementBar from "./AnnouncementBar";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/executives", label: "Executives" },
  { to: "/resources", label: "Resources" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-[#0A0A08]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.07)] shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#2D7A22] focus:text-[#F0EDE6] focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      {/* Integrated Announcement Bar */}
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src={logo}
              alt="NACOS Logo"
              className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-display font-medium text-[#2D7A22] text-base leading-none tracking-tight">
                NACOS
              </span>
              <span className="text-[10px] text-[#888880] font-normal leading-none tracking-wide mt-1">
                Bells Chapter
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `nav-link px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "text-white bg-white/[0.06]"
                    : "text-[#888880] hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions & Socials (WhatsApp, GitHub, Portal, Join) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-[#888880] hover:text-[#2D7A22] transition-colors duration-200 text-lg flex items-center justify-center p-1"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              <i className={theme === "dark" ? "ti ti-sun" : "ti ti-moon"} />
            </button>

            {/* WhatsApp Link */}
            <a
              href="https://chat.whatsapp.com/nacos-bells-community"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888880] hover:text-[#2D7A22] transition-colors duration-200 text-lg"
              title="Join WhatsApp Community"
            >
              <i className="ti ti-brand-whatsapp" />
            </a>

            {/* GitHub Link + Member Count Badge */}
            <a
              href="https://github.com/nacos-bells"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#888880] hover:text-white transition-colors duration-200 text-lg border border-[rgba(255,255,255,0.07)] rounded-full px-2.5 py-1 bg-white/[0.02] hover:bg-white/[0.05]"
              title="GitHub Repository"
            >
              <i className="ti ti-brand-github" />
              <span className="text-[10px] font-medium tracking-wider text-[#2D7A22] bg-[#2D7A22]/10 px-1.5 py-0.5 rounded-full">
                500+
              </span>
            </a>

            {/* Portal Button */}
            <NavLink
              to="/portal"
              className="px-4 py-2 border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] text-[#888880] hover:text-[#F0EDE6] bg-white/[0.02] text-xs uppercase tracking-wider font-medium rounded-full transition-all duration-300"
            >
              Portal
            </NavLink>

            {/* Join NACOS Button */}
            <NavLink
              to="/contact"
              className="px-5 py-2 bg-[#2D7A22] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-full hover:bg-[#3A9C2D] transition-all duration-300 hover:scale-102"
            >
              Join NACOS
            </NavLink>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#888880] hover:text-white hover:bg-white/[0.05] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden overflow-hidden border-t border-[rgba(255,255,255,0.07)] bg-[#0A0A08]"
            >
              <div className="py-3 space-y-1">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                        ? "text-[#2D7A22] bg-[#2D7A22]/[0.06]"
                        : "text-[#888880] hover:text-white hover:bg-white/[0.04]"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {/* Mobile Social & CTA */}
                <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.07)] flex flex-col gap-3">
                  <div className="flex items-center gap-4 justify-center py-2 flex-wrap">
                    {/* Mobile Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 text-[#888880] hover:text-[#2D7A22] transition-colors duration-200 text-sm"
                    >
                      <i className={theme === "dark" ? "ti ti-sun" : "ti ti-moon"} />
                      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                    <span className="text-[#555550]">|</span>

                    <a
                      href="https://chat.whatsapp.com/nacos-bells-community"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#888880] hover:text-[#2D7A22] transition-colors duration-200 text-sm"
                    >
                      <i className="ti ti-brand-whatsapp text-lg" /> WhatsApp
                    </a>
                    
                    <span className="text-[#555550]">|</span>

                    <a
                      href="https://github.com/nacos-bells"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#888880] hover:text-white transition-colors duration-200 text-sm"
                    >
                      <i className="ti ti-brand-github text-lg" /> GitHub
                    </a>
                  </div>

                  {/* Portal Button Mobile */}
                  <NavLink
                    to="/portal"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-2.5 border border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-full transition-all duration-300"
                  >
                    Student Portal
                  </NavLink>

                  {/* Join Button Mobile */}
                  <NavLink
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-2.5 bg-[#2D7A22] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-full transition-all duration-300"
                  >
                    Join NACOS
                  </NavLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;
