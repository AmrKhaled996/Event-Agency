
import { getAccessToken } from "../services/cookieTokenService";
import { axiosInstance } from "./axiosInstence";


export async function getMyProfile() {
  const token = getAccessToken();
  return axiosInstance.get(`/api/v1/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
export async function updateMyProfile(data) {
  const token = getAccessToken();
  return axiosInstance.patch(
    `/api/v1/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
export async function deleteMyProfile(password) {
  const token = getAccessToken();

  return axiosInstance.delete(
    `/api/v1/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { password },
    },
  );
}

export async function changePassword(data) {
  const token = getAccessToken();

  return axiosInstance.patch(
    `/api/v1/profile/change-password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
export async function changeEmail(data) {
  const token = getAccessToken();

  return axiosInstance.patch(
    `/api/v1/profile/change-email`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
export async function confirmEmail(tokenParam) {
  return axiosInstance.get(
    `/api/v1/profile/confirm-email?token=${tokenParam}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export async function getAttendedEvents() {
  const token = getAccessToken();

  return axiosInstance.get(
    `/api/v1/profile/attended-events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function getPreferences() {
  const token = getAccessToken();

  return axiosInstance.get(
    `/api/v1/profile/preferences`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
export async function updatePreferences(data) {
  const token = getAccessToken();

  return axiosInstance.patch(
    `/api/v1/profile/change-preferences`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
