import { useState } from "react";

import { setTokens } from "../services/cookieTokenService";
import { resendOtps, logout } from "../APIs/authAPIs";
import { useUser } from "../Context/AuthProvider";
import useAppNavigate from "../Router/useAppNavigate";
import { useTranslation } from "react-i18next";
import { handleError } from "../utils/errorHandler";

export function useAuth({
  initialValues = {},
  validator,
  onSubmit,
  redirectTo = null,
  redirectFrom = null,
  openDialog = false,
  dialogMessage,
  setDialogMessage,
  setopenDialog,
}) {
  const { user, setUser } = useUser();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // const [openDialog, setopenDialog] = useState(false);
  // const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useAppNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const closeDialog = () => setopenDialog(false);

  const submit = async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target).entries());

    const validationErr = validator(formData, t);

    setErrors(validationErr);

    if (Object.keys(validationErr).length > 0) return;

    try {
      setLoading(true);

      // Pass _silentError: true to prevent global interceptor toast
      const response = await onSubmit(formData, { _silentError: true });

      setTokens(response.data.data);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      // Use global handler but siliently (no toast) to use the dialog instead
      const message = handleError(error, { 
        silent: true,
        onMapped: (msg) => {
          setDialogMessage(msg);
          setopenDialog(true);
        }
      });
      console.error("Auth submit error:", message);
    } finally {
      setLoading(false);
    }
  };
  const submitOTP = async (otp) => {
    const validationErr = validator(otp, t);

    setErrors(validationErr);

    // if (Object.keys(validationErr).length > 0) return;
    try {
      const response = await onSubmit(otp, { _silentError: true });

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      handleError(error, { 
        silent: true,
        onMapped: (msg) => {
          setDialogMessage(msg);
          setopenDialog(true);
        }
      });
    }
  };

  const resendOtp = async () => {
    try {
      await resendOtps({ _silentError: true });
    } catch (error) {
      handleError(error, { 
        silent: true,
        onMapped: (msg) => {
          setDialogMessage(msg);
          setopenDialog(true);
        }
      });
    }
  };

  return {
    values,
    handleChange,
    showPassword,
    handleShowPassword,
    errors,
    submit,
    submitOTP,
    resendOtp,
    openDialog,
    dialogMessage,
    closeDialog,
    loading,
    setLoading,
  };
}
