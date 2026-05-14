import {  useEffect, useState } from "react";
import { getAnalyticsOrgainzerDashboard } from "../../../APIs/organizerDashboardAPIs";
import BarChart from "../../../components/Charts/BarChart";

import ProfitsLineChart from "../../../components/Charts/ProfitsLineChart";
import DoughnutChart from "../../../components/Charts/DoughnutChart";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import Loading from "../../../components/Layout/LoadingLayout";
import { useTranslation } from "react-i18next";


export default function OrganizerAnalyticsPage() {
  const { t } = useTranslation();
  const [analyticsData, setanalyticsData] = useState({});
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setloading] = useState(false);
  const getAnalyticsData = async () => {
    try {
      setloading(true);
      const response = await getAnalyticsOrgainzerDashboard();

      setanalyticsData(response.data.data.data);
    } catch (error) {
      const message =
        error.response?.data?.data?.message || t("common.feedback.error");
      setDialogMessage(message);
      setopenDialog(true);
    }
    finally {
      setloading(false);
    }
  }
  useEffect(() => {
    getAnalyticsData();
  }, []);

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold mb-6">{t("organizer.dashboard.analytics")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* tickets Statistics */}
        <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 flex flex-col min-h-80 transition-all hover:border-primary/10">
          <p className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-widest">{t("organizer.dashboard.sellingTicketsStats")}</p>
          <div className="flex-1 w-full flex items-center justify-center">
            <BarChart 
              data={analyticsData?.ticket?.data || []} 
              labels={[
                t("organizer.dashboard.totalTickets"), 
                t("organizer.dashboard.soldTickets"), 
                t("organizer.dashboard.remainingTickets")
              ]} 
            />
          </div>
        </div>

        {/* Events Statistics */}
        <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 flex flex-col min-h-80 transition-all hover:border-primary/10">
          <p className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-widest">{t("organizer.dashboard.eventsStats")}</p>
          <div className="flex-1 w-full flex items-center justify-center">
            <DoughnutChart 
              data={analyticsData?.event?.data || []} 
              labels={[
                t("organizer.dashboard.activeEvents"), 
                t("organizer.dashboard.cancelledEvents"), 
                t("organizer.dashboard.upcomingEvents")
              ]}
            />
          </div>
        </div>

        {/* orders Statistics */}
        <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 flex flex-col min-h-80 md:col-span-2 transition-all hover:border-primary/10">
          <p className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-widest">{t("organizer.dashboard.ordersStats")}</p>
          <div className="flex-1 w-full flex items-center justify-center">
            <BarChart 
              data={analyticsData?.order?.data || []} 
              labels={[
                t("organizer.dashboard.totalOrders"), 
                t("organizer.dashboard.completedOrders"), 
                t("organizer.dashboard.pendingOrders"), 
                t("organizer.dashboard.cancelledOrders")
              ]} 
            />
          </div>
        </div>
      </div>
      {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
      {loading && <Loading />}
    </div>
  );
}
