import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/executives", label: "Executives" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-nacos border-b border-nacos-green/10"
          : "bg-white/90 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Branding */}
          <NavLink to="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
            <div className="relative">
              <img
                src={logo}
                alt="NACOS Logo"
                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-nacos-green text-base leading-none">
                NACOS
              </span>
              <span className="text-[10px] text-gray-500 font-medium leading-none tracking-wide">
                Bells Chapter
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `nav-link relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-nacos-green bg-nacos-green-muted font-semibold"
                      : "text-gray-600 hover:text-nacos-green hover:bg-nacos-green-muted/50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className="ml-3 px-5 py-2 bg-nacos-green text-white text-sm font-semibold rounded-full shadow-nacos hover:bg-nacos-green-light hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Join NACOS
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-nacos-green hover:bg-nacos-green-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="md:hidden overflow-hidden border-t border-nacos-green/10"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "text-nacos-green bg-nacos-green-muted font-semibold"
                          : "text-gray-600 hover:text-nacos-green hover:bg-nacos-green-muted/50"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="pt-2 pb-1 px-4">
                  <NavLink
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-2.5 bg-nacos-green text-white text-sm font-semibold rounded-full shadow-nacos"
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
