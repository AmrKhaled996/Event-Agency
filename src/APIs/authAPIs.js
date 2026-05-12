import { axiosInstance } from "./axiosInstence";
import {
  getAccessToken,
  getRefreshToken,
} from "../services/cookieTokenService";

export async function login(formData) {
  return axiosInstance.post(
    "/api/v1/auth/login",
    formData,
  );
}

export async function signup(formData) {
  return axiosInstance.post(
    "/api/v1/auth/register",
    formData,
  );
}
export async function verify(otp) {
  const token = getAccessToken();
  return axiosInstance.post(
    `/api/v1/auth/verify-otp`,
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function resendOtps() {
  const token = getAccessToken();
  return axiosInstance.post(
    `/api/v1/auth/resend-otp`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
export async function refreshToken() {
  const refreshToken = getRefreshToken();
  const token = getAccessToken();

  return axiosInstance.post(
    `/api/v1/auth/refresh-token`,
    { refreshToken },
    {
      headers: {
        Authorization: `Bearer ${token}`,

      },
    },
  );
}
export async function frogetPassword(email) {
  return axiosInstance.post(
    `/api/v1/auth/forgot-password`,
    { email },
  );
}
export async function resetPassword(newPassword, email, token) {
  return axiosInstance.post(
    `/api/v1/auth/reset-password`,
    { email: email, token: token, newPassword: newPassword },
  );
}
export async function logout() {
  const refreshToken = getRefreshToken();
  const token = getAccessToken();
  return axiosInstance.post(
    `/api/v1/auth/logout`,
    { refreshToken },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
export async function getGoogleAuth() {
  return axiosInstance.get(
    `/api/v1/auth/google/url`,
    {},
  );
}
export async function googleAuthCallback() {
  return axiosInstance.get(
    `/api/v1/auth/google/callback`,
    {},
  );
}
