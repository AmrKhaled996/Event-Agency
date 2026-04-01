import { axiosInstance } from "./axiosInstence";
import {
  getAccessToken,
  getRefreshToken,
} from "../services/cookieTokenService";

export async function paymentProcess(tickets) {
  const token = getAccessToken();

  return axiosInstance.get(
    "/api/v1/orders/96219e91-2485-46c8-b3b2-b9f51b2750f4/status",
    {},
  );
}
