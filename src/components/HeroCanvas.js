import React, { useRef, useEffect } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Pre-compute column data
    const columns = [];
    const COL_COUNT = 60;

    const buildColumns = () => {
      columns.length = 0;
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < COL_COUNT; i++) {
        columns.push({
          x: (w / COL_COUNT) * i + Math.random() * (w / COL_COUNT),
          baseHeight: 0.15 + Math.random() * 0.55,
          speed: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random() > 0.7 ? 150 : 130, // green range
          brightness: 0.3 + Math.random() * 0.7,
          width: 2 + Math.random() * 4,
        });
      }
    };
    buildColumns();

    // Floating particles
    const particles = [];
    const PARTICLE_COUNT = 40;
    const buildParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.2 - Math.random() * 0.5,
          size: 1 + Math.random() * 2,
          alpha: 0.1 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };
    buildParticles();

    const render = () => {
      t += 0.008;
      const w = canvas.width;
      const h = canvas.height;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw vertical glowing bars
      columns.forEach((col) => {
        const heightMod = Math.sin(t * col.speed + col.phase) * 0.3 + 0.7;
        const barH = h * col.baseHeight * heightMod;
        const y = h - barH;

        const grad = ctx.createLinearGradient(col.x, y, col.x, h);
        const alpha = col.brightness * (0.15 + Math.sin(t * col.speed + col.phase) * 0.1);
        grad.addColorStop(0, `hsla(${col.hue}, 100%, 50%, 0)`);
        grad.addColorStop(0.3, `hsla(${col.hue}, 100%, 50%, ${alpha * 0.5})`);
        grad.addColorStop(0.7, `hsla(${col.hue}, 100%, 50%, ${alpha})`);
        grad.addColorStop(1, `hsla(${col.hue}, 100%, 50%, ${alpha * 0.3})`);

        ctx.fillStyle = grad;
        ctx.fillRect(col.x - col.width / 2, y, col.width, barH);

        // Top glow
        ctx.beginPath();
        ctx.arc(col.x, y, col.width * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${col.hue}, 100%, 60%, ${alpha * 0.4})`;
        ctx.fill();
      });

      // Draw grid overlay
      ctx.strokeStyle = "rgba(12, 207, 0, 0.03)";
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(t + p.phase) * 0.2;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(12, 207, 0, ${p.alpha * (0.5 + Math.sin(t * 2 + p.phase) * 0.5)})`;
        ctx.fill();
      });

      // Central radial glow
      const centerGrad = ctx.createRadialGradient(w * 0.4, h * 0.6, 0, w * 0.4, h * 0.6, w * 0.5);
      centerGrad.addColorStop(0, "rgba(12, 207, 0, 0.04)");
      centerGrad.addColorStop(0.5, "rgba(12, 207, 0, 0.015)");
      centerGrad.addColorStop(1, "transparent");
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
