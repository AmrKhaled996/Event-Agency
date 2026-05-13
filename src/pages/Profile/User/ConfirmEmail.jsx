import { Title } from "react-head";
import { confirmEmail } from "../../../APIs/profileAPI";
import { useTranslation } from "react-i18next";
import useAppNavigate from "../../../Router/useAppNavigate";
import { refreshToken } from "../../../APIs/authAPIs";
import { refreshAccessToken } from "../../../services/cookieTokenService";
import Loading from "../../../components/Layout/LoadingLayout";
import { useState } from "react";

function ConfirmEmail() {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  const [loading, setLoading] = useState(false);

  // let token = window.location.search.split("=")[1];
  const handleConfirmation = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(window.location.search);

      const token = params.get("token");
      const response = await confirmEmail(token);

      // Refresh token to get the new email in the JWT
      const newToken = await refreshToken();
      await refreshAccessToken(newToken.data);

      navigate("/otp-verification");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <Title>{t("profile.confirmEmail.title")}</Title>
      <div className="bg-green-200 p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">{t("profile.confirmEmail.title")} </h2>
        <p className="mb-6 font-medium text-lg">
          {t("profile.confirmEmail.step")}
        </p>
        <button
          onClick={() => handleConfirmation()}
          className="text-white bg-green-800 px-6 py-3 rounded-lg hover:bg-green-900 font-bold transition-colors cursor-pointer"
        >
          {t("common.actions.confirm")}
        </button>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default ConfirmEmail;

