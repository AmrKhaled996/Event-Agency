import { useState, useEffect, useRef } from "react";
import { Title } from "react-head";
import { useNavigate } from "react-router-dom";
import { useFormHandler } from "../Hooks/useFormHandler";
import { validateOTP } from "../utils/FormVaildators";

function OTPVerificationPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(300);
  const inputsRef = useRef([]);

  const { submitOTP, errors, showDialog, dialogMessage, closeDialog } =
    useFormHandler({
      initialValues: { otp: "" },
      validator: validateOTP,
      onSubmit: (otp) => verify(otp), // axios call
      redirectTo: "/personality-info",
      redirectFrom: "/otp-verification",
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, 0);
  const seconds = (timeLeft % 60).toString().padStart(2, 0);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9|A-Z]/g, ""); // for both numbers and capital only
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    submitOTP({ otp: otpCode });
  };
  const resendHandler = (e) => {
    e.preventDefault();

    // use axios with backend to resend the OTP code
  };

  return (
    <div className=" font-display min-h-screen flex flex-col items-center justify-center  sm:px-8 md:px-20 lg:px-20">
      <Title>Verify Account </Title>
      <div className="w-full max-w-4xl bg-white/10  backdrop-blur-lg rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-3">Verify Your Account</h1>
        <p className="mb-5">
          We’ve sent a one-time password to your email. Please enter it below to
          continue.
        </p>

        {/* OTP inouts */}
        <div className="flex justify-center gap-3 mb-10 transition duration-500">
          {otp.map((data, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={data}
              ref={(box) => (inputsRef.current[i] = box)}
              onChange={(e) => handleChange(e.target, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-10 h-10 sm:w-16 sm:h-16 lg:text-2xl text-center  rounded-md border border-primary bg-purple-100 focus:outline-none focus:ring-2 focus:ring-primary transition duration-500"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-3xl font-bold mb-6">
          {minutes} : {seconds}
        </div>

        {/* Resend */}
        <p className=" mb-8">
          Didn’t receive the code?{" "}
          <button
            onClick={resendHandler}
            className="text-pink-500 hover:underline font-semibold cursor-pointer"
          >
            Resend OTP
          </button>
        </p>

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          className={`w-full max-w-120 py-3 text-lg font-bold text-white rounded-lg
            ${
              otp.join("").length < 6
                ? "bg-gray-300"
                : "bg-linear-to-r from-primary to-secandry hover:opacity-90"
            } transition cursor-pointer`}
          disabled={otp.join("").length < 6}
        >
          Verify
        </button>
        {showDialog && (
          <div className="mt-4 text-red-600 font-bold">{dialogMessage}</div>
        )}
      </div>
    </div>
  );
}

export default OTPVerificationPage;
