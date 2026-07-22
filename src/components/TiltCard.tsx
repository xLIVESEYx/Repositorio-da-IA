import { type ReactNode } from "react";
import useTiltEffect from "../hooks/useTiltEffect";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
}: TiltCardProps) {
  const ref = useTiltEffect<HTMLDivElement>({ maxTilt, glare, scale: 1.01 });

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
      {glare && (
        <div
          data-tilt-glare
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />
      )}
    </div>
  );
}
