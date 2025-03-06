"use client";

import useAxios from "@/hooks/api/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { PeakSeasonRate } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

interface GetPeakSeasonsQueries extends PaginationQueries {
  search?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  roomId?: number;
  userId: number;
}

export const useGetPeakSeasons = (queries: GetPeakSeasonsQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["peakSeasonRate", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<PeakSeasonRate>
      >("/peak-season-rates", { params: queries });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
