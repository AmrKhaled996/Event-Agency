import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/UI/AdminDashboard/Pagination";
import StatusPill from "../../../components/UI/AdminDashboard/StatusPill";
import { getOrganizers } from "../../../APIs/adminDashboardApis";
import Loading from "../../../components/Layout/LoadingLayout";
import { Title } from "react-head";


/* ── Type badge (Tailwind) ───────────────────────────── */
const TYPE_STYLES = {
  COMPANY:  "bg-blue-200/60 text-blue-400 border-blue-700",
  BUSINESS: "bg-purple-200/60 text-purple-400 border-purple-700",
  HOBBYIST: "bg-emerald-200/60 text-emerald-400 border-emerald-700",
};

function TypeBadge({ type }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${
        TYPE_STYLES[type] ?? " text-slate-400 border-slate-600"
      }`}
    >
      {type}
    </span>
  );
}

/* ── Reason chip ───────────────────────────── */
function ReasonChip({ label, reason }) {
  const [show, setShow] = useState(false);

  if (!reason)
    return <span className="text-gray-500 text-xs">—</span>;

  return (
    <div className="relative inline-block">
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-xs px-2 py-1 rounded bg-red-200/30 text-red-400 border border-red-700 cursor-default mx-1"
      >
        {label}
      </span>

      {show && (
        <div className="absolute bottom-full mb-2 left-0 z-10 w-56 text-xs bg-gray-900 text-gray-200 p-2 rounded shadow-lg border border-gray-700">
          {reason}
        </div>
      )}
    </div>
  );
}

/* ── Row ───────────────────────────── */
function OrganizerRow({ org, t }) {
  const [expanded, setExpanded] = useState(false);

  const shortId = (id) => (id ? `${id.slice(0, 8)}…` : "—");

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <>
      {/* main row */}
      <tr
        onClick={() => setExpanded((p) => !p)}
        className="cursor-pointer hover:bg-primary/10 duration-300 transition select-text"
      >
        <td className="px-4 py-3 text-xs text-gray-500">
          {shortId(org.id)}
        </td>

        <td className="px-4 py-3 text-sm select-text">
          {org.name}
        </td>

        <td className="px-4 py-3 text-xs text-blue-400">
          {org.contactEmail}
        </td>

        <td className="px-4 py-3 text-center">
          <TypeBadge type={org.type} />
        </td>

        <td className="px-4 py-3 text-center">
          <StatusPill status={org.status} />
        </td>

        <td className="px-4 py-3 text-center">
          <StatusPill status={org.verificationStatus} />
        </td>

        <td className="px-4 py-3 text-center">
          {org.rejectionReason && (
            <ReasonChip
              label={t("listorganizersTable.rejected")}
              reason={org.rejectionReason}
            />
          )}
          {org.suspendReason && (
            <ReasonChip
              label={t("listorganizersTable.suspended")}
              reason={org.suspendReason}
            />
          )}
          {!org.rejectionReason && !org.suspendReason && (
            <span className="text-gray-500 text-xs">—</span>
          )}
        </td>

        <td className="px-4 py-3 text-center text-gray-500">
          {expanded ? "▲" : "▼"}
        </td>
      </tr>

      {/* expanded row */}
      {expanded && (
        <tr className="bg-gray-200">
          <td colSpan={8} className="px-6 py-4 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm select-text">
              {[
                ["id", org.id],
                ["userId", org.userId],
                ["phone", org.contactPhone],
                ["reviewedBy", org.reviewedBy ?? "—"],
                ["reviewedAt", fmtDate(org.reviewedAt)],
                ["createdAt", fmtDate(org.createdAt)],
                ["updatedAt", fmtDate(org.updatedAt)],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-semibold select-text">
                    {t(`organizerFields.${key}`, {
                      defaultValue: key,
                    })}
                    :
                  </span>

                  <span className="text-slate-500 break-all select-text">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Main panel ───────────────────────────── */
export default function ListOrganizersPanel() {
  const { t } = useTranslation();
    const [page, setPage] = useState(1);
      const [loading, setloading] = useState(false);
      const [organizersList, setOrganizersList] = useState();
  const [pagination, setpagination] = useState();
  // const { organizers, pagination } = MOCK_RESPONSE;



   const handleGetData =async()=>{
      try {
        // await adminDashboardauth.refreshtoken();
        setloading(true)
        const response = await getOrganizers(page);
        console.log("data",response.data.data)
        setOrganizersList(response.data.data.organizers);
        setpagination(response.data.data.pagination);
      } catch (error) {
        console.error(error);
      }finally{
      setloading(false)
    }
    }
  
    useEffect(() => {
      handleGetData();
    }, [page]);
  // const {organizers,pagination} = MOCK_RESPONSE;
  // const organizers = data?.organizers || [];
  // const pagination = data?.pagination || {};

  return (
    <div className="flex flex-col gap-4">
      <Title>{t("actions.listOrganizers")}</Title>
      {/* table wrapper */}

      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-primary text-white text-sm uppercase tracking-wide select-text">
              <tr>
                <th className="px-4 py-3 text-left select-text">{t("listorganizersTable.id")}</th>
                <th className="px-4 py-3 text-left">{t("listorganizersTable.name")}</th>
                <th className="px-4 py-3 text-left">{t("listorganizersTable.email")}</th>
                <th className="px-4 py-3 text-center">
                  {t("listorganizersTable.type")}
                </th>
                <th className="px-4 py-3 text-center select-text">
                  {t("listorganizersTable.status")}
                </th>
                <th className="px-4 py-3 text-center select-text">
                  {t("listorganizersTable.verification")}
                </th>
                <th className="px-4 py-3 text-center">
                  {t("listorganizersTable.reason")}
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {organizersList?.map((org) => (
                <OrganizerRow key={org.id} org={org} t={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      <Pagination
        page={page}
        total={pagination?.total}
        limit={pagination?.limit}
        onChange={ setPage}
      />
      {loading && <Loading />}
    </div>
  );
}