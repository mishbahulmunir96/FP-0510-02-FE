"use client";

import { TransactionResponse } from "@/types/transactionByTenant";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";
import { Filters } from "@/types/transaction";

const useGetTransactionsByTenant = (
  page: number = 1,
  take: number = 10,
  filters?: Filters,
) => {
  const { axiosInstance } = useAxios();

  return useQuery<TransactionResponse>({
    queryKey: ["transactionsByTenant", page, take, filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/transactions/tenant`, {
        params: {
          page,
          take,
          sortBy: filters?.sortBy || "createdAt",
          sortOrder: filters?.sortOrder || "desc",
          startDate: filters?.startDate?.toISOString(),
          endDate: filters?.endDate?.toISOString(),
        },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useGetTransactionsByTenant;
