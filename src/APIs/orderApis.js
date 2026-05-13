import { axiosInstance } from "./axiosInstance";

export async function getOrderStatus(orderId) {
  return axiosInstance.get(
    `/api/v1/orders/${orderId}/status`
  );
}
