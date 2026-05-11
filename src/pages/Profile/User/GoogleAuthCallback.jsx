// import { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { getStatus } from "../../APIs/onboardingAPIs";
// import { setTokens } from "../../services/cookieTokenService";
// import useAppNavigate from "../../Router/useAppNavigate";
// import { confirmEmail } from "../../../APIs/profileAPI";

// function ConfirmEmail() {
//   const [searchParams] = useSearchParams();
//   const code = searchParams.get("code");
  // const navigate = useAppNavigate();

//   const handleConfirm = async () => {
//     try {
//       console.log("in callback");

//       const params = new URLSearchParams(window.location.search);

//       const token = params.get("token");
//       // const expiresIn = params.get("expiresIn");
//       // const refreshToken = params.get("refreshToken");
//       // console.log("params ", params, "token ", token);
//       // const data = {
//       //   accessToken: { token, expiresIn },
//       //   refreshToken,
//       // };

//       // Save tokens in localStorage
//       // setTokens(data);

//       const response = await confirmEmail(token);
//       console.log("response confirmEmail",response)

//       navigate("/otp-verification");

//       // console.log(response.data.data);
//       // const status = response.data.data;

//       // if (status.isComplete) {
//       //   setTimeout(() => {
//       //     navigate("/otp-verfication");
//       //   }, 1000);
//       // } else {
//       //   setTimeout(() => {
//       //     navigate("/onboarding/personality-info");
//       //   }, 1000);
//       // }
//     } catch (error) {
//       console.error("change error:", error);
//     }
//   };

//   useEffect(() => {
//     handleConfirm();

//     return () => {};
//   }, []);

//   return <p>Changing email...</p>;
// }

// export default ConfirmEmail;
