import { ShieldAlert } from "lucide-react";
import useAppNavigate from "../../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";

export default function AdminPendingApprovalPage() {
  const navigate = useAppNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
          <ShieldAlert size={30} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          {t("auth.adminPending.title")}
        </h1>
        <p className="text-slate-600 text-lg leading-8 mb-8">
          {t("auth.adminPending.message")}
        </p>
        <button
          onClick={() => navigate("/admin/login")}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
        >
          {t("auth.login.login")}
        </button>
      </div>
    </div>
  );
}
