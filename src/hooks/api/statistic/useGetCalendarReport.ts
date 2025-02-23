import { CalendarReportResponse, RoomType } from "@/types/calendar-report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface CalendarReportParams {
  propertyId: number;
  startDate: Date;
  endDate: Date;
  roomType?: RoomType;
}

interface ApiResponse {
  status: string;
  data: CalendarReportResponse;
}

const useCalendarReport = (params: CalendarReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<CalendarReportResponse>({
    queryKey: ["calendarReport", params],
    queryFn: async () => {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(
        "/statistics/calendar-report",
        {
          params: {
            propertyId: params.propertyId,
            startDate: params.startDate.toISOString(),
            endDate: params.endDate.toISOString(),
            ...(params.roomType && { roomType: params.roomType }),
          },
        },
      );
      console.log("Api response:", response);
      return response.data.data;
    },
    enabled: !!params.propertyId && !!params.startDate && !!params.endDate,
  });
};

export default useCalendarReport;
