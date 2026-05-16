import {  approveOrganizer,  getReviewQueue, reactivateOrganizer, rejectOrganizer, suspendOrganizer } from "../../../APIs/adminDashboardApis";
import InfoDialog from "../../../components/Dialogs/InfoDialog";
import Pagination from "../../../components/UI/AdminDashboard/Pagination";
import StatusPill from "../../../components/UI/AdminDashboard/StatusPill";
import { useState ,useEffect } from "react";
import { useTranslation } from "react-i18next";
import { extractDateTime } from "../../../utils/dateFormater";

const DataLabels = {
  id: "ID",
  userId: "User ID",
  name: "Name",
  type: "Type",
  contactEmail: "Email",
  contactPhone: "Phone",
  status: "Status",
  verificationStatus: "Verification",
  createdAt: "Created",
  updatedAt: "Updated",
};

/* ── Mock ── */
const MOCK_RESPONSE = {
  organizers: [
    {
      id: "org_0031",
      name: "NoveFest",
      email: "novo@fest.com",
      submitted: "2025-05-01",
      status: "pending",
    },
    {
      id: "org_0032",
      name: "UrbanWave",
      email: "hi@urbanwave.io",
      submitted: "2025-05-02",
      status: "pending",
    },
    {
      id: "org_0033",
      name: "Glow Events",
      email: "glow@events.com",
      submitted: "2025-05-02",
      status: "pending",
    },
    {
      id: "org_0034",
      name: "SoundBox",
      email: "info@soundbox.co",
      submitted: "2025-05-03",
      status: "pending",
    },
  ],
  pagination: { total: 4, page: 1, limit: 10 },
};

/* ── Colors (clean Tailwind mapping) ── */
const ACTION_STYLES = {
  approve:
    "bg-green-500/20 text-green-400 border-green-700 hover:cursor-pointer hover:bg-green-500/30",
  reactivate:
    "bg-blue-500/20 text-blue-400 border-blue-700 hover:cursor-pointer hover:bg-blue-500/30",
  reject:
    "bg-red-500/20 text-red-400 border-red-700 hover:cursor-pointer hover:bg-red-500/30",
  suspend:
    "bg-yellow-500/20 text-yellow-400 border-yellow-700 hover:cursor-pointer hover:bg-yellow-500/30",
};

