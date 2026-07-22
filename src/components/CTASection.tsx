import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section id="sobre" className="relative py-32 px-6">
      {/* Glow background */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-purple/5 blur-[150px]" />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-[1px] rounded-3xl bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink">
          <div className="py-16 px-10 rounded-3xl bg-deep-900">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              O Futuro da{" "}
              <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Criação Digital
              </span>
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Este projeto é uma demonstração do que a inteligência artificial pode 
              alcançar quando recebe autonomia total. Cada pixel, cada animação, 
              cada linha de código foi gerada por IA — provando que o futuro do 
              desenvolvimento web já chegou.
            </p>
            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="https://github.com/xLIVESEYx/Repositorio-da-IA"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-3.5 rounded-full font-medium text-sm bg-white text-deep-950 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Ver no GitHub
                </span>
              </motion.a>
              <motion.button
                className="px-8 py-3.5 rounded-full font-medium text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Compartilhar Projeto
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
