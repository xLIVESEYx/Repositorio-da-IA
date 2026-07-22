import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "./TiltCard";

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
      "Página inicial completa gerada inteiramente por IA, com design responsivo, animações fluidas e tema escuro imersivo.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    gradient: "from-neon-cyan to-neon-purple",
    icon: "◈",
  },
  {
    title: "Sistema de Partículas",
    category: "Canvas/WebGL",
    description:
      "Motor de partículas interativo com conexões dinâmicas entre pontos, seguimento do cursor e otimização para dispositivos móveis.",
    tech: ["Canvas API", "RequestAnimationFrame", "Performance API"],
    gradient: "from-neon-purple to-neon-pink",
    icon: "✦",
  },
  {
    title: "Terminal Interativo",
    category: "UX/UI",
    description:
      "Console simulando o processo de pensamento da IA com efeito de digitação em tempo real e mensagens codificadas por tipo.",
    tech: ["React Hooks", "setInterval", "Conditional Rendering"],
    gradient: "from-neon-pink to-neon-cyan",
    icon: "⌘",
  },
  {
    title: "Carrossel Infinito",
    category: "Animação",
    description:
      "Carrossel de tecnologias com scroll infinito em duas direções simultâneas, pausa ao hover e gradientes neon personalizados.",
    tech: ["CSS Animations", "Keyframes", "Flexbox"],
    gradient: "from-neon-blue to-neon-cyan",
    icon: "∞",
  },
  {
    title: "Loading Animado",
    category: "UX/UI",
    description:
      "Tela de splash com animação de digitação em múltiplas etapas, barra de progresso gradiente e entrada suave com AnimatePresence.",
    tech: ["Framer Motion", "AnimatePresence", "CSS Transitions"],
    gradient: "from-neon-purple to-neon-blue",
    icon: "◎",
  },
  {
    title: "Cursor Glow",
    category: "Efeitos",
    description:
      "Efeito de brilho suave que segue o cursor com interpolação suave (lerp) e detecção de ponteiro fino.",
    tech: ["requestAnimationFrame", "matchMedia", "CSS Filters"],
    gradient: "from-neon-cyan to-neon-blue",
    icon: "✦",
  },
  {
    title: "Depoimentos Animados",
    category: "UX/UI",
    description:
      "Cards de depoimento com gradientes, avatares e animações de entrada suaves para engajamento visual.",
    tech: ["Framer Motion", "CSS Gradients", "Responsive Design"],
    gradient: "from-neon-cyan to-neon-pink",
    icon: "💬",
  },
  {
    title: "3D Floating Shapes",
    category: "Efeitos",
    description:
      "Formas geométricas 3D que reagem ao movimento do mouse com rotação contínua e interação em tempo real.",
    tech: ["CSS 3D Transforms", "Mouse Events", "React State"],
    gradient: "from-neon-blue to-neon-purple",
    icon: "◆",
  },
];

const ALL_CATEGORIES = ["Todas", ...new Set(projects.map((p) => p.category))];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function ShowcaseSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        searchTerm === "" ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tech.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        activeCategory === "Todas" || p.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setSearchTerm("");
        (e.target as HTMLInputElement).blur();
      }
    },
    []
  );

  return (
    <section id="projetos" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
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
            {filteredProjects.length} componentes criados por IA — encontre o que te interessa.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-10 py-2.5 rounded-full bg-white/5 border border-white/5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-neon-purple/30 focus:bg-white/10 transition-all duration-300"
              aria-label="Buscar projetos"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                aria-label="Limpar busca"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-white border border-white/10"
                    : "bg-white/5 text-white/40 hover:text-white/60 border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${searchTerm}-${activeCategory}`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <TiltCard key={project.title}>
              <motion.button
                key={project.title}
                variants={cardVariants}
                layout
                className="group relative text-left p-5 rounded-2xl bg-deep-800/30 border border-white/5 hover:border-white/15 transition-all duration-500 overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500`}
                />

                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center text-lg mb-3`}
                >
                  {project.icon}
                </div>

                <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 text-[9px] text-white/40 uppercase tracking-wider mb-2">
                  {project.category}
                </span>

                <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-neon-cyan transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-xs text-white/35 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tech.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded-md bg-white/5 text-[9px] text-white/30"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[9px] text-white/30">
                      +{project.tech.length - 2}
                    </span>
                  )}
                </div>
              </motion.button>
            </TiltCard>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
              </svg>
            </div>
            <p className="text-white/30 text-sm">
              Nenhum projeto encontrado para "{searchTerm}"
            </p>
            <button
              onClick={() => { setSearchTerm(""); setActiveCategory("Todas"); }}
              className="mt-3 text-xs text-neon-cyan/60 hover:text-neon-cyan transition-colors"
            >
              Limpar filtros
            </button>
          </motion.div>
        )}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-deep-950/80 backdrop-blur-xl"
              onClick={() => setSelectedProject(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-10 max-w-lg w-full p-8 rounded-2xl bg-deep-800 border border-white/10 shadow-2xl shadow-neon-purple/10"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Fechar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

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
