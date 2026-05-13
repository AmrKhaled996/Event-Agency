import { useState } from "react";
import FacebookLogo from "../../../components/Icons/FacebookLogo";
import GoogleLogo from "../../../components/Icons/GoogleLogo";
import {  useParams } from "react-router-dom";
import { useAuth } from "../../../Hooks/useAuth";
import { validateSignup } from "../../../utils/FormVaildators";
import EyeTrager from "../../../components/Icons/Eyetrager";
import Loading from "../../../components/Layout/LoadingLayout";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import { useTranslation } from "react-i18next";
import { adminDashboardauth } from "../../../APIs/adminDashboardApis";

function SignUpFormAttendeeUser() {
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const {t}=useTranslation();
  const {lang}=useParams();
  const {
    values,
    handleChange,
    showPassword,
    // showDialog,
    // closeDialog,
    // dialogMessage,
    handleShowPassword,
    errors,
    submit,
    loading,
    
  } = useAuth({
    initialValues: { name: "", email: "", password: "" },
    validator: validateSignup,
    onSubmit: adminDashboardauth.signup,
    inAdmin:true,
    redirectFrom: "signup",
    redirectTo: "/admin",
    openDialog,
    dialogMessage,
    setDialogMessage,
    setopenDialog,
  });


  return (
    <>
      {/* Social Login Buttons */}
      {/* <div className="flex space-x-4 mb-6">
        <button
          onClick={handleGoogleAuth}
          className="flex-1 border border-gray-300 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition hover:cursor-pointer"
        >
          <GoogleLogo /> {t("auth.signup.google")}
        </button>
        <button className="flex-1 border border-gray-300 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition hover:cursor-pointer text-[#1877F2]">
          <FacebookLogo /> {t("auth.signup.facebook")}
        </button>
      </div> */}

      {/* Divider */}
      <div className="flex items-center mb-6">
        <hr className="grow border-gray-200" />
        <span className="mx-3 text-gray-400">OR</span>
        <hr className="grow border-gray-200" />
      </div>

      {/* Form */}
      <form
        className="space-y-4"
        name="SignUpFormAttendeeUser"
        onSubmit={submit}
      >
        <div>
          <label className="block text-gray-700 font-semibold mb-1">{t("auth.signup.nameLabel")}</label>
          <input
            type="text"
            placeholder={t("auth.signup.namePlaceholder")}
            name="name"
            id="name"
            value={values.name || ""}
            onChange={handleChange}
            autoComplete="name"
            className={`w-full h-15 border  ${
              errors.name ? "border-red-600" : "border-gray-300"
            }  rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.name && (
            <small className={`text-red-600 ml-5 `}>
              {errors.name} <b>*</b>
            </small>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            {t("auth.signup.emailLabel")}
          </label>
          <input
            type="email"
            placeholder={t("auth.signup.emailPlaceholder")}
            name="email"
            id="email"
            value={values.email || ""}
            onChange={handleChange}
            autoComplete="email"
            className={`w-full h-15 border  ${
              errors.email ? "border-red-600" : "border-gray-300"
            }  rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-2`}
          />
          {errors.email && (
            <small className={`text-red-600 ml-5 `}>
              {errors.email} <b>*</b>
            </small>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            {t("auth.signup.passwordLabel")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? `text` : `password`}
              placeholder={t("auth.signup.passwordPlaceholder")}
              name="password"
              id="password"
              value={values.password || ""}
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full h-15 border ${
                errors.password ? "border-red-600" : "border-gray-300"
              } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.password && (
              <small className={`text-red-600 ml-5 `}>
                {errors.password} <b>*</b>
              </small>
            )}
            <span
              className={`absolute ${lang === "en" ? "right-6" : "left-6"} top-5 text-gray-400 cursor-pointer`}
              onClick={handleShowPassword}
            >
              <EyeTrager />
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-2 rounded-md text-white text-2xl font-semibold bg-linear-to-r from-secandry to-[#FF8370] hover:opacity-90 transition"
        >
          {t("auth.signup.createAccount")}
        </button>
      </form>
      {/* {showDialog && (
        <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-50">
          <div className="bg-white  rounded-lg shadow-lg p-6 w-120 h-50 max-w-sm flex flex-col justify-center items-center ">
            <p className="text-gray-800 text-xl">{dialogMessage}</p>

            <button
              onClick={closeDialog}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition mt-10"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </>
  );
}

export default SignUpFormAttendeeUser;
