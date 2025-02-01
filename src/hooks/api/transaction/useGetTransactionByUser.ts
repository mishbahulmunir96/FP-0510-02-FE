"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";
import { Transaction } from "@/types/transaction";

const useGetTransactionByUser = (transactionId: number) => {
  const { axiosInstance } = useAxios();

  return useQuery<Transaction, Error>({
    queryKey: ["TransactionDetail", transactionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Transaction>(
        `/transactions/${transactionId}`,
      );
      return data;
    },
    enabled: !!transactionId,
  });
};

export default useGetTransactionByUser;
