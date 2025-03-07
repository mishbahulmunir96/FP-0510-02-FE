"use client";

import useAxios from "@/hooks/api/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { Property } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

interface GetPropertyQueries extends PaginationQueries {
  userId?: number;
  search?: string;
}

export const useGetPropertiesTenant = (queries: GetPropertyQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["tenant-properties", queries],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<PageableResponse<Property>>(
          "/properties/tenant",
          { params: queries },
        );
        return data;
      } catch (error) {
        console.error("Error fetching properties:", error);
        throw error;
      }
    },
  });
};
