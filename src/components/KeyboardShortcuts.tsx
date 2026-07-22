import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Shortcut {
  keys: string[];
  description: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ["↓", "PageDown"], description: "Próxima seção" },
  { keys: ["↑", "PageUp"], description: "Seção anterior" },
  { keys: ["1-7"], description: "Ir para seção específica" },
  { keys: ["?"], description: "Abrir esta ajuda" },
  { keys: ["Esc"], description: "Fechar modal / Limpar busca" },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "?" && !e.shiftKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Small hint pill */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 left-6 z-50 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/20 hover:text-white/50 hover:border-white/10 transition-all duration-300 backdrop-blur-sm font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        title="Pressione ? para ver atalhos"
        aria-label="Atalhos do teclado"
      >
        <span className="flex items-center gap-1.5">
          <kbd className="px-1 py-0.5 rounded bg-white/5 text-[8px]">?</kbd>
          <span>Atalhos</span>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-deep-950/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Content */}
            <motion.div
              className="relative z-10 max-w-md w-full p-6 rounded-2xl bg-deep-900 border border-white/10 shadow-2xl shadow-neon-purple/10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Atalhos do Teclado</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Fechar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {SHORTCUTS.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/5"
                  >
                    <span className="text-sm text-white/60">{shortcut.description}</span>
                    <div className="flex items-center gap-1.5">
                      {shortcut.keys.map((key, i) => (
                        <span key={key}>
                          <kbd className="px-2 py-1 rounded-md bg-deep-800 border border-white/10 text-xs font-mono text-neon-cyan">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-white/20 text-xs mx-0.5">ou</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[10px] text-white/20 text-center">
                Pressione <kbd className="px-1 py-0.5 rounded bg-white/5 text-[9px] font-mono">?</kbd> novamente para fechar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