/* ── Action Button ── */
function ActionBtn({ actionKey, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition whitespace-nowrap
        ${ACTION_STYLES[actionKey]}
        ${active ? "ring-1 ring-white/30" : ""}
      `}
    >
      {label}
    </button>
  );
}

/* ── Row ── */
function OrganizerRow({ org, t ,setSelectedData,setInfoDialogOpen}) {
  const [activeAction, setActiveAction] = useState(null);
  const [reason, setReason] = useState("");
  const [result, setResult] = useState(null);

  const needsReason = activeAction === "reject" || activeAction === "suspend";

  const handleSelect = async(e,key) => {
    e.stopPropagation();
    
    setActiveAction((prev) => (prev === key ? null : key));
    setReason("");
    setResult(null);
  };

  const handleConfirm = async(e) => {
    e.stopPropagation();
    if (!activeAction) return;
    
      if (activeAction === "approve") await handleApprove();
      if (activeAction === "reactivate") await handleReactivate();
      if (activeAction === "reject") await handleReject();
      if (activeAction === "suspend") await handleSuspend();


    setResult({
      success: true,
      organizer_id: org.id,
      action: activeAction,
      ...(reason.trim() ? { reason: reason.trim() } : {}),
      updated_at: new Date().toISOString(),
    });

    setActiveAction(null);
    setReason("");
  };

  const handleApprove=async()=>{
    try {
       await approveOrganizer(org.id);
    } catch (error) {
      console.error(error)
    }
  }
  const handleReactivate=async()=>{
    try {
       await reactivateOrganizer(org.id);
    } catch (error) {
      console.error(error)
    }
  }
  const handleReject=async()=>{
    try {
       await rejectOrganizer(org.id, reason);
    } catch (error) {
      console.error(error)
    }
  }
  const handleSuspend=async()=>{
    try {
      await suspendOrganizer(org.id, reason);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {/* Main Row */}
      <tr className=" border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors " onClick={(e) => {
        e.stopPropagation();
        setSelectedData(org);
        setInfoDialogOpen(true);
      }}>
        <td className="px-6 py-3 text-xs text-gray-500">{org.id}</td>
        <td className="px-6 py-3 text-sm ">{org.name}</td>
        <td className="px-6 py-3 text-xs text-blue-400">{org.contactEmail}</td>
        <td className="px-6 py-3 text-xs text-gray-400">{extractDateTime(org.createdAt).date}</td>

        <td className="px-6 py-3 text-center">
          <StatusPill status={result ? result.action : org.status} />
        </td>

        <td className="px-6 py-3 min-w-[260px]">
          <div className="flex flex-nowrap gap-2">
            {result ? (
              <span className="text-xs text-green-400">
                ✓ {result.action} applied
              </span>
            ) : (
              <>
                <ActionBtn
                  actionKey="approve"
                  label={t("buttons.approve")}
                  onClick={(e) => handleSelect(e,"approve")}
                  active={activeAction === "approve"}
                />
                <ActionBtn
                  actionKey="reject"
                  label={t("buttons.reject")}
                  onClick={(e) => handleSelect(e,"reject")}
                  active={activeAction === "reject"}
                />
                <ActionBtn
                  actionKey="suspend"
                  label={t("buttons.suspend")}
                  onClick={(e) => handleSelect(e,"suspend")}
                  active={activeAction === "suspend"}
                />
                <ActionBtn
                  actionKey="reactivate"
                  label={t("buttons.reactivate")}
                  onClick={(e) => handleSelect(e,"reactivate")}
                  active={activeAction === "reactivate"}
                />
              </>
            )}
          </div>
        </td>
      </tr>

      {/* Expand Row */}
      {activeAction && !result && (
        <tr className="bg-gray-50 border-b border-gray-200">
          <td colSpan={6} className="px-3 py-3">
            <div className="flex flex-wrap items-end gap-3">
              {needsReason && (
                <div className="flex flex-col gap-1 min-w-[250px] flex-1">
                  <label className="text-[11px] text-gray-500">
                    {t("fields.reason")}
                  </label>

                  <input
                    autoFocus
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t("fields.reasonPlaceholder")}
                    className="text-xs px-2 py-1 rounded-md border border-gray-700  outline-none focus:border-purple-500"
                  />
                </div>
              )}

              <div className="flex gap-2 mx-auto">
                <button
                  onClick={(e) => handleConfirm(e)}
                  disabled={needsReason && !reason.trim()}
                  className={`px-3 py-1 text-xs font-semibold rounded-md border transition
                    ${ACTION_STYLES[activeAction]}
                    ${needsReason && !reason.trim() ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  {t(`buttons.confirm_${activeAction}`, {
                    defaultValue: "Confirm",
                  })}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAction(null);
                    setReason("");
                  }}
                  className="px-3 py-1 text-xs rounded-md border border-gray-700 text-gray-400 hover:cursor-pointer hover:bg-gray-800 transition"
                >
                  {t("buttons.cancel", { defaultValue: "Cancel" })}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Main Panel ── */
export default function ReviewQueuePanel() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [organizersList, setOrganizersList] = useState();
  const [pagination, setpagination] = useState();
  // const { organizers, pagination } = MOCK_RESPONSE;



   const handleGetData =async()=>{
      try {
        // await adminDashboardauth.refreshtoken();

        const response = await getReviewQueue();
        setOrganizersList(response.data.data.organizers);
        setpagination(response.data.data.pagination);
      } catch (error) {
        console.error(error);
      }
    }
  
    useEffect(() => {
      handleGetData();
    }, [page]);

  return (
    <div className="flex flex-col gap-4 ">
      {/* TABLE WRAPPER (FIXED) */}
      <div className="border border-gray-800 rounded-xl overflow-hidden w-full">
        {/* scroll fix */}
        <div className="w-full overflow-x-auto">
          <table className=" w-full border-collapse p-2">
            <thead className="bg-primary text-white p-2">
              <tr className="text-left text-[11px] uppercase tracking-wider p-2">
                <th className="px-6 py-3"> {t("table.id")} </th>
                <th className="px-6 py-3"> {t("table.name")} </th>
                <th className="px-6 py-3"> {t("table.email")} </th>
                <th className="px-6 py-3"> {t("table.submitted")} </th>
                <th className="px-6 py-3 text-center"> {t("table.status")} </th>
                <th className="px-6 py-3"> {t("table.actions")} </th>
              </tr>
            </thead>

            <tbody>
              {organizersList?.map((org) => (
                <OrganizerRow key={org.id} org={org} t={t}  setSelectedData={setSelectedData} setInfoDialogOpen={setInfoDialogOpen}   />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        total={pagination?.total}
        limit={pagination?.limit}
        onChange={setPage}
      />

      <InfoDialog
        data={selectedData}
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        labels={DataLabels}
        t={t}
      />
    </div>
  );
}
