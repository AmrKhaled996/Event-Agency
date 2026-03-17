import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";

export async function becomeOrganizer() {

  const token = getAccessToken();

  const decode = jwtDecode(token);

  return axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/upgrade-to-organizer`, {},{
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
        }
  );
}

export async function getUserTickets() {
  const token = getAccessToken();

  return axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/tickets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function getInterestedEvents() {
  const token = getAccessToken();

  return axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/interested-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

