import { useEffect, useRef } from "react";

export default function MorphingBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId: number;
    let time = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.scale(dpr, dpr);
    }

    // Blob control points
    const points = 8;
    const controlPoints: { x: number; y: number; vx: number; vy: number; phase: number }[] = [];

    function initBlob() {
      controlPoints.length = 0;
      const cx = canvas!.width / (window.devicePixelRatio || 1) / 2;
      const cy = canvas!.height / (window.devicePixelRatio || 1) / 2;
      const radius = Math.min(canvas!.width, canvas!.height) * 0.15;

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        controlPoints.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function animate() {
      time += 0.008;
      const w = canvas!.width / (window.devicePixelRatio || 1);
      const h = canvas!.height / (window.devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;

      ctx!.clearRect(0, 0, w, h);

      // Update blob control points with organic movement
      const baseRadius = Math.min(w, h) * 0.15;
      const pulse = Math.sin(time * 0.5) * baseRadius * 0.15 + baseRadius;

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2 + time * 0.1;
        const variance = Math.sin(time * 0.7 + controlPoints[i].phase) * baseRadius * 0.3;
        const variance2 = Math.cos(time * 0.5 + controlPoints[i].phase * 1.3) * baseRadius * 0.15;
        const r = pulse + variance + variance2;

        controlPoints[i].x = cx + Math.cos(angle) * r;
        controlPoints[i].y = cy + Math.sin(angle) * r;
      }

      // Draw the blob using bezier curves
      ctx!.beginPath();
      ctx!.moveTo(controlPoints[0].x, controlPoints[0].y);

      for (let i = 0; i < points; i++) {
        const current = controlPoints[i];
        const next = controlPoints[(i + 1) % points];
        const nextNext = controlPoints[(i + 2) % points];

        // Control points for smooth organic curve
        const cp1x = current.x + (next.x - current.x) * 0.5;
        const cp1y = current.y + (next.y - current.y) * 0.5;
        const cp2x = next.x + (nextNext.x - next.x) * 0.5;
        const cp2y = next.y + (nextNext.y - next.y) * 0.5;

        ctx!.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
      }

      ctx!.closePath();

      // Create gradient fill that shifts over time
      const gradX = cx + Math.sin(time * 0.3) * w * 0.2;
      const gradY = cy + Math.cos(time * 0.2) * h * 0.2;
      const grad = ctx!.createRadialGradient(gradX, gradY, 0, cx, cy, w * 0.5);

      const alpha = 0.12;
      grad.addColorStop(0, `rgba(168, 85, 247, ${alpha})`);
      grad.addColorStop(0.3, `rgba(0, 240, 255, ${alpha * 0.7})`);
      grad.addColorStop(0.6, `rgba(236, 72, 153, ${alpha * 0.5})`);
      grad.addColorStop(1, "transparent");

      ctx!.fillStyle = grad;
      ctx!.fill();

      // Second smaller blob
      ctx!.beginPath();
      const smallBlobRadius = baseRadius * 0.4;
      const smallCx = cx + Math.sin(time * 0.4 + 1) * w * 0.15;
      const smallCy = cy + Math.cos(time * 0.3 + 2) * h * 0.1;

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2 + time * 0.15;
        const variance = Math.sin(time * 0.6 + i * 1.5) * smallBlobRadius * 0.3;
        const r = smallBlobRadius + variance;
        const px = smallCx + Math.cos(angle) * r;
        const py = smallCy + Math.sin(angle) * r;

        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();

      const grad2 = ctx!.createRadialGradient(smallCx, smallCy, 0, smallCx, smallCy, smallBlobRadius * 2);
      grad2.addColorStop(0, `rgba(0, 240, 255, ${alpha * 0.6})`);
      grad2.addColorStop(0.5, `rgba(59, 130, 246, ${alpha * 0.4})`);
      grad2.addColorStop(1, "transparent");

      ctx!.fillStyle = grad2;
      ctx!.fill();

      animId = requestAnimationFrame(animate);
    }

    let resizeTimer: number;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        initBlob();
      }, 200);
    }

    resize();
    initBlob();
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
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
