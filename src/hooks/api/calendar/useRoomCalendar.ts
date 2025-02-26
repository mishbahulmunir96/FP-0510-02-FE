"use client";

import useAxios from "@/hooks/api/useAxios";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

export interface CalendarEntry {
  date: string;
  price: number;
  isPeakSeason: boolean;
  isAvailable: boolean;
  availableStock: number;
  totalStock: number;
}

export interface RoomCalendarData {
  success: boolean;
  data: {
    roomId: number;
    basePrice: number;
    calendar: {
      [key: string]: CalendarEntry;
    };
  };
}

const useRoomCalendar = (
  roomId: number,
  date: Date = new Date(),
  options = { enabled: true },
) => {
  const { axiosInstance } = useAxios();
  const formattedDate = format(date, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["roomCalendar", roomId, format(date, "yyyy-MM")],
    queryFn: async () => {
      if (!roomId) return null;

      const { data } = await axiosInstance.get<RoomCalendarData>(
        `/calendar/room/${roomId}?date=${formattedDate}`,
      );
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: roomId > 0 && options.enabled,
  });
};

export default useRoomCalendar;
