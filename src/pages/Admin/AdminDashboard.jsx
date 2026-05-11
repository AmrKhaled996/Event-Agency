import { useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/Header";
import { buildNav } from "../../constants/adminDashboardNav";

/* ── Panels ─────────────────────────────────────────────────────────────── */
import DashboardSummaryPanel  from "./panels/DashboardSummaryPanel";
import ReviewQueuePanel       from "./panels/ReviewQueuePanel";
import ListUsersPanel         from "./panels/ListUsersPanel";
import ListOrganizersPanel    from "./panels/ListOrganizersPanel";
// import AnalyticsPanel         from "./panels/AnalyticsPanel";
import ActiveUsersPanel       from "./panels/ActiveUsersPanel";
// import FinanceSummaryPanel    from "./panels/FinanceSummaryPanel";
// import ProcessPayoutsPanel    from "./panels/ProcessPayoutsPanel";
import ListEventsPanel        from "./panels/ListEventsPanel";




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
});

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { t } = useTranslation();
  const [openTopics, setOpenTopics]   = useState(["dashboard"]);
  const [activeAction, setActiveAction] = useState("dashboard-summary");

  const toggle = id =>
    setOpenTopics(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const currentAction = NAV.flatMap(s => s.actions).find(a => a.id === activeAction);
  const Panel = currentAction?.panel;

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

        <div className="w-full">
          {Panel && <Panel key={activeAction} />}
        </div>
      </main>
    </div>
  );
}
