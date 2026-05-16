import { toast } from "sonner";
import { useState } from "react";
import Dialog from "../UI/Dialog";
import PasswordInput from "../UI/PasswordInput";
import { deleteMyProfile } from "../../APIs/profileAPI";
import { removeTokens } from "../../services/cookieTokenService";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";

export default function DeleteAccountDialog({ open, onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const navigate = useAppNavigate();

  const handleDeleteAccount = async () => {
    
    if (!inputValue) {
      setError(t("confirm.deleteAccount.passwordRequired"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteMyProfile(inputValue);

      removeTokens();

      toast.success(t("confirm.deleteAccount.success"));
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);

      const message =
        error?.response?.data?.message ||
        t("confirm.deleteAccount.error");

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInputValue("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <h3 className="text-xl font-semibold mb-4">{t("confirm.deleteAccount.title")}</h3>

      <p className="mb-4 font-bold text-red-500">
        {t("confirm.deleteAccount.message")}
      </p>

      <PasswordInput
        content={"password"}
        id={"deleteAccountPassword"}
        password={inputValue}
        setPassword={(val) => {
          setInputValue(val);
          setError("");
        }}
        errors={error}
      />

      {error && <small className="text-red-400 m-2 block">{error}</small>}

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={handleClose}
          disabled={loading}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          {t("cancel")}
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={loading || !inputValue}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? t("confirm.deleteAccount.deleting") : t("confirm.deleteAccount.deleteButton")}
        </button>
      </div>
    </Dialog>
  );
}
