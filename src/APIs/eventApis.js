import { axiosInstance } from "./axiosInstence";
import { getAccessToken } from "../services/cookieTokenService";

export async function getEvents({ id, slug }) {
  return axiosInstance.get(`/api/v1/events/${id}`, {});
}

export async function checkoutEvent(tickets, id) {
  const token = getAccessToken();
  return axiosInstance.post(
    `/api/v1/events/${id}/checkout`,
    { ...tickets },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function addToInterested(id) {
  const token = getAccessToken();
  return axiosInstance.post(
    `/api/v1/events/${id}/interested`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function removeFromInterested(id) {
  const token = getAccessToken();
  return axiosInstance.delete(
    `/api/v1/events/${id}/interested`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function getEventAvailability(id) {
  const token = getAccessToken();
  return axiosInstance.get(
    `/api/v1/events/${id}/availability`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
}

export async function reserveEventSeats(id, tickets) {
  const token = getAccessToken();
  return axiosInstance.post(
    `/api/v1/events/${id}/reserve`,
    { tickets },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function SearchEvents({ search , filter}) {
  return axiosInstance.get(`/api/v1/events/search?search=${search}`, {});
}
