import React from "react";
import i18n from "../I18n";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: "#f9fafb",
            color: "#1f2937",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "1rem",
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
            }}
          >
            {i18n.t("errors.boundary.title")}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              marginBottom: "1.5rem",
              maxWidth: "400px",
            }}
          >
            {i18n.t("errors.boundary.message")}
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#fff",
                backgroundColor: "#6366f1",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
            >
              {i18n.t("common.actions.tryAgain")}
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
            >
              {i18n.t("common.actions.goHome")}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
