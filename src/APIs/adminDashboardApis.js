/**
 * get api/v1/admin/dashboard/summary
 * get api/v1/admin/dashboard/review-queue?page=1&limit=10
 * get api/v1/admin/users?page=1&limit=2&gender=male
 * get api/v1/admin/users/:userId
 * delete api/v1/admin/users/:userId
 * patch api/v1/admin/users/:userId/restore
 * get api/v1/admin/organizers?page=1&limit=3&verficiationStatus=APPROVED&status=ACTIVE
 * get api/v1/admin/organizers/:organizerId
 * patch api/v1/admin/organizers/:organizerId/reactivate
 * patch api/v1/admin/organizers/:organizerId/suspend
 * patch api/v1/admin/organizers/:organizerId/reject
 * patch api/v1/admin/organizers/:organizerId/approve
 * get api/v1/admin/finance/summary?days=1
 * get api/v1/admin/analytics/active-users?days=30
 * get api/v1/admin/analytics/events/:eventId/revenue
 * get api/v1/admin/analytics/events/:eventId/tickets-sold
 * get api/v1/admin/events?page=1&limit=3
 * get api/v1/admin/events/:eventId
 * delete api/v1/admin/events/:eventId
 * patch api/v1/admin/events/:eventId/restore
 *
 */

import {
  getAccessToken,
  getRefreshToken,
} from "../services/cookieTokenService";
import { signup } from "./authAPIs";
import { adminAxiosInstance } from "./axiosInstence";

/* =========================
   DASHBOARD
========================= */
const token = getAccessToken();
// GET /api/v1/admin/dashboard/summary
export const getDashboardSummary = () => {
  console.log("in token", token);
  return adminAxiosInstance.get("/api/v1/admin/dashboard/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// GET /api/v1/admin/dashboard/review-queue?page=&limit=
export const getReviewQueue = () => {
  console.log("in token", token);
  return adminAxiosInstance.get("/api/v1/admin/dashboard/review-queue", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

/* =========================
   USERS
========================= */

// GET /api/v1/admin/users?page=&limit=&gender=
export const getUsers = (page) =>
  adminAxiosInstance.get(`/api/v1/admin/users?page=${page}&limit=8`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// GET /api/v1/admin/users/:userId
export const getUserById = (userId) =>
  adminAxiosInstance.get(`/api/v1/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// DELETE /api/v1/admin/users/:userId
export const deleteUser = (userId) =>
  adminAxiosInstance.delete(`/api/v1/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// PATCH /api/v1/admin/users/:userId/restore
export const restoreUser = (userId) =>
  adminAxiosInstance.patch(`/api/v1/admin/users/${userId}/restore`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

/* =========================
   ORGANIZERS
========================= */

// GET /api/v1/admin/organizers?page=&limit=&verificationStatus=&status=
export const getOrganizers = (page) =>
  adminAxiosInstance.get(`/api/v1/admin/organizers?page=${page}&limit=8`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// GET /api/v1/admin/organizers/:organizerId
export const getOrganizerById = (organizerId) =>
  adminAxiosInstance.get(`/api/v1/admin/organizers/${organizerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// PATCH actions
export const reactivateOrganizer = (id) =>
  adminAxiosInstance.patch(`/api/v1/admin/organizers/${id}/reactivate`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const suspendOrganizer = (id ,reason) =>
  adminAxiosInstance.patch(`/api/v1/admin/organizers/${id}/suspend`,{reason: reason.trim()}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const rejectOrganizer = (id,reason) =>
  adminAxiosInstance.patch(`/api/v1/admin/organizers/${id}/reject`,{reason: reason.trim()}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const approveOrganizer = (id) => {
  console.log("in token1", token);
  return adminAxiosInstance.patch(`/api/v1/admin/organizers/${id}/approve`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

/* =========================
   FINANCE
========================= */

// GET /api/v1/admin/finance/summary?days=
export const getFinanceSummary = () =>
  adminAxiosInstance.get("/api/v1/admin/finance/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

/* =========================
   ANALYTICS
========================= */

// GET /api/v1/admin/analytics/active-users?days=
export const getActiveUsers = () =>
  adminAxiosInstance.get("/api/v1/admin/analytics/active-users", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// GET /api/v1/admin/analytics/events/:eventId/revenue
export const getEventRevenue = (eventId) =>
  adminAxiosInstance.get(`/api/v1/admin/analytics/events/${eventId}/revenue`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// GET /api/v1/admin/analytics/events/:eventId/tickets-sold
export const getEventTickets = (eventId) =>
  adminAxiosInstance.get(`/api/v1/admin/analytics/events/${eventId}/tickets-sold`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

/* =========================
   EVENTS
========================= */

// GET /api/v1/admin/events?page=&limit=
export const getEvents = (page) =>
  adminAxiosInstance.get(`/api/v1/admin/events?page=${page}&limit=8`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// GET /api/v1/admin/events/:eventId
export const getEventById = (eventId) =>
  adminAxiosInstance.get(`/api/v1/admin/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// DELETE /api/v1/admin/events/:eventId
export const deleteEvent = (eventId) =>
  adminAxiosInstance.delete(`/api/v1/admin/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// PATCH /api/v1/admin/events/:eventId/restore
export const restoreEvent = (eventId) =>
  adminAxiosInstance.patch(`/api/v1/admin/events/${eventId}/restore`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });


/*
  export async function login(formData) {
   return axiosInstance.post(
     "/api/v1/auth/login",
     formData,
   );
 }
 
 export async function signup(formData) {
   return axiosInstance.post(
     "/api/v1/auth/register",
     formData,
   );
 }
 */  


export const adminDashboardauth = {
  refreshtoken: function () {
    const refreshToken = getRefreshToken();
    const token = token;
    return adminAxiosInstance.post(
      `/api/v1/admin/auth/refresh`,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
  },
  login:function(formData){
    return adminAxiosInstance.post(
     "/api/v1/admin/auth/login",
     formData,
   );
  },
  signup:function(formData){
    return adminAxiosInstance.post(
     "/api/v1/admin/auth/register",
     formData,
   );
  }
};
