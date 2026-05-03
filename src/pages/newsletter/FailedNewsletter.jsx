import { useTranslation } from "react-i18next";

function FailedNewsletter() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100">
      <Title>{t("newsletter.failed.title")}</Title>
      <div className="bg-red-200 p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          {" "}
          {t("newsletter.failed.header")}
        </h2>
        <p className="mb-6 font-medium text-lg">
          {t("newsletter.failed.description")}
        </p>
        <a
          href="/"
          className="text-white bg-red-800 px-4 py-2 rounded hover:bg-red-900"
        >
          {t("newsletter.backbutton")}
        </a>
      </div>
    </div>
  );
}

export default FailedNewsletter;
