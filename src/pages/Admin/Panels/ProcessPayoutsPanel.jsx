import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";
import {
  getPayoutHistory,
  processPayouts,
} from "../../../APIs/adminDashboardApis";
import Pagination from "../../../components/UI/AdminDashboard/Pagination";
import Loading from "../../../components/Layout/LoadingLayout";
import { Wallet, Calendar, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Users, ShoppingBag } from "lucide-react";
import { Button } from "../../../components/shadcn/button";

/* ── Helpers ───────────────────────────── */
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtCurrency(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(Number(v));
}

/* ── Payout row ──────────────────────────── */
function PayoutRow({ payout }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setExpanded((p) => !p)}
        className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
      >
        <td className="px-6 py-4 text-xs font-mono text-gray-400">
          #{String(payout?.id ?? "").slice(0, 8)}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <Calendar size={14} className="text-gray-400" />
            {fmtDate(payout?.processedAt)}
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 text-center">
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
            {payout?.window?.days ?? "—"}{t("admin.finance.days").charAt(0)}
          </span>
        </td>
        <td className="px-6 py-4 text-center">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-tight bg-blue-50 text-blue-700 border border-blue-100">
            <Users size={10} />
            {payout?.totals?.organizers ?? 0}
          </span>
        </td>
        <td className="px-6 py-4 text-center">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-tight bg-emerald-50 text-emerald-700 border border-emerald-100">
            <ShoppingBag size={10} />
            {payout?.totals?.orders ?? 0}
          </span>
        </td>
        <td className="px-6 py-4 text-sm font-bold text-gray-900">
          {fmtCurrency(payout?.totals?.grossAmount)}
        </td>
        <td className="px-6 py-4 text-center">
          <div className="p-1.5 hover:bg-gray-200 rounded-full transition-colors inline-block">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-gray-50/50">
          <td colSpan={7} className="px-8 py-6 border-b border-gray-100 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                [t("admin.finance.windowFrom"), fmtDate(payout?.window?.from)],
                [t("admin.finance.windowTo"), fmtDate(payout?.window?.to)],
                [t("admin.finance.processedBy"), payout?.processedBy ?? "System Admin"],
              ].map(([key, val]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{key}</span>
                  <span className="text-sm text-gray-700 font-medium">{val}</span>
                </div>
              ))}
            </div>

            {Array.isArray(payout?.payouts) && payout.payouts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  {t("admin.finance.individualPayouts")}
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-md text-[10px]">
                    {payout.payouts.length}
                  </span>
                </h4>
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-2.5 text-left">{t("admin.finance.organizer")}</th>
                        <th className="px-4 py-2.5 text-left">{t("admin.finance.grossAmount")}</th>
                        <th className="px-4 py-2.5 text-center text-xs">{t("admin.finance.orders")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payout.payouts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80">
                          <td className="px-4 py-2.5 text-gray-700 font-medium">
                            {p?.organizerId ?? p?.organizer ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-gray-900 font-bold">
                            {fmtCurrency(p?.amount ?? p?.grossAmount)}
                          </td>
                          <td className="px-4 py-2.5 text-center text-gray-500">
                            {p?.orderCount ?? p?.orders ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Main panel ───────────────────────────── */
export default function ProcessPayoutsPanel() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [payouts, setPayouts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* process payout state */
  const [days, setDays] = useState(30);
  const [confirm, setConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPayoutHistory(page);
      setPayouts(response.data?.data?.payouts ?? []);
      setPagination(response.data?.data?.pagination ?? null);
    } catch (err) {
      console.error("[ProcessPayoutsPanel]", err);
      setError(
        err?.response?.data?.message ?? t("apiErrors.INTERNAL_SERVER_ERROR")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!confirm) return;
    setProcessing(true);
    setProcessResult(null);
    try {
      const response = await processPayouts(days);
      setProcessResult({
        success: true,
        data: response.data?.data,
      });
      // refresh history after processing
      setConfirm(false);
      fetchHistory();
    } catch (err) {
      console.error("[ProcessPayouts]", err);
      setProcessResult({
        success: false,
        message:
          err?.response?.data?.message ?? t("admin.finance.error"),
      });
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("admin.finance.title")}
        </h1>
        <p className="text-sm text-gray-500">
          {t("admin.finance.desc")}
        </p>
      </div>

      <Title>
        {t("admin.finance.title")}
      </Title>

      {/* ── Process payouts form ──────────────── */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6 flex flex-col gap-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-blue-200 shadow-lg">
            <Wallet className="text-white" size={20} />
          </div>
          <h3 className="text-base font-bold text-gray-800">
            {t("admin.finance.generateBatch")}
          </h3>
        </div>

        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {t("admin.finance.historicalWindow")}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{t("admin.finance.days")}</span>
              </div>
            </div>
            
            <div className="pt-5">
               <p className="text-xs text-gray-400 italic">
                 {t("admin.finance.batchingNote", { days })}
               </p>
            </div>
          </div>

          <label className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-gray-100 select-none">
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={confirm}
                onChange={(e) => setConfirm(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                {t("admin.finance.confirmExecution")}
              </span>
              <span className="text-xs text-gray-500">
                {t("admin.finance.confirmCheckbox")}
              </span>
            </div>
          </label>

          <div className="flex items-center gap-4 mt-2">
            <Button
              onClick={handleProcess}
              disabled={!confirm || processing}
              className="px-8 py-6 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   {t("admin.finance.processing")}
                </div>
              ) : (
                t("buttons.processPayouts", "Execute Payouts Now")
              )}
            </Button>

            {processResult && (
              <div
                className={`flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-xl border animate-in slide-in-from-left duration-300 ${
                  processResult.success
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-red-50 border-red-100 text-red-700"
                }`}
              >
                {processResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {processResult.success
                  ? t("admin.finance.batchSuccess")
                  : processResult.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Payout history ────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {t("admin.finance.historyTitle")}
          </h3>
          <div className="text-xs text-gray-500 font-medium">
            {t("admin.finance.showingBatches", { count: payouts.length })}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin.finance.id", "ID")}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin.finance.date")}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">{t("admin.finance.window")}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">{t("admin.finance.orgs")}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">{t("admin.finance.orders")}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin.finance.totalAmount")}</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-6 py-8">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : payouts.length > 0 ? (
                  payouts.map((p) => (
                    <PayoutRow key={p?.id} payout={p} />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Wallet size={48} className="opacity-10" />
                        <p className="text-sm font-medium">{t("admin.finance.noHistory")}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && pagination && (
          <div className="flex justify-center mt-6">
            <Pagination
              page={page}
              total={pagination?.total}
              limit={pagination?.limit}
              onChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
