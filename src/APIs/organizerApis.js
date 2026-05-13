import { axiosInstance } from "./axiosInstance";

export async function createEvent(formDataa) {
  return axiosInstance.post("/api/v1/organizer/events", formDataa, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function updateEvent(formData, id) {
  return axiosInstance.put(`/api/v1/organizer/events/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function deleteEvent(id) {
  return axiosInstance.delete(`/api/v1/organizer/events/${id}`);
}
export async function cancelEvent(id) {
  return axiosInstance.patch(`/api/v1/organizer/events/${id}`,{});
}
export async function getAllEvents() {
  return axiosInstance.get(`/api/v1/organizer/events`);
}
