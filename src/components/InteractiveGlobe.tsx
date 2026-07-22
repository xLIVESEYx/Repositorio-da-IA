import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface GlobeNode {
  lat: number;
  lng: number;
  radius: number;
  color: string;
  label: string;
  pulse: number;
  phase: number;
}

interface Connection {
  from: number;
  to: number;
  progress: number;
  speed: number;
}

const NODES: GlobeNode[] = [
  { lat: 40.7128, lng: -74.006, radius: 3, color: "#00f0ff", label: "Nova York", pulse: 0, phase: 0 },
  { lat: 51.5074, lng: -0.1278, radius: 2.5, color: "#a855f7", label: "Londres", pulse: 0, phase: 1.2 },
  { lat: 35.6762, lng: 139.6503, radius: 2.5, color: "#ec4899", label: "Tóquio", pulse: 0, phase: 2.5 },
  { lat: -23.5505, lng: -46.6333, radius: 2, color: "#3b82f6", label: "São Paulo", pulse: 0, phase: 3.7 },
  { lat: 55.7558, lng: 37.6173, radius: 2, color: "#00f0ff", label: "Moscou", pulse: 0, phase: 4.9 },
  { lat: 31.2304, lng: 121.4737, radius: 2.5, color: "#a855f7", label: "Xangai", pulse: 0, phase: 6.1 },
  { lat: 28.6139, lng: 77.209, radius: 2, color: "#ec4899", label: "Nova Delhi", pulse: 0, phase: 7.3 },
  { lat: -33.8688, lng: 151.2093, radius: 1.8, color: "#3b82f6", label: "Sydney", pulse: 0, phase: 8.5 },
  { lat: 19.076, lng: 72.8777, radius: 1.8, color: "#00f0ff", label: "Mumbai", pulse: 0, phase: 9.7 },
  { lat: 48.8566, lng: 2.3522, radius: 2, color: "#a855f7", label: "Paris", pulse: 0, phase: 10.9 },
  { lat: 37.7749, lng: -122.4194, radius: 2.2, color: "#ec4899", label: "São Francisco", pulse: 0, phase: 12.1 },
  { lat: 39.9042, lng: 116.4074, radius: 2.3, color: "#3b82f6", label: "Pequim", pulse: 0, phase: 13.3 },
  { lat: 1.3521, lng: 103.8198, radius: 1.5, color: "#00f0ff", label: "Singapura", pulse: 0, phase: 14.5 },
  { lat: -26.2041, lng: 28.0473, radius: 1.5, color: "#a855f7", label: "Joanesburgo", pulse: 0, phase: 15.7 },
  { lat: 25.2048, lng: 55.2708, radius: 1.8, color: "#ec4899", label: "Dubai", pulse: 0, phase: 16.9 },
];

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId: number;
    let rotation = 0;
    let time = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let connections: Connection[] = [];

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function latLngToXYZ(lat: number, lng: number, radius: number) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = (lng * Math.PI) / 180;
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      };
    }

    function rotateX(x: number, y: number, z: number, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x,
        y: y * cos - z * sin,
        z: y * sin + z * cos,
      };
    }

    function rotateY(x: number, y: number, z: number, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: x * cos + z * sin,
        y,
        z: -x * sin + z * cos,
      };
    }

    function project(x: number, y: number, z: number, w: number, h: number) {
      const fov = 500;
      const factor = fov / (fov + z);
      return {
        x: x * factor + w / 2,
        y: y * factor + h / 2,
        scale: factor,
      };
    }

    function animate() {
      time += 0.005;
      rotation += 0.002;

      // Smooth mouse follow
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      const w = canvas!.width / (window.devicePixelRatio || 1);
      const h = canvas!.height / (window.devicePixelRatio || 1);

      ctx!.clearRect(0, 0, w, h);

      const originX = w / 2;
      const originY = h / 2;
      const globeRadius = Math.min(w, h) * 0.35;

      // Draw glow
      const glowGrad = ctx!.createRadialGradient(originX, originY, 0, originX, originY, globeRadius * 1.2);
      glowGrad.addColorStop(0, "rgba(168, 85, 247, 0.08)");
      glowGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.04)");
      glowGrad.addColorStop(1, "transparent");
      ctx!.fillStyle = glowGrad;
      ctx!.beginPath();
      ctx!.arc(originX, originY, globeRadius * 1.2, 0, Math.PI * 2);
      ctx!.fill();

      // Calculate node positions with 3D rotation
      const projectedNodes = NODES.map((node) => {
        let pos = latLngToXYZ(node.lat, node.lng, globeRadius);
        pos = rotateY(pos.x, pos.y, pos.z, rotation + currentRotY);
        pos = rotateX(pos.x, pos.y, pos.z, currentRotX);
        const proj = project(pos.x, pos.y, pos.z, originX, originY);
        return { node, pos, proj, z: pos.z };
      });

      // Sort by z for proper depth rendering
      projectedNodes.sort((a, b) => a.z - b.z);

      // Draw connections
      for (const conn of connections) {
        const fromData = projectedNodes[conn.from];
        const toData = projectedNodes[conn.to];
        if (!fromData || !toData) continue;

        // Only draw connections for nodes on the front side
        const avgZ = (fromData.z + toData.z) / 2;
        if (avgZ < 0) continue;

        const alpha = Math.min(0.15, Math.max(0.02, (avgZ + globeRadius) / (globeRadius * 2) * 0.15));
        
        ctx!.beginPath();
        ctx!.moveTo(fromData.proj.x, fromData.proj.y);
        ctx!.lineTo(toData.proj.x, toData.proj.y);
        ctx!.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();

        // Data pulse traveling through connection
        conn.progress += conn.speed;
        if (conn.progress > 1) conn.progress = 0;

        const pulseX = fromData.proj.x + (toData.proj.x - fromData.proj.x) * conn.progress;
        const pulseY = fromData.proj.y + (toData.proj.y - fromData.proj.y) * conn.progress;

        ctx!.beginPath();
        ctx!.arc(pulseX, pulseY, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 240, 255, ${0.3 + Math.sin(time * 3) * 0.2})`;
        ctx!.fill();
      }

      // Draw latitude/longitude grid lines (front side only)
      ctx!.strokeStyle = "rgba(168, 85, 247, 0.06)";
      ctx!.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx!.beginPath();
        for (let lng = 0; lng <= 360; lng += 5) {
          let pos = latLngToXYZ(lat, lng, globeRadius * 0.98);
          pos = rotateY(pos.x, pos.y, pos.z, rotation + currentRotY);
          pos = rotateX(pos.x, pos.y, pos.z, currentRotX);
          if (pos.z < 0) continue;
          const proj = project(pos.x, pos.y, pos.z, originX, originY);
          if (lng === 0) ctx!.moveTo(proj.x, proj.y);
          else ctx!.lineTo(proj.x, proj.y);
        }
        ctx!.stroke();
      }

      // Draw nodes
      for (const data of projectedNodes) {
        const { node, proj, z } = data;

        // Skip nodes behind the globe
        if (z < -globeRadius * 0.3) continue;

        const fadeAlpha = Math.max(0.3, Math.min(1, (z + globeRadius) / (globeRadius)));
        
        // Node pulse
        const pulseRadius = node.radius + Math.sin(time * 2 + node.phase) * 1.5;

        // Glow
        const nodeGlow = ctx!.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, pulseRadius * 6);
        nodeGlow.addColorStop(0, node.color + "20");
        nodeGlow.addColorStop(1, "transparent");
        ctx!.beginPath();
        ctx!.arc(proj.x, proj.y, pulseRadius * 6, 0, Math.PI * 2);
        ctx!.fillStyle = nodeGlow;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(proj.x, proj.y, pulseRadius * fadeAlpha, 0, Math.PI * 2);
        ctx!.fillStyle = node.color + "80";
        ctx!.fill();

        // Bright center
        ctx!.beginPath();
        ctx!.arc(proj.x, proj.y, pulseRadius * 0.4 * fadeAlpha, 0, Math.PI * 2);
        ctx!.fillStyle = node.color;
        ctx!.fill();
      }

      // Draw globe outline
      ctx!.beginPath();
      ctx!.arc(originX, originY, globeRadius, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(168, 85, 247, 0.08)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      animId = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = mx * 0.5;
      targetRotX = my * 0.3;
    }

    const handleResize = () => resize();
    // Create connections between nodes
    connections = [];
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i + 1; j < NODES.length; j++) {
        if (Math.random() < 0.18) {
          connections.push({
            from: i,
            to: j,
            progress: Math.random(),
            speed: 0.001 + Math.random() * 0.003,
          });
        }
      }
    }
    resize();
    animate();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
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
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Presença Global
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            A IA não tem fronteiras — conectando ideias e inovação em todo o planeta através de dados e algoritmos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          {/* Globe container */}
          <div className="rounded-2xl border border-white/5 bg-deep-900/40 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-deep-900/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-white/30 font-mono ml-2">global-network.viz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-white/20 font-mono">CONNECTED</span>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-[520px] cursor-crosshair"
              aria-label="Visualização 3D de conexões globais da IA"
            />
          </div>

          <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-neon-pink/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-neon-cyan">{NODES.length}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Cidades</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-neon-purple">36+</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Conexões</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-neon-pink">15</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Países</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-neon-blue">∞</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Alcance</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
