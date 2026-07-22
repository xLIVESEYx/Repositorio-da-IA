import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function animate() {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.08;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${posRef.current.x - 100}px, ${posRef.current.y - 100}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Only show on devices with fine pointer (mouse)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[200px] h-[200px] rounded-full bg-gradient-to-r from-neon-purple/8 via-neon-cyan/8 to-transparent blur-[80px] pointer-events-none z-[9999] hidden md:block"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
