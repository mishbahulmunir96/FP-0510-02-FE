"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";
import { TransactionDetail } from "@/types/transaction";

const useGetTransactionByUser = (transactionId: number) => {
  const { axiosInstance } = useAxios();

  return useQuery<TransactionDetail, Error>({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TransactionDetail>(
        `/transactions/${transactionId}`,
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!transactionId,
  });
};

export default useGetTransactionByUser;
