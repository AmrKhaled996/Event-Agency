import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { adminRefreshAccessToken, getAccessToken, refreshAccessToken, getRefreshToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";
import { refreshToken as refreshTokenAPI } from "../APIs/authAPIs";
import { adminDashboardauth } from "../APIs/adminDashboardApis";
import Loading from "../components/Layout/LoadingLayout";
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const location = useLocation();
  const isAdminRoute = useMemo(() => location.pathname.includes("/admin"), [location.pathname]);

  const [user, setUser] = useState(() => {
    const token = getAccessToken(isAdminRoute);
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error("Invalid token during synchronous initialization:", error);
        return null;
      }
    }
    return null;
  });

  const [isInitializing, setIsInitializing] = useState(() => {
    return !getAccessToken(isAdminRoute) && !!getRefreshToken(isAdminRoute);
  });

  const syncUserFromToken = useCallback((token) => {
    try {
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded);
        if (decoded?.languagePreference) {
          localStorage.setItem("lang", decoded?.languagePreference);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Invalid token during sync:", error);
      setUser(null);
    }
  }, []);

  // Sync user whenever route type (Admin vs App) changes
  useEffect(() => {
    const token = getAccessToken(isAdminRoute);
    syncUserFromToken(token);
    
    // If we have a refresh token but no access token for this route type, trigger initialization
    if (!token && getRefreshToken(isAdminRoute)) {
      setIsInitializing(true);
    }
  }, [isAdminRoute, syncUserFromToken]);

  const updateUser = useCallback(async (userData) => {
    setUser(userData);
    try {
      const isAdmin = userData?.role === "admin";
      if(isAdmin) {
        const response = await adminDashboardauth.refreshtoken();
        await adminRefreshAccessToken(response.data);
      }else{
        const response = await refreshTokenAPI();
        await refreshAccessToken(response.data);
      }
      const newToken = getAccessToken(isAdmin);
      syncUserFromToken(newToken);
    } catch (error) {
      console.error("Failed to refresh token during updateUser:", error);
    }
  }, [syncUserFromToken]);

  // Handle initialization and background refresh
  useEffect(() => {
    const initAuth = async () => {
      if (!isInitializing) return;

      try {
        if (isAdminRoute) {
          const response = await adminDashboardauth.refreshtoken();
          await adminRefreshAccessToken(response.data);
        } else {
          const response = await refreshTokenAPI();
          await refreshAccessToken(response.data);
        }
        const newToken = getAccessToken(isAdminRoute);
        syncUserFromToken(newToken);
      } catch (error) {
        console.error("Failed to refresh token during initialization:", error);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [isInitializing, isAdminRoute, syncUserFromToken]);

  // Listen for forced logout events from axios interceptors
  useEffect(() => {
    const handleForcedLogout = (event) => {
      const isAdminLogout = event.detail?.isAdmin;
      const isAdminRoute = window.location.pathname.includes("/admin");
      
      if (isAdminLogout === isAdminRoute) {
        console.warn(`Forced logout triggered for ${isAdminLogout ? "admin" : "user"}`);
        setUser(null);
      }
    };

    window.addEventListener("auth:forced-logout", handleForcedLogout);
    return () => window.removeEventListener("auth:forced-logout", handleForcedLogout);
  }, []);

  // Proactive token refresh interval (every 14 minutes)
  useEffect(() => {
    const interval = setInterval(async () => {
      const isAdminRoute = window.location.pathname.includes("/admin");
      const token = getAccessToken(isAdminRoute);
      if (!token) return;

      try {
        const isAdmin = isAdminRoute || user?.role === "admin";
        if (isAdmin) {
          const response = await adminDashboardauth.refreshtoken();
          await adminRefreshAccessToken(response.data);
        } else {
          const response = await refreshTokenAPI();
          await refreshAccessToken(response.data);
        }
        const newToken = getAccessToken(isAdmin);
        syncUserFromToken(newToken);
      } catch (error) {
        console.error("Proactive refresh failed:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // If refresh fails due to invalid/expired refresh token, we logout
          setUser(null);
        }
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [syncUserFromToken, user]);

  if (isInitializing) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => useContext(AuthContext);
