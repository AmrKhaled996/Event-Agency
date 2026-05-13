import { useState } from "react";
import GoogleLogo from "../../components/Icons/GoogleLogo";
import FacebookLogo from "../../components/Icons/FacebookLogo";

import SignUpFormOrganizerUser from "../../components/Layout/SignUpFormOrganizerUser";
import { Meta, Title } from "react-head";
import SignUpFormAttendeeUser from "../../components/Layout/SignUpFormAttendeeUser";
import Loading from "../../components/Layout/LoadingLayout";
import LocalLink from "../../Router/LocalLink";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";

function SignUpPage() {
  // const [userRole, setUserRole] = useState("attendee");
  const [loading, setLoading] = useState(null);
  const {t}=useTranslation()

  const navigator = useAppNavigate();


  return (
    <div className="flex flex-col  min-h-screen font-sans  bg-primary lg:flex-row">
      <Title>{t("auth.signUp.title")} </Title>
      <Meta
        name="description"
        content="Login page in Fa3liat Event Agency site"
      />
      {/* LEFT SIDE */}
      <div
        className="w-full lg:w-[40%]  text-white flex flex-col justify-start gap-2.5 items-center lg:items-start lg:p-10 p-3 "
        style={{
          background: ` linear-gradient(to bottom, #BB52E0 20%, rgba(0,0,0,0.36)) , url('/public/images/login.jpg')`,
          backgroundSize: `cover`,
        }}
      >
        <img src="/Fa3liatLogo.png" alt="Fa3liat Logo" className="mb-8 w-48" />
        <h1 className="text-4xl font-bold mb-4 text-start leading-snug hidden lg:flex">
          {t("auth.login.aside1")}
          <br />
          {t("auth.login.aside2")}

          <br />
          {t("auth.login.aside3")}

          <br />
          {t("auth.login.aside4")}

          <br />
          {t("auth.login.aside5")}
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-[60%] w-full bg-white flex flex-col justify-center px-3 lg:px-10 md:px-6  relative lg:rounded-l-3xl rounded-t-3xl  outline-white outline-10 shadow-[0_-25px_50px_2px] shadow-black ">
        {/* Close Button (optional) */}
        <button 
        onClick={() => navigator("/")}
        className="absolute top-3 right-3 lg:top-6 lg:right-6 text-gray-400 text-4xl hover:text-gray-600 ">
          &times;
        </button>

        <h2 className="text-transparent bg-linear-to-b from-secandry  to-[#FF8370] bg-clip-text md:text-5xl text-4xl font-bold mb-5 mt-5 h-15">
          {t("auth.signup.createAccount")}
        </h2>

        <SignUpFormAttendeeUser loadingpage={setLoading} />

        <p className="mt-2 mb-6 text-gray-600 text-center">
          {t("auth.signup.alreadyHaveAccount")} &nbsp;
          <LocalLink
            to={"/login"}
            className="text-secandry font-semibold hover:underline"
          >
            {t("auth.signup.login")}
          </LocalLink>
        </p>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default SignUpPage;

{
  /* Select Role Buttons */
}
{
  /* <div className="flex space-x-4 mb-6">
          <button
            className={`h-28 flex-1 border-2 border-gray-300 rounded-2xl py-2 flex flex-col justify-center i lg:ify-cestarttems-center gap-0.5 md:gap-2 hover:bg-gray-50 transition hover:cursor-pointer ${
              userRole === "attendee"
                ? "bg-linear-to-b from-secandry  to-[#FF8370]  shadow-[0_0px_24px_-6px] shadow-secandry"
                : "bg-white"
            } `}
            onClick={() => setUserRole("attendee")}
          >
            <h2
              className={`text-xl md:text-2xl font-bold  ${
                userRole === "attendee"
                  ? "text-white"
                  : "text-transparent bg-linear-to-b from-secandry  to-[#FF8370] bg-clip-text"
              }`}
            >
              Attendee
            </h2>
            <p
              className={` ${
                userRole === "attendee" ? "text-gray-200" : "text-gray-500"
              }`}
            >
              Book unique parties , events, workshops
            </p>
          </button>
          <button
            disabled={true}
            className={`h-28 flex-1 border-2 border-gray-300 rounded-2xl py-2 flex flex-col justify-center items-center gap-0.5 md:gap-2
                
                ${
                  userRole === "organizer"

                      // "bg-linear-to-b from-secandry  to-[#FF8370]  shadow-[0_0px_24px_-6px] shadow-secandry hover:bg-gray-50  hover:cursor-pointer transition-all duration-300 opacity-100"
                      "bg-gray-300 shadow-[0_0px_24px_-6px] shadow-gray-300 cursor-not-allowed" 
                    // : "bg-white cursor-not-allowed"
                // } `}
            // onClick={() => setUserRole("organizer")}
          // >
        //     <h2*/
}
{
  /* className={`text-xl md:text-2xl font-bold   */
}
{
  /* //         userRole === "organizer"
        //           ? "text-white"
        //           : /* soon*/
  //             "text-transparent bg-linear-to-b from-secandry  to-[#FF8370] bg-clip-text"
  //             "text-gray-400 cursor-not-allowed"
  //       }`}
  //     >
  //       Organizer
  //     </h2>
  //     <p */}
  //       className={` ${
  //         userRole === "organizer" ? "text-gray-200" : "text-gray-500"
  //       }`}
  //     >
  //       list and host your amazing events, parties
  //     </p>
  //   </button>
  // </div>
  // {/* divider */}
  // <hr className=" mb-5" /> */}
  // {/* Create Account attendee or organizer */
}
