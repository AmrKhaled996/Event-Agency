import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import OTPVerificationPage from "../pages/OTPVerificationPage";
import PersonlityinfoQ from "../pages/PersonlityinfoQ&A";
import LocationSelection from "../pages/LocationSelectionPage";
import PreferenceSelection from "../pages/PreferenceSelection";
import CompleteResister from "../pages/CompleteRegister";
import HomePage from "../pages/HomePage";
import Onboarding from "../pages/Onbording";

function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route
            path="/onboarding/location-selection"
            element={
              <Onboarding stepNo={2} pageTitle="Location Selection">
                <LocationSelection />
              </Onboarding>
            }
          />
          <Route
            path="/onboarding/preference-selection"
            element={
              <Onboarding stepNo={3} pageTitle="Preference Selection">
                <PreferenceSelection />
              </Onboarding>
            }
          />
          <Route
            path="/onboarding/personality-info"
            element={
              <Onboarding stepNo={1} pageTitle="Personality Information">
                <PersonlityinfoQ />
              </Onboarding>
            }
          />
           

          <Route path="/Completed" element={<CompleteResister />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRouter;
