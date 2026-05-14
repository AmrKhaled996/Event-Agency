import { Navigate, useLocation, useParams } from "react-router-dom";
import { useUser } from "../Context/AuthProvider";

function ProtectedRoutes({ children, Roles }) {
  const { user } = useUser();
  const location = useLocation();
  const { lang } = useParams();
  const currentLang = lang || localStorage.getItem("lang") || "en";

  // If user is not logged in
  if (!user || Object.keys(user).length === 0) {
    // If trying to access admin route, redirect to admin login
    if (location.pathname.includes("/admin")) {
      return <Navigate to={`/${currentLang}/admin/login`} state={{ from: location }} replace />;
    }
    return <Navigate to={`/${currentLang}/login`} state={{ from: location }} replace />;
  }

  const userRole = user.role;

  // Strict separation: Admins cannot access user/organizer routes
  if (userRole === "admin" && !location.pathname.includes("/admin")) {
    return <Navigate to={`/${currentLang}/admin`} replace />;
  }

  // Strict separation: Users/Organizers cannot access admin routes
  if (userRole !== "admin" && location.pathname.includes("/admin")) {
    return <Navigate to={`/${currentLang}/unauthorized`} replace />;
  }

  // If user doesn't have the specific required role (e.g., organizer only)
  if (Roles && !Roles.includes(userRole)) {
    return <Navigate to={`/${currentLang}/unauthorized`} replace />;
  }

  return children;
}

export default ProtectedRoutes;

