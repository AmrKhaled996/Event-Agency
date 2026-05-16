import { axiosInstance } from "./axiosInstance";

/**
 * GET /api/v1/organizer/:id
 */
export const getOrganizerPublicProfile = (id) => {
  return axiosInstance.get(`/api/v1/organizer/${id}`);
};

/**
 * POST /api/v1/organizer/:id/follow
 */
export const followOrganizer = (id) => {
  return axiosInstance.post(`/api/v1/organizer/${id}/follow`);
};

/**
 * DELETE /api/v1/organizer/:id/unfollow
 */
export const unfollowOrganizer = (id) => {
  return axiosInstance.delete(`/api/v1/organizer/${id}/unfollow`);
};
