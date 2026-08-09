import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string | null;
}

/**
 * Catches render-time errors anywhere below it in the tree and shows a
 * recoverable screen instead of letting React unmount the whole app to
 * a blank white page. Also logs the error to the console so it's
 * visible in DevTools (F12) for debugging, since this class of crash
 * is otherwise silent to the person using the app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error:", error, info.componentStack);

    // "insertBefore ... is not a child of this node" is a well-known,
    // benign class of error caused by browser extensions (translators,
    // grammar checkers, ad blockers) mutating the DOM outside of
    // React's knowledge -- not an actual application bug. The React
    // tree itself is fine; it just needs a moment to re-render.
    // Auto-recovering in place (instead of navigating away) avoids
    // losing an in-progress chat session over what's usually a
    // one-off browser quirk.
    const isBenignDomInterference =
      error instanceof Error &&
      error.name === "NotFoundError" &&
      /insertBefore|removeChild/i.test(error.message);

    if (isBenignDomInterference) {
      setTimeout(() => this.setState({ hasError: false, message: null }), 50);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-3 bg-surface-light-muted px-6 text-center">
          <AlertTriangle size={28} className="text-danger" aria-hidden="true" />
          <p className="text-lg font-semibold text-foreground-light">Something went wrong.</p>
          <p className="max-w-md text-sm text-foreground-light-muted">
            {this.state.message ?? "An unexpected error occurred."} Check the browser console
            (F12) for details if this keeps happening.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-2 rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
