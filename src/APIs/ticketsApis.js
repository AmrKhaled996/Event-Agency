import { getAccessToken } from "../services/cookieTokenService";
import { axiosInstance } from "./axiosInstence";

export async function getTicketById(ticketId) {
  const token = getAccessToken();
  return axiosInstance.get(
    `/api/v1/tickets/${ticketId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
