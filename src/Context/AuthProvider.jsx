import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { adminRefreshAccessToken, getAccessToken, refreshAccessToken, getRefreshToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";
import { refreshToken as refreshTokenAPI } from "../APIs/authAPIs";
import { adminDashboardauth } from "../APIs/adminDashboardApis";
import Loading from "../components/Layout/LoadingLayout";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.languagePreference) {
          localStorage.setItem("lang", decoded?.languagePreference);
        }
        return decoded;
      } catch (error) {
        console.error("Invalid token during synchronous initialization:", error);
        return null;
      }
    }
    return null;
  });

  const [isInitializing, setIsInitializing] = useState(() => {
    return !getAccessToken() && !!getRefreshToken();
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

  const updateUser = useCallback(async (userData) => {
    setUser(userData);
    // Token refresh will be handled automatically by interceptors if needed,
    // or we can manually refresh here if we want to ensure latest session.
    try {
      if(userData?.role === "admin") {
        const response = await adminDashboardauth.refreshtoken();
        await adminRefreshAccessToken(response.data);
      }else{
        const response = await refreshTokenAPI();
        await refreshAccessToken(response.data);
      }
      const newToken = getAccessToken();
      syncUserFromToken(newToken);
    } catch (error) {
      console.error("Failed to refresh token during updateUser:", error);
      console.error(
        error.response?.data?.data[0]?.message || "Something went wrong"
      );
      
    }
  }, [syncUserFromToken]);

  // Handle initialization and background refresh on mount
  useEffect(() => {
    const initAuth = async () => {
      if (!isInitializing) return;

      try {
        const path = window.location.pathname;
        const isAdminRoute = path.includes("/admin");
        
        if (isAdminRoute) {
          const response = await adminDashboardauth.refreshtoken();
          await adminRefreshAccessToken(response.data);
        } else {
          const response = await refreshTokenAPI();
          await refreshAccessToken(response.data);
        }
        const newToken = getAccessToken();
        syncUserFromToken(newToken);
      } catch (error) {
        console.error("Failed to refresh token on mount:", error);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [isInitializing, syncUserFromToken]);

  // Listen for forced logout events from axios interceptors
  useEffect(() => {
    const handleForcedLogout = () => {
      console.warn("Forced logout triggered");
      setUser(null);
      // We don't need to call removeTokens() here as triggerForcedLogout in axiosInstance already did it,
      // but it doesn't hurt to be safe.
    };

    window.addEventListener("auth:forced-logout", handleForcedLogout);
    return () => window.removeEventListener("auth:forced-logout", handleForcedLogout);
  }, []);

  // Proactive token refresh interval (every 14 minutes)
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const isAdmin = user?.role === "admin";
        if (isAdmin) {
          const response = await adminDashboardauth.refreshtoken();
          await adminRefreshAccessToken(response.data);
        } else {
          const response = await refreshTokenAPI();
          await refreshAccessToken(response.data);
        }
        const newToken = getAccessToken();
        syncUserFromToken(newToken);
      } catch (error) {
        console.error("Proactive refresh failed:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // If refresh fails due to invalid/expired refresh token, we logout
          setUser(null);
          // removeTokens() is called by the axios interceptor if the API call triggers it,
          // but we ensure consistency here.
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
