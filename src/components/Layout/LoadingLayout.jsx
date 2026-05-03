import { useTranslation } from "react-i18next";

function Loading() {
  const {t}=useTranslation();
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100  flex-col  gap-4">
      
        <div className="h-12 w-12 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
        <p className="text-white text-lg font-semibold">{t("common.actions.loading")}</p>
      
    </div>
  );
}

export default Loading;
