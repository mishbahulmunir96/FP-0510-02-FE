"use client";

import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";

type SortOrder = "asc" | "desc";

interface TransactionFilters {
  sortBy: string;
  sortOrder: SortOrder;
  startDate?: Date;
  endDate?: Date;
}

interface TransactionResponse {
  data: Transaction[];
  meta: {
    total: number;
    totalCount: number;
    page: number;
    take: number;
  };
}

const useGetTransactionByUser = (
  userId: number,
  page: number,
  take: number,
  filters?: TransactionFilters,
) => {
  const { axiosInstance } = useAxios();

  return useQuery<TransactionResponse>({
    queryKey: ["TransactionsByUser", userId, page, filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/transactions`, {
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
    enabled: !!userId,
  });
};

export default useGetTransactionByUser;
