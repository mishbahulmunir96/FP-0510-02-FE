import { SalesReport } from "@/types/report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface SalesReportParams {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

interface ApiResponse {
  status: string;
  data: SalesReport;
  metadata: {
    filterType: string;
    startDate: string;
    endDate: string;
    propertyId?: number;
  };
}

const useSalesReport = (params: SalesReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<SalesReport>({
    queryKey: ["salesReport", params],
    queryFn: async () => {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(
        "/statistics/report",
        {
          params: {
            startDate: params.startDate.toISOString(),
            endDate: params.endDate.toISOString(),
            propertyId: params.propertyId || undefined,
          },
        },
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!params.startDate && !!params.endDate,
  });
};

export default useSalesReport;
