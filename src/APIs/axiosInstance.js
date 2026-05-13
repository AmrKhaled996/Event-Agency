import axios from "axios";
import {
  adminRefreshAccessToken,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  removeTokens,
} from "../services/cookieTokenService";
import { handleError } from "../utils/errorHandler";

const baseURL = import.meta.env.VITE_API_URL || "";

// Custom event to signal forced logout to AuthProvider
const triggerForcedLogout = () => {
  removeTokens();
  window.dispatchEvent(new CustomEvent("auth:forced-logout"));
};

export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for axiosInstance
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const refreshTokenValue = getRefreshToken();
        if (!refreshTokenValue) {
          triggerForcedLogout();
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${baseURL}/api/v1/auth/refresh-token`,
          { refreshToken: refreshTokenValue },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );

        await refreshAccessToken(response.data);

        const newToken = getAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed, logging out...", refreshError);
        triggerForcedLogout();
        return Promise.reject(refreshError);
      }
    }

    if (!originalRequest._silentError) {
      handleError(error, { silent: false });
    }

    return Promise.reject(error);
  },
);


export const adminAxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for adminAxiosInstance
adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/admin/auth/login") &&
      !originalRequest.url.includes("/admin/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshTokenValue = getRefreshToken();
        if (!refreshTokenValue) {
          triggerForcedLogout();
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${baseURL}/api/v1/admin/auth/refresh`,
          { refreshToken: refreshTokenValue },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        await adminRefreshAccessToken(response.data);

        const newToken = getAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return adminAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Admin refresh token failed, logging out...", refreshError);
        triggerForcedLogout();
        return Promise.reject(refreshError);
      }
    }

    if (!originalRequest._silentError) {
      handleError(error, { silent: false });
    }

    return Promise.reject(error);
  },
);
