import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Neon-style two-tone heading with GSAP scroll-triggered word reveals.
 * Uses .bright / .dim CSS classes so it responds automatically to light mode.
 * Each word wipes in via clip-path when scrolled into view.
 *
 * Usage:
 *   <NeonHeading bright="Software Engineering." dim="Build full-stack apps, contribute to open source." />
 */
export default function NeonHeading({ bright, dim, className = "" }) {
  const headingRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      const words = headingRef.current.querySelectorAll(".gsap-word");

      gsap.set(words, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
      });

      gsap.to(words, {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, headingRef.current);

    return () => ctx.revert();
  }, [bright, dim]);

  const renderWords = (text, spanClass) =>
    text.split(" ").map((word, i) => (
      <span key={`${spanClass}-${i}`} className={`gsap-word ${spanClass}`} style={{ display: "inline-block", marginRight: "0.3em" }}>
        {word}
      </span>
    ));

  return (
    <h2 ref={headingRef} className={`neon-heading ${className}`}>
      {renderWords(bright, "bright")}
      {renderWords(dim, "dim")}
    </h2>
  );
}
