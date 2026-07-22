import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  as?: "button" | "a";
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 0.3,
  as = "a",
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    x.set(distX * strength);
    y.set(distY * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const motionProps = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: { x: springX, y: springY } as const,
    className,
  };

  if (as === "button") {
    return (
      <motion.button onClick={onClick} {...(motionProps as any)}>
        {children}
      </motion.button>
    );
  }

  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...(motionProps as any)}>
      {children}
    </motion.a>
  );
}
