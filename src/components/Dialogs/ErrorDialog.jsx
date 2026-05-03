import { useTranslation } from "react-i18next";
import Dialog from "../UI/Dialog";

function ErrorDialog({ open, message, onClose }) {
  const {t} = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-red-600">{t("common.actions.error")}</h2>
        <hr  className="text-3xl border-2 border-red-600 bg-red-600 mb-8"/>
      <p className="mb-6 font-medium text-lg text-center">{message}</p>
      <button
        onClick={onClose}
        className="text-white bg-red-600 px-12 py-2 rounded hover:bg-red-700 mx-auto block "
      >
        {t("common.actions.close")}
      </button>
    </Dialog>
  );
}

export default ErrorDialog;
