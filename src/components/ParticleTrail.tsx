import { useEffect, useRef } from "react";

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const COLORS = ["#00f0ff", "#a855f7", "#ec4899", "#3b82f6"];

export default function ParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for reduced motion or mobile
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    let animId: number;
    let isVisible = true;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function addParticles(x: number, y: number, count: number) {
      const particles = particlesRef.current;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.8;
        const maxLife = 40 + Math.random() * 60;
        particles.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.6 + Math.random() * 0.4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife,
        });

        // Limit particles
        if (particles.length > 200) {
          particles.splice(0, particles.length - 200);
        }
      }
    }

    function animate() {
      if (!isVisible) {
        animId = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 0.02;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Calculate mouse velocity
      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Add particles based on mouse movement
      if (speed > 1) {
        const count = Math.min(Math.floor(speed * 0.4), 5);
        addParticles(mouse.x, mouse.y, count);
      }

      // Occasionally add particles even when idle (subtle ambient effect)
      if (mouse.x > 0 && speed < 0.5 && Math.random() < 0.02) {
        addParticles(mouse.x, mouse.y, 1);
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Fade out based on life
        const lifeRatio = 1 - p.life / p.maxLife;
        const fadeIn = Math.min(1, p.life / 10);

        // Slow down over time
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        // Add subtle gravity/wind
        p.vy += 0.01;
        p.vx += Math.sin(timeRef.current + p.life * 0.1) * 0.02;

        // Shrink slightly
        const size = p.size * (0.3 + lifeRatio * 0.7);

        // Draw particle
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.alpha * fadeIn * lifeRatio;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        // Draw glow for larger particles
        if (size > 1.5) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
          ctx!.fillStyle = p.color;
          ctx!.globalAlpha = (p.alpha * fadeIn * lifeRatio) * 0.15;
          ctx!.fill();
          ctx!.globalAlpha = 1;
        }
      }

      // Store current position for next frame velocity calc
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      animId = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }

    function onMouseLeave() {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;
    }

    let resizeTimer: number;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 300);
    }

    resize();
    animate();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
