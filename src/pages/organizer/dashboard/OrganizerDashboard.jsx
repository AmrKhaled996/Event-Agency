import { Outlet } from "react-router-dom";
import { Title } from "react-head";
import { useUser } from "../../../Context/AuthProvider";
import { ChartColumn, Info, LucideBookHeart, Plus, Users2 } from "lucide-react";
import UnauthorizedPage from "../../Unauthorized";
import useAppNavigate from "../../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";
import NotificationBell from "../../../components/UI/NotificationBell";

function OrganizerDashboard({ children, page, title }) {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  const { user } = useUser();

  // Defensive check for user
  if (!user || user.role !== "organizer") {
    return <UnauthorizedPage />;
  }

  return (
    <div className="flex  items-center justify-center  p-4 w-screen h-screen  transition-all gap-2  bg-gray-50">
      <Title>{title}</Title>
      <div className="w-full h-full flex gap-4  ">
        {/* side bar */}
        <aside className="w-76  h-full min-h-170 shadow-2xl p-6 bg-linear-to-b from-primary/95 to-primary/90 text-white text-2xl flex align-center rounded-2xl flex-col ">
          <img
            src="/Fa3liatLogo.png"
            alt="Fa3liat logo"
            className="mb-10 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
          <hr className=" text-gray-350 mb-4   " />
          <ul className=" h-full transition-all duration-300">
            <li
              onClick={() => navigate("/organizer/dashboard/overview")}
              className={`flex gap-3 hover:cursor-pointer hover:bg-black/10 p-3 py-4 rounded-xl border-b  border-gray-300/50 transition-all duration-200
          ${page === "overview" ? "bg-black/30 hover:bg-black/30" : ""}
          `}
            >
              <Info className="self-center" /> {t("organizer.dashboard.overview")}
            </li>
            <li
              onClick={() => navigate("/organizer/dashboard/events")}
              className={`flex gap-3 hover:cursor-pointer hover:bg-black/10 p-3 py-4 rounded-xl border-b border-gray-300/50 transition-all duration-200
          ${page === "events" ? "bg-black/30 hover:bg-black/30" : ""}
          `}
            >
              <LucideBookHeart /> {t("organizer.dashboard.myEvents")}
            </li>
            <li
              onClick={() => navigate("/organizer/dashboard/analytics")}
              className={`flex gap-3 hover:cursor-pointer hover:bg-black/10 p-3 py-4 rounded-xl transition-all duration-200 
          ${page === "analytics" ? "bg-black/30 hover:bg-black/30" : ""}
          `}
            >
              <ChartColumn className="self-center" />
              {t("organizer.dashboard.analytics")}
            </li>
          </ul>
          <button
            onClick={() => navigate("/organizer/create-event/basics")}
            className="text-2xl p-4 flex gap-2 hover:bg-blue-950/95 transition duration-300 bg-blue-950 text-white rounded-2xl cursor-pointer"
          >
            <Plus className="self-center" /> {t("organizer.dashboard.createEvent")}
          </button>
        </aside>
        {/* main content */}
        <div className="flex-1 h-full min-h-170 bg-white shadow-2xl rounded-2xl p-8 overflow-scroll overflow-x-auto scroll-m-52 relative">
          <div className="absolute top-8 right-8 z-10 bg-primary rounded-full shadow-lg">
            <NotificationBell />
          </div>
          {children}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;
