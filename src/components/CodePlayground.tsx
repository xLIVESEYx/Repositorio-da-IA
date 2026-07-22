import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoCommand {
  label: string;
  description: string;
  icon: string;
  code: string[];
  output: string[];
  gradient: string;
}

const DEMOS: DemoCommand[] = [
  {
    label: "Partículas",
    description: "Gerar partículas interativas",
    icon: "✦",
    gradient: "from-neon-cyan to-neon-purple",
    code: [
      "const particles = [];",
      "for (let i = 0; i < 50; i++) {",
      "  particles.push({",
      "    x: Math.random() * canvas.width,",
      "    y: Math.random() * canvas.height,",
      "    size: Math.random() * 3 + 1,",
      '    color: "#a855f7"',
      "  });",
      "}",
      "animate(particles);",
    ],
    output: [
      "✓ Inicializando motor de partículas...",
      "✓ 50 partículas criadas",
      "✓ Conexões entre partículas: ATIVO",
      "✓ Seguimento de cursor: ATIVO",
      `▶ Renderizando ${50 + Math.floor(Math.random() * 20)} quadros/segundo`,
    ],
  },
  {
    label: "Rede Neural",
    description: "Simular rede neural",
    icon: "◆",
    gradient: "from-neon-purple to-neon-pink",
    code: [
      "class NeuralNetwork {",
      "  constructor(layers) {",
      "    this.layers = layers;",
      "    this.weights = [];",
      "    this.biases = [];",
      "    this.initialize();",
      "  }",
      "",
      "  forward(input) {",
      "    let activation = input;",
      "    for (const layer of this.layers) {",
      "      activation = layer.activate(activation);",
      "    }",
      "    return activation;",
      "  }",
      "}",
    ],
    output: [
      "✓ Carregando arquitetura neural...",
      "✓ 5 camadas configuradas",
      "✓ 28 neurônios inicializados",
      "✓ 300+ sinapses conectadas",
      "▶ Precisão: 98.7% | Loss: 0.023",
    ],
  },
  {
    label: "Animações",
    description: "Renderizar animações fluídas",
    icon: "◎",
    gradient: "from-neon-pink to-neon-cyan",
    code: [
      "const animation = {",
      "  duration: 2000,",
      "  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',",
      "  keyframes: [",
      "    { opacity: 0, transform: 'translateY(30px)' },",
      "    { opacity: 1, transform: 'translateY(0)' },",
      "  ],",
      "};",
      "",
      "element.animate(keyframes, {",
      "  duration: animation.duration,",
      "  easing: animation.easing,",
      "});",
    ],
    output: [
      "✓ Compilando keyframes CSS...",
      "✓ Aplicando interpolação de movimento",
      "✓ Spring: stiffness=300, damping=25",
      "✓ Transições: 100% suaves",
      "▶ 60 FPS em todas as animações",
    ],
  },
  {
    label: "3D Shapes",
    description: "Renderizar formas 3D",
    icon: "◈",
    gradient: "from-neon-blue to-neon-cyan",
    code: [
      "const scene = new THREE.Scene();",
      "const camera = new THREE.PerspectiveCamera(",
      "  75, width / height, 0.1, 1000",
      ");",
      "",
      "const geometry = new THREE.IcosahedronGeometry(2, 1);",
      'const material = new THREE.MeshPhongMaterial({',
      "  color: 0xa855f7,",
      "  wireframe: true,",
      "});",
      "",
      "scene.add(new THREE.Mesh(geometry, material));",
    ],
    output: [
      "✓ Inicializando cena WebGL...",
      "✓ Geometria: Icosaedro (1 subdivisão)",
      "✓ Material: MeshPhong + Wireframe",
      "✓ Iluminação direcional configurada",
      "▶ Renderizando em 3D com rotação contínua",
    ],
  },
];

