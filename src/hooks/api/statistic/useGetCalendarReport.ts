// hooks/api/property/usePropertyCalendarReport.ts
import { PropertyCalendarReport, RoomType } from "@/types/calendar-report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";

interface CalendarReportParams {
  propertyId: number;
  startDate: Date;
  endDate: Date;
  roomType?: RoomType;
}

const usePropertyCalendarReport = (params: CalendarReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<PropertyCalendarReport>({
    queryKey: ["propertyCalendarReport", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/property/calendar-report", {
        params: {
          propertyId: params.propertyId,
          startDate: params.startDate.toISOString().split("T")[0],
          endDate: params.endDate.toISOString().split("T")[0],
          ...(params.roomType && { roomType: params.roomType }),
        },
      });
      return data.data;
    },
    enabled: !!params.propertyId && !!params.startDate && !!params.endDate,
  });
};

export default usePropertyCalendarReport;
