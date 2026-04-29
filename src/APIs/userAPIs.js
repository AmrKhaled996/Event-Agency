import { axiosInstance } from "./axiosInstence";
import { getAccessToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";

export async function becomeOrganizer(formData) {
  const token = getAccessToken();

  const decode = jwtDecode(token);

  return axiosInstance.patch(
    `/api/v1/user/upgrade-to-organizer`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
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
