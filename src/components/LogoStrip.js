import React from "react";

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
  return (
    <section className="relative z-10 py-10 border-y border-[rgba(255,255,255,0.07)] bg-[#0A0A08]">
      <div className="marquee-container">
        <div className="marquee-track">
          {DOUBLED.map((logo, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 flex-shrink-0 text-[#555550] hover:text-[#888880] transition-colors duration-300"
            >
              <i className={`ti ${logo.icon} text-xl`} />
              <span className="text-sm font-normal tracking-wide whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
