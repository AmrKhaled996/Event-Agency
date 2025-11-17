import { useState } from "react";
import { validateLogin } from "../utils/FormVaildators";

import { useNavigate } from "react-router-dom";

export function useFormHandler({
  initialValues = {},
  validator,
  onSubmit,
  redirectTo = null,
  redirectFrom = null,
}) {
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
    console.log(e);

    const formData = Object.fromEntries(new FormData(e.target).entries());

    const validationErr = validator(formData);

    setErrors(validationErr);

    if (Object.keys(validationErr).length > 0) return;

    try {
      const response = await onSubmit(formData);
      console.log("Success:", response.data);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      const message =
        error.response?.data?.error + " invalid e-mail or password" ||
        "Something went wrong";
      setDialogMessage(message);
      setShowDialog(true);
    }
  };
  const submitOTP = async (OTP) => {


    const validationErr = validator(OTP);

    setErrors(validationErr);

    if (Object.keys(validationErr).length > 0) return;

    try {
      const response = await onSubmit(OTP);
      console.log("Success:", response.data);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong";
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
    showDialog,
    dialogMessage,
    closeDialog,
  };
}
