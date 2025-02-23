import { PropertyReport } from "@/types/report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface PropertyReportParams {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

interface ApiResponse {
  status: string;
  data: PropertyReport[];
  metadata: {
    filterType: string;
    startDate: string;
    endDate: string;
    propertyId?: number;
  };
}

const usePropertyReport = (params: PropertyReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<PropertyReport[]>({
    queryKey: ["propertyReport", params],
    queryFn: async () => {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(
        "/statistics/property",
        {
          params: {
            startDate: params.startDate.toISOString(),
            endDate: params.endDate.toISOString(),
            ...(params.propertyId && { propertyId: params.propertyId }),
          },
        },
      );
      return response.data.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });
};

export default usePropertyReport;
