import { Title } from "react-head";
import ProgressBar from "../../components/UI/progressBar";
import AuthHeaderSection from "../../components/UI/AuthHeaderSection";
import {
  locationOptions,
  locationOptionsAr,
} from "../../utils/LocationOptions";
import { useState } from "react";
import ButtonOnBoarding from "../../components/UI/ButtonOnBoarding";
import { location } from "../../APIs/onboardingAPIs";
import Loading from "../../components/Layout/LoadingLayout";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

function LocationSelection() {
  const [Location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigator = useAppNavigate();
  const submitLocation = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await location({ governorate: Location });

      navigator("/onboarding/preference-selection");
    } catch (error) {
      console.error("error", error);

      const message = error.response?.data?.message || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Header Section */}
      <AuthHeaderSection
        title={t("onboarding.locationSelection.header")}
        content={t("onboarding.locationSelection.description")}
      />
      {/* Location Selection */}
      <div className="mb-8 h-fit">
        <h3 className="text-lg font-bold mb-4">
          {t("onboarding.locationSelection.selectLabel")}
        </h3>

        <select
          name="location"
          value={Location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer focus:border-primary focus:ring-primary transition-all"
        >
          <option value="" disabled>
            {t("onboarding.locationSelection.selectPlaceholder")}
          </option>

          {(lang === "ar" ? locationOptionsAr : locationOptions).map(
            (option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ),
          )}
        </select>
      </div>
      {/* Buttons */}
      <ButtonOnBoarding submit={submitLocation} data={Location} />

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

export default LocationSelection;