export default function CodePlayground() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [visibleCodeLines, setVisibleCodeLines] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const demo = DEMOS[activeDemo];

  function runDemo() {
    setIsRunning(true);
    setIsCompiling(true);
    setOutputLines([]);
    setVisibleCodeLines(0);

    // Type out code lines one by one
    let lineIndex = 0;
    const codeTimer = setInterval(() => {
      if (lineIndex < demo.code.length) {
        setVisibleCodeLines((prev) => prev + 1);
        lineIndex++;
      } else {
        clearInterval(codeTimer);
        setIsCompiling(false);

        // After code is typed, show output lines
        let outIndex = 0;
        const outTimer = setInterval(() => {
          if (outIndex < demo.output.length) {
            setOutputLines((prev) => [...prev, demo.output[outIndex]]);
            outIndex++;
          } else {
            clearInterval(outTimer);
            setIsRunning(false);
          }
        }, 400);
      }
    }, 100);
  }

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Auto-run first demo
  useEffect(() => {
    const timer = setTimeout(runDemo, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDemo]);

  function switchDemo(index: number) {
    setActiveDemo(index);
    setIsRunning(false);
    setOutputLines([]);
    setVisibleCodeLines(0);
  }

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Playground de Código
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Observe a IA escrevendo código e veja os resultados em tempo real — como se estivesse assistindo ao vivo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demo selector sidebar */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {DEMOS.map((d, i) => (
              <button
                key={d.label}
                onClick={() => switchDemo(i)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  i === activeDemo
                    ? "bg-deep-800/60 border border-white/10 shadow-lg"
                    : "bg-deep-800/20 border border-transparent hover:bg-deep-800/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${d.gradient} flex items-center justify-center text-lg shrink-0`}>
                    {d.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{d.label}</p>
                    <p className="text-[10px] text-white/30 truncate">{d.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Code + Output panel */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-deep-950/90 backdrop-blur-sm">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-deep-900/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-xs text-white/30 font-mono ml-2">playground.ts</span>
                </div>
                <button
                  onClick={runDemo}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 ${
                    isRunning
                      ? "bg-white/5 text-white/20 cursor-not-allowed"
                      : "bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-neon-cyan hover:from-neon-purple/30 hover:to-neon-cyan/30"
                  }`}
                >
                  {isCompiling ? "EXECUTANDO..." : isRunning ? "AGUARDE..." : "▶ EXECUTAR"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Code panel */}
                <div className="p-4 border-r border-white/5 min-h-[300px]">
                  <div className="text-[10px] text-white/20 font-mono mb-3 uppercase tracking-wider">
                    Código Fonte
                  </div>
                  <pre className="font-mono text-xs leading-6">
                    <code>
                      {demo.code.map((line, i) => (
                        <div
                          key={i}
                          className={`transition-all duration-300 ${
                            i < visibleCodeLines ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {i < visibleCodeLines ? (
                            <span className="text-white/60">
                              {line.match(/^(\s*)/)?.[0] ? (
                                <span className="text-white/10">{" ".repeat(line.match(/^(\s*)/)![1].length)}</span>
                              ) : null}
                              <span className="text-white/70">{line.trim()}</span>
                            </span>
                          ) : i === visibleCodeLines ? (
                            <span className="text-neon-cyan animate-pulse">▌</span>
                          ) : null}
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Output panel */}
                <div
                  ref={outputRef}
                  className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto"
                >
                  <div className="text-[10px] text-white/20 font-mono mb-3 uppercase tracking-wider">
                    Terminal Output
                  </div>
                  <AnimatePresence>
                    {outputLines.length === 0 && !isCompiling ? (
                      <p className="text-xs text-white/20 font-mono">
                        {isRunning ? "Processando..." : "Clique em EXECUTAR para iniciar o demo"}
                      </p>
                    ) : (
                      <div className="font-mono text-xs leading-6">
                        {outputLines.map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`${
                              line.startsWith("✓")
                                ? "text-green-400/80"
                                : line.startsWith("▶")
                                ? "text-neon-cyan/80"
                                : "text-white/50"
                            }`}
                          >
                            {line}
                          </motion.div>
                        ))}
                        {isCompiling && (
                          <div className="flex items-center gap-2 text-yellow-400/60 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                            Compilando...
                          </div>
                        )}
                        {!isCompiling && !isRunning && outputLines.length > 0 && (
                          <div className="flex items-center gap-2 text-neon-cyan/40 mt-2 pt-2 border-t border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            Demo executado com sucesso
                          </div>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom status */}
              <div className="px-4 py-2 border-t border-white/5 bg-deep-900/30 flex items-center justify-between text-[10px] text-white/20 font-mono">
                <span>
                  {demo.label} • {demo.code.length} linhas
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isCompiling ? "bg-yellow-400 animate-pulse" : outputLines.length > 0 ? "bg-green-400" : "bg-white/20"
                  }`} />
                  {isCompiling ? "Compilando..." : outputLines.length > 0 ? "Pronto" : "Aguardando"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
