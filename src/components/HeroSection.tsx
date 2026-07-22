import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MorphingBlob from "./MorphingBlob";
import { SplitText } from "./ScrollReveal";

// 3D geometric shapes rendered with pure CSS
function FloatingShapes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const shapes = [
    {
      shape: "cube",
      size: 60,
      color: "border-neon-purple/20",
      bg: "bg-neon-purple/5",
      x: -200,
      y: -150,
      rotateX: 20,
      rotateY: 30,
    },
    {
      shape: "pyramid",
      size: 80,
      color: "border-neon-cyan/15",
      bg: "bg-neon-cyan/5",
      x: 250,
      y: -100,
      rotateX: -15,
      rotateY: 45,
    },
    {
      shape: "sphere",
      size: 100,
      color: "border-neon-pink/10",
      bg: "bg-neon-pink/5",
      x: -180,
      y: 200,
      rotateX: 30,
      rotateY: -20,
    },
    {
      shape: "diamond",
      size: 50,
      color: "border-neon-blue/20",
      bg: "bg-neon-blue/5",
      x: 220,
      y: 180,
      rotateX: -25,
      rotateY: 15,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: s.size,
            height: s.size,
            marginLeft: s.x,
            marginTop: s.y,
          }}
          animate={{
            x: mousePos.x * 30,
            y: mousePos.y * 30,
            rotateX: [s.rotateX, s.rotateX + 360],
            rotateY: [s.rotateY, s.rotateY + 360],
          }}
          transition={{
            x: { duration: 2, ease: "easeOut" },
            y: { duration: 2, ease: "easeOut" },
            rotateX: { duration: 20, repeat: Infinity, ease: "linear" },
            rotateY: { duration: 25, repeat: Infinity, ease: "linear" },
          }}
        >
          {s.shape === "cube" && (
            <div className={`w-full h-full rounded-xl ${s.bg} ${s.color} border backdrop-blur-sm`} style={{ transform: "rotateX(20deg) rotateY(30deg)" }}>
              <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-white/5 to-transparent" />
            </div>
          )}
          {s.shape === "pyramid" && (
            <div
              className={`w-0 h-0 ${s.color}`}
              style={{
                borderLeft: `${s.size / 2}px solid transparent`,
                borderRight: `${s.size / 2}px solid transparent`,
                borderBottom: `${s.size}px solid rgba(0, 240, 255, 0.05)`,
                filter: "drop-shadow(0 0 20px rgba(0, 240, 255, 0.1))",
              }}
            />
          )}
          {s.shape === "sphere" && (
            <div className={`w-full h-full rounded-full ${s.bg} ${s.color} border backdrop-blur-sm`}>
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-pink/10 to-transparent blur-sm" />
            </div>
          )}
          {s.shape === "diamond" && (
            <div
              className={`w-full h-full ${s.bg} ${s.color} border backdrop-blur-sm`}
              style={{ transform: "rotate(45deg)", borderRadius: "8px" }}
            >
              <div className="absolute inset-2 rounded bg-gradient-to-br from-white/5 to-transparent" style={{ transform: "rotate(-45deg)" }} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Morphing Blob Background */}
      <MorphingBlob />

      {/* 3D Floating Shapes */}
      <FloatingShapes />

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full border border-neon-purple/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full border border-neon-cyan/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full border border-neon-pink/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Central glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse-glow" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neon-cyan mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            Experimento de Autonomia Total
          </span>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          <SplitText text="Repositório" className="bg-gradient-to-r from-white via-neon-cyan to-neon-purple bg-clip-text text-transparent" />
          <br />
          <SplitText text="da IA" className="text-white/90" stagger={0.04} delay={0.6} />
        </h1>

        <motion.p
          className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Um experimento ousado para demonstrar o que acontece quando uma 
          inteligência artificial recebe autonomia criativa total — sem limites, 
          sem restrições, apenas código e imaginação.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.a
            href="#recursos"
            className="group relative px-8 py-3.5 rounded-full font-medium text-sm bg-gradient-to-r from-neon-purple to-neon-cyan text-white overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("recursos")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="relative z-10">Explorar o Projeto</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.a>

          <motion.a
            href="https://github.com/xLIVESEYx/Repositorio-da-IA"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full font-medium text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Ver Código
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-white/20"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs tracking-widest uppercase">Rolar</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
