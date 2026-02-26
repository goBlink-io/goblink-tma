import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <p className="text-xl font-semibold mb-2">Something went wrong</p>
            <p className="text-sm text-[var(--tg-theme-hint-color,#94a3b8)] mb-4">
              {this.state.error?.message ?? "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[var(--tg-theme-button-color,#2563eb)] text-white text-sm"
            >
              Reload
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
