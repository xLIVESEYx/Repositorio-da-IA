import { useEffect, useRef, useCallback } from "react";

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
}

export default function useTiltEffect<T extends HTMLElement = HTMLDivElement>(
  options: TiltOptions = {}
) {
  const {
    maxTilt = 10,
    perspective = 1000,
    scale = 1.02,
    speed = 400,
    glare = true,
    maxGlare = 0.3,
  } = options;

  const ref = useRef<T>(null);
  const stateRef = useRef({
    rect: { left: 0, top: 0, width: 0, height: 0 },
    isHovering: false,
  });

  const updateTransform = useCallback(
    (x: number, y: number) => {
      const el = ref.current;
      if (!el) return;

      const { rect } = stateRef.current;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (x - centerX) / (rect.width / 2) * maxTilt;
      const deltaY = (y - centerY) / (rect.height / 2) * maxTilt;

      el.style.transform = `perspective(${perspective}px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) scale3d(${scale}, ${scale}, ${scale})`;

      if (glare) {
        const glareEl = el.querySelector("[data-tilt-glare]") as HTMLElement | null;
        if (glareEl) {
          const glareX = (x - centerX) / (rect.width / 2);
          const glareY = (y - centerY) / (rect.height / 2);
          const glareOpacity = (Math.abs(glareX) + Math.abs(glareY)) / 2 * maxGlare;
          glareEl.style.opacity = String(glareOpacity);
        }
      }
    },
    [maxTilt, perspective, scale, glare, maxGlare]
  );

  const resetTransform = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transition = `transform ${speed}ms ease-out`;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

    if (glare) {
      const glareEl = el.querySelector("[data-tilt-glare]") as HTMLElement | null;
      if (glareEl) {
        glareEl.style.opacity = "0";
      }
    }

    setTimeout(() => {
      if (el) el.style.transition = "";
    }, speed);
  }, [speed, perspective, glare]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for reduced motion or touch devices
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isTouchDevice) return;

    function onMouseEnter() {
      stateRef.current.rect = el!.getBoundingClientRect();
      stateRef.current.isHovering = true;
    }

    function onMouseMove(e: MouseEvent) {
      if (!stateRef.current.isHovering) return;
      stateRef.current.rect = el!.getBoundingClientRect();
      updateTransform(e.clientX, e.clientY);
    }

    function onMouseLeave() {
      stateRef.current.isHovering = false;
      resetTransform();
    }

    el.addEventListener("mouseenter", onMouseEnter, { passive: true });
    el.addEventListener("mousemove", onMouseMove, { passive: true });
    el.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [updateTransform, resetTransform]);

  return ref;
}
