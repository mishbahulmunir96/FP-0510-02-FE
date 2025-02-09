"use client";

import { Filters, TransactionResponse } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";

const useGetTransactionsByUser = (
  userId: number,
  page: number,
  take: number,
  filters?: Filters,
) => {
  const { axiosInstance } = useAxios();

  return useQuery<TransactionResponse>({
    queryKey: ["transactions", userId, page, take, filters],
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

export default useGetTransactionsByUser;
