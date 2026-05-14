import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import { MessageCircle } from "lucide-react";
import useAppNavigate from "./Router/useAppNavigate";

function App() {
   const { i18n, t } = useTranslation();
   const navigate = useAppNavigate();

  useEffect(() => {
    // Handle RTL/LTR
    document.documentElement.dir =
      i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    // Handle Dark Mode Initialization
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      <Toaster richColors expand position="top-right" />
      
      {/* Floating Chatbot Icon */}
      <button
        onClick={() => navigate("/help/chatbot")}
        title={t("layout.footer.chatbot")}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full soft-shadow hover:scale-110 hover:brightness-110 transition-all duration-300 cursor-pointer group active:scale-95"
      >
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-12 right-0 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
          {t("layout.footer.chatbot")}
        </span>
      </button>
    </>
  );
}

export default App;

