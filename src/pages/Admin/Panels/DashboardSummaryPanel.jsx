import { useTranslation } from "react-i18next";
import { adminDashboardauth, getDashboardSummary } from "../../../APIs/adminDashboardApis";
import { useEffect, useState } from "react";
import { refreshAccessToken } from "../../../services/cookieTokenService";
import { Title } from "react-head";
import Loading from "../../../components/Layout/LoadingLayout";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
const MOCK_DATA = {
  users:      { total: "-", deleted: "-",  activeInPeriod: "-" },
  organizers: { total: "-",   pendingReview: "-" },
  events:     { total: "-" },
  orders:     { total: "-", completed: "-", pending: "-", cancelled: "-", revenue: "-" },
};

function Section({ title, children }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-10">
      <p className="text-[11px] font-medium tracking-wider uppercase text-gray-400 mb-2">
        {t(title)}
      </p>

      <div className="grid  grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
        {children}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const { t } = useTranslation();

  const isRevenue = label.toLowerCase().includes("revenue");

  const display = isRevenue
    ? `$${(value).toLocaleString()}`
    : (value).toLocaleString();

  return (
    <div
      className="bg-gray-100 rounded-md px-3 py-2 border-l-[3px]"
      style={{ borderColor: accent || "transparent" }}
    >
      <p className="text-xs text-gray-500 mb-1">
        {t(label)}
      </p>

      <p className="text-lg font-medium text-gray-900">
        {display}
      </p>
    </div>
  );
}

export default function DashboardSummaryPanel() {
  const { t } = useTranslation();
  const d = MOCK_DATA;
  const [summaryData, setsummaryData] = useState(d);
  const [loading, setloading] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleGetData =async()=>{
    try {
      setloading(true)

      const response = await getDashboardSummary();

      setsummaryData(response.data.data);
      
    } catch (error) {
      const message =
        error.response?.data?.data?.message || "Something went wrong";
      console.error(error);
      // setDialogMessage(message);
      // setopenDialog(true);
    }
    finally{
      setloading(false)
    }
  }

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className="pt-1">
      <Title>{t("actions.dashboardSummary")}</Title>
      <Section title="dashboardSummary.users">
        <StatCard label="dashboardSummary.total" value={summaryData?.users?.total} accent={"#BB52E0"} />
        <StatCard
          label="dashboardSummary.active"
          value={summaryData?.users?.activeInPeriod}
          accent="#22c55e"
        />
        <StatCard
          label="dashboardSummary.deleted"
          value={summaryData?.users?.deleted}
          accent="#ef4444"
        />
      </Section>

      <Section title="dashboardSummary.organizers">
        <StatCard label="dashboardSummary.total" value={summaryData?.organizers?.total} accent={"#BB52E0"} />
        <StatCard
          label="dashboardSummary.pendingReview"
          value={summaryData?.organizers?.pendingReview}
          accent="#f59e0b"
        />
      </Section>

      <Section title="dashboardSummary.events">
        <StatCard label="dashboardSummary.total" value={summaryData?.events?.total} accent={"#BB52E0"}  />
      </Section>

      <Section title="dashboardSummary.orders">
        <StatCard label="dashboardSummary.total" value={summaryData?.orders?.total} accent={"#BB52E0"} />
        <StatCard
          label="dashboardSummary.completed"
          value={summaryData?.orders?.completed}
          accent="#22c55e"
        />
        <StatCard
          label="dashboardSummary.pending"
          value={summaryData?.orders?.pending}
          accent="#f59e0b"
        />
        <StatCard
          label="dashboardSummary.cancelled"
          value={summaryData?.orders?.cancelled}
          accent="#ef4444"
        />
        <StatCard
          label="dashboardSummary.revenue"
          value={summaryData?.orders?.revenue}
          accent={"silver"}
        />
      </Section>
           {loading && <Loading />}
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