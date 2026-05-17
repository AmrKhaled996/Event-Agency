import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({ page = 1, total = 0, limit = 10, onChange }) => {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  if (totalPages <= 1 && total <= limit) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5; // Number of buttons to show around current page

    if (totalPages <= showMax + 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis-start");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (page < totalPages - 2) pages.push("ellipsis-end");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 px-2">
      <span className="text-xs text-slate-500 font-medium order-2 sm:order-1">
        {t("pagination.range", {
          from: (page - 1) * limit + 1,
          to: Math.min(page * limit, total),
          total,
        })}
      </span>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "ellipsis-start" || p === "ellipsis-end") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400"
                >
                  <MoreHorizontal size={14} />
                </span>
              );
            }

            return (
              <button
                key={p}
                onClick={() => onChange(p)}
                className={`w-8 h-8 rounded-md text-xs font-bold transition-all duration-200 ${
                  p === page
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label={t("pagination.next")}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;