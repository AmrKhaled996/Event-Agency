import { axiosInstance } from "./axiosInstance";

export async function createEvent(formData, config = {}) {
  return axiosInstance.post("/api/v1/organizer/events", formData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config.headers,
    },
  });
}
export async function updateEvent(formData, id, config = {}) {
  return axiosInstance.put(`/api/v1/organizer/events/${id}`, formData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config.headers,
    },
  });
}
export async function deleteEvent(id, config = {}) {
  return axiosInstance.delete(`/api/v1/organizer/events/${id}`, config);
}
export async function cancelEvent(id, config = {}) {
  return axiosInstance.patch(`/api/v1/organizer/events/${id}`, {}, config);
}
export async function getAllEvents(config = {}) {
  return axiosInstance.get(`/api/v1/organizer/events`, config);
}
