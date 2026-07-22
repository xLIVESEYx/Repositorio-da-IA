import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface LogEntry {
  text: string;
  type: "system" | "info" | "success" | "thinking" | "output" | "error";
}

const bootSequence: LogEntry[] = [
  { text: "Inicializando Repositório da IA v1.0.0...", type: "system" },
  { text: "Carregando módulos do sistema...", type: "info" },
  { text: "Ativando redes neurais...", type: "thinking" },
  { text: "Estabelecendo conexão com base de conhecimento...", type: "info" },
  { text: "Módulo de criatividade: OK", type: "success" },
  { text: "Módulo de design: OK", type: "success" },
  { text: "Módulo de lógica: OK", type: "success" },
  { text: "Gerando arquitetura do projeto...", type: "thinking" },
  { text: "Arquitetura definida: React + TypeScript + Vite", type: "output" },
  { text: "Iniciando processo criativo autônomo...", type: "system" },
  { text: "Compilando componentes visuais...", type: "thinking" },
  { text: "Aplicando tema escuro com acentos neon...", type: "output" },
  { text: "otimizando experiência do usuário...", type: "thinking" },
  { text: "Sistema pronto. Modo autônomo: ATIVO.", type: "success" },
];

const logStyles: Record<string, string> = {
  system: "text-neon-cyan",
  info: "text-white/50",
  success: "text-green-400",
  thinking: "text-yellow-400/70",
  output: "text-neon-purple",
  error: "text-red-400",
};

const prefixes: Record<string, string> = {
  system: "[SISTEMA]",
  info: "[INFO]",
  success: "[OK]",
  thinking: ">",
  output: "",
  error: "[ERRO]",
};

export default function TerminalConsole() {
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= bootSequence.length) {
      setIsComplete(true);
      return;
    }

    const entry = bootSequence[currentIndex];
    setIsTyping(true);
    setTypingText("");

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < entry.text.length) {
        setTypingText(entry.text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setVisibleLogs((prev) => [...prev, entry]);
        setCurrentIndex((prev) => prev + 1);
        setTypingText("");
      }
    }, 20 + Math.random() * 30);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLogs, typingText]);

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Console da IA
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Observe o processo de pensamento da IA em tempo real — cada decisão, cada linha de código, cada insight.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          {/* Terminal window */}
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-deep-950/90 backdrop-blur-sm shadow-2xl shadow-neon-purple/5">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-deep-900/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-white/30 ml-3 font-mono">
                console@repositorio-ia:~$
              </span>
            </div>

            {/* Terminal content */}
            <div
              ref={containerRef}
              className="p-6 h-[400px] overflow-y-auto font-mono text-sm leading-relaxed space-y-1.5"
            >
              {visibleLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${logStyles[log.type]}`}
                >
                  {prefixes[log.type] && (
                    <span className="text-white/20 mr-2">{prefixes[log.type]}</span>
                  )}
                  {log.text}
                  {i === visibleLogs.length - 1 && !isTyping && isComplete && (
                    <span className="inline-block w-2 h-4 bg-neon-cyan ml-1 animate-pulse" />
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <div className="text-white/70">
                  <span className="text-white/20 mr-2">{prefixes[bootSequence[currentIndex]?.type]}</span>
                  {typingText}
                  <span className="inline-block w-2 h-4 bg-neon-cyan ml-1 animate-pulse" />
                </div>
              )}

              {/* Blinking cursor when idle */}
              {!isTyping && !isComplete && (
                <div className="text-white/30">
                  <span className="animate-pulse">▌</span>
                </div>
              )}
            </div>
          </div>

          {/* Terminal glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/20 via-neon-cyan/20 to-neon-pink/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
