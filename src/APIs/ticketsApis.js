import { axiosInstance } from "./axiosInstance";

export async function getTicketById(ticketId) {
  return axiosInstance.get(
    `/api/v1/tickets/${ticketId}`
  );
}
