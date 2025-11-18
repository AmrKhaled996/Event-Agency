import { useState } from "react";
import FemaleIcon from "../components/Icons/Female";
import MaleIcon from "../components/Icons/male";
import { Title } from "react-head";
import CustomDateInput from "../components/UI/CustemDateInput";
import AuthHeaderSection from "../components/UI/AuthHeaderSection";
import ProgressBar from "../components/UI/progressBar";
import genderRadio from "../utils/genderRadio";
import { useNavigate } from "react-router-dom";

function PersonlityinfoQ() {
  const [Gender, setGender] = useState();
  const [date, setDate] = useState();
  const navigator = useNavigate();
  const submitInfo = (e) => {
    e.preventDefault();
    const formattedDate =
      date instanceof Date ? date.toISOString().split("T")[0] : date;

    console.log(Gender, formattedDate);
    navigator("/onboarding/location-selection");

    //sending data to Backend
  };

  return (
    <>
      {/* Header Section */}
      <AuthHeaderSection
        title="Tell us a bit about yourself"
        content="This helps us personalize your experience and show you relevant content."
      />
      {/* Gender Selection */}
      <div className="mb-8 h-fit">
        <h3 className="text-lg font-bold mb-4 ">What's your gender?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {genderRadio.map((option) => (
            <label
              key={option.value}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all duration-400 hover:border-primary
                    ${
                      Gender === option.value
                        ? "border-primary bg-primary/20 scale-103"
                        : "border-gray-300 "
                    } `}
            >
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={Gender === option.value}
                onChange={(e) => setGender(e.target.value)}
                className="absolute h-full w-full opacity-0 cursor-pointer"
              />

              <span className="material-symbols-outlined text-4xl mb-2 text-primary">
                {option.icon}
              </span>
              <span className="font-semibold">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* date Input */}
      <CustomDateInput
        id="date"
        name="date"
        type="date"
        selected={date}
        value={date}
        onChange={(value) => setDate(value)}
        placeholder="Enter your date"
        className="lg:w-100 w-70  max-w-sm rounded-lg border px-4 py-3 focus:outline-none focus:border-primary  focus:ring-2 focus:ring-primary transition-all duration-200"
      />

      {/* Buttons */}
      <div className="flex flex-row sm:flex-row gap-3 max-w-120 mx-auto">
        <button
          onClick={submitInfo}
          disabled={!Gender || !date}
          className={`flex-1 h-12 bg-linear-to-r ${
            !Gender || !date
              ? `bg-gray-300 `
              : `from-primary to-secandry hover:bg-primary/90 cursor-pointer `
          }hover:opacity-90  text-white text-2xl rounded-lg font-bold tracking-wide transition`}
        >
          Continue
        </button>
      </div>
    </>
  );
}

export default PersonlityinfoQ;
