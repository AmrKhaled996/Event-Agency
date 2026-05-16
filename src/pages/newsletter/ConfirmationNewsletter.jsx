import { useEffect, useState } from "react";
import { Title } from "react-head";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { confirmNewsletterSubscription } from "../../APIs/newsletterAPIs";
import Loading from "../../components/Layout/LoadingLayout";
import useAppNavigate from "../../Router/useAppNavigate";
import { CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "../../components/shadcn/button";

function ConfirmNewsletter() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error, already
  const [message, setMessage] = useState("");
  const navigate = useAppNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage(t("newsletter.errors.noToken", "No confirmation token found."));
      return;
    }

    const performConfirmation = async () => {
      try {
        await confirmNewsletterSubscription(token);
        setStatus("success");
      } catch (err) {
        console.error("[ConfirmNewsletter]", err);
        const errCode = err?.response?.data?.code;
        if (errCode === "ALREADY_SUBSCRIBED") {
          setStatus("already");
        } else {
          setStatus("error");
          setMessage(err?.response?.data?.message || t("newsletter.errors.default", "Failed to confirm subscription."));
        }
      }
    };

    performConfirmation();
  }, [searchParams, t]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-lg font-medium text-gray-600">{t("newsletter.loading", "Confirming your subscription...")}</p>
          </div>
        );

      case "success":
        return (
          <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-3xl shadow-sm text-center flex flex-col items-center max-w-md animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-emerald-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-emerald-900">{t("newsletter.success.header", "Subscription Confirmed!")}</h2>
            <p className="mb-8 text-emerald-700 leading-relaxed">{t("newsletter.success.description", "Thank you for joining our newsletter. You'll now receive our latest updates and exclusive offers.")}</p>
            <Button onClick={() => navigate("/")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl">
              {t("newsletter.backbutton", "Back to Home")}
            </Button>
          </div>
        );

      case "already":
        return (
          <div className="bg-blue-50 border border-blue-100 p-10 rounded-3xl shadow-sm text-center flex flex-col items-center max-w-md animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <HelpCircle className="text-blue-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-blue-900">{t("newsletter.already.header", "Already Subscribed")}</h2>
            <p className="mb-8 text-blue-700 leading-relaxed">{t("newsletter.already.description", "You are already a member of our newsletter community. Thank you for your continued support!")}</p>
            <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl">
              {t("newsletter.backbutton", "Back to Home")}
            </Button>
          </div>
        );

      case "error":
      default:
        return (
          <div className="bg-red-50 border border-red-100 p-10 rounded-3xl shadow-sm text-center flex flex-col items-center max-w-md animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="text-red-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-red-900">{t("newsletter.failed.header", "Confirmation Failed")}</h2>
            <p className="mb-8 text-red-700 leading-relaxed">{message || t("newsletter.failed.description", "The confirmation link is invalid or has expired. Please try subscribing again.")}</p>
            <Button onClick={() => navigate("/")} variant="outline" className="px-8 h-12 rounded-xl border-red-200 text-red-700 hover:bg-red-100">
              {t("newsletter.backbutton", "Back to Home")}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Title>{t("newsletter.success.title", "Newsletter Confirmation")}</Title>
      {renderContent()}
    </div>
  );
}

export default ConfirmNewsletter;