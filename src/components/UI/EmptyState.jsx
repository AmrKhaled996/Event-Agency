import { LucideInbox } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EmptyState({ 
  title, 
  description, 
  icon: Icon = LucideInbox, 
  action 
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 w-full min-h-80">
      <div className="p-4 bg-white rounded-full shadow-sm mb-6">
        <Icon size={48} className="text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {title || t("common.feedback.noData", "No results found")}
      </h3>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        {description || t("common.feedback.noDataDesc", "We couldn't find anything matching your request.")}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
