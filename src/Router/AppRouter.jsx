import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import OTPVerificationPage from "../pages/OTPVerificationPage";
import PersonlityinfoQ from "../pages/PersonlityinfoQ&A";
import LocationSelection from "../pages/LocationSelectionPage";
import PreferenceSelection from "../pages/PreferenceSelection";
import CompleteResister from "../pages/CompleteRegister";
import HomePage from "../pages/HomePage";

function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route path="/personality-info" element={<PersonlityinfoQ />} />
          <Route path="/location-selection" element={<LocationSelection />} />
          <Route
            path="/preference-selection"
            element={<PreferenceSelection />}
          />
          <Route path="/Completed" element={<CompleteResister />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRouter;
