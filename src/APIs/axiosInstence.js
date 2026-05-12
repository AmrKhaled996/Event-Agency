import axios from "axios";
import {
  adminRefreshAccessToken,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
} from "../services/cookieTokenService";

export const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
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

export const adminAxiosInstance = axios.create({
  baseURL: "", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

      
    if (
      (error.response?.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const token = getAccessToken();
        const response = await axios.post(
          `/api/v1/admin/auth/refresh`,
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        adminRefreshAccessToken(response.data);

        
        return adminAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);

      
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
