import React from "react";

/**
 * Neon-style two-tone heading.
 * Pattern: bold white first sentence, dimmed gray rest.
 *
 * Usage:
 *   <NeonHeading bright="Software Engineering." dim="Build full-stack apps, contribute to open source." />
 */
export default function NeonHeading({ bright, dim, className = "", light = false }) {
  return (
    <h2 className={`neon-heading ${className}`}>
      <span className={light ? "text-[#111111]" : "text-white"}>{bright} </span>
      <span className={light ? "text-black/35" : "text-white/35"}>{dim}</span>
    </h2>
  );
}
