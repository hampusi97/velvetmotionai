"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, ShieldCheck, ExternalLink } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  reported: boolean;
  issueUrl: string | null;
}

export class SentryErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    reported: false,
    issueUrl: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, reported: false, issueUrl: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Sentry Guardian Intercepted Client Error]:", error, errorInfo);

    let userId = "anonymous";
    try {
      userId = localStorage.getItem("velvet_user_id") || "anonymous";
    } catch (e) {}

    // Dispatch telemetry report to backend self-healing pipeline
    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        errorMessage: error.message || error.toString(),
        stackTrace: `${error.stack || ""}\nComponent Stack: ${errorInfo.componentStack || ""}`,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        userId
      })
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          reported: true,
          issueUrl: data.githubIssueUrl || null
        });
      })
      .catch((err) => {
        console.warn("[Sentry Guardian Telemetry Error]:", err);
        this.setState({ reported: true });
      });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, reported: false, issueUrl: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07060A] text-white flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-[#120E1C] border border-pink-500/30 shadow-2xl shadow-pink-600/10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-pink-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 font-bold px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
                Self-Healing Guardian Active
              </span>
              <h2 className="text-2xl font-black tracking-tight pt-2">
                Session Interrupted Gracefully
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                VelvetMotion&apos;s 24/7 Autonomous Guardian intercepted an unexpected UI event.
                Telemetry has been dispatched to GitHub to trigger an AI self-healing patch.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-left font-mono text-[11px] text-zinc-300 max-h-32 overflow-y-auto">
                <p className="text-pink-400 font-semibold mb-1">Error Trace:</p>
                {this.state.error.message}
              </div>
            )}

            {this.state.issueUrl && (
              <a
                href={this.state.issueUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 underline"
              >
                Track Autonomous GitHub Issue <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-pink-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Velvet Session
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/10"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
