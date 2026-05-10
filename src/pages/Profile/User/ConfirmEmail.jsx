import { Title } from "react-head";
import { confirmEmail } from "../../../APIs/profileAPI";
import { useTranslation } from "react-i18next";

function ConfirmEmail() {
  const { t } = useTranslation();
  let token = window.location.search.split("=")[1];
  const handleConfirmation = async () => {
    try {
      const response = await confirmEmail(token);
      console.log(response);
      window.close();
    } catch (error) {
      console.error(error);
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
        <a
          onClick={() => handleConfirmation()}
          className="text-white bg-green-800 px-4 py-2 rounded hover:bg-green-900"
        >
          {t("common.actions.confirm")}
        </a>
      </div>
    </div>
  );
}

export default ConfirmEmail;

