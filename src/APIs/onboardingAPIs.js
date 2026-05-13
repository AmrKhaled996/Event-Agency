import { axiosInstance } from "./axiosInstance";

export async function getStatus(config = {}) {
  return axiosInstance.get("/api/v1/onboarding/status", config);
}

export async function basic({ birthDate, gender }, config = {}) {
  return axiosInstance.patch(
    "/api/v1/onboarding/basic",
    { birthDate, gender },
    config
  );
}

export async function preferences({ preferences }, config = {}) {
  return axiosInstance.patch(
    "/api/v1/onboarding/preferences",
    { preferences },
    config
  );
}

export async function location({ governorate }, config = {}) {
  return axiosInstance.patch(
    "/api/v1/onboarding/location",
    { governorate },
    config
  );
}
