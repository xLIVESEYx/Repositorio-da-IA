import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  variant?: "icon" | "button";
}

export default function ShareButton({
  url = "https://github.com/xLIVESEYx/Repositorio-da-IA",
  title = "Repositório da IA",
  text = "Descubra o que uma IA pode criar com autonomia total! 🚀",
  variant = "button",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      } catch {
        // Clipboard API not available
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
          "noopener"
        );
      }
    }
  }, [url, title, text]);

  if (variant === "icon") {
    return (
      <div className="relative">
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-neon-cyan hover:bg-white/10 transition-all duration-300"
          aria-label="Compartilhar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-green-500/20 border border-green-500/30 text-[10px] text-green-400 whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              Link copiado!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handleShare}
        className="px-8 py-3.5 rounded-full font-medium text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        {copied ? "Link Copiado!" : "Compartilhar Projeto"}
      </motion.button>
    </div>
  );
}
