"use client";

import useAxios from "@/hooks/api/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { Property } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

export interface PropertySearchQueries extends PaginationQueries {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  guest?: number;
  title?: string;
  price?: number;
  propertyCategoryId?: number;
}

export const usePropertySearch = (queries: PropertySearchQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["properties", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Property>>(
        "/properties/search",
        { params: queries },
      );
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
