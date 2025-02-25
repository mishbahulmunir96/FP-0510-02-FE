"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import useAxios from "../useAxios";
import { toast } from "react-toastify";

interface UploadPaymentProofPayload {
  transactionId: number;
  paymentProof: File;
}

interface PaymentProofResponse {
  id: number;
  status: string;
  paymentProof: string;
  updatedAt: string;
}

const useUploadPaymentProof = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation<
    PaymentProofResponse,
    AxiosError<{ message: string }>,
    UploadPaymentProofPayload
  >({
    mutationFn: async ({ transactionId, paymentProof }) => {
      const formData = new FormData();
      formData.append("paymentProof", paymentProof);

      const { data } = await axiosInstance.patch<PaymentProofResponse>(
        `/transactions/${transactionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success("Payment proof uploaded successfully");

      queryClient.invalidateQueries({
        queryKey: ["transaction", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload payment proof",
      );
    },
  });
};

export default useUploadPaymentProof;
