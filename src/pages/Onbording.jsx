import { Title } from "react-head";
import ProgressBar from "../components/UI/progressBar";
import { Outlet } from "react-router-dom";

function Onboarding({children ,stepNo , pageTitle}) {
  return (
    <>
      <div className=" font-display min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-20 lg:px-20">
        <div className="w-full max-w-4xl bg-white/10  backdrop-blur-lg rounded-xl shadow-lg p-8">
          {/* Progress Section */}
          <ProgressBar step={stepNo} />
          {/* Page title */}
          <Title>{pageTitle}</Title>

            <Outlet />
            {children}

        </div>
      </div>
    </>
  );
}

export default Onboarding;
