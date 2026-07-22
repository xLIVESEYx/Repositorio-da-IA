import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  title: string;
  category: string;
  description: string;
  tech: string[];
  gradient: string;
  icon: string;
}

const projects: Project[] = [
  {
    title: "Landing Page Autônoma",
    category: "Frontend",
    description:
      "Página inicial completa gerada inteiramente por IA, com design responsivo, animações fluidas e tema escuro imersivo. Cada seção foi concebida e implementada de forma autônoma.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    gradient: "from-neon-cyan to-neon-purple",
    icon: "◈",
  },
  {
    title: "Sistema de Partículas",
    category: "Canvas/WebGL",
    description:
      "Motor de partículas interativo com conexões dinâmicas entre pontos, seguimento do cursor e otimização automática para dispositivos móveis com throttling inteligente.",
    tech: ["Canvas API", "RequestAnimationFrame", "Performance API"],
    gradient: "from-neon-purple to-neon-pink",
    icon: "✦",
  },
  {
    title: "Terminal Interativo",
    category: "UX/UI",
    description:
      "Console simulando o processo de pensamento da IA com efeito de digitação em tempo real, scroll automático e mensagens codificadas por tipo (sistema, info, sucesso, erro).",
    tech: ["React Hooks", "setInterval", "Conditional Rendering"],
    gradient: "from-neon-pink to-neon-cyan",
    icon: "⌘",
  },
  {
    title: "Carrossel Infinito",
    category: "Animação",
    description:
      "Carrossel de tecnologias com scroll infinito em duas direções simultâneas, pausa ao hover e gradientes neon personalizados para cada stack.",
    tech: ["CSS Animations", "Keyframes", "Flexbox"],
    gradient: "from-neon-blue to-neon-cyan",
    icon: "∞",
  },
  {
    title: "Loading Animado",
    category: "UX/UI",
    description:
      "Tela de splash com animação de digitação em múltiplas etapas, barra de progresso gradiente e entrada suave com AnimatePresence do Framer Motion.",
    tech: ["Framer Motion", "AnimatePresence", "CSS Transitions"],
    gradient: "from-neon-purple to-neon-blue",
    icon: "◎",
  },
  {
    title: "Cursor Glow",
    category: "Efeitos",
    description:
      "Efeito de brilho suave que segue o cursor com interpolação suave (lerp), detecção de ponteiro fino e respeito a preferências de movimento reduzido.",
    tech: ["requestAnimationFrame", "matchMedia", "CSS Filters"],
    gradient: "from-neon-cyan to-neon-blue",
    icon: "✦",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

export default function ShowcaseSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projetos" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Projetos Criados
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Cada componente deste site é uma obra-prima gerada por IA — explore os detalhes de cada um.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((project, index) => (
            <motion.button
              key={index}
              variants={cardVariants}
              className="group relative text-left p-6 rounded-2xl bg-deep-800/30 border border-white/5 hover:border-white/15 transition-all duration-500 overflow-hidden cursor-pointer"
              onClick={() => setSelectedProject(project)}
              whileHover={{ y: -5 }}
            >
              {/* Card gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center text-xl mb-4`}
              >
                {project.icon}
              </div>

              {/* Category tag */}
              <span className="inline-block px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-white/40 uppercase tracking-wider mb-3">
                {project.category}
              </span>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
                {project.title}
              </h3>

              <p className="text-sm text-white/35 leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tech.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/30"
                  >
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/30">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>

              {/* Corner accent */}
              <div
                className={`absolute top-0 right-0 w-12 h-12 border-t border-r border-white/5 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-deep-950/80 backdrop-blur-xl"
              onClick={() => setSelectedProject(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              className="relative z-10 max-w-lg w-full p-8 rounded-2xl bg-deep-800 border border-white/10 shadow-2xl shadow-neon-purple/10"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Fechar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedProject.gradient} flex items-center justify-center text-2xl mb-5`}
              >
                {selectedProject.icon}
              </div>

              <span className="inline-block px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-white/40 uppercase tracking-wider mb-3">
                {selectedProject.category}
              </span>

              <h3 className="text-2xl font-bold text-white mb-3">
                {selectedProject.title}
              </h3>

              <p className="text-white/50 text-sm leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
                  Tecnologias
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span
                      key={t}
                      className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${selectedProject.gradient} text-white/90`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
