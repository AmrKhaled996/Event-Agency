import { axiosInstance } from "./axiosInstence";
import { getAccessToken } from "../services/cookieTokenService";

export async function createEvent(formDataa) {
  const token = getAccessToken();

  //   const formData = new FormData();

  // formData.append("banner",formDataa.banner);
  // formData.append("title", formDataa.title);
  // formData.append("description", formDataa.description);
  // formData.append("type", formDataa.type);
  // formData.append("mode", formDataa.mode);
  // formData.append("categoryName", formDataa.categoryName);

  // formData.append("location[address]", formDataa.location.address);
  // formData.append("location[city]", formDataa.location.city);
  // formData.append("location[state]", formDataa.location.state);
  // formData.append("location[country]", formDataa.location.country);
  // formData.append("location[latitude]", formDataa.location.lat);
  // formData.append("location[longitude]", formDataa.location.lon);

  // for (let pair of formData.entries()) {
  //   console.log(pair[0], pair[1]);
  // }

  return axiosInstance.post("/api/v1/organizer/events", formDataa, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function updateEvent(formData, id) {
  const token = getAccessToken();
  console.log(formData);
  return axiosInstance.put(`/api/v1/organizer/events/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function deleteEvent(id) {
  const token = getAccessToken();

  return axiosInstance.delete(`/api/v1/organizer/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function cancelEvent(id) {
  const token = getAccessToken();

  return axiosInstance.patch(`/api/v1/organizer/events/${id}`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function getAllEvents() {
  const token = getAccessToken();

  return axiosInstance.get(
    `/api/v1/organizer/events`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
