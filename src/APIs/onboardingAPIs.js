import { axiosInstance } from "./axiosInstence";
import { getAccessToken } from "../services/cookieTokenService";

export async function getStatus() {
  const token = getAccessToken();

  return axiosInstance.get("/api/v1/onboarding/status", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function basic({ birthDate, gender }) {
  const token = getAccessToken();
  return axiosInstance.patch(
    "/api/v1/onboarding/basic",
    { birthDate, gender },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function preferences({ preferences }) {
  const token = getAccessToken();
  return axiosInstance.patch(
    "/api/v1/onboarding/preferences",
    { preferences },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function location({ governorate }) {
  const token = getAccessToken();
  return axiosInstance.patch(
    "/api/v1/onboarding/location",
    { governorate },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      
    },
  );
}
