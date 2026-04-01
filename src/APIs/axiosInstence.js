import axios from "axios";

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/refresh-token`,
          {
            withCredentials: true,
          },
        );

        return axiosInstance(originalRequest);
      } catch (refreshTokenerror) {
        console.error(
          "Proccess failed, Refresh token Error",
          refreshTokenerror,
        );

        window.location.href = "/login";

        return Promise.reject(refreshTokenerror);
      }
    }

    return Promise.reject(error);
  },
);
