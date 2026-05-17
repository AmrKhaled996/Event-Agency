import axios from "axios";
import {
  adminRefreshAccessToken,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  removeTokens,
} from "../services/cookieTokenService";
import { handleError } from "../utils/errorHandler";

const baseURL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || "") : "";

const LOCAL_MEDIA_HOSTS = new Set(["localhost", "127.0.0.1"]);

const normalizeMediaUrl = (value) => {
  if (!import.meta.env.DEV || typeof value !== "string") {
    return value;
  }

  try {
    const parsedUrl = new URL(value);

    if (
      LOCAL_MEDIA_HOSTS.has(parsedUrl.hostname) &&
      parsedUrl.pathname.startsWith("/uploads/")
    ) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }
  } catch {
    return value;
  }

  return value;
};

const normalizeMediaUrlsDeep = (value) => {
  if (typeof value === "string") {
    return normalizeMediaUrl(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeMediaUrlsDeep);
  }

  if (value && typeof value === "object") {
    Object.keys(value).forEach((key) => {
      value[key] = normalizeMediaUrlsDeep(value[key]);
    });
  }

  return value;
};

// Custom event to signal forced logout to AuthProvider
const triggerForcedLogout = (isAdmin = false) => {
  removeTokens(isAdmin);
  window.dispatchEvent(new CustomEvent("auth:forced-logout", { detail: { isAdmin } }));
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
    const token = getAccessToken(false);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data) {
      normalizeMediaUrlsDeep(response.data);
    }

    return response;
  },
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
        const refreshTokenValue = getRefreshToken(false);
        if (!refreshTokenValue) {
          triggerForcedLogout(false);
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

        const newToken = getAccessToken(false);
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed, logging out...", refreshError);
        triggerForcedLogout(false);
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
    const token = getAccessToken(true);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

adminAxiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data) {
      normalizeMediaUrlsDeep(response.data);
    }

    return response;
  },
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
        const refreshTokenValue = getRefreshToken(true);
        if (!refreshTokenValue) {
          triggerForcedLogout(true);
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

        const newToken = getAccessToken(true);
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return adminAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Admin refresh token failed, logging out...", refreshError);
        triggerForcedLogout(true);
        return Promise.reject(refreshError);
      }
    }

    if (!originalRequest._silentError) {
      handleError(error, { silent: false });
    }

    return Promise.reject(error);
  },
);
