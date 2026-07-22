import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Neuron {
  x: number;
  y: number;
  layer: number;
  radius: number;
  phase: number;
  color: string;
}

interface Connection {
  from: number;
  to: number;
  progress: number;
  speed: number;
}

const COLORS = ["#a855f7", "#00f0ff", "#ec4899", "#3b82f6"];

export default function NeuralNetworkViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let neurons: Neuron[] = [];
    let connections: Connection[] = [];
    let time = 0;

    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      initNetwork();
    }

    function initNetwork() {
      const w = canvas!.width;
      const h = canvas!.height;
      const layers = 5;
      const neuronsPerLayer = [4, 6, 8, 6, 4];
      neurons = [];
      connections = [];

      let id = 0;
      for (let l = 0; l < layers; l++) {
        const count = neuronsPerLayer[l];
        const startY = h * 0.15;
        const endY = h * 0.85;
        const spacing = (endY - startY) / Math.max(count - 1, 1);

        for (let n = 0; n < count; n++) {
          neurons.push({
            x: (w / (layers - 1)) * l + (l === 0 ? 20 : l === layers - 1 ? -20 : 0),
            y: count === 1 ? h / 2 : startY + n * spacing,
            layer: l,
            radius: 2 + Math.random() * 3,
            phase: Math.random() * Math.PI * 2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
          id++;
        }
      }

      // Create connections between adjacent layers
      for (let l = 0; l < layers - 1; l++) {
        const currentLayerStart = neuronsPerLayer.slice(0, l).reduce((a, b) => a + b, 0);
        const nextLayerStart = neuronsPerLayer.slice(0, l + 1).reduce((a, b) => a + b, 0);
        const currentCount = neuronsPerLayer[l];
        const nextCount = neuronsPerLayer[l + 1];

        // Connect about 40% of possible connections
        for (let i = 0; i < currentCount; i++) {
          for (let j = 0; j < nextCount; j++) {
            if (Math.random() < 0.4) {
              connections.push({
                from: currentLayerStart + i,
                to: nextLayerStart + j,
                progress: Math.random(),
                speed: 0.002 + Math.random() * 0.004,
              });
            }
          }
        }
      }
    }

    function animate() {
      time += 0.01;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const w = canvas!.width;
      const h = canvas!.height;

      // Draw subtle background gradient
      const bgGrad = ctx!.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
      bgGrad.addColorStop(0, "rgba(168, 85, 247, 0.03)");
      bgGrad.addColorStop(1, "transparent");
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, w, h);

      // Draw connections
      for (const conn of connections) {
        const from = neurons[conn.from];
        const to = neurons[conn.to];
        if (!from || !to) continue;

        const alpha = 0.04 + Math.sin(time + conn.progress * Math.PI * 2) * 0.03;
        
        ctx!.beginPath();
        ctx!.moveTo(from.x, from.y);
        ctx!.lineTo(to.x, to.y);
        ctx!.strokeStyle = `rgba(168, 85, 247, ${Math.max(0, alpha)})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();

        // Data pulse traveling through connection
        conn.progress += conn.speed;
        if (conn.progress > 1) {
          conn.progress = 0;
        }

        const pulseX = from.x + (to.x - from.x) * conn.progress;
        const pulseY = from.y + (to.y - from.y) * conn.progress;

        ctx!.beginPath();
        ctx!.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 240, 255, ${0.4 + Math.sin(time * 2) * 0.2})`;
        ctx!.fill();
      }

      // Draw neurons
      for (const neuron of neurons) {
        const pulse = Math.sin(time * 1.5 + neuron.phase) * 0.3 + 1;
        const radius = neuron.radius * pulse;

        // Glow
        const grad = ctx!.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, radius * 4
        );
        grad.addColorStop(0, neuron.color + "20");
        grad.addColorStop(1, "transparent");
        ctx!.beginPath();
        ctx!.arc(neuron.x, neuron.y, radius * 4, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = neuron.color + "80";
        ctx!.fill();

        // Bright center
        ctx!.beginPath();
        ctx!.arc(neuron.x, neuron.y, radius * 0.4, 0, Math.PI * 2);
        ctx!.fillStyle = neuron.color;
        ctx!.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent">
              Rede Neural
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Visualização em tempo real de uma rede neural artificial — cada nó representa um neurônio, cada pulso uma decisão criativa.
          </p>
        </motion.div>

        {/* Canvas container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div className="rounded-2xl border border-white/5 bg-deep-900/50 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-deep-900/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-white/30 font-mono ml-2">neural-network.tsx</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-white/20 font-mono">PROCESSING</span>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-[500px]"
              aria-label="Visualização de rede neural"
            />
          </div>

          {/* Glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-neon-pink/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        </motion.div>

        {/* Stats below */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-neon-cyan">5</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Camadas</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-neon-purple">28</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Neurônios</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-neon-pink">~300</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Conexões</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-neon-blue">∞</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Iterações</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
