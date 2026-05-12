import { useState } from "react";

import { setTokens } from "../services/cookieTokenService";
import { resendOtps, logout } from "../APIs/authAPIs";
import { useUser } from "../Context/AuthProvider";
import useAppNavigate from "../Router/useAppNavigate";
import { useTranslation } from "react-i18next";

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
  const {t}=useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const closeDialog = () => setopenDialog(false);

  const submit = async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target).entries());

    const validationErr = validator(formData,t);

    setErrors(validationErr);

    if (Object.keys(validationErr).length > 0) return;

    try {
      setLoading(true);

      const response = await onSubmit(formData);

      setTokens(response.data.data);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      const message =
        error.response?.data?.data?.error || "Something went wrong";
      console.error("message", message);
      setDialogMessage(message);
      setopenDialog(true);
    } finally {
      setLoading(false);
    }
  };
  const submitOTP = async (otp) => {
    const validationErr = validator(otp,t);

    setErrors(validationErr);

    // if (Object.keys(validationErr).length > 0) return;
    try {
      const response = await onSubmit(otp);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      const message = error.response?.data?.data?.otp || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await resendOtps();
    } catch (error) {
      const message =
        error.response?.data?.data?.error ||
        "Something went wrong resending OTP";
      setDialogMessage(message);
      setopenDialog(true);
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
