"use client";

import useAxios from "@/hooks/api/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { Room } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

interface GetRoomsQueries extends PaginationQueries {
  propertyId?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  guest?: number;
}

export const useGetRooms = (queries: GetRoomsQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["room", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Room>>(
        "/rooms",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};
