import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Property } from "../../../types/property"; // Pastikan path sesuai
import { PageableResponse, PaginationQueries } from "../../../types/pagination";

interface GetPropertiesQuery extends PaginationQueries {
  location?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  search?: string;
  guest?: number;
}

const useGetProperties = (queries: GetPropertiesQuery) => {
  return useQuery({
    queryKey: ["properties", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Property>>(
        "/properties",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};

export default useGetProperties;
