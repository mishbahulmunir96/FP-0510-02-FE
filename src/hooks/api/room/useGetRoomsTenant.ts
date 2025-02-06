"use client";

import useAxios from "@/hooks/api/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { Room } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

interface GetRoomsQueries extends PaginationQueries {
  propertyId?: number;
  search?: string;
}

export const useGetRoomsTenant = (queries: GetRoomsQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["room", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Room>>(
        "/rooms/tenant",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};
