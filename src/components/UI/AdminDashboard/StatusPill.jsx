/**
 * StatusPill
 * Renders a coloured badge for a status string.
 * Supports: active | approved | reactivated | published
 *           inactive | pending | draft
 *           banned | suspended | cancelled | rejected
 */

import { useTranslation } from "react-i18next";

const COLORS = {
active:      { value: "active",       bg: "#05ff1630", color: "#4ad080", border: "#16b534" }, 
approved:    { value: "approved",     bg: "#05ff1630", color: "#4ad080", border: "#16b534" }, 
reactivated: { value: "reactivated",  bg: "#05ff1630", color: "#4ad080", border: "#16b534" }, 
published:   { value: "published",    bg: "#05ff1630", color: "#4ad080", border: "#16b534" }, 
 
inactive:    { value: "inactive",     bg: "#bbbbbb40", color: "#bbbbbb", border: "#ababab" }, 
pending:     { value: "pending",      bg: "#f0f40030", color: "#fbbf24", border: "#92400e" }, 
draft:       { value: "draft",        bg: "#f0f40030", color: "#fbbf24", border: "#92400e" }, 
under_review:{ value: "under_Review", bg: "#f0f40030", color: "#fbbf24", border: "#92400e" }, 
 
banned:      { value: "banned",       bg: "#ff080830", color: "#f87171", border: "#f71d1d" }, 
suspended:   { value: "suspended",    bg: "#ff080830", color: "#f87171", border: "#f71d1d" }, 
cancelled:   { value: "cancelled",    bg: "#ff080830", color: "#f87171", border: "#f71d1d" }, 
rejected:    { value: "rejected",     bg: "#ff080830", color: "#f87171", border: "#f71d1d" },
};

export default function StatusPill({ status = "" }) {
  const key = status.toLowerCase();
  const s = COLORS[key] ?? { bg: "#05ff1630", color: "#4ad080", border: "#16b534" };
 
  const {t}=useTranslation();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",

        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
          flexShrink: 0,
        }}
      />
      {t(`eventDialog.status.${key}`)}
    </span>
  );
}