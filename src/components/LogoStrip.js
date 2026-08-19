import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LOGOS = [
  { name: "Python",      icon: "ti-brand-python" },
  { name: "React",       icon: "ti-brand-react" },
  { name: "JavaScript",  icon: "ti-brand-javascript" },
  { name: "Figma",       icon: "ti-brand-figma" },
  { name: "GitHub",      icon: "ti-brand-github" },
  { name: "Node.js",     icon: "ti-brand-nodejs" },
  { name: "TensorFlow",  icon: "ti-brain" },
  { name: "Firebase",    icon: "ti-brand-firebase" },
  { name: "Tailwind",    icon: "ti-brand-tailwind" },
  { name: "Docker",      icon: "ti-brand-docker" },
  { name: "MongoDB",     icon: "ti-database" },
  { name: "Blender",     icon: "ti-brand-blender" },
  { name: "After Effects", icon: "ti-sparkles" },
  { name: "VS Code",     icon: "ti-brand-vscode" },
];

const DOUBLED = [...LOGOS, ...LOGOS];

export default function LogoStrip() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // Fade + scale in the individual logo items
      gsap.from(".gsap-logo-item", {
        opacity: 0,
        scale: 0.85,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          once: true,
        },
      });

      // Scroll-linked horizontal translation — logos move as user scrolls
      gsap.to(trackRef.current, {
        xPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 py-10 border-y border-[rgba(255,255,255,0.07)] bg-[#0A0A08] overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center gap-10 px-6"
        style={{ width: "max-content" }}
      >
        {DOUBLED.map((logo, i) => (
          <div
            key={i}
            className="gsap-logo-item flex items-center gap-2.5 flex-shrink-0 text-[#555550] hover:text-[#888880] transition-colors duration-300"
          >
            <i className={`ti ${logo.icon} text-xl`} />
            <span className="text-sm font-normal tracking-wide whitespace-nowrap">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
