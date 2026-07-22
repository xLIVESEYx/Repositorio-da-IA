import { useEffect, useRef } from "react";

interface MeshPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
}

const NUM_POINTS = 6;

export default function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId: number;
    let points: MeshPoint[] = [];
    let time = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.scale(dpr, dpr);
      initPoints();
    }

    function initPoints() {
      const w = canvas!.width / (window.devicePixelRatio || 1);
      const h = canvas!.height / (window.devicePixelRatio || 1);

      const colorSets = [
        { r: 168, g: 85, b: 247 },  // neon-purple
        { r: 0, g: 240, b: 255 },   // neon-cyan
        { r: 236, g: 72, b: 153 },  // neon-pink
        { r: 59, g: 130, b: 246 },  // neon-blue
      ];

      points = Array.from({ length: NUM_POINTS }, (_, i) => {
        const color = colorSets[i % colorSets.length];
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: color.r,
          g: color.g,
          b: color.b,
        };
      });
    }

    function animate() {
      time += 0.005;
      const w = canvas!.width / (window.devicePixelRatio || 1);
      const h = canvas!.height / (window.devicePixelRatio || 1);

      ctx!.clearRect(0, 0, w, h);

      // Move control points
      for (const p of points) {
        p.x += p.vx + Math.sin(time + p.r * 0.01) * 0.2;
        p.y += p.vy + Math.cos(time + p.g * 0.01) * 0.2;

        // Bounce off edges
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Clamp
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      // Create gradient mesh using triangulation
      // We'll use a radial gradient per point and blend them
      
      // Sort points by distance from center for layering
      const cx = w / 2;
      const cy = h / 2;
      const sorted = [...points].sort((a, b) => {
        const da = Math.sqrt((a.x - cx) ** 2 + (a.y - cy) ** 2);
        const db = Math.sqrt((b.x - cx) ** 2 + (b.y - cy) ** 2);
        return da - db;
      });

      // Draw overlapping radial gradients
      for (const p of sorted) {
        const radius = Math.max(w, h) * 0.8;
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, 0.08)`);
        grad.addColorStop(0.3, `rgba(${p.r}, ${p.g}, ${p.b}, 0.04)`);
        grad.addColorStop(1, "transparent");

        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, w, h);
      }

      // Subtle base overlay
      const baseGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      baseGrad.addColorStop(0, "rgba(5, 5, 15, 0.3)");
      baseGrad.addColorStop(1, "transparent");
      ctx!.fillStyle = baseGrad;
      ctx!.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(animate);
    }

    let resizeTimer: number;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 200);
    }

    resize();
    animate();

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
