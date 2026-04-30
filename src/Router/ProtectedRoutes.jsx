
import { useUser } from "../Context/AuthProvider";
import useAppNavigate from "./useAppNavigate";

function ProtectedRoutes({ children, Roles }) {
  const { user } = useUser();
  const navigate = useAppNavigate();

  if (Roles && !Roles.includes(user.role)) {
    // return <Navigate to="/unauthorized" replace />;
    navigate("/unauthorized");
    // return null;
  }

  return children;
}

export default ProtectedRoutes;
