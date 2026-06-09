import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => (
  <footer className="bg-nacos-green-dark text-white">
    {/* Main Footer */}
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="NACOS Logo" className="h-12 w-12 object-contain brightness-0 invert" />
            <div>
              <p className="font-display font-bold text-xl text-white">NACOS</p>
              <p className="text-nacos-gold text-sm font-medium">Bells Chapter</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
            Nigerian Association of Computer Science Students — Bells University of Technology Chapter.
            Connecting, Innovating, and Leading the next generation of tech leaders.
          </p>
          {/* Social links */}
          <div className="flex items-center gap-3 mt-6">
            {[
              { label: "X/Twitter", icon: "𝕏", href: "#" },
              { label: "Instagram", icon: "📷", href: "#" },
              { label: "LinkedIn", icon: "in", href: "#" },
              { label: "WhatsApp", icon: "💬", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-sm hover:bg-nacos-gold hover:border-nacos-gold transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-nacos-gold mb-4 text-sm uppercase tracking-widest">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/events", label: "Events" },
              { to: "/executives", label: "Executives" },
              { to: "/blog", label: "Blog" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-gray-300 hover:text-nacos-gold text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-nacos-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-bold text-nacos-gold mb-4 text-sm uppercase tracking-widest">Get In Touch</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>Bells University of Technology, Km 8 Idiroko Road, Baban Ode, Ota, Ogun State</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span>
              <a href="mailto:nacos.bellsuniversity@gmail.com" className="hover:text-nacos-gold transition-colors">
                nacos.bells@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span>🌐</span>
              <a href="https://www.nacos.org.ng" target="_blank" rel="noopener noreferrer" className="hover:text-nacos-gold transition-colors">
                nacos.org.ng
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <p>© 2025 NACOS Bells Chapter. All Rights Reserved.</p>
        <p className="flex items-center gap-1">
          Built with <span className="text-red-400">♥</span> by NACOS Bells Tech Team
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
