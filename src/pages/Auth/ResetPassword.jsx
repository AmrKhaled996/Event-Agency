import { Mail, XCircle } from "lucide-react";
import { useState } from "react";
import { validateResetPassword } from "../../utils/FormVaildators";
import PasswordInput from "../../components/UI/PasswordInput";
import { resetPassword } from "../../APIs/authAPIs";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import Loading from "../../components/Layout/LoadingLayout";
import useAppNavigate from "../../Router/useAppNavigate";
import { Title } from "react-head";
import { useTranslation } from "react-i18next";

function ResetPassword() {
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigator = useAppNavigate();
  const { t } = useTranslation();

  const urlPrams = new URLSearchParams(window.location.search);
  const email = urlPrams.get("email");
  const token = urlPrams.get("token");

  const submitResetForm = async (e) => {
    e.preventDefault();

    if (!email || !token) {
      setDialogMessage("Invalid reset link. Please request a new one.");
      setopenDialog(true);
      return;
    }

    const values = { password, confirmPassword };
    const validationErrors = validateResetPassword(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setDialogMessage(
        validationErrors.password || validationErrors.confirmPassword,
      );

      setopenDialog(true);
      return;
    }

    try {
      setLoading(true);
      await resetPassword(values.password, email, token);
      navigator("/login");
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <Title>{t("resetPassword.title")}</Title>
      <div>
        <img
          src={import.meta.env.BASE_URL + "Fa3liatLogo.png"}
          alt="fa3liat Logo"
          className="w-fit h-30 absolute top-2 left-10 drop-shadow-black  drop-shadow-lg"
        />
      </div>
      <div className="w-full max-w-md bg-white border-gray-200 rounded-xl shadow-lg p-8">
        <h1 className="text-slate-900 text-3xl font-bold leading-tight pb-3 text-center">
          {t("Reset your Password")}
        </h1>
        <p className="text-gray-600 text-base font-normal leading-normal pb-6 text-center">
          {}
        </p>

        <form onSubmit={submitResetForm} className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-4">
            <PasswordInput
              content={"New Password"}
              id="password"
              password={password}
              setPassword={setPassword}
              errors={errors.password}
              placeholder={t("auth.signup.passwordPlaceholder")}
            />
            <PasswordInput
              content={
                 "Confirm Password"
              }
              id="confirmPassword"
              password={confirmPassword}
              setPassword={setConfirmPassword}
              errors={errors.confirmPassword}
            />
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full cursor-pointer rounded-lg h-12 px-5 bg-primary text-white font-bold hover:bg-primary/90 focus:ring-2 ${loading ? "opacity-50" : ""}`}
            >
              <span className="">{t("Reset Password")}</span>
            </button>
          </div>
        </form>
      </div>
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </div>
  );
}

export default ResetPassword;
