"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxios from "../useAxios";
import { useRouter } from "next/navigation";

interface CancelTransactionResponse {
  id: number;
  status: string;
  updatedAt: string;
}

const useCancelTransaction = () => {
  const router = useRouter();

  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: number) => {
      const { data } = await axiosInstance.patch<CancelTransactionResponse>(
        `/transactions/cancel/${transactionId}`,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success("Transaction cancelled successfully");
      queryClient.invalidateQueries({
        queryKey: ["transaction", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      router.push(`/transactions/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel transaction");
    },
  });
};

export default useCancelTransaction;
