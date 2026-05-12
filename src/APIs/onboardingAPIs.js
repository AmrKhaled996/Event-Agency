import { axiosInstance } from "./axiosInstance";

export async function getStatus() {
  return axiosInstance.get("/api/v1/onboarding/status");
}

export async function basic({ birthDate, gender }) {
  return axiosInstance.patch(
    "/api/v1/onboarding/basic",
    { birthDate, gender }
  );
}

export async function preferences({ preferences }) {
  return axiosInstance.patch(
    "/api/v1/onboarding/preferences",
    { preferences }
  );
}

export async function location({ governorate }) {
  return axiosInstance.patch(
    "/api/v1/onboarding/location",
    { governorate }
  );
}
