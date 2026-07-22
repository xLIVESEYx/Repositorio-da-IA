import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isVisible = true;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function animate() {
      if (!isVisible) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx!.clearRect(0, 0, width, height);

      // Draw frequency bars
      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(data);
        const barCount = 64;
        const barWidth = width / barCount;
        const centerY = height / 2;

        for (let i = 0; i < barCount; i++) {
          const value = data[i] / 255;
          const barHeight = value * height * 0.6;
          const x = i * barWidth;

          // Gradient color based on frequency
          const hue = 200 + i * 1.5;
          const saturation = 80 + value * 20;
          const lightness = 50 + value * 30;

          // Top bar
          ctx!.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.3 + value * 0.4})`;
          ctx!.fillRect(x, centerY - barHeight / 2, barWidth - 1, barHeight);

          // Glow effect on higher values
          if (value > 0.5) {
            ctx!.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${value * 0.1})`;
            ctx!.fillRect(x - 2, centerY - barHeight / 2 - 2, barWidth + 3, barHeight + 4);
          }
        }
      } else {
        // Idle animation - gentle waves
        const time = Date.now() * 0.001;
        const barCount = 64;
        const barWidth = width / barCount;
        const centerY = height / 2;

        for (let i = 0; i < barCount; i++) {
          const value = Math.sin(time + i * 0.3) * 0.2 + 0.15;
          const barHeight = value * height * 0.4;
          const x = i * barWidth;
          const hue = 200 + i * 1.5;

          ctx!.fillStyle = `hsla(${hue}, 70%, 50%, 0.15)`;
          ctx!.fillRect(x, centerY - barHeight / 2, barWidth - 1, barHeight);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;
    }

    resize();
    animate();

    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  function toggleAudio() {
    if (audioCtxRef.current && sourceRef.current) {
      // Stop
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch { /* already stopped */ }
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      sourceRef.current = null;
      analyserRef.current = null;
      gainRef.current = null;
      setIsPlaying(false);
      return;
    }

    // Start
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const oscillator = ctx.createOscillator();
      sourceRef.current = oscillator;
      oscillator.type = "sine";
      oscillator.frequency.value = 120;

      const gain = ctx.createGain();
      gainRef.current = gain;
      gain.gain.value = 0.04; // Very quiet

      const analyser = ctx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 128;

      oscillator.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      // Add subtle frequency modulation for interest
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 30;
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();

      oscillator.start();
      setIsPlaying(true);
    } catch {
      // Audio not supported or blocked
    }
  }

  // Reduced motion check
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <button
          onClick={toggleAudio}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-xs text-white/50 hover:text-white/70 cursor-pointer"
          aria-label={isPlaying ? "Desligar som ambiente" : "Ligar som ambiente"}
          title={isPlaying ? "Desligar som ambiente" : "Ligar som ambiente"}
        >
          <svg
            className={`w-3.5 h-3.5 ${isPlaying ? "text-neon-cyan" : "text-white/30"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isPlaying ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.5a3.5 3.5 0 000 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            )}
          </svg>
          <span>{isPlaying ? "Som Ativo" : "Som Ambiente"}</span>
          {isPlaying && (
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-0.5 h-3 bg-neon-cyan/60 rounded-full"
                  style={{
                    animation: prefersReducedMotion ? "none" : `audio-bar 0.6s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </span>
          )}
        </button>
      </motion.div>

      <canvas
        ref={canvasRef}
        className="w-full h-24 mt-3 rounded-xl"
        aria-hidden="true"
      />
    </div>
  );
}
