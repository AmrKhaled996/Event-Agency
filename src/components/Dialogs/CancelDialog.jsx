import { useTranslation } from "react-i18next";
import Dialog from "../UI/Dialog";

export default function CancelDialog({ open, onClose, onConfirm }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Confirm Cancelation</h3>
      <p className="text-gray-600 mb-4">
        Are you sure you want to Cancel this event?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          {t("common.actions.cancel")}
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      </div>
    </Dialog>
  );
}
