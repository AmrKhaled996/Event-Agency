import { Title } from "react-head";
import ProgressBar from "../components/UI/progressBar";
import AuthHeaderSection from "../components/UI/AuthHeaderSection";
import locationOptions from "../utils/LocationOptions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LocationSelection() {
  const [Location, setLocation] = useState("");
  const navigator = useNavigate();
  const submitLocation = (e) => {
    e.preventDefault();
    console.log(Location);
    //sending data to Backend
    navigator("/preference-selection");
  };
  return (
    <>
      <div className=" font-display min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-20 lg:px-20">
        <div className="w-full max-w-4xl bg-white/10  backdrop-blur-lg rounded-xl shadow-lg p-8">
          {/* Progress Section */}
          <ProgressBar step={2} />
          {/* Page title */}
          <Title>Step 2 of 3</Title>
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
          <div className="flex flex-row sm:flex-row gap-3 max-w-120 mx-auto">
            <button
              onClick={submitLocation}
              className={`flex-1 h-12 bg-linear-to-r ${
                Location === ""
                  ? `bg-gray-300 `
                  : `from-primary to-secandry hover:bg-primary/90 cursor-pointer `
              }hover:opacity-90  text-white text-2xl rounded-lg font-bold tracking-wide transition`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocationSelection;
