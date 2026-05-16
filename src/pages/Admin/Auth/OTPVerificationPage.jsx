import { useState, useEffect, useRef } from "react";
import { Title } from "react-head";

import { useAuth } from "../../../Hooks/useAuth";
import { validateOTP } from "../../../utils/FormVaildators";
import OTPInput from "../../../components/UI/OTPInput";
import { verify, resendOtps } from "../../../APIs/authAPIs";
import Loading from "../../../components/Layout/LoadingLayout";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import { useTranslation } from "react-i18next";
import { removeTokens } from "../../../services/cookieTokenService";
import useAppNavigate from "../../../Router/useAppNavigate";
import { toast } from "sonner";
import { mapApiError } from "../../../utils/apiErrorMapper";

function OTPVerificationPageAdmin() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const {t} = useTranslation();
  const navigate = useAppNavigate();

  const {
    submitOTP,
    loading,
  } = useAuth({
    initialValues: { otp: "" },
    validator: validateOTP,
    onSubmit: verify,
    redirectTo: "/admin",
    redirectFrom: "/otp-verification",
    openDialog,
    dialogMessage,
    setDialogMessage,
    setopenDialog,
  });

  const handleSignOut = () => {
    removeTokens();
    navigate("/admin/login");
  };

  // Use absolute timestamp to survive browser tab throttling/inactivity and page refreshes
  const [expiryTime, setExpiryTime] = useState(() => {
    const saved = localStorage.getItem("admin_otp_expiry");
    if (saved) {
      const ts = parseInt(saved, 10);
      if (ts > Date.now()) return ts;
    }
    const newExpiry = Date.now() + 600 * 1000;
    localStorage.setItem("admin_otp_expiry", newExpiry.toString());
    return newExpiry;
  });
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, Math.round((expiryTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        localStorage.removeItem("admin_otp_expiry");
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [expiryTime]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const handleChange = (value, index) => {
  
    const newValue = value.replace(/[^0-9A-Z]/g, "");
    if (!newValue) return;

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    if (index < 5) inputsRef.current[index + 1]?.focus();
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
    submitOTP(otpCode).then(() => {
      localStorage.removeItem("admin_otp_expiry");
    });
  };

  const resendHandler = async (e) => {
    e.preventDefault();
    try {
      await resendOtps();
      const newExpiry = Date.now() + 600 * 1000;
      setExpiryTime(newExpiry);
      localStorage.setItem("admin_otp_expiry", newExpiry.toString());
      toast.success(t("auth.otp.resentSuccess"));
    } catch (error) {
      console.log(error)
      const message = mapApiError(error);
      setDialogMessage(message);
      setopenDialog(true);
    }
  };

  return (
    <div className=" font-display min-h-screen flex flex-col items-center justify-center  sm:px-8 md:px-20 lg:px-20 relative">
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 lg:top-8 lg:right-10 text-gray-500 hover:text-gray-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
      >
        <span className="text-xl">&times;</span> {t("auth.otp.signOut")}
      </button>
      <Title>{t("auth.otp.title")}</Title>
      <div className="w-full max-w-4xl bg-white/10  backdrop-blur-lg rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-3">{t("auth.otp.header")}</h1>
        <p className="mb-5">
          {t("auth.otp.instruction")}
        </p>

        {/* OTP inouts */}
        <OTPInput
          otp={otp}
          inputsRef={inputsRef}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
        />

        {/* Timer */}
        <div className={`flex text-3xl font-bold mb-6 flex-row-reverse`}>
          {(minutes + ":" + seconds)}
        </div>

        {/* Resend */}
        <p className=" mb-8">
          {t("auth.otp.notReceived")}{" "}
          <button
            onClick={resendHandler}
            className="text-pink-500 hover:underline font-semibold cursor-pointer"
          >
            {t("auth.otp.resend")}
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
          {t("auth.otp.verify")}
        </button>
      </div>
      {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
      {loading && <Loading />}
    </div>
  );
}

export default OTPVerificationPageAdmin;
