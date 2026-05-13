import { axiosInstance } from "./axiosInstance";

export async function getEvents({ id, slug }) {
  return axiosInstance.get(`/api/v1/events/${id}`, {});
}

export async function checkoutEvent(tickets, id) {
  return axiosInstance.post(
    `/api/v1/events/${id}/checkout`,
    { ...tickets }
  );
}

export async function addToInterested(id) {
  return axiosInstance.post(
    `/api/v1/events/${id}/interested`,
    {}
  );
}

export async function removeFromInterested(id) {
  return axiosInstance.delete(
    `/api/v1/events/${id}/interested`
  );
}

export async function getEventAvailability(id) {
  return axiosInstance.get(
    `/api/v1/events/${id}/availability`
  );
}

export async function reserveEventSeats(id, tickets) {
  return axiosInstance.post(
    `/api/v1/events/${id}/reserve`,
    { tickets }
  );
}

export async function SearchEvents({ search , filter}) {
  return axiosInstance.get(`/api/v1/events/search?search=${search}`, {});
}
