import { Title } from "react-head";
import { useTranslation } from "react-i18next";

function AlreadySubscribedNewsletter() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <Title>{t("newsletter.already.title")}</Title>
      <div className="bg-blue-200 p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          {" "}
          {t("newsletter.already.header")}
        </h2>
        <p className="mb-6 font-medium text-lg">
          {" "}
          {t("newsletter.already.description")}
        </p>
        <a
          href="/"
          className="text-white bg-blue-800 px-4 py-2 rounded hover:bg-blue-900"
        >
          {t("newsletter.backbutton")}
        </a>
      </div>
    </div>
  );
}

export default AlreadySubscribedNewsletter;
