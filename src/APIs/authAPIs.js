import { axiosInstance } from "./axiosInstance";
import {
  getRefreshToken,
} from "../services/cookieTokenService";

export async function login(formData, config = {}) {
  return axiosInstance.post(
    "/api/v1/auth/login",
    formData,
    config
  );
}

export async function signup(formData, config = {}) {
  return axiosInstance.post(
    "/api/v1/auth/register",
    formData,
    config
  );
}
export async function verify(otp, config = {}) {
  return axiosInstance.post(
    `/api/v1/auth/verify-otp`,
    { otp },
    config
  );
}

export async function resendOtps(config = {}) {
  return axiosInstance.post(
    `/api/v1/auth/resend-otp`,
    {},
    config
  );
}
export async function refreshToken(config = {}) {
  const refreshToken = getRefreshToken();

  return axiosInstance.post(
    `/api/v1/auth/refresh-token`,
    { refreshToken },
    config
  );
}
export async function frogetPassword(email, config = {}) {
  return axiosInstance.post(
    `/api/v1/auth/forgot-password`,
    { email },
    config
  );
}
export async function resetPassword(newPassword, email, token, config = {}) {
  return axiosInstance.post(
    `/api/v1/auth/reset-password`,
    { email: email, token: token, newPassword: newPassword },
    config
  );
}
export async function logout(config = {}) {
  const refreshToken = getRefreshToken();
  return axiosInstance.post(
    `/api/v1/auth/logout`,
    { refreshToken },
    config
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
