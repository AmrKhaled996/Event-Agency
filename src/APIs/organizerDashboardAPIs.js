import { axiosInstance } from "./axiosInstance";

export async function getStatsOrgainzerDashboard() {
  return axiosInstance.get("/api/v1/organizer/dashboard/stats");
}
export async function getAnalyticsOrgainzerDashboard() {
  return axiosInstance.get("/api/v1/organizer/dashboard/analytics");
}

export async function updateSettingsOrgainzerDashboard(formData) {
  return axiosInstance.patch("/api/v1/organizer/dashboard/settings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
