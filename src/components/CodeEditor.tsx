import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface CodeSnippet {
  fileName: string;
  language: string;
  code: string[];
  gradient: string;
}

const snippets: CodeSnippet[] = [
  {
    fileName: "HeroSection.tsx",
    language: "tsx",
    gradient: "from-neon-cyan to-neon-purple",
    code: [
      'export default function HeroSection() {',
      '  return (',
      '    <section className="relative min-h-screen',
      '      flex items-center justify-center overflow-hidden">',
      '      <FloatingShapes />',
      '      <div className="relative z-10 text-center">',
      '        <motion.h1',
      '          initial={{ opacity: 0, y: 30 }}',
      '          animate={{ opacity: 1, y: 0 }}',
      '          transition={{ duration: 0.8 }}',
      '        >',
      '          <span>Repositório</span>',
      '          <br /><span>da IA</span>',
      '        </motion.h1>',
      '      </div>',
      '    </section>',
      '  );',
      '}',
    ],
  },
  {
    fileName: "ParticleBackground.tsx",
    language: "tsx",
    gradient: "from-neon-purple to-neon-pink",
    code: [
      'function createParticles(ctx: CanvasRenderingContext2D) {',
      '  const particles: Particle[] = [];',
      '  for (let i = 0; i < PARTICLE_COUNT; i++) {',
      '    particles.push({',
      '      x: Math.random() * canvas.width,',
      '      y: Math.random() * canvas.height,',
      '      vx: (Math.random() - 0.5) * 0.5,',
      '      vy: (Math.random() - 0.5) * 0.5,',
      '      radius: Math.random() * 2 + 0.5,',
      '      opacity: Math.random() * 0.5 + 0.2,',
      '    });',
      '  }',
      '  return particles;',
      '}',
    ],
  },
  {
    fileName: "TerminalConsole.tsx",
    language: "tsx",
    gradient: "from-neon-pink to-neon-cyan",
    code: [
      'useEffect(() => {',
      '  if (currentIndex >= bootSequence.length) return;',
      '  const entry = bootSequence[currentIndex];',
      '  let charIndex = 0;',
      '  const interval = setInterval(() => {',
      '    if (charIndex < entry.text.length) {',
      '      setTypingText(entry.text.slice(0, charIndex + 1));',
      '      charIndex++;',
      '    } else {',
      '      clearInterval(interval);',
      '      setVisibleLogs(prev => [...prev, entry]);',
      '      setCurrentIndex(prev => prev + 1);',
      '    }',
      '  }, 20 + Math.random() * 30);',
      '  return () => clearInterval(interval);',
      '}, [currentIndex]);',
    ],
  },
  {
    fileName: "tailwind.config",
    language: "css",
    gradient: "from-neon-blue to-neon-cyan",
    code: [
      '@theme {',
      '  --color-deep-950: #05050f;',
      '  --color-deep-900: #0a0a1a;',
      '  --color-neon-cyan: #00f0ff;',
      '  --color-neon-purple: #a855f7;',
      '  --color-neon-blue: #3b82f6;',
      '  --color-neon-pink: #ec4899;',
      '  --color-surface: rgba(15, 15, 36, 0.6);',
      '  --color-border-subtle: rgba(168, 85, 247, 0.15);',
      '}',
    ],
  },
];

function getLanguageClass(lang: string): string {
  const map: Record<string, string> = {
    tsx: "text-blue-300",
    css: "text-yellow-300",
  };
  return map[lang] || "text-white/60";
}

const KEYWORDS = [
  "function", "return", "const", "let", "export", "default", "from",
  "import", "for", "if", "else", "useEffect", "useState", "useRef",
  "useCallback", "true", "false", "null", "async", "await", "try",
  "catch", "throw", "new", "typeof", "keyof",
];

