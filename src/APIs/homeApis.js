import { axiosInstance } from "./axiosInstence";
import { getAccessToken } from "../services/cookieTokenService";

export async function categories() {
  return axiosInstance.get("/api/v1/home/categories", {});
}
export async function latestEvents() {
  return axiosInstance.get(
    "/api/v1/home/latest-events",
    {},
  );
}
export async function newEventsThisWeek() {
  return axiosInstance.get(
    "/api/v1/home/new-events-this-week",
    {},
  );
}
export async function pastEvents() {
  return axiosInstance.get("/api/v1/home/past-events", {});
}
export async function nearbyEvents() {
  const token = getAccessToken();

  return axiosInstance.get("/api/v1/home/nearby-events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function personalizedEvents() {
  const token = getAccessToken();

  return axiosInstance.get(
    "/api/v1/home/personalized-events",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
