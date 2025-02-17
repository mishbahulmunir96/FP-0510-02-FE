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
    enabled: !!transactionId,
  });
};

export default useGetTransactionByUser;
