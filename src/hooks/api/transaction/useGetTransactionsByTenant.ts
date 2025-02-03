"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";
import {
  TransactionFilters,
  TransactionResponse,
} from "@/types/transactionByTenant";

const useGetTransactionsByTenant = (
  page: number = 1,
  take: number = 10,
  filters?: TransactionFilters,
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
        },
      });
      return data;
    },
  });
};

export default useGetTransactionsByTenant;
