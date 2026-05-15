import { User, QrCode, Smartphone } from "lucide-react";
import { getStatsOrgainzerDashboard } from "../../../APIs/organizerDashboardAPIs";
import { useEffect, useState } from "react";
import Loading from "../../../components/Layout/LoadingLayout";
import { useTranslation } from "react-i18next";
import { handleError } from "../../../utils/errorHandler";

export default function OrganizerOverviewPage() {
  const { t } = useTranslation();
  const [overviewData, setOverviewData] = useState();
  const [loading, setloading] = useState(false);

  const getData = async () => {
    try {
      setloading(true);
      const response = await getStatsOrgainzerDashboard();
   
      setOverviewData(response.data.data.data);
    } catch (error) {
      handleError(error);
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

        {/* Fa3liat Scanner Promotion */}
        <div className="bg-linear-to-r from-primary to-secandry rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center gap-6 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm shadow-inner">
            <QrCode size={48} />
          </div>
          <div className="flex-1 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="bg-white/20 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold border border-white/10">Official App</span>
              <h3 className="text-2xl font-black italic">Fa3liat Scanner</h3>
            </div>
            <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4">
              Streamline your check-in process! Download our specialized scanner app to validate tickets instantly. (only available for organizers)
              Available now on <strong>App Store</strong> and <strong>Google Play</strong>.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:bg-black/40 transition-colors cursor-pointer">
                <Smartphone size={18} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[9px] uppercase opacity-70">Download on the</span>
                  <span className="text-sm font-bold">App Store</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:bg-black/40 transition-colors cursor-pointer">
                <Smartphone size={18} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[9px] uppercase opacity-70">Get it on</span>
                  <span className="text-sm font-bold">Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
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
      {loading && <Loading />}
    </div>
  );
}
