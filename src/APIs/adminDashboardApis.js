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
 * get api/v1/admin/categories
 * post api/v1/admin/categories
 * put api/v1/admin/categories/:categoryId
 * delete api/v1/admin/categories/:categoryId
 */

import {
  getRefreshToken,
} from "../services/cookieTokenService";

import { adminAxiosInstance } from "./axiosInstance";

/* =========================
   DASHBOARD
========================= */
// GET /api/v1/admin/dashboard/summary
export const getDashboardSummary = () => {
  return adminAxiosInstance.get("/api/v1/admin/dashboard/summary");
};

// GET /api/v1/admin/dashboard/review-queue?page=&limit=
export const getReviewQueue = () => {
  return adminAxiosInstance.get("/api/v1/admin/dashboard/review-queue");
};

/* =========================
   USERS
========================= */

// GET /api/v1/admin/users?page=&limit=&gender=
export const getUsers = (page) =>
  adminAxiosInstance.get(`/api/v1/admin/users?page=${page}&limit=8`);

// GET /api/v1/admin/users/:userId
export const getUserById = (userId) =>
  adminAxiosInstance.get(`/api/v1/admin/users/${userId}`);

// DELETE /api/v1/admin/users/:userId
export const deleteUser = (userId) =>
  adminAxiosInstance.delete(`/api/v1/admin/users/${userId}`);

// PATCH /api/v1/admin/users/:userId/restore
export const restoreUser = (userId) =>
  adminAxiosInstance.patch(`/api/v1/admin/users/${userId}/restore`,{});

/* =========================
   ORGANIZERS
========================= */

// GET /api/v1/admin/organizers?page=&limit=&verificationStatus=&status=
export const getOrganizers = (page) =>
  adminAxiosInstance.get(`/api/v1/admin/organizers?page=${page}&limit=8`);

// GET /api/v1/admin/organizers/:organizerId
export const getOrganizerById = (organizerId) =>
  adminAxiosInstance.get(`/api/v1/admin/organizers/${organizerId}`);

// PATCH actions
export const reactivateOrganizer = (id) =>
  adminAxiosInstance.patch(`/api/v1/admin/organizers/${id}/reactivate`,{});

export const suspendOrganizer = (id ,reason) =>
  adminAxiosInstance.patch(`/api/v1/admin/organizers/${id}/suspend`,{reason: reason.trim()});

export const rejectOrganizer = (id,reason) =>
  adminAxiosInstance.patch(`/api/v1/admin/organizers/${id}/reject`,{reason: reason.trim()});

export const approveOrganizer = (id) => {
  return adminAxiosInstance.patch(`/api/v1/admin/organizers/${id}/approve`,{});
};

/* =========================
   FINANCE
========================= */

// GET /api/v1/admin/finance/summary?days=
export const getFinanceSummary = () =>
  adminAxiosInstance.get("/api/v1/admin/finance/summary");

/* =========================
   ANALYTICS
========================= */

// GET /api/v1/admin/analytics/active-users?days=
export const getActiveUsers = () =>
  adminAxiosInstance.get("/api/v1/admin/analytics/active-users");

// GET /api/v1/admin/analytics/events/:eventId/revenue
export const getEventRevenue = (eventId) =>
  adminAxiosInstance.get(`/api/v1/admin/analytics/events/${eventId}/revenue`);

// GET /api/v1/admin/analytics/events/:eventId/tickets-sold
export const getEventTickets = (eventId) =>
  adminAxiosInstance.get(`/api/v1/admin/analytics/events/${eventId}/tickets-sold`);

/* =========================
   EVENTS
========================= */

// GET /api/v1/admin/events?page=&limit=
export const getEvents = (page) =>
  adminAxiosInstance.get(`/api/v1/admin/events?page=${page}&limit=8`);

// GET /api/v1/admin/events/:eventId
export const getEventById = (eventId) =>
  adminAxiosInstance.get(`/api/v1/admin/events/${eventId}`);

// DELETE /api/v1/admin/events/:eventId
export const deleteEvent = (eventId) =>
  adminAxiosInstance.delete(`/api/v1/admin/events/${eventId}`);

// PATCH /api/v1/admin/events/:eventId/restore
export const restoreEvent = (eventId) =>
  adminAxiosInstance.patch(`/api/v1/admin/events/${eventId}/restore`,{});


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

 /* =========================
   CATEGORIES
========================= */

// GET /api/v1/admin/categories
export const getCategories = () =>
  adminAxiosInstance.get("/api/v1/admin/categories");

// GET /api/v1/admin/categories/:categoryId
export const addCategory = (formData) =>
  adminAxiosInstance.post("/api/v1/admin/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  export const deleteCategory = (id) =>
  adminAxiosInstance.delete(`/api/v1/admin/categories/${id}`);

  export const editCategory = (id,formData) =>
  adminAxiosInstance.put(`/api/v1/admin/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* =========================
   COUPONS
========================= */

// GET /api/v1/admin/coupons
export const getCoupons = () =>
  adminAxiosInstance.get("/api/v1/admin/coupons");

// POST /api/v1/admin/coupons
export const addCoupon = (data) =>
  adminAxiosInstance.post("/api/v1/admin/coupons", data);

// DELETE /api/v1/admin/coupons/:id
export const deleteCoupon = (id) =>
  adminAxiosInstance.delete(`/api/v1/admin/coupons/${id}`);


export const adminDashboardauth = {
  refreshtoken: function () {
    const refreshToken = getRefreshToken(true);
    return adminAxiosInstance.post(
      `/api/v1/admin/auth/refresh`,
      { refreshToken }
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
