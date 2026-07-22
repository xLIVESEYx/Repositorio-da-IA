import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";

interface GitHubData {
  stars: number;
  forks: number;
  issues: number;
  description: string;
}

const MAX_RETRIES = 3;
const REFRESH_INTERVAL = 120000; // 2 minutes (respects GitHub unauthenticated rate limit)

export default function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const retryCount = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimeout: ReturnType<typeof setTimeout>;

    async function fetchStats() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/xLIVESEYx/Repositorio-da-IA"
        );
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData({
            stars: json.stargazers_count ?? 0,
            forks: json.forks_count ?? 0,
            issues: json.open_issues_count ?? 0,
            description: json.description ?? "",
          });
          setIsLoading(false);
          setError(false);
          retryCount.current = 0;
        }
      } catch {
        if (!cancelled) {
          retryCount.current++;
          if (retryCount.current <= MAX_RETRIES) {
            // Exponential backoff: 2s, 4s, 8s
            const backoff = Math.pow(2, retryCount.current) * 1000;
            retryTimeout = setTimeout(fetchStats, backoff);
          } else {
            setError(true);
            setIsLoading(false);
          }
        }
      }
    }

    fetchStats();
    const interval = setInterval(() => {
      retryCount.current = 0;
      fetchStats();
    }, REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(retryTimeout);
    };
  }, []);

  const statItems = useMemo(
    () => [
      { label: "Estrelas", value: data?.stars ?? 0, icon: "★", color: "text-yellow-400" },
      { label: "Forks", value: data?.forks ?? 0, icon: "⑂", color: "text-neon-cyan" },
      { label: "Issues", value: data?.issues ?? 0, icon: "!", color: "text-neon-purple" },
    ],
    [data]
  );

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              GitHub em Tempo Real
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Estatísticas ao vivo do repositório — dados atualizados da API do GitHub.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative p-8 rounded-2xl border border-white/5 bg-deep-800/40 backdrop-blur-sm overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                <div className="w-12 h-12 rounded-xl bg-deep-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <a
                    href="https://github.com/xLIVESEYx/Repositorio-da-IA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-white hover:text-neon-cyan transition-colors"
                  >
                    xLIVESEYx/Repositorio-da-IA
                  </a>
                  <p className="text-sm text-white/30 mt-0.5">
                    {isLoading
                      ? "Carregando..."
                      : error
                      ? "Não foi possível carregar os dados"
                      : data?.description || "Repositório da IA"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {statItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="text-center p-5 rounded-xl bg-deep-700/30 border border-white/5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`text-2xl mb-1 ${item.color}`}>
                      {isLoading ? (
                        <span className="inline-block w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                      ) : (
                        <motion.span
                          key={data?.stars ?? 0}
                          initial={{ scale: 1.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="text-3xl font-bold"
                        >
                          {error ? "—" : item.value}
                        </motion.span>
                      )}
                    </div>
                    <div className="text-xs text-white/30 flex items-center justify-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${error ? "bg-red-400" : "bg-green-400"} animate-pulse`} />
              <span className="text-[10px] text-white/20 font-mono">
                {error ? "OFFLINE" : isLoading ? "..." : "LIVE"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
