"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAxios from "../useAxios";

interface ApproveTransactionPayload {
  paymentId: number;
  isApproved: boolean;
}

const useApproveTransactionByTenant = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ApproveTransactionPayload) => {
      const { data } = await axiosInstance.patch(
        `/transactions/tenant/${payload.paymentId}`,
        { isApproved: payload.isApproved },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      const action = variables.isApproved ? "approved" : "rejected";
      toast.success(`Transaction successfully ${action}`);
      queryClient.invalidateQueries({ queryKey: ["transactionsByTenant"] });
      queryClient.invalidateQueries({
        queryKey: ["transactionDetailTenant", variables.paymentId],
      });
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while processing the transaction",
      );
    },
  });
};

export default useApproveTransactionByTenant;
