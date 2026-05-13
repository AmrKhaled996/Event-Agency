import {  useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/Header";
import { buildNav } from "../../constants/adminDashboardNav";

/* ── Panels ─────────────────────────────────────────────────────────────── */
import DashboardSummaryPanel  from "./Panels/DashboardSummaryPanel";
import ReviewQueuePanel       from "./Panels/ReviewQueuePanel";
import ListUsersPanel         from "./Panels/ListUsersPanel";
import ListOrganizersPanel    from "./Panels/ListOrganizersPanel";
// import AnalyticsPanel         from "./Panels/AnalyticsPanel";
import ActiveUsersPanel       from "./Panels/ActiveUsersPanel";
// import FinanceSummaryPanel    from "./Panels/FinanceSummaryPanel";
// import ProcessPayoutsPanel    from "./Panels/ProcessPayoutsPanel";
import ListEventsPanel        from "./Panels/ListEventsPanel";
import { ListCategoriesPanel } from "./Panels";
import { adminDashboardauth } from "../../APIs/adminDashboardApis";
import { adminRefreshAccessToken } from "../../services/cookieTokenService";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";

/* ── Build NAV ───────────────────────────────────────────────────────────── */
const NAV = buildNav({
  DashboardSummaryPanel,
  ReviewQueuePanel,
  ListUsersPanel,
  ListOrganizersPanel,
  // AnalyticsPanel,
  ActiveUsersPanel,
  // FinanceSummaryPanel,
  // ProcessPayoutsPanel,
  ListEventsPanel,
  ListCategoriesPanel,
});

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { t } = useTranslation();
  const [openTopics, setOpenTopics] = useState(["dashboard"]);
  const [activeAction, setActiveAction] = useState("dashboard-summary");
    const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const toggle = (id) =>
    setOpenTopics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const currentAction = NAV.flatMap((s) => s.actions).find(
    (a) => a.id === activeAction,
  );
  const Panel = currentAction?.panel;
  const handlerefreshToken = async () => {
    try {
      const response = await adminDashboardauth.refreshtoken();
      await adminRefreshAccessToken(response?.data);
    } catch (error) {
      const message =
        error.response?.data?.data[0]?.message || "Something went wrong";
      // console.error(
      //   error?.response?.data?.data[0]?.message || error || "something went wrong",
      // );
      setDialogMessage(message);
      setopenDialog(true);
    }
  };
  useEffect(() => {
    handlerefreshToken();
  }, []);

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar
        NAV={NAV}
        openTopics={openTopics}
        toggle={toggle}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        t={t}
      />

      <main className="flex-1 overflow-y-auto px-9 py-7">
        <Header
          currentAction={currentAction}
          activeAction={activeAction}
          t={t}
        />

        <div className="w-full">{Panel && <Panel key={activeAction} />}</div>
      </main>
            {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
    </div>
  );
}
