import { axiosInstance } from "./axiosInstance";

export async function becomeOrganizer(formData, config = {}) {
  return axiosInstance.patch(
    `/api/v1/user/upgrade-to-organizer`,
    formData,
    {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export async function verifyOrganizer(otp, config = {}) {
  return axiosInstance.post(
    `/api/v1/user/organizer/contact-email/verify`,
    { otp },
    config
  );
}
  
export async function resendOtpsOrganizer(config = {}) {
  return axiosInstance.post(
    `/api/v1/user/organizer/contact-email/resend`,
    {},
    config
  );
}

export async function getOrganizerStatus(config = {}) {
  return axiosInstance.get(`/api/v1/user/organizer/status`, config);
}

export async function getUserTickets(config = {}) {
  return axiosInstance.get(`/api/v1/user/tickets`, config);
}

export async function getInterestedEvents(config = {}) {
  return axiosInstance.get(`/api/v1/user/interested-events`, config);
}

export async function getWalletBalance(config = {}) {
  return axiosInstance.get(`/api/v1/user/wallet`, config);
}

export async function followOrganizer(organizerId, config = {}) {
  return axiosInstance.post(`/api/v1/user/follow/${organizerId}`, {}, config);
}

export async function unfollowOrganizer(organizerId, config = {}) {
  return axiosInstance.delete(`/api/v1/user/follow/${organizerId}`, config);
}
