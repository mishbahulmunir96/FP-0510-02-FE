"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAxios from "../useAxios";

const useConfirmCheckIn = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: number) => {
      const { data } = await axiosInstance.patch(
        `/transactions/check-in/${paymentId}`,
      );
      return data;
    },
    onSuccess: (_, paymentId) => {
      toast.success("Check-in successfully confirmed");
      queryClient.invalidateQueries({ queryKey: ["transactionsByTenant"] });
      queryClient.invalidateQueries({
        queryKey: ["transactionDetailTenant", paymentId],
      });
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while processing check-in",
      );
    },
  });
};

export default useConfirmCheckIn;
