import MethodBadge from "../UI/AdminDashboard/MethodBadge";

const Sidebar = ({
  NAV,
  openTopics,
  toggle,
  activeAction,
  setActiveAction,
  t,
}) => {
  return (
    <aside className="w-60 bg-linear-to-l from-primary/80 to-primary border-r border-gray-300 flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b border-gray-300 text-center mx-2">
        <span className="font-mono font-bold  text-white  ">
          {t("appTitle")}
        </span>
      </div>

      <nav className="p-2 flex-1">
        {NAV.map((section) => {
          const isOpen = openTopics.includes(section.id);

          return (
            <div key={section.id} className="mb-1">
              <button
                onClick={() => toggle(section.id)}
                className={`w-full flex items-center gap-2 px-2 py-4 rounded-lg  font-semibold transition ${
                  isOpen
                    ? "bg-secandry border border-[#BB52E033] text-white shadow-sm rounded-b-none"
                    : "text-white hover:bg-gray-900"
                }`}
              >
                <span>{section.icon}</span>
                <span className="flex-1 text-left">{t(section.labelKey)}</span>
                <span
                  className={`text-[9px] ${
                    isOpen ? "text-white rotate-90" : "text-white"
                  }`}
                >
                  ▶
                </span>
              </button>

              {isOpen && (
                <div className="px-2 pt-2 pb-2 rounded-b-sm bg-slate-400 ">
                  {section.actions.map((action) => {
                    const isActive = activeAction === action.id;

                    return (
                      <button
                        key={action.id}
                        onClick={() => setActiveAction(action.id)}
                        className={`w-full flex items-center gap-2 px-2 py-2 mb-1 rounded-md text-left text-xs transition ${
                          isActive
                            ? "bg-gray-900 border border-[#BB52E044]"
                            : "hover:bg-[#0d1117]"
                        }`}
                      >
                        {/* <MethodBadge method={action.method} /> */}
                        <span
                          className={`${
                            isActive ? "text-white font-semibold" : "text-white"
                          }`}
                        >
                          {t(action.labelKey)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-2 border-t border-gray-300 mx-2 text-xs text-gray-300 font-mono">
        {t("sandbox")}
      </div>
    </aside>
  );
};

export default Sidebar;
