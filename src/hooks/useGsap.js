import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useGsap — wraps gsap.context() for safe React cleanup.
 *
 * Usage:
 *   const containerRef = useGsap(() => {
 *     gsap.from(".card", { y: 40, opacity: 0, stagger: 0.1,
 *       scrollTrigger: { trigger: ".card-grid", start: "top 80%" }
 *     });
 *   }, []);
 *
 * All GSAP selector queries are scoped to containerRef.current.
 * The context auto-reverts every tween / ScrollTrigger on unmount.
 */
export function useGsap(callback, deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(callback, ref.current);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export { gsap, ScrollTrigger };
