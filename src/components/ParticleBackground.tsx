import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const COLORS = ["#a855f7", "#00f0ff", "#3b82f6", "#ec4899"];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let lastResizeTime = 0;
    const resizeThrottle = 200;
    let isVisible = true;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Check for low power / mobile (fewer particles)
    const isMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;
    const particleMultiplier = isMobile ? 0.3 : 1;

    function resize() {
      const now = Date.now();
      if (now - lastResizeTime < resizeThrottle) return;
      lastResizeTime = now;

      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      createParticles();
    }

    function createParticles() {
      const count = Math.min(
        Math.floor(window.innerWidth * 0.04 * particleMultiplier),
        isMobile ? 25 : 70
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * (isMobile ? 1.5 : 2) + 0.5,
        speedX: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.3),
        speedY: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.3),
        opacity: Math.random() * 0.4 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function drawConnections() {
      const connectionDistance = isMobile ? 100 : 150;

      for (let i = 0; i < particles.length; i++) {
        // Limit connections for performance
        const maxConnections = isMobile ? 2 : 4;
        let connections = 0;

        for (let j = i + 1; j < particles.length; j++) {
          if (connections >= maxConnections) break;

          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            connections++;
            const alpha = (1 - distance / connectionDistance) * (isMobile ? 0.08 : 0.12);
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction (subtle)
        if (!isMobile) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            p.x += dx * 0.0003;
            p.y += dy * 0.0003;
          }
        }

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.opacity;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;
    }

    // Debounced resize
    let resizeTimer: number;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 300);
    }

    resize();
    animate();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