function highlightLine(line: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const tokens = line.split(
    /(\/\/(?:.*))|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(`(?:[^`\\]|\\.)*`)|(\b(?:function|return|const|let|export|default|from|import|for|if|else|useEffect|useState|useRef|useCallback|true|false|null|async|await|try|catch|throw|new|typeof|keyof)\b)/
  );

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === undefined) { i++; continue; }

    // Comments
    if (token.startsWith("//")) {
      parts.push(<span key={i} className="text-green-500/50">{token}</span>);
    }
    // Strings
    else if (
      token.startsWith('"') || token.startsWith("'") || token.startsWith("`")
    ) {
      parts.push(<span key={i} className="text-green-300/70">{token}</span>);
    }
    // Keywords
    else if (KEYWORDS.includes(token)) {
      parts.push(<span key={i} className="text-neon-purple">{token}</span>);
    }
    else {
      parts.push(token);
    }
    i++;
  }
  return parts;
}

export default function CodeEditor() {
  const [visibleSnippet, setVisibleSnippet] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSnippet = snippets[visibleSnippet];

  const resetSnippet = useCallback(() => {
    setVisibleLines(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    resetSnippet();
  }, [visibleSnippet, resetSnippet]);

  useEffect(() => {
    if (visibleLines >= currentSnippet.code.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, 80 + Math.random() * 60);

    return () => clearTimeout(timer);
  }, [visibleLines, currentSnippet.code.length]);

  // Auto-rotate snippets
  useEffect(() => {
    if (!isComplete) return;
    const timer = setTimeout(() => {
      setVisibleSnippet((prev) => (prev + 1) % snippets.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isComplete]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Código em Ação
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Navegue pelo código-fonte do site sendo digitado em tempo real — cada snippet é código real do projeto.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-deep-950/90 backdrop-blur-sm shadow-2xl shadow-neon-blue/5">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-deep-900/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-white/30 font-mono ml-2">
                  {currentSnippet.fileName}
                </span>
              </div>

              {/* Snippet navigation dots */}
              <div className="flex items-center gap-1.5">
                {snippets.map((s, i) => (
                  <button
                    key={s.fileName}
                    onClick={() => setVisibleSnippet(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === visibleSnippet
                        ? "bg-neon-cyan scale-125"
                        : "bg-white/10 hover:bg-white/30"
                    }`}
                    aria-label={`Ver ${s.fileName}`}
                  />
                ))}
              </div>
            </div>

            {/* Code content */}
            <div
              ref={containerRef}
              className="p-5 h-[320px] overflow-y-auto font-mono text-sm leading-7"
            >
              <div className="flex items-center gap-2 text-xs text-white/15 mb-4 pb-3 border-b border-white/5">
                <span className="text-neon-cyan/40">{currentSnippet.language.toUpperCase()}</span>
                <span className="w-px h-3 bg-white/10" />
                <span>{currentSnippet.fileName}</span>
              </div>

              <div className="relative">
                {/* Line numbers */}
                <div className="absolute left-0 top-0 select-none text-right pr-4 text-white/10 w-8">
                  {currentSnippet.code.map((_, i) => (
                    <div key={i} className="leading-7 text-xs">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Code lines */}
                <pre className="pl-12">
                  <code>
                    {currentSnippet.code.map((line, i) => (
                      <div
                        key={i}
                        className={`leading-7 transition-all duration-300 ${
                          i < visibleLines
                            ? "opacity-100"
                            : i === visibleLines
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {i < visibleLines ? (
                          <span className={getLanguageClass(currentSnippet.language)}>
                            {highlightLine(line)}
                          </span>
                        ) : i === visibleLines ? (
                          <span className="text-white/20">▌</span>
                        ) : null}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="px-4 py-2 border-t border-white/5 bg-deep-900/30 flex items-center justify-between text-[10px] text-white/20 font-mono">
              <span>
                {currentSnippet.fileName} • {currentSnippet.code.length} linhas
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isComplete ? "bg-green-400" : "bg-yellow-400"} animate-pulse`} />
                {isComplete ? "Compilado" : "Digitando..."}
              </span>
            </div>
          </div>
        </motion.div>

        {/* File selector */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {snippets.map((s, i) => (
            <button
              key={s.fileName}
              onClick={() => setVisibleSnippet(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                i === visibleSnippet
                  ? "bg-white/10 text-white border border-white/10"
                  : "bg-white/5 text-white/30 hover:text-white/50 border border-transparent"
              }`}
            >
              {s.fileName}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
