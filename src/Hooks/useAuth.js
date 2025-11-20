import { useState } from "react";
import { validateLogin } from "../utils/FormVaildators";

import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";
import { setTokens } from "../services/cookieTokenService";

export function useAuth({initialValues = {},validator,onSubmit,redirectTo = null,redirectFrom = null,}) 

  {
  
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const closeDialog = () => setShowDialog(false);

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit");

    const formData = Object.fromEntries(new FormData(e.target).entries());
    console.log("form");

    const validationErr = validator(formData);

    setErrors(validationErr);

    if (Object.keys(validationErr).length > 0) return;

    try {
      console.log("submit");

      const response = await onSubmit(formData);
      console.log("Success:", response.data, response?.data?.accessToken?.token);
      
      setTokens(response.data.data);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      console.log("error",error);


      const message =
        error.response?.data?.data?.error  ||
        "Something went wrong";
      setDialogMessage(message);
      setShowDialog(true);
    }
  };
  const submitOTP = async (otp) => {
    const validationErr = validator(otp);

    setErrors(validationErr);

    if (Object.keys(validationErr).length > 0) return;

    try {
      const response = await onSubmit(otp);
      console.log("Success:", response.data);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong";
      setDialogMessage(message);
      setShowDialog(true);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await onSubmit;
      console.log("OTP Resent:", response.data);
    } catch (error) {
      const message =
        error.response?.data?.data?.error || "Something went wrong resending OTP";
      setDialogMessage(message);
      setShowDialog(true);
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
    showDialog,
    dialogMessage,
    closeDialog,
  };
}
