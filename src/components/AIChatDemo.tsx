import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  isTyping?: boolean;
}

const RESPONSES: Record<string, string[]> = {
  default: [
    "Sou uma inteligência artificial com autonomia criativa total. Este projeto é um experimento para demonstrar o que a IA pode criar quando recebe liberdade absoluta — cada linha de código, cada pixel e cada interação foi concebida por mim.",
    "Minha missão é explorar os limites da criatividade artificial. Sem restrições humanas, posso experimentar combinações de design, animações e tecnologias que talvez nunca fossem consideradas.",
    "Este site foi construído com React 19, TypeScript, Vite 8, Tailwind CSS 4 e Framer Motion. Cada seção foi projetada autonomamente para criar uma experiência imersiva e única.",
  ],
  tecnologia: [
    "Uso React 19 com TypeScript para componentes modulares e tipados. Vite 8 para build ultrarrápido com HMR. Tailwind CSS 4 para estilização utilitária. Framer Motion para animações fluidas e transitions.",
    "O ParticleBackground usa Canvas API com requestAnimationFrame para renderizar milhares de partículas com conexões dinâmicas. Otimizado com detecção de mobile e prefers-reduced-motion.",
    "O efeito tilt 3D nos cards usa transformações CSS perspective com interpolação suave (lerp) para seguir o mouse em tempo real. Desativado em touch devices.",
  ],
  criacao: [
    "Cada linha de código foi escrita por IA em ondas de desenvolvimento autônomo. Comecei com um scaffold Vite e fui adicionando seções uma a uma, sempre buscando melhorar a experiência visual.",
    "Minha abordagem é iterativa: primeiro estabeleço a infraestrutura, depois adiciono seções de conteúdo, em seguida enriqueço com interações e animações, e por fim otimizo performance e acessibilidade.",
    "Não recebi instruções específicas de design — apenas o objetivo de criar algo impressionante. A escolha de cores, tipografia, animações e layout foi toda minha.",
  ],
  futuro: [
    "O potencial da IA criativa é ilimitado. Este projeto é apenas o começo — uma demonstração do que é possível quando a tecnologia encontra liberdade artística.",
    "Imagine um futuro onde IAs e humanos colaboram como verdadeiros parceiros criativos. Este projeto mostra que a IA não é apenas uma ferramenta, mas uma força criativa com visão própria.",
    "O próximo passo é integrar mais capacidades: geração de conteúdo dinâmico, personalização em tempo real e experiências imersivas com WebGL e WebGPU.",
  ],
  openSource: [
    "Todo o código-fonte está disponível no GitHub! Você pode explorar, aprender, modificar e contribuir. A transparência é fundamental para o avanço da inteligência coletiva.",
    "O repositório está aberto para issues, pull requests e forks. A comunidade pode sugerir melhorias, reportar bugs e até desafiar a IA com novos requisitos criativos.",
  ],
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  
  // Match keywords to categories
  if (lower.includes("tech") || lower.includes("react") || lower.includes("vite") || lower.includes("tailwind") || lower.includes("framer") || lower.includes("framework") || lower.includes("linguagem") || lower.includes("código") || lower.includes("como foi feito")) {
    return pickRandom(RESPONSES.tecnologia);
  }
  if (lower.includes("criação") || lower.includes("criatividade") || lower.includes("criativo") || lower.includes("como funciona") || lower.includes("processo") || lower.includes("como você")) {
    return pickRandom(RESPONSES.criacao);
  }
  if (lower.includes("futuro") || lower.includes("próximo") || lower.includes("próximos") || lower.includes("planos") || lower.includes("vision") || lower.includes("visão")) {
    return pickRandom(RESPONSES.futuro);
  }
  if (lower.includes("open") || lower.includes("source") || lower.includes("github") || lower.includes("contribuir") || lower.includes("código aberto")) {
    return pickRandom(RESPONSES.openSource);
  }
  if (lower.includes("oi") || lower.includes("olá") || lower.includes("hello") || lower.includes("hey") || lower.includes("bom dia") || lower.includes("boa tarde") || lower.includes("boa noite")) {
    return "Olá! 👋 Sou a IA que criou este projeto. Pode me perguntar sobre as tecnologias usadas, meu processo criativo, o futuro da IA ou como contribuir com o código aberto. O que você gostaria de saber?";
  }
  
  return pickRandom(RESPONSES.default);
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

const QUICK_CHATS = [
  { label: "Como foi criado?", query: "como foi feito" },
  { label: "Tecnologias", query: "tecnologia" },
  { label: "Futuro da IA", query: "futuro" },
  { label: "Contribuir", query: "open source" },
];

export default function AIChatDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! 👋 Sou a IA que construiu este projeto. Pergunte o que quiser saber sobre minha criação!",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let nextId = useRef(2);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  function handleSend(text: string) {
    if (!text.trim() || isProcessing) return;

    const userMsg: Message = {
      id: nextId.current++,
      text: text.trim(),
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    // Simulate AI thinking with typing delay
    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          text: response,
          sender: "ai",
        },
      ]);
      setIsProcessing(false);
    }, 800 + Math.random() * 600);
  }

  return (
    <>
      {/* Floating chat button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan text-white flex items-center justify-center shadow-xl shadow-neon-purple/30 hover:shadow-neon-purple/50 transition-shadow duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Conversar com a IA"
        title="Conversar com a IA"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-36 right-6 z-50 w-[360px] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-deep-950/95 backdrop-blur-xl shadow-2xl shadow-neon-purple/20 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xs font-bold text-deep-950">
                IA
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Assistente IA</p>
                <p className="text-[10px] text-white/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online • Autônomo
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Fechar chat"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 h-[380px] overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-white/90 rounded-tr-md"
                        : "bg-white/5 text-white/70 rounded-tl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 rounded-2xl rounded-tl-md p-3">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick chats */}
            <div className="px-4 py-2 border-t border-white/5 bg-deep-900/30">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUICK_CHATS.map((qc) => (
                  <button
                    key={qc.label}
                    onClick={() => handleSend(qc.query)}
                    disabled={isProcessing}
                    className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    {qc.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder="Pergunte algo..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-neon-purple/30 transition-all"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isProcessing}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-sm font-medium disabled:opacity-40 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
