import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CapabilitiesSection from "./components/CapabilitiesSection";
import StatsSection from "./components/StatsSection";
import TerminalConsole from "./components/TerminalConsole";
import TechStackCarousel from "./components/TechStackCarousel";
import ShowcaseSection from "./components/ShowcaseSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import FooterSection from "./components/FooterSection";
import ParticleBackground from "./components/ParticleBackground";
import ScrollToTop from "./components/ScrollToTop";
import CursorGlow from "./components/CursorGlow";
import LoadingScreen from "./components/LoadingScreen";
import SectionDivider from "./components/SectionDivider";
import ErrorBoundary from "./components/ErrorBoundary";

const NAV_ITEMS = [
  { label: "Início", href: "#home" },
  { label: "Recursos", href: "#recursos" },
  { label: "Capacidades", href: "#capacidades" },
  { label: "Projetos", href: "#projetos" },
  { label: "Sobre", href: "#sobre" },
];

const SECTION_IDS = [
  "home",
  "recursos",
  "capacidades",
  "projetos",
  "console",
  "sobre",
];

// Performance monitoring
const perfMarks: Record<string, number> = {};

function mark(name: string) {
  if (typeof performance !== "undefined") {
    performance.mark(`app-${name}`);
    perfMarks[name] = performance.now();
  }
}

function measure(from: string, to: string) {
  if (
    typeof performance !== "undefined" &&
    perfMarks[from] &&
    perfMarks[to]
  ) {
    const duration = perfMarks[to] - perfMarks[from];
    if (duration > 0) {
      console.debug(`[Perf] ${from} → ${to}: ${duration.toFixed(1)}ms`);
    }
  }
}

function App() {
  mark("mount");

  useEffect(() => {
    mark("mounted");
    measure("mount", "mounted");

    // Report total JS execution time
    if (typeof performance !== "undefined") {
      const navEntry = performance.getEntriesByType("navigation")[0] as (
        PerformanceNavigationTiming | undefined
      );
      if (navEntry) {
        console.debug(
          `[Perf] DOM Interactive: ${navEntry.domInteractive.toFixed(0)}ms`
        );
        console.debug(
          `[Perf] Total Load: ${navEntry.loadEventEnd.toFixed(0)}ms`
        );
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-deep-950 text-white overflow-x-hidden">
      <LoadingScreen />
      <CursorGlow />
      <ParticleBackground />

      <div className="relative z-10">
        <Navbar />
        <ErrorBoundary>
          <section id="home">
            <HeroSection />
          </section>
          <SectionDivider variant="glow" />
          <FeaturesSection />
          <SectionDivider variant="line" />
          <CapabilitiesSection />
          <SectionDivider variant="glow" />
          <StatsSection />
          <SectionDivider variant="line" />
          <TerminalConsole />
          <SectionDivider variant="glow" />
          <TechStackCarousel />
          <SectionDivider variant="line" />
          <ShowcaseSection />
          <SectionDivider variant="glow" />
          <TestimonialsSection />
          <CTASection />
          <FooterSection />
        </ErrorBoundary>
        <ScrollToTop />
      </div>
    </div>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 150;

      for (const section of SECTION_IDS) {
        const el = document.getElementById(section);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetBottom = offsetTop + el.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const currentIndex = SECTION_IDS.indexOf(activeSection);

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, SECTION_IDS.length - 1);
        const el = document.getElementById(SECTION_IDS[nextIndex]);
        el?.scrollIntoView({ behavior: "smooth" });
      }

      if ((e.key === "ArrowUp" || e.key === "PageUp") && !e.ctrlKey) {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        const el = document.getElementById(SECTION_IDS[prevIndex]);
        el?.scrollIntoView({ behavior: "smooth" });
      }

      if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (index < SECTION_IDS.length) {
          e.preventDefault();
          const el = document.getElementById(SECTION_IDS[index]);
          el?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection]);

  const scrollToSection = useCallback((href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-deep-950/80 backdrop-blur-xl border-b border-border-subtle"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.a
            href="#home"
            className="flex items-center gap-2 text-lg font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xs font-bold text-deep-950">
              IA
            </span>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent hidden sm:inline">
              Repositório da IA
            </span>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent sm:hidden">
              IA
            </span>
          </motion.a>

          <motion.div
            className="hidden md:flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-sm transition-colors duration-300 rounded-full ${
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 border border-white/5"
                      layoutId="nav-indicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.a
              href="https://github.com/xLIVESEYx/Repositorio-da-IA"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex px-5 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300 items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </motion.a>

            <button
              className="md:hidden relative w-8 h-8 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <div className="flex flex-col gap-1.5">
                <motion.span
                  className="block w-5 h-[2px] bg-white/60 rounded-full origin-center"
                  animate={
                    isMobileMenuOpen
                      ? { rotate: 45, y: 4 }
                      : { rotate: 0, y: 0 }
                  }
                />
                <motion.span
                  className="block w-5 h-[2px] bg-white/60 rounded-full"
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="block w-5 h-[2px] bg-white/60 rounded-full origin-center"
                  animate={
                    isMobileMenuOpen
                      ? { rotate: -45, y: -4 }
                      : { rotate: 0, y: 0 }
                  }
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-deep-950/95 backdrop-blur-xl flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center gap-6">
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-2xl text-white/60 hover:text-neon-cyan transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="https://github.com/xLIVESEYx/Repositorio-da-IA"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Ver GitHub
            </motion.a>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default App;
