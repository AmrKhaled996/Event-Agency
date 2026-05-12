import { axiosInstance } from "./axiosInstance";

export async function becomeOrganizer(formData) {
  return axiosInstance.patch(
    `/api/v1/user/upgrade-to-organizer`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export async function verifyOrganizer(otp) {
  return axiosInstance.post(
    `/api/v1/user/organizer/contact-email/verify`,
    { otp }
  );
}
  
export async function resendOtpsOrganizer() {
  return axiosInstance.post(
    `/api/v1/auth/resend-otp`,
    {}
  );
}

export async function getUserTickets() {
  return axiosInstance.get(`/api/v1/user/tickets`);
}

export async function getInterestedEvents() {
  return axiosInstance.get(`/api/v1/user/interested-events`);
}

export async function getWalletBalance() {
  return axiosInstance.get(`/api/v1/user/wallet`);
}
