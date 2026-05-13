import { axiosInstance } from "./axiosInstance";

export async function getEvents({ id, slug }, config = {}) {
  return axiosInstance.get(`/api/v1/events/${id}`, config);
}

export async function checkoutEvent(tickets, id, config = {}) {
  return axiosInstance.post(
    `/api/v1/events/${id}/checkout`,
    { ...tickets },
    config
  );
}

export async function addToInterested(id, config = {}) {
  return axiosInstance.post(
    `/api/v1/events/${id}/interested`,
    {},
    config
  );
}

export async function removeFromInterested(id, config = {}) {
  return axiosInstance.delete(
    `/api/v1/events/${id}/interested`,
    config
  );
}

export async function getEventAvailability(id, config = {}) {
  return axiosInstance.get(
    `/api/v1/events/${id}/availability`,
    config
  );
}

export async function reserveEventSeats(id, tickets, config = {}) {
  return axiosInstance.post(
    `/api/v1/events/${id}/reserve`,
    { tickets },
    config
  );
}

// export async function SearchEvents({ search , filter}, config = {}) {
//   return axiosInstance.get(`/api/v1/events/search?search=${search}`, config);
// }
