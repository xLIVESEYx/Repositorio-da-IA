import { Component, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    console.error("[ErrorBoundary]", error.message, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] flex items-center justify-center px-6">
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-neon-pink/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Algo deu errado
            </h2>
            <p className="text-white/40 text-sm mb-2">
              Um erro inesperado ocorreu. A inteligência artificial já foi notificada.
            </p>
            {this.state.error && (
              <p className="text-red-400/60 text-xs font-mono mb-6 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-sm font-medium hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
            >
              Tentar novamente
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
