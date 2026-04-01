import { axiosInstance } from "./axiosInstence";
import {
  getAccessToken,
  getRefreshToken,
} from "../services/cookieTokenService";

export async function getStatsOrgainzerDashboard() {
  const token = getAccessToken();

  return axiosInstance.get(
    "/api/v1/organizer/dashboard/stats",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
export async function getAnalyticsOrgainzerDashboard() {
  const token = getAccessToken();

  return axiosInstance.get(
    "/api/v1/organizer/dashboard/analytics",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
