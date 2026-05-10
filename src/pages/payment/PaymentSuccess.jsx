import { CheckCircle } from "lucide-react";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";

function PaymentSuccessPage() {
  const { t } = useTranslation();
  const navigate = useAppNavigate();

  return (
    <div className="w-full h-screen flex justify-center items-center px-5">
      <Title>{t("payment.success.title")}</Title>
      <div className="max-w-lg  w-full border border-gray-200 rounded-2xl shadow-xl text-center">
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-secandry p-6 rounded-t-2xl">
          <CheckCircle className="mx-auto text-white w-16 h-16 mb-2" />
          <h1 className="text-3xl font-bold text-white">{t("payment.success.title")}</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            {t("payment.success.message")}
          </p>

          <p className="text-sm text-gray-400">
            {t("payment.success.bookedMessage")}
          </p>
          <button
            onClick={() => {
              navigate(`/tickets`);
            }}
            className="w-full bg-linear-to-r from-primary to-secandry text-white py-3 rounded-lg font-semibold mt-4 cursor-pointer hover:opacity-90 transition duration-300 "
          >
            {t("payment.success.viewTickets")}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white border border-primary text-primary py-3 rounded-lg font-semibold mt-4 cursor-pointer hover:bg-primary/10 transition duration-300 "
          >
            {t("payment.backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
