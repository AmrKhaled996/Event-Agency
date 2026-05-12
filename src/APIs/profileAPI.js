
import { axiosInstance } from "./axiosInstance";


export async function getMyProfile() {
  return axiosInstance.get(`/api/v1/profile`);
}
export async function updateMyProfile(data) {
  return axiosInstance.patch(
    `/api/v1/profile`,
    data
  );
}
export async function deleteMyProfile(password) {
  return axiosInstance.delete(
    `/api/v1/profile`,
    {
      data: { password },
    },
  );
}

export async function changePassword(data) {
  return axiosInstance.patch(
    `/api/v1/profile/change-password`,
    data
  );
}
export async function changeEmail(data) {
  return axiosInstance.patch(
    `/api/v1/profile/change-email`,
    data
  );
}
export async function confirmEmail(tokenParam) {
  return axiosInstance.get(
    `/api/v1/profile/confirm-email?token=${tokenParam}`
  );
}

export async function getAttendedEvents() {
  return axiosInstance.get(
    `/api/v1/profile/attended-events`
  );
}

export async function getPreferences() {
  return axiosInstance.get(
    `/api/v1/profile/preferences`
  );
}
export async function updatePreferences(data) {
  return axiosInstance.patch(
    `/api/v1/profile/change-preferences`,
    data
  );
}
