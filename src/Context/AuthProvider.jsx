import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { adminRefreshAccessToken, getAccessToken, refreshAccessToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";
import { refreshToken as refreshTokenAPI } from "../APIs/authAPIs";
import { adminDashboardauth } from "../APIs/adminDashboardApis";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

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

  // Initialize user from existing token
  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      syncUserFromToken(accessToken);
    }
  }, [syncUserFromToken]);

  // Proactive token refresh interval (every 14 minutes)
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const response = await refreshTokenAPI();
        await refreshAccessToken(response.data);
        const newToken = getAccessToken();
        syncUserFromToken(newToken);
      } catch (error) {
        console.error("Proactive refresh failed:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // If refresh fails due to invalid/expired refresh token, we should probably logout
          // setUser(null);
          // removeTokens();
        }
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [syncUserFromToken]);

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => useContext(AuthContext);
