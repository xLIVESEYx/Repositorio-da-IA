import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "Inicializando redes neurais...",
  "Carregando módulo criativo...",
  "Ativando processamento autônomo...",
  "Preparando interface...",
  "Sistema pronto.",
];

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Clear any previous timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (messageIndex >= loadingMessages.length) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 600);
      timersRef.current.push(timer);
      return () => {
        timersRef.current.forEach(clearTimeout);
      };
    }

    const message = loadingMessages[messageIndex];
    let charIndex = 0;
    setCurrentText("");

    const typeInterval = setInterval(() => {
      if (charIndex < message.length) {
        setCurrentText(message.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        const nextTimer = setTimeout(() => {
          setMessageIndex((prev) => prev + 1);
        }, 300);
        timersRef.current.push(nextTimer);
      }
    }, 30);

    return () => {
      clearInterval(typeInterval);
      timersRef.current.forEach(clearTimeout);
    };
  }, [messageIndex]);

  // Check for reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[999] bg-deep-950 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Central icon */}
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-2xl font-bold text-deep-950 mb-8"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            IA
          </motion.div>

          {/* Loading text */}
          <div className="font-mono text-sm">
            <span className="text-neon-cyan">{currentText}</span>
            <span className="inline-block w-2 h-4 bg-neon-cyan ml-1 animate-pulse" />
          </div>

          {/* Progress bar */}
          <div className="mt-6 w-48 h-0.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
              animate={{
                width:
                  messageIndex === loadingMessages.length - 1
                    ? "100%"
                    : `${(messageIndex / (loadingMessages.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="mt-4 text-[10px] text-white/20 font-mono tracking-widest uppercase">
            Repositório da IA
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
