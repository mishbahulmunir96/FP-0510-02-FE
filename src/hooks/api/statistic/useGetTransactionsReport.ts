// hooks/api/statistic/useGetTransactionsReport.ts
import { TransactionReport } from "@/types/report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";

interface TransactionReportParams {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

const useTransactionReport = (params: TransactionReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<TransactionReport>({
    queryKey: ["transactionReport", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/statistics/transaction", {
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

export default useTransactionReport;
