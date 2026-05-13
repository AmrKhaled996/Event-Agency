import { useEffect } from "react";
import { getStatus } from "../../APIs/onboardingAPIs";
import { setTokens } from "../../services/cookieTokenService";
import useAppNavigate from "../../Router/useAppNavigate";

function GoogleCallback() {


  const navigate = useAppNavigate();

  const handleCallback = async () => {
    try {

      const params = new URLSearchParams(window.location.search);

      const token = params.get("token");
      const expiresIn = params.get("expiresIn");
      const refreshToken = params.get("refreshToken");
      const data = {
        accessToken: { token, expiresIn },
        refreshToken,
      };

      // Save tokens in localStorage
      setTokens(data);

      const response = await getStatus();

      const status = response.data.data;

      if (status.isComplete) {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/onboarding/personality-info");
        }, 1000);
      }
    } catch (error) {
      console.error("Google callback error:", error);
    }
  };

  useEffect(() => {
    handleCallback();

    return () => {};
  }, []);

  return <p>Signing you in...</p>;
}

export default GoogleCallback;
