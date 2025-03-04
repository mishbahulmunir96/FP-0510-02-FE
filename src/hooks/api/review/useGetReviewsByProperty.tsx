import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface ReviewsByPropertyParams {
  propertyId?: number;
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const useGetReviewsByProperty = ({
  propertyId,
  page = 1,
  take = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
}: ReviewsByPropertyParams) => {
  return useQuery({
    queryKey: [
      "reviews",
      "property",
      propertyId,
      page,
      take,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/reviews/property/${propertyId}`,
        {
          params: {
            page,
            take,
            sortBy,
            sortOrder,
          },
        },
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useGetReviewsByProperty;
