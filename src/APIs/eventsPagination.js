import { axiosInstance } from "./axiosInstance";
import { getAccessToken } from "../services/cookieTokenService";

export async function latestEvents(page) {
  return axiosInstance.get(
    `/api/v1/home/latest-events?page=${page}&limit=12`,
    {},
  );
}
export async function newEventsThisWeek(page) {
  return axiosInstance.get(
    `/api/v1/home/new-events-this-week?page=${page}&limit=12`,
    {},
  );
}
export async function pastEvents(page) {
  return axiosInstance.get(
    `/api/v1/home/past-events?page=${page}&limit=12`,
    {},
  );
}
export async function nearbyEvents(page) {
  const token = getAccessToken();
  return axiosInstance.get(
    `/api/v1/home/nearby-events?page=${page}&limit=12`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
export async function personalizedEvents(page) {
  const token = getAccessToken();

  return axiosInstance.get(
    `/api/v1/home/personalized-events?page=${page}&limit=12`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
