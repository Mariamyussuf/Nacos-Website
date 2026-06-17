import React from "react";

/**
 * Neon-style two-tone heading.
 * Uses .bright / .dim CSS classes so it responds automatically to light mode.
 *
 * Usage:
 *   <NeonHeading bright="Software Engineering." dim="Build full-stack apps, contribute to open source." />
 */
export default function NeonHeading({ bright, dim, className = "" }) {
  return (
    <h2 className={`neon-heading ${className}`}>
      <span className="bright">{bright} </span>
      <span className="dim">{dim}</span>
    </h2>
  );
}
