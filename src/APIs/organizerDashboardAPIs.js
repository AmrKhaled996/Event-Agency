import { axiosInstance } from "./axiosInstance";

export async function getStatsOrgainzerDashboard() {
  return axiosInstance.get("/api/v1/organizer/dashboard/stats");
}
export async function getAnalyticsOrgainzerDashboard() {
  return axiosInstance.get("/api/v1/organizer/dashboard/analytics");
}
