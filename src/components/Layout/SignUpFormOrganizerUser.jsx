import { useState } from "react";
import FacebookLogo from "../Icons/FacebookLogo";
import GoogleLogo from "../Icons/GoogleLogo";
import EyeTrager from "../Icons/Eyetrager";
import { useTranslation } from "react-i18next";

function SignUpFormOrganizerUser({ submitedData }) {
  const { t } = useTranslation();
  const [showPassword, setshowPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    password: null,
  });

  const handleShowpassword = () => {
    setshowPassword(!showPassword);
  };

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.name = t("auth.signup.organizer.nameRequired") || "Name is required";
    }

    if (!formData.Email.includes("@")) {
      newErrors.email = t("validation.invalidEmail");
    }
    if (!formData.Email.trim()) {
      newErrors.email = t("validation.emailRequired");
    }

    if (!formData.Password.trim()) {
      newErrors.password = t("validation.passwordRequired");
    } else if (formData.Password.trim().length < 6) {
      newErrors.password = t("validation.passwordMin", { length: 6 });
    }
    console.log(newErrors);

    setErrors(newErrors);

    console.log(errors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const submitSignUpForm = (e) => {
    e.preventDefault();
    const userName = document.getElementById("OrganizationName");
    const Email = document.getElementById("Email");
    const Password = document.getElementById("Password");

    const formData = {
      userName: userName.value,
      Email: Email.value,
      Password: Password.value,
    };
    if (validateForm(formData)) {
      submitedData(formData);
    }
    console.log(userName.value, Email.value, Password.value);
  };
  return (
    <>
      {/* Social Login Buttons */}
      <div className="flex space-x-4 mb-6">
        <button className="flex-1 border border-gray-300 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition hover:cursor-pointer">
          <GoogleLogo /> {t("auth.login.google")}
        </button>
        <button className="flex-1 border border-gray-300 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition hover:cursor-pointer text-[#1877F2]">
          <FacebookLogo /> {t("auth.login.facebook")}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center mb-6">
        <hr className="grow border-gray-200" />
        <span className="mx-3 text-gray-400">{t("common.actions.or")}</span>
        <hr className="grow border-gray-200" />
      </div>

      {/* Form */}
      <form className="space-y-4" name="SignUpFormOrganizerUser">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            {t("auth.signup.organizer.nameLabel")}
          </label>
          <input
            type="text"
            placeholder={t("auth.signup.organizer.namePlaceholder")}
            name="OrganizationName"
            id="OrganizationName"
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
            placeholder={t("auth.signup.organizer.emailPlaceholder")}
            name="Email"
            id="Email"
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
              name="Password"
              id="Password"
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
              className="absolute right-6 top-5 text-gray-400 cursor-pointer"
              onClick={handleShowpassword}
            >
              <EyeTrager />
            </span>
          </div>
        </div>

        <button
          type="submit"
          onClick={submitSignUpForm}
          className="w-full py-3 mt-2 rounded-md text-white text-2xl font-semibold bg-linear-to-r from-secandry to-[#FF8370] hover:opacity-90 transition"
        >
          {t("auth.signup.organizer.createAccount")}
        </button>
      </form>
    </>
  );
}

export default SignUpFormOrganizerUser;

