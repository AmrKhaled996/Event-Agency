import { ACCENT } from "../../../constants/theme";

/**
 * Btn
 * A labelled action button with an HTTP-method badge.
 *
 * Props:
 *   label    – button text
 *   method   – "GET" | "POST" | "PATCH" | "DELETE" (shown as badge)
 *   variant  – "primary" | "danger"
 *   onClick  – click handler
 *   disabled – boolean
 */

const METHOD_COLORS = {
  GET:    { bg: "#0c2a1a", color: "#4ade80", border: "#166534" },
  POST:   { bg: "#0c1a2a", color: "#60a5fa", border: "#1d4ed8" },
  PATCH:  { bg: "#1a1a0c", color: "#fbbf24", border: "#92400e" },
  DELETE: { bg: "#2a0c0c", color: "#f87171", border: "#7f1d1d" },
  DEL:    { bg: "#2a0c0c", color: "#f87171", border: "#7f1d1d" },
};

const VARIANT_STYLES = {
  primary: {
    background: ACCENT,
    color: "#fff",
    border: `1px solid ${ACCENT}`,
    hoverBg: "#4f46e5",
  },
  danger: {
    background: "#7f1d1d",
    color: "#fca5a5",
    border: "1px solid #991b1b",
    hoverBg: "#991b1b",
  },
};

export default function Btn({ label, method, variant = "primary", onClick, disabled = false }) {
  const v = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const m = METHOD_COLORS[method];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {method && m && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            padding: "2px 7px",
            borderRadius: 4,
            background: m.bg,
            color: m.color,
            border: `1px solid ${m.border}`,
            whiteSpace: "nowrap",
          }}
        >
          {method === "DEL" ? "DELETE" : method}
        </span>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: "7px 18px",
          borderRadius: 7,
          fontSize: 13,
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          background: v.background,
          color: v.color,
          border: v.border,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = v.hoverBg; }}
        onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = v.background; }}
      >
        {label}
      </button>
    </div>
  );
}