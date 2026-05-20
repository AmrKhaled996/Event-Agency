import i18next from "i18next";

/**
 * Standardized currency formatter for the application (Targets Egypt).
 *
 * @param {number|string} value - The numeric value to format
 * @param {object} options - Optional formatting overrides
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value, options = {}) {
  if (
    value === null ||
    value === undefined ||
    value === "-" ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  const lang = i18next.language || "en";

  const locale = lang === "ar" ? "ar-EG" : "en-EG";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
    ...options,
  }).format(Number(value));
}
