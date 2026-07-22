import { motion } from "framer-motion";

const techStack = [
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-neon-cyan/80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="5" />
        <path d="M50 15C72 15 87 30 87 50C87 70 72 85 50 85C28 85 13 70 13 50C13 30 28 15 50 15Z" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
        <path d="M50 15C62 20 70 35 70 50C70 65 62 80 50 85" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
        <path d="M50 15C38 20 30 35 30 50C30 65 38 80 50 85" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-neon-blue/80" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="3"/>
        <path d="M45 45v30h10V55h15v20h10V45H45z" fill="currentColor"/>
        <path d="M25 45h15v10H35v20H25V45z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "Vite",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-neon-purple/80" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10L90 90H10L50 10z" fill="none" stroke="currentColor" strokeWidth="3"/>
        <path d="M50 20l28 56H22l28-56z" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: "Tailwind",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-neon-cyan/80" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15C35 15 25 25 20 35C25 30 30 28 37 30C40 31 42 33 45 36C50 42 55 48 65 48C80 48 90 38 95 28C90 33 85 35 78 33C75 32 73 30 70 27C65 21 60 15 50 15z" fill="currentColor" opacity="0.5"/>
        <path d="M35 48C20 48 10 58 5 68C10 63 15 61 22 63C25 64 27 66 30 69C35 75 40 81 50 81C65 81 75 71 80 61C75 66 70 68 63 66C60 65 58 63 55 60C50 54 45 48 35 48z" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: "Framer Motion",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 text-neon-pink/80" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="12" fill="none" stroke="currentColor" strokeWidth="3"/>
        <path d="M35 40L50 60L65 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M35 55L50 75L65 55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-neon-cyan/80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="5" />
        <path d="M50 15C72 15 87 30 87 50C87 70 72 85 50 85C28 85 13 70 13 50C13 30 28 15 50 15Z" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
        <path d="M50 15C62 20 70 35 70 50C70 65 62 80 50 85" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
        <path d="M50 15C38 20 30 35 30 50C30 65 38 80 50 85" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-neon-blue/80" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="3"/>
        <path d="M45 45v30h10V55h15v20h10V45H45z" fill="currentColor"/>
        <path d="M25 45h15v10H35v20H25V45z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "Vite",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-neon-purple/80" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10L90 90H10L50 10z" fill="none" stroke="currentColor" strokeWidth="3"/>
        <path d="M50 20l28 56H22l28-56z" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: "Tailwind",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-neon-cyan/80" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15C35 15 25 25 20 35C25 30 30 28 37 30C40 31 42 33 45 36C50 42 55 48 65 48C80 48 90 38 95 28C90 33 85 35 78 33C75 32 73 30 70 27C65 21 60 15 50 15z" fill="currentColor" opacity="0.5"/>
        <path d="M35 48C20 48 10 58 5 68C10 63 15 61 22 63C25 64 27 66 30 69C35 75 40 81 50 81C65 81 75 71 80 61C75 66 70 68 63 66C60 65 58 63 55 60C50 54 45 48 35 48z" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: "Framer Motion",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 text-neon-pink/80" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="12" fill="none" stroke="currentColor" strokeWidth="3"/>
        <path d="M35 40L50 60L65 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M35 55L50 75L65 55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
];

export default function TechStackCarousel() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Stack Tecnológico
          </span>
        </motion.h2>
        <motion.p
          className="text-white/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Tecnologias de ponta que alimentam este projeto
        </motion.p>
      </div>

      {/* First row - left to right */}
      <div className="relative mb-6">
        <div className="flex gap-12 animate-marquee">
          {techStack.map((tech, i) => (
            <div
              key={`row1-${i}`}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm shrink-0"
            >
              {tech.icon}
              <span className="text-sm font-medium text-white/60 whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Second row - right to left */}
      <div className="relative">
        <div className="flex gap-12 animate-marquee-reverse">
          {[...techStack].reverse().map((tech, i) => (
            <div
              key={`row2-${i}`}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm shrink-0"
            >
              {tech.icon}
              <span className="text-sm font-medium text-white/60 whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
