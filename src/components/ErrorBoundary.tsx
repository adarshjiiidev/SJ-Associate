import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application ErrorBoundary caught an error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-5">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#DAF6EF] text-[#0A2536]">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[#0A2536]">
              Something interrupted this view
            </h1>
            <p className="text-sm text-[#33566D] leading-relaxed">
              Please reload the page or return to the SJ Associates home page.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Reload Page
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.assign("/");
              }}
              className="rounded-full"
            >
              Return Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
