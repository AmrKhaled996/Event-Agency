import { Navigate, useLocation, useParams } from "react-router-dom";
import { useUser } from "../Context/AuthProvider";
import { getAccessToken } from "../services/cookieTokenService";

function ProtectedRoutes({ children, Roles }) {
  const { user } = useUser();
  const location = useLocation();
  const { lang } = useParams();
  const currentLang = lang || localStorage.getItem("lang") || "en";

  // Robustly detect if we are on an admin route
  const isAdminPath = location.pathname.includes("/admin");

  // 1. Handling users with NO session in the current context (Admin vs App)
  if (!user || Object.keys(user).length === 0) {
    if (isAdminPath) {
      // Check if they are actually logged in as a regular user/organizer
      // If they have an app token, we show 'unauthorized' instead of 'login'
      if (getAccessToken(false)) {
        console.warn(
          "User/Organizer attempting to access Admin area. Denying access.",
        );
        return <Navigate to={`/${currentLang}/unauthorized`} replace />;
      }
      return (
        <Navigate
          to={`/${currentLang}/admin/login`}
          state={{ from: location }}
          replace
        />
      );
    }
    return (
      <Navigate
        to={`/${currentLang}/login`}
        state={{ from: location }}
        replace
      />
    );
  }

  const userRole = user.role;
  const isVerified = userRole === "admin" ? user.isApproved : user.isVerified;

  // Strict verification check
  if (!isVerified && 
      !location.pathname.includes("/otp-verification") && 
      !location.pathname.includes("/confirm-email") &&
      !location.pathname.includes("/admin/pending-approval")) {
    
    if (userRole === "admin") {
      return <Navigate to={`/${currentLang}/admin/pending-approval`} replace />;
    }
    return <Navigate to={`/${currentLang}/otp-verification`} replace />;
  }

  // Strict onboarding check (only for regular users)
  if (userRole === "user" && !user.isCompleted && !location.pathname.includes("/onboarding") && !location.pathname.includes("/otp-verification")) {
    return <Navigate to={`/${currentLang}/onboarding/personality-info`} replace />;
  }

  // 2. Strict Context Separation for authenticated users
  if (userRole === "admin" && !isAdminPath) {
    return <Navigate to={`/${currentLang}/admin`} replace />;
  }

  if (userRole !== "admin" && isAdminPath) {
    return <Navigate to={`/${currentLang}/unauthorized`} replace />;
  }


  // 3. Specific Role Requirements (e.g. ['organizer'])
  if (Roles && !Roles.includes(userRole)) {
    return <Navigate to={`/${currentLang}/unauthorized`} replace />;
  }

  return children;
}

export default ProtectedRoutes;

