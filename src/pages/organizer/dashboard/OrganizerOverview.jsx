import { User } from "lucide-react";
import { getStatsOrgainzerDashboard } from "../../../APIs/organizerDashboardAPIs";
import { useEffect, useState } from "react";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import Loading from "../../../components/Layout/LoadingLayout";
import { useTranslation } from "react-i18next";

export default function OrganizerOverviewPage() {
  const { t } = useTranslation();
  const [overviewData, setOverviewData] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setloading] = useState(false);

  const getData = async () => {
    try {
      setloading(true);
      const response = await getStatsOrgainzerDashboard();
   
      setOverviewData(response.data.data.data);
    } catch (error) {
      const message =
        error.response?.data?.data[0]?.message || t("common.feedback.error");
        console.error(error.response?.data?.data[0]?.message)
      setDialogMessage(message);
      setopenDialog(true);
    }
    finally {
      setloading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold mb-6">{t("organizer.dashboard.overview")}</h2>
        
        {/* Events Group */}
        <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 px-1">{t("organizer.dashboard.eventsStats")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100 transition-all hover:border-primary/20">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{t("organizer.dashboard.totalEvents")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.event?.totalEvents || 0}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100 transition-all hover:border-emerald-100">
            <p className="text-xs font-semibold text-emerald-500 uppercase mb-2">{t("organizer.dashboard.activeEvents")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.event?.activeEvents || 0}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100 transition-all hover:border-blue-100">
            <p className="text-xs font-semibold text-blue-500 uppercase mb-2">{t("organizer.dashboard.upcomingEvents")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.event?.upcomingEvents || 0}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100 transition-all hover:border-amber-100">
            <p className="text-xs font-semibold text-amber-500 uppercase mb-2">{t("organizer.dashboard.endedEvents")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.event?.endedEvents || 0}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100 transition-all hover:border-rose-100">
            <p className="text-xs font-semibold text-rose-500 uppercase mb-2">{t("organizer.dashboard.cancelledEvents")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.event?.cancelledEvents || 0}</h3>
          </div>
        </div>

        {/* Financials & Tickets Group */}
        <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 px-1">{t("organizer.dashboard.sellingTicketsStats")}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="md:col-span-2 bg-linear-to-br from-primary/5 to-secandry/5 p-6 rounded-2xl border border-primary/10 soft-shadow flex flex-col justify-center items-center text-center">
            <p className="text-sm font-bold text-primary uppercase mb-2 tracking-widest">{t("organizer.dashboard.revenue")}</p>
            <h3 className="text-4xl font-black text-gray-900 drop-shadow-sm">
              {overviewData?.revenue?.totalRevenue || 0} <span className="text-lg font-medium text-gray-500">{t("common.actions.currncy")}</span>
            </h3>
          </div>
          <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-50 flex flex-col justify-center items-center text-center">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t("organizer.dashboard.totalTickets")}</p>
            <h3 className="text-3xl font-black text-gray-800">{overviewData?.ticket?.totalTickets || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-50 flex flex-col justify-center items-center text-center">
            <p className="text-xs font-bold text-emerald-500 uppercase mb-2">{t("organizer.dashboard.sold")}</p>
            <h3 className="text-3xl font-black text-gray-800">{overviewData?.ticket?.soldTickets || 0}</h3>
          </div>
        </div>

        {/* Orders & Inventory Group */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{t("organizer.dashboard.remainingTickets")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.ticket?.remainingTickets || 0}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{t("organizer.dashboard.totalOrders")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.order?.totalOrders || 0}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100">
            <p className="text-xs font-semibold text-emerald-500 uppercase mb-2">{t("organizer.dashboard.completedOrders")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.order?.completedOrders || 0}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl soft-shadow border border-gray-100">
            <p className="text-xs font-semibold text-amber-500 uppercase mb-2">{t("organizer.dashboard.pendingOrders")}</p>
            <h3 className="text-2xl font-black text-gray-800">{overviewData?.order?.pendingOrders || 0}</h3>
          </div>
        </div>
      </div>
      {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
      {loading && <Loading />}
    </div>
  );
}
