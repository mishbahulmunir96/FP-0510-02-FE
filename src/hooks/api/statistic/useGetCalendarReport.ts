"use client";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";

/**
 * Interface for room calendar data within a specific day
 */
export interface RoomCalendarData {
  roomId: number;
  roomName: string;
  roomType: "Deluxe" | "Suite" | "Standard";
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  isNonAvailable: boolean;
  isPeakSeason: boolean;
  price: number;
}

/**
 * Interface for a day's calendar data
 */
export interface DayCalendarData {
  date: string;
  totalRooms: number;
  totalBookedRooms: number;
  totalAvailableRooms: number;
  occupancyRate: number;
  rooms: RoomCalendarData[];
}

/**
 * Interface for the full property calendar report
 */
export interface PropertyCalendarReport {
  propertyId: number;
  propertyName: string;
  calendarData: DayCalendarData[];
}

/**
 * API response format
 */
export interface PropertyCalendarReportResponse {
  status: string;
  data: PropertyCalendarReport;
}

/**
 * Parameters for the calendar report API request
 */
export interface PropertyCalendarReportParams {
  propertyId: number;
  startDate: Date;
  endDate: Date;
  roomId?: number;
}

/**
 * Hook for fetching property calendar report data
 */
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
