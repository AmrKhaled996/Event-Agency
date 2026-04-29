import { axiosInstance } from "./axiosInstence";
//?q=I+am+looking+for+event+to+relax&limit=5&page=1&organizerId=&minPrice=&maxPrice=&hasSeatMap=
export async function getSearchEvents({
  q,
  limit,
  page,
  organizerId,
  minPrice,
  maxPrice,
  categoryId,
  location,
}) {
  return axiosInstance.get('/api/v1/search', {
    params: {
      ...(q && { q }),
      ...(limit && { limit }),
      ...(page && { page }),
      ...(organizerId && { organizerId }),
      ...(minPrice !== undefined && { minPrice }),
      ...(maxPrice !== undefined && { maxPrice }),
      ...(categoryId && { categoryId }),
      ...(location && { location }),
    },
  });
}