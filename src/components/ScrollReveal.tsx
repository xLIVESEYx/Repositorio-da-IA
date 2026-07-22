import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  distance = 60,
  delay = 0,
  duration = 0.7,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });

  const getTransform = () => {
    const y = direction === "up" || direction === "down"
      ? useTransform(scrollYProgress, [0, 1], [direction === "up" ? distance : -distance, 0])
      : undefined;
    const x = direction === "left" || direction === "right"
      ? useTransform(scrollYProgress, [0, 1], [direction === "left" ? distance : -distance, 0])
      : undefined;
    return { x, y };
  };

  const { x, y } = getTransform();
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.2, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, x, y }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function SplitText({ text, className = "", delay = 0, stagger = 0.03 }: SplitTextProps) {
  return (
    <span className={`inline ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{
            duration: 0.3,
            delay: delay + i * stagger,
            ease: "easeOut",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({ children, className = "", speed = 0.5 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
