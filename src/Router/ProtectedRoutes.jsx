import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Context/AuthProvider";

function ProtectedRoutes({ children, Roles }) {
  const { user } = useUser();
  const location = useLocation();

  // If user is not logged in
  if (!user || Object.keys(user).length === 0) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have the required role
  if (Roles && !Roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoutes;
