import React from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorPage = ({ error }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
        <AlertTriangle size={48} className="text-red-500" />
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-4">Something went wrong</h1>
      <p className="text-neutral-400 max-w-md mb-8">
        We encountered an unexpected error. Don't worry, it's not your fault. 
        Our team (Arhan's AI Twin) has been notified.
      </p>

      {error && (
        <div className="bg-black/30 p-4 rounded-lg mb-8 max-w-2xl w-full overflow-auto text-left border border-red-500/20">
          <code className="text-red-400 text-sm">
            {error.toString()}
          </code>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
        >
          <RefreshCcw size={20} />
          Try Again
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 text-white rounded-xl font-semibold hover:bg-neutral-700 transition-all"
        >
          <Home size={20} />
          Go Home
        </button>
      </div>
    </div>
  );
};
