import React, { useState } from "react";
import GoogleLogo from "../components/Icons/GoogleLogo";
import FacebookLogo from "../components/Icons/FacebookLogo";
import { Meta, Title } from "react-head";

function LoginPage() {
  const [showPassword, setshowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });
  const handleShowpassword = () => {
    setshowPassword(!showPassword);
  };

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.Email.includes("@")) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.Email.trim()) {
      newErrors.email = "email is requierd";
    }

    if (!formData.Password.trim()) {
      newErrors.password = "password is requierd";
    } else if (formData.Password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    console.log(newErrors);

    setErrors(newErrors);

    console.log(errors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const submitSignUpForm = (e) => {
    e.preventDefault();
    const Email = document.getElementById("Email");
    const Password = document.getElementById("Password");

    const formData = {
      Email: Email.value,
      Password: Password.value,
    };
    if (validateForm(formData)) {
      submitedData(formData);
    }
    console.log(Email.value, Password.value);
  };

  // add navigation back to the home on click "x" button

  // add the authintication for user by fetch (or axios) the backend route and POST the form to it

  //NOTE: can't leave the page until the backend send accept

  return (
    <div className="flex flex-col  min-h-screen font-sans  bg-primary lg:flex-row">
      <Title>Fa3liat | Log in </Title>
       <Meta name="description" content="Login page in Fa3liat Event Agency site" />
      {/* LEFT SIDE */}
      <div
        className="w-full lg:w-[40%]  text-white flex flex-col justify-start gap-2.5 items-center lg:items-start lg:p-10 p-3 "
        style={{
          background: ` linear-gradient(to bottom, #BB52E0 20%, rgba(0,0,0,0.36)) , url('/images/login.jpg')`,
          backgroundSize: `cover`,
        }}
      >
        <img src="/Fa3liatLogo.png" alt="Fa3liat Logo" className="mb-8 w-48" />
        <h1 className="text-4xl font-bold mb-4 text-start leading-snug hidden lg:flex">
          Discover tailored
          <br />
          events.
          <br />
          Sign in for personalized
          <br />
          recommendations
          <br />
          today!
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-[60%] w-full bg-white flex flex-col justify-center px-3 lg:px-10 md:px-6  relative lg:rounded-l-3xl rounded-t-3xl  outline-white outline-10 shadow-[0_-25px_50px_2px] shadow-black ">
        {/* Close Button (optional) */}
        <button className="absolute top-3 right-3 lg:top-6 lg:right-6 text-gray-400 text-4xl hover:text-gray-600 ">
          &times;
        </button>

        <h2 className="text-transparent bg-linear-to-b from-secandry  to-[#FF8370] bg-clip-text md:text-5xl text-4xl font-bold mb-5 mt-5 h-15">
          Login
        </h2>

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
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              E-mail Address
            </label>
            <input
              type="email"
              name="Email"
              id="Email"
              placeholder="Enter your e-mail"
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
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? `text` : `password`}
                placeholder="Enter password"
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
            onClick={submitSignUpForm}
            className="w-full py-3 mt-2 rounded-md text-white font-semibold bg-linear-to-r from-secandry to-[#FF8370] hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-center">
          Don’t have an account? &nbsp;
          <a href="#" className="text-secandry font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
