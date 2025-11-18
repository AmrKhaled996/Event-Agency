import { Title } from "react-head";
import ProgressBar from "../components/UI/progressBar";
import AuthHeaderSection from "../components/UI/AuthHeaderSection";
import locationOptions from "../utils/LocationOptions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonOnBoarding from "../components/UI/ButtonOnBoarding";

function LocationSelection() {
  const [Location, setLocation] = useState("");
  const navigator = useNavigate();
  const submitLocation = (e) => {
    e.preventDefault();
    console.log(Location);
    //sending data to Backend
    navigator("/onboarding/preference-selection");
  };
  return (
    <>
      {/* Header Section */}
      <AuthHeaderSection
        title="Where are you located?"
        content="This helps us personalize your experience and show you relevant content."
      />
      {/* Location Selection */}
      <div className="mb-8 h-fit">
        <h3 className="text-lg font-bold mb-4">Select your location</h3>

        <select
          name="location"
          value={Location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer focus:border-primary focus:ring-primary transition-all"
        >
          <option value="" disabled>
            Choose a location...
          </option>

          {locationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {/* Buttons */}
      <ButtonOnBoarding submit={submitLocation} data={Location} />
    </>
  );
}

export default LocationSelection;
