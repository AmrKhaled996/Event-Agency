import { axiosInstance } from "./axiosInstence";
import { getAccessToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";

export async function becomeOrganizer(formData) {
  const token = getAccessToken();

 


  return axiosInstance.patch(
    `/api/v1/user/upgrade-to-organizer`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export async function verifyOrganizer(otp) {
  const token = getAccessToken();
  return axiosInstance.post(
    `/api/v1/user/organizer/contact-email/verify`,
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
  
export async function resendOtpsOrganizer() {
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
export async function getUserTickets() {
  const token = getAccessToken();

  return axiosInstance.get(
    `/api/v1/user/tickets`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
export async function getInterestedEvents() {
  const token = getAccessToken();

  return axiosInstance.get(
    `/api/v1/user/interested-events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
export async function getWalletBalance() {
  const token = getAccessToken();

  return axiosInstance.get(
    `/api/v1/user/wallet`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
