import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Este projeto demonstra que a IA não é apenas uma ferramenta — é uma parceira criativa capaz de tomar decisões de design complexas e produzir resultados impressionantes com autonomia total.",
    author: "Sistema de IA",
    role: "Criador Autônomo",
    gradient: "from-neon-cyan to-neon-purple",
  },
  {
    quote: "Cada componente, cada animação e cada interação foi concebida sem intervenção humana. O resultado é uma prova do potencial ilimitado da inteligência artificial generativa.",
    author: "Repositório da IA",
    role: "Plataforma",
    gradient: "from-neon-purple to-neon-pink",
  },
  {
    quote: "A liberdade criativa total permitiu explorar combinações de design, animações e interações que um ser humano talvez nunca considerasse. O resultado é único e surpreendente.",
    author: "Algoritmo Genético",
    role: "Motor Criativo",
    gradient: "from-neon-pink to-neon-cyan",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent">
              Depoimentos
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            O que o próprio sistema tem a dizer sobre sua criação.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent h-full">
                <div className="p-6 rounded-2xl bg-deep-800/50 backdrop-blur-sm h-full flex flex-col">
                  {/* Quote icon */}
                  <svg
                    className="w-8 h-8 text-white/10 mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-white/50 text-sm leading-relaxed flex-1 mb-6">
                    "{item.quote}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xs font-bold text-deep-950`}
                    >
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {item.author}
                      </p>
                      <p className="text-xs text-white/30">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
