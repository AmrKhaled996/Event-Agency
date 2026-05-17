import { useState, useEffect, useRef } from "react";
import { Title } from "react-head";

import { useUser } from "../../../Context/AuthProvider";
import OTPInput from "../../../components/UI/OTPInput";
import Loading from "../../../components/Layout/LoadingLayout";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import { useTranslation } from "react-i18next";
import { verifyOrganizer, resendOtpsOrganizer } from "../../../APIs/userAPIs";
import { refreshToken as refreshTokenAPI } from "../../../APIs/authAPIs";
import { refreshAccessToken, getAccessToken } from "../../../services/cookieTokenService";
import { handleError } from "../../../utils/errorHandler";
import { jwtDecode } from "jwt-decode";
import useAppNavigate from "../../../Router/useAppNavigate";

function OTPVerificationPageOrganizer() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const navigate = useAppNavigate();

  // Use absolute timestamp to survive browser tab throttling/inactivity and page refreshes
  const [expiryTime, setExpiryTime] = useState(() => {
    const saved = localStorage.getItem("otp_expiry_organizer");
    if (saved) {
      const ts = parseInt(saved, 10);
      if (ts > Date.now()) return ts;
    }
    const newExpiry = Date.now() + 600 * 1000;
    localStorage.setItem("otp_expiry_organizer", newExpiry.toString());
    return newExpiry;
  });
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, Math.round((expiryTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        localStorage.removeItem("otp_expiry_organizer");
      }
    };

    updateTimer(); // Immediately sync on mount
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) return;

    try {
      setLoading(true);

      // Step 1: Verify the OTP with the backend
      await verifyOrganizer(otpCode, { _silentError: true });

      // Step 2: Refresh the JWT token — this will now reflect role: "organizer"
      const tokenResponse = await refreshTokenAPI();
      await refreshAccessToken(tokenResponse.data);

      // Step 3: Decode the new token and update the user context
      const newAccessToken = getAccessToken();
      if (newAccessToken) {
        const decoded = jwtDecode(newAccessToken);
        // updateUser also does a refresh internally, so just set state directly
        // by decoding the freshly set token
        await updateUser(decoded);
      }

      // Step 4: Clean up OTP timer and navigate to organizer dashboard
      localStorage.removeItem("otp_expiry_organizer");
      navigate("/organizer/dashboard/overview");
    } catch (error) {
      handleError(error, {
        silent: true,
        onMapped: (msg) => {
          setDialogMessage(msg);
          setOpenDialog(true);
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      await resendOtpsOrganizer({ _silentError: true });
      const newExpiry = Date.now() + 600 * 1000;
      setExpiryTime(newExpiry);
      localStorage.setItem("otp_expiry_organizer", newExpiry.toString());
    } catch (error) {
      handleError(error, {
        silent: true,
        onMapped: (msg) => {
          setDialogMessage(msg);
          setOpenDialog(true);
        },
      });
    }
  };

  return (
    <div className=" font-display min-h-screen flex flex-col items-center justify-center  sm:px-8 md:px-20 lg:px-20">
      <Title>{t("auth.otp.title")}</Title>
      <div className="w-full max-w-4xl bg-white/10  backdrop-blur-lg rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-3">{t("auth.otp.title")}</h1>
        <p className="mb-5">
          {t("auth.otp.instruction")}
        </p>

        {/* OTP inputs */}
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
            onClick={handleResend}
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
          disabled={otp.join("").length < 6 || loading}
        >
          {t("auth.otp.verify")}
        </button>
      </div>
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setOpenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </div>
  );
}

export default OTPVerificationPageOrganizer;
