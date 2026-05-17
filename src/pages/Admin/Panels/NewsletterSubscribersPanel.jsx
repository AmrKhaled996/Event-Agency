import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";
import Pagination from "../../../components/UI/AdminDashboard/Pagination";
import { getNewsletterSubscribers } from "../../../APIs/adminDashboardApis";
import Loading from "../../../components/Layout/LoadingLayout";
import { Mail, Calendar, Globe } from "lucide-react";

/* ── Row ───────────────────────────── */
function SubscriberRow({ subscriber }) {
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      <td className="px-6 py-4 text-xs font-mono text-gray-400">
        #{String(subscriber?.id).slice(0, 8)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Mail size={14} className="text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">{subscriber?.email}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Globe size={10} />
          {subscriber?.languagePreference?.toUpperCase() ?? "EN"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={12} className="text-gray-400" />
          {fmtDate(subscriber?.createdAt)}
        </div>
      </td>
    </tr>
  );
}

/* ── Main panel ───────────────────────────── */
export default function NewsletterSubscribersPanel() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [subscribers, setSubscribers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNewsletterSubscribers(page);
      setSubscribers(response.data?.data?.subscribers ?? []);
      setPagination(response.data?.data?.pagination ?? null);
    } catch (err) {
      console.error("[NewsletterSubscribersPanel]", err);
      setError(
        err?.response?.data?.message ?? "Failed to load newsletter subscribers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <Title>
        {t("actions.listNewsletterSubscribers", "Newsletter Subscribers")}
      </Title>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("actions.listNewsletterSubscribers", "Newsletter Subscribers")}
        </h1>
        <p className="text-sm text-gray-500">
          Manage and view all users who have subscribed to your newsletter updates.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="p-1 bg-red-100 rounded-full">
            <X size={14} />
          </div>
          {error}
        </div>
      )}

      {/* table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("userTable.id", "ID")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("userTable.email", "Email")}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("common.language", "Language")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("common.subscribedAt", "Subscribed At")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : subscribers.length > 0 ? (
                subscribers.map((sub) => (
                  <SubscriberRow key={sub?.id} subscriber={sub} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Mail size={32} className="opacity-20" />
                      <p>{t("common.noData", "No subscribers found")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      {!loading && pagination && (
        <div className="flex justify-center mt-4">
          <Pagination
            page={page}
            total={pagination?.total}
            limit={pagination?.limit}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
