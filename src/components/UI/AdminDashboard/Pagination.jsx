import { useTranslation } from "react-i18next";

const Pagination = ({ page, total, limit, onChange }) => {
  const { t } = useTranslation();
  const pages = Math.ceil((total+1) / limit);

  return (
    <div className="flex  items-center justify-between mt-3 gap-3">
      <span className="text-[11px] text-gray-500">
        {t("pagination.range", {
          from: (page - 1) * limit + 1,
          to: Math.min(page * limit, total)+" ",
          total,
        })}
      </span>

      <div className="flex gap-1">
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-7 h-7 rounded-md text-xs font-semibold transition ${
              p === page
                ? "bg-linear-to-br from-primary to-secandry text-white"
                : "bg-gray-900 text-gray-500"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;