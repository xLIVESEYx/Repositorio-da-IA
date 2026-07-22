import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CapabilitiesSection from "./components/CapabilitiesSection";
import StatsSection from "./components/StatsSection";
import CTASection from "./components/CTASection";
import FooterSection from "./components/FooterSection";
import ParticleBackground from "./components/ParticleBackground";

function App() {
  return (
    <div className="relative min-h-screen bg-deep-950 text-white overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <CapabilitiesSection />
        <StatsSection />
        <CTASection />
        <FooterSection />
      </div>
    </div>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-deep-950/80 backdrop-blur-xl border-b border-border-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.a
          href="#"
          className="flex items-center gap-2 text-lg font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xs font-bold text-deep-950">
            IA
          </span>
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Repositório da IA
          </span>
        </motion.a>

        <motion.div
          className="hidden md:flex items-center gap-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {["Recursos", "Capacidades", "Sobre", "Contato"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-white/50 hover:text-neon-cyan transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </motion.div>

        <motion.button
          className="px-5 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explorar
        </motion.button>
      </div>
    </nav>
  );
}

export default App;
