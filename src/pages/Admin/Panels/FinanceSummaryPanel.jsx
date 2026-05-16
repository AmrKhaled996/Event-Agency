import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";
import { getFinanceSummary } from "../../../APIs/adminDashboardApis";
import Loading from "../../../components/Layout/LoadingLayout";

/* ── Stat card ────────────────────────── */
function StatCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-xl px-5 py-4 flex flex-col gap-1 transition-all hover:shadow-md shadow-sm border-l-4 ${
        accent
          ? "bg-primary/5 border-primary/40 border-l-primary"
          : "bg-white border-gray-100 border-l-gray-300"
      }`}
    >
      <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
        {label}
      </span>
      <span className="text-2xl font-bold text-gray-900">{value ?? "—"}</span>
    </div>
  );
}

/* ── Helpers ───────────────────────────── */
function fmtCurrency(v) {
  if (v === null || v === undefined || v === "-" || Number.isNaN(Number(v))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(Number(v));
}

export default function FinanceSummaryPanel() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFinanceSummary(days);
      setData(response.data?.data ?? null);
    } catch (err) {
      console.error("[FinanceSummaryPanel]", err);
      setError(
        err?.response?.data?.message ?? "Failed to load finance summary"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days]);

  return (
    <div className="flex flex-col gap-5">
      <Title>
        {t("actions.financeSummary", { defaultValue: "Finance Summary" })}
      </Title>

      {/* Days filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">
          {t("common.period", { defaultValue: "Period" })}:
        </span>
        {[7, 30, 90, 365].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition border ${
              days === d
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {d}d
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && <Loading />}

      {data && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label={t("finance.totalRevenue", { defaultValue: "Total Revenue" })}
            value={fmtCurrency(data?.totalRevenue)}
            accent
          />
          <StatCard
            label={t("finance.totalPaidOut", { defaultValue: "Total Paid Out" })}
            value={fmtCurrency(data?.totalPaidOut)}
          />
          <StatCard
            label={t("finance.platformFees", { defaultValue: "Platform Fees" })}
            value={fmtCurrency(data?.platformFees)}
          />
          <StatCard
            label={t("finance.pendingPayouts", {
              defaultValue: "Pending Payouts",
            })}
            value={fmtCurrency(data?.pendingPayouts)}
            accent
          />
          <StatCard
            label={t("finance.totalOrders", { defaultValue: "Total Orders" })}
            value={data?.totalOrders ?? "—"}
          />
          <StatCard
            label={t("finance.totalTicketsSold", {
              defaultValue: "Tickets Sold",
            })}
            value={data?.totalTicketsSold ?? "—"}
          />
          <StatCard
            label={t("finance.activeOrganizers", {
              defaultValue: "Active Organizers",
            })}
            value={data?.activeOrganizers ?? "—"}
          />
          <StatCard
            label={t("finance.payoutsProcessed", {
              defaultValue: "Payouts Processed",
            })}
            value={data?.payoutsProcessed ?? "—"}
          />
        </div>
      )}
    </div>
  );
}
