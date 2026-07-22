import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "default" | "glow" | "line";
}

export default function SectionDivider({ variant = "default" }: SectionDividerProps) {
  if (variant === "glow") {
    return (
      <div className="relative flex justify-center py-8">
        <motion.div
          className="w-[1px] h-16 bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: "top" }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-neon-purple/50 blur-sm"
          animate={{ y: [-30, 30], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (variant === "line") {
    return (
      <div className="flex justify-center py-6">
        <motion.div
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ transformOrigin: "center" }}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center gap-3">
        <motion.div
          className="w-8 h-[1px] bg-gradient-to-r from-transparent to-neon-purple/30"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "right" }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-neon-purple/40"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="w-8 h-[1px] bg-gradient-to-l from-transparent to-neon-purple/30"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
