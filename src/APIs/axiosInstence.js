import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
} from "../services/cookieTokenService";

export const axiosInstance = axios.create({
  baseURL: "", // ✅ important (with Vite proxy)
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ only retry once
    if (
      (error.response?.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log("Trying to refresh token...");
        const refreshToken = getRefreshToken();
        console.log("refreshToken", refreshToken);
        const token = getAccessToken();

        const response = await axios.post(
          `/api/v1/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );
        refreshAccessToken(response.data);

        // ✅ retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);

        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
