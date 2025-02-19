"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxios from "../useAxios";
import { useRouter } from "next/navigation";

const useCancelTransactionByTenant = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: number) => {
      const { data } = await axiosInstance.patch(
        `/transactions/tenant/cancel/${paymentId}`,
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
      queryClient.invalidateQueries({
        queryKey: ["transactionDetailTenant"],
      });
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel transaction");
    },
  });
};

export default useCancelTransactionByTenant;
