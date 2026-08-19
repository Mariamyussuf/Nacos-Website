import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GlowCard with GSAP magnetic hover tilt + scroll-triggered entrance.
 * The card subtly tilts toward the cursor on hover (3D parallax feel)
 * and fades up into view when scrolled into the viewport.
 */
export default function GlowCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const quickX = useRef(null);
  const quickY = useRef(null);

  // Scroll-triggered entrance
  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          once: true,
        },
      });
    }, cardRef.current);

    return () => ctx.revert();
  }, []);

  // Create GSAP quickTo setters for smooth magnetic tilt
  useEffect(() => {
    if (!cardRef.current) return;
    quickX.current = gsap.quickTo(cardRef.current, "rotateY", { duration: 0.4, ease: "power2.out" });
    quickY.current = gsap.quickTo(cardRef.current, "rotateX", { duration: 0.4, ease: "power2.out" });
    gsap.set(cardRef.current, { transformPerspective: 800 });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !quickX.current || !quickY.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    quickX.current(x * 8);  // max ±4 degrees
    quickY.current(-y * 8);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!quickX.current || !quickY.current) return;
    quickX.current(0);
    quickY.current(0);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glow-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
