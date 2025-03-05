"use client";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";
import {
  PropertyCalendarReport,
  PropertyCalendarReportParams,
  PropertyCalendarReportResponse,
} from "@/types/calendar-report";

const useCalendarReport = (params: PropertyCalendarReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<PropertyCalendarReport>({
    queryKey: ["propertyCalendarReport", params],
    queryFn: async () => {
      const response = await axiosInstance.get<PropertyCalendarReportResponse>(
        "/statistics/calendar-report",
        {
          params: {
            propertyId: params.propertyId,
            startDate: params.startDate.toISOString().split("T")[0],
            endDate: params.endDate.toISOString().split("T")[0],
            ...(params.roomId && { roomId: params.roomId }),
          },
        },
      );
      return response.data.data;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!params.propertyId && !!params.startDate && !!params.endDate,
  });
};

export default useCalendarReport;
