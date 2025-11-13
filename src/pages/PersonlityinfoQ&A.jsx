import { useState } from "react";
import FemaleIcon from "../components/Icons/Female";
import MaleIcon from "../components/Icons/male";
import { Title } from "react-head";

function PersonlityinfoQ() {
  const [Gender, setGender] = useState("male");
  const [Age, setAge] = useState("");
  const genderRadio = [
    {
      icon: <MaleIcon />,
      label: "Male",
      value: "Male",
    },
    {
      icon: <FemaleIcon />,
      label: "Female",
      value: "Female",
    },
  ];

  const submitInfo = (e) => {
    e.preventDefault();

    console.log(Gender ,Age);
    
    //sending data to Backend
  };

  return (
    <div className=" font-display min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-20 lg:px-20">
        <Title>Step 1 of 3</Title>
      <div className="w-full max-w-4xl bg-white/10  backdrop-blur-lg rounded-xl shadow-lg p-8">
        {/* Progress Section */}
        <div className="mb-6">
          <p className="text-sm font-medium ">Step 1 of 3</p>
          <div className="w-full h-2 rounded-full mt-2 bg-gray-200">
            <div className="bg-primary h-2 w-1/3 rounded-full transition-all duration-600"></div>
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold leading-tight ">
            Tell us a bit about yourself
          </h1>
          <p className=" mt-2">
            This helps us personalize your experience and show you relevant
            content.
          </p>
        </div>

        {/* Gender Selection */}
        <div className="mb-8 h-48">
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

        {/* Age Input */}
        <div className="mb-10 flex flex-col items-center">
          <label
            htmlFor="age"
            className="block text-lg font-bold mb-3"
          >
            What's your age?
          </label>
          <input
            id="age"
            name="age"
            type="date"
            min="1"
            max="99"
            onChange={(e)=>setAge(e.target.value)}
            placeholder="Enter your age"
            className="w-full max-w-sm rounded-lg border px-4 py-3 focus:outline-none focus:border-primary  focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-row sm:flex-row gap-3 max-w-120 mx-auto">
          <button
            onClick={submitInfo}
            className="flex-1 h-12 bg-linear-to-r from-primary to-secandry hover:opacity-90  text-white text-2xl rounded-lg font-bold tracking-wide hover:bg-primary/90 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonlityinfoQ;
