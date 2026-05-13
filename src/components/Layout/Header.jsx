import MethodBadge from "../UI/AdminDashboard/MethodBadge";

const Header = ({ currentAction,  t }) => {
  return (
    <div className="mb-6 pb-4 border-b border-gray-800 ">
      <div className="flex items-center gap-2">

        {/* <MethodBadge method={currentAction?.method || "GET"} /> */}
        <h1 className=" font-bold text-xl ">
          {currentAction ? t(currentAction.labelKey) : ""}
        </h1>
        <span className="ml-auto px-2 py-1 text-[9px] font-bold rounded-full border border-[#BB52E044] bg-primary/5 text-primary font-mono">
          {t("live")}
        </span>
      </div>
    </div>
  );
};

export default Header;
