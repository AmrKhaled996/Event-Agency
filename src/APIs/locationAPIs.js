import { axiosInstance } from "./axiosInstance";

export async function getCountries(config = {}) {
  return axiosInstance.get("/api/v1/countries", config);
}

export async function getStates(countryId, config = {}) {
  return axiosInstance.get(`/api/v1/countries/${countryId}/states`, config);
}

export async function getCities(stateId, config = {}) {
  return axiosInstance.get(`/api/v1/states/${stateId}/cities`, config);
}
