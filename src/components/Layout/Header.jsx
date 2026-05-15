import MethodBadge from "../UI/AdminDashboard/MethodBadge";
import NotificationBell from "../UI/NotificationBell";

const Header = ({ currentAction,  t }) => {
  return (
    <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* <MethodBadge method={currentAction?.method || "GET"} /> */}
        <h1 className="font-bold text-2xl text-gray-800">
          {currentAction ? t(currentAction.labelKey) : ""}
        </h1>
        <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full border border-primary/20 bg-primary/5 text-primary tracking-widest uppercase">
          {t("live")}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-1 bg-primary rounded-full shadow-lg shadow-primary/20 transition-transform hover:scale-105">
          <NotificationBell />
        </div>
      </div>
    </div>
  );
};

export default Header;
