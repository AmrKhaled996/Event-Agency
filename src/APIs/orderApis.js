import { axiosInstance } from "./axiosInstance";

export async function getOrderStatus(tickets) {
  return axiosInstance.get(
    "/api/v1/orders/96219e91-2485-46c8-b3b2-b9f51b2750f4/status",
    {
      params: { tickets }
    },
  );
}
