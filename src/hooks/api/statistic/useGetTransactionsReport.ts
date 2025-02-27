import { TransactionReport } from "@/types/report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface TransactionReportParams {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

interface ApiResponse {
  status: string;
  data: TransactionReport;
  metadata: {
    filterType: string;
    startDate: string;
    endDate: string;
    propertyId?: number;
  };
}

const useTransactionReport = (params: TransactionReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<TransactionReport>({
    queryKey: ["transactionReport", params],
    queryFn: async () => {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(
        "/statistics/transaction",
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
    enabled: !!params.startDate && !!params.endDate,
  });
};

export default useTransactionReport;
