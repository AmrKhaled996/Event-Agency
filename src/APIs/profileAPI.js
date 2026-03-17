import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";

export async function getMyProfile() {
  const token = getAccessToken();
  return axios.get(
    `http://localhost:3000/api/v1/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}
export async function updateMyProfile(data) {
  const token = getAccessToken();

  return axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}
export async function deleteMyProfile({password}) {
  const token = getAccessToken();

  return axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { password },
    }
  );
}

export async function changePassword(data) {
  const token = getAccessToken();

  return axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile/change-password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}
export async function changeEmail(data) {
  const token = getAccessToken();
  
  return axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile/change-email`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}
export async function confirmEmail(tokenParam) {
  return axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile/confirm-email?token=${tokenParam}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function getAttendedEvents() {
  const token = getAccessToken();

  return axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile/attended-events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function getPreferences() {
  const token = getAccessToken();

  return axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile/preferences`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}
export async function updatePreferences(data) {
  const token = getAccessToken();

  return axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile/change-preferences`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}