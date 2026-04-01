import { axiosInstance } from "./axiosInstence";
import { getAccessToken } from "../services/cookieTokenService";

export async function subscribeToNewsletter(email, language) {
  const token = getAccessToken();

  return axiosInstance.post(
    "/api/v1/newsletter/subscribe",
    { email, language },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}
