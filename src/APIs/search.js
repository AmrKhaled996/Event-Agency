import { axiosInstance } from "./axiosInstance";

export async function getSearchEvents({
  q,
  limit,
  page,
  organizerId,
  minPrice,
  maxPrice,
  categoryId,
  location,
  date,
}) {
  return axiosInstance.get('/api/v1/search', {
    params: {
      ...(q !== undefined && q !== null && q !== "" && { q }),
      ...(limit !== undefined && limit !== null && { limit }),
      ...(page !== undefined && page !== null && { page }),
      ...(organizerId !== undefined && organizerId !== null && organizerId !== "" && { organizerId }),
      ...(minPrice !== undefined && minPrice !== null && { minPrice }),
      ...(maxPrice !== undefined && maxPrice !== null && { maxPrice }),
      ...(categoryId !== undefined && categoryId !== null && { categoryId }),
      ...(location !== undefined && location !== null && location !== "" && { location }),
      ...(date !== undefined && date !== null && date !== "" && { date }),
    },
  });
}