import { useState } from "react";
import FacebookLogo from "../Icons/FacebookLogo";
import GoogleLogo from "../Icons/GoogleLogo";
import { redirect } from "react-router-dom";
import { useFormHandler } from "../../Hooks/useFormHandler";
import { validateSignup } from "../../utils/FormVaildators";
import { signup } from "../../services/authService";

function SignUpFormAttendeeUser({ submitedData }) {
  const {
    values,
    handleChange,
    showPassword,
    showDialog,
    closeDialog,
      dialogMessage,
    handleShowPassword,
    errors,
    submit,
  } = useFormHandler({
    initialValues: { Name: "", Email: "", Password: "" },
    validator: validateSignup,
    onSubmit: signup,
    redirectTo: "/otp-verification",
    redirectStatus: "signup",
  });
  // const [showPassword, setshowPassword] = useState(false);
  // const [errors, setErrors] = useState({
  //   name: null,
  //   email: null,
  //   password: null,
  // });
  // const handleShowpassword = () => {
  //   setshowPassword(!showPassword);
  // };

  // const validateForm = (formData) => {
  //   const newErrors = {};

  //   if (!formData.userName.trim()) {
  //     newErrors.Name = "Name is required";
  //   }

  //   if (!formData.Email.includes("@")) {
  //     newErrors.Email = "Invalid email format";
  //   }
  //   if (!formData.Email.trim()) {
  //     newErrors.Email = "email is requierd";
  //   }

  //   if (!formData.Password.trim()) {
  //     newErrors.Password = "password is requierd";
  //   } else if (formData.Password.trim().length < 6) {
  //     newErrors.Password = "Password must be at least 6 characters";
  //   }
  //   console.log(newErrors);

  //   setErrors(newErrors);

  //   console.log(errors);
  //   return Object.keys(newErrors).length === 0; // true if no errors
  // };

  // const submitSignUpForm = (e) => {
  //   e.preventDefault();
  //   const userName = document.getElementById("Name");
  //   const Email = document.getElementById("Email");
  //   const Password = document.getElementById("Password");

  //   const formData = {
  //     userName: userName.value,
  //     Email: Email.value,
  //     Password: Password.value,
  //   };
  //   if (validateForm(formData)) {
  //     submitedData(formData);
  //   }
  //   console.log(userName.value, Email.value, Password.value);
  // };
  return (
    <>
      {/* Social Login Buttons */}
      <div className="flex space-x-4 mb-6">
        <button className="flex-1 border border-gray-300 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition hover:cursor-pointer">
          <GoogleLogo /> Login with Google
        </button>
        <button className="flex-1 border border-gray-300 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition hover:cursor-pointer text-[#1877F2]">
          <FacebookLogo /> Login with Facebook
        </button>
      </div>

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
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your Name"
            name="Name"
            id="Name"
            value={values.Name || ""}
            onChange={handleChange}
            autoComplete="name"
            className={`w-full h-15 border  ${
              errors.Name ? "border-red-600" : "border-gray-300"
            }  rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.Name && (
            <small className={`text-red-600 ml-5 `}>
              {errors.Name} <b>*</b>
            </small>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            E-mail Address
          </label>
          <input
            type="email"
            placeholder="Enter your e-mail"
            name="Email"
            id="Email"
            value={values.Email || ""}
            onChange={handleChange}
            autoComplete="email"
            className={`w-full h-15 border  ${
              errors.Email ? "border-red-600" : "border-gray-300"
            }  rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-2`}
          />
          {errors.Email && (
            <small className={`text-red-600 ml-5 `}>
              {errors.Email} <b>*</b>
            </small>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? `text` : `password`}
              placeholder="Enter password"
              name="Password"
              id="Password"
              value={values.Password || ""}
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full h-15 border ${
                errors.Password ? "border-red-600" : "border-gray-300"
              } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.Password && (
              <small className={`text-red-600 ml-5 `}>
                {errors.Password} <b>*</b>
              </small>
            )}
            <span
              className="absolute right-6 top-5 text-gray-400 cursor-pointer"
              onClick={handleShowPassword}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 32 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 22C22.0751 22 28 19 32 11C28 3 22.0751 0 16 0C9.92487 0 4 3 0 11C4 19 9.92487 22 16 22ZM16 18C19.866 18 23 14.866 23 11C23 7.13401 19.866 4 16 4C12.134 4 9 7.13401 9 11C9 14.866 12.134 18 16 18Z"
                  fill="#A4A4A4"
                />
                <path
                  d="M19 11C19 12.6569 17.6569 14 16 14C14.3431 14 13 12.6569 13 11C13 9.34315 14.3431 8 16 8C17.6569 8 19 9.34315 19 11Z"
                  fill="#A4A4A4"
                />
              </svg>
            </span>
          </div>
        </div>

        <button
          type="submit"

          className="w-full py-3 mt-2 rounded-md text-white text-2xl font-semibold bg-linear-to-r from-secandry to-[#FF8370] hover:opacity-90 transition"
        >
          Create account
        </button>
      </form>
      {showDialog && (
        <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-50">
          <div className="bg-white  rounded-lg shadow-lg p-6 w-120 h-50 max-w-sm flex flex-col justify-center items-center ">
            <p className="text-gray-800 text-xl">
              {dialogMessage}
            </p>

            <button
              onClick={closeDialog}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition mt-10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUpFormAttendeeUser;
