import { axiosInstance } from "./axiosInstance";

export async function createReview(eventId, data, config = {}) {
  return axiosInstance.post(`/api/v1/reviews/${eventId}`, data, config);
}

export async function updateReview(reviewId, data, config = {}) {
  return axiosInstance.put(`/api/v1/reviews/${reviewId}`, data, config);
}

export async function deleteReview(reviewId, config = {}) {
  return axiosInstance.delete(`/api/v1/reviews/${reviewId}`, config);
}

export async function getEventReviews(eventId, params = {}, config = {}) {
  return axiosInstance.get(`/api/v1/reviews/${eventId}`, {
    ...config,
    params,
  });
}

export async function getMyEventReview(eventId, config = {}) {
  return axiosInstance.get(`/api/v1/reviews/${eventId}/my-review`, config);
}
