// hooks/api/statistic/useGetPropertyReport.ts
import { PropertyReport } from "@/types/report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";

interface PropertyReportParams {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

const usePropertyReport = (params: PropertyReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<PropertyReport[]>({
    queryKey: ["propertyReport", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/statistics/property", {
        params: {
          startDate: params.startDate.toISOString(),
          endDate: params.endDate.toISOString(),
          ...(params.propertyId && { propertyId: params.propertyId }),
        },
      });
      return data.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });
};

export default usePropertyReport;
