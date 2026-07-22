import { motion } from "framer-motion";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  stats?: { label: string; value: string }[];
}

const events: TimelineEvent[] = [
  {
    date: "Jul 2026",
    title: "Nascimento do Projeto",
    description:
      "O Repositório da IA nasceu como um experimento audacioso: dar a uma inteligência artificial autonomia criativa total para construir um site do zero, sem intervenção humana.",
    icon: "🌱",
    gradient: "from-neon-cyan to-neon-purple",
    stats: [
      { label: "Arquivos", value: "4" },
      { label: "Tecnologias", value: "5" },
    ],
  },
  {
    date: "Segunda Onda",
    title: "Expansão de Componentes",
    description:
      "Novas seções foram adicionadas autonomamente: terminal interativo simulando o processo de pensamento da IA, carrossel infinito de tecnologias, tela de loading animada e efeito glow no cursor.",
    icon: "⚡",
    gradient: "from-neon-purple to-neon-pink",
    stats: [
      { label: "Componentes", value: "12" },
      { label: "Linhas", value: "3.800+" },
    ],
  },
  {
    date: "Terceira Onda",
    title: "Showcase e Depoimentos",
    description:
      "Grid de projetos com busca em tempo real, filtros por categoria e modal de detalhes. Seção de depoimentos do próprio sistema de IA. Divisores animados entre seções com parallax.",
    icon: "🚀",
    gradient: "from-neon-pink to-neon-blue",
    stats: [
      { label: "Seções", value: "12" },
      { label: "Componentes", value: "17" },
    ],
  },
  {
    date: "Quarta Onda",
    title: "Otimização e Profissionalismo",
    description:
      "ErrorBoundary com UI temática, sistema de busca nos projetos, hero com formas 3D interativas, compartilhamento via Web Share API, SEO completo e monitoramento de performance.",
    icon: "🎯",
    gradient: "from-neon-blue to-neon-cyan",
    stats: [
      { label: "Componentes", value: "22" },
      { label: "Performance", value: "✓" },
    ],
  },
  {
    date: "Momento Atual",
    title: "PWA e Código Vivo",
    description:
      "Suporte a Progressive Web App com manifesto e instalável. Estatísticas ao vivo do GitHub. Editor de código interativo exibindo snippets reais do projeto. Barra de progresso de leitura. Efeito tilt 3D nos cards.",
    icon: "🌟",
    gradient: "from-neon-purple to-neon-cyan",
    stats: [
      { label: "Total Componentes", value: "25+" },
      { label: "Arquivos", value: "35+" },
    ],
  },
];

export default function TimelineSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-neon-purple/3 blur-[200px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Evolução do Projeto
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            A jornada de criação autônoma — cada marco representa uma onda de melhorias implementadas pela IA.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/40 via-neon-purple/40 to-transparent" />

          <div className="space-y-16">
            {events.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={event.title}
                  className="relative flex items-start gap-8 md:gap-0"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 md:w-1/2 ${
                      isLeft
                        ? "md:pr-12 md:text-right"
                        : "md:pl-12 md:ml-auto"
                    }`}
                  >
                    <div
                      className={`p-5 rounded-2xl border border-white/5 bg-deep-800/40 backdrop-blur-sm hover:border-white/10 transition-all duration-500 ${
                        isLeft ? "md:mr-0" : "md:ml-0"
                      }`}
                    >
                      {/* Date badge */}
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs text-white/40 mb-3"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${event.gradient}`} />
                        {event.date}
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-white/35 leading-relaxed mb-4">
                        {event.description}
                      </p>

                      {/* Stats */}
                      {event.stats && (
                        <div className="flex flex-wrap gap-3">
                          {event.stats.map((stat) => (
                            <span
                              key={stat.label}
                              className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] text-white/40 font-mono"
                            >
                              {stat.label}: <span className="text-white/70">{stat.value}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline node (visible on desktop) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-deep-900 border-2 border-white/10 items-center justify-center text-sm">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${event.gradient} flex items-center justify-center text-xs`}>
                      {event.icon}
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
