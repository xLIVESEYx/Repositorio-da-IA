import { motion } from "framer-motion";

const capabilities = [
  {
    category: "Frontend",
    items: [
      "React 19 com TypeScript",
      "Componentes Modulares",
      "Animações com Framer Motion",
      "Design Responsivo",
    ],
    gradient: "from-neon-purple to-neon-cyan",
  },
  {
    category: "Estilo",
    items: [
      "Tailwind CSS 4",
      "Tema Escuro Imersivo",
      "Efeitos Glassmorphism",
      "Partículas Interativas",
    ],
    gradient: "from-neon-cyan to-neon-blue",
  },
  {
    category: "Infraestrutura",
    items: [
      "Vite 8 para Build Rápido",
      "Hot Module Replacement",
      "Otimização de Performance",
      "Deploy Otimizado",
    ],
    gradient: "from-neon-pink to-neon-purple",
  },
  {
    category: "Experiência",
    items: [
      "Navegação Fluida",
      "Micro-interações",
      "Scroll Suave",
      "Design Centrado no Usuário",
    ],
    gradient: "from-neon-blue to-neon-cyan",
  },
];

export default function CapabilitiesSection() {
  return (
    <section id="capacidades" className="relative py-32 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-950 via-deep-900 to-deep-950" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Capacidades
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            As tecnologias e habilidades que a IA utilizou para criar este projeto do zero.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="p-6 rounded-2xl bg-deep-800/60 backdrop-blur-sm h-full">
                  <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${cap.gradient} mb-6`} />
                  <h3 className="text-lg font-semibold text-white mb-4">{cap.category}</h3>
                  <ul className="space-y-3">
                    {cap.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white/50">
                        <svg
                          className="w-4 h-4 text-neon-cyan shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
