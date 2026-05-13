import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAccessToken, refreshAccessToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";
import { refreshToken as refreshTokenAPI } from "../APIs/authAPIs";

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
      const response = await refreshTokenAPI();
      await refreshAccessToken(response.data);
      const newToken = getAccessToken();
      syncUserFromToken(newToken);
    } catch (error) {
      console.error("Failed to refresh token during updateUser:", error);
    }
  }, [syncUserFromToken]);

  // Initialize user from existing token
  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      syncUserFromToken(accessToken);
    }
  }, [syncUserFromToken]);

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
        const response = await refreshTokenAPI();
        await refreshAccessToken(response.data);
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
  }, [syncUserFromToken]);

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => useContext(AuthContext);
