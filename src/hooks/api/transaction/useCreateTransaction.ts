import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAxios from "../useAxiosDummy";

// Enum untuk Status Transaksi
export enum TransactionStatus {
  WAITING_FOR_PAYMENT = "Waiting Payment",
  WAITING_FOR_PAYMENT_CONFIRMATION = "Waiting Confirmation",
  PROCESSED = "Processed",
  CANCELLED = "Cancelled",
}

// Payload untuk membuat transaksi
export interface CreateTransactionPayload {
  roomId: number;
  startDate: Date;
  endDate: Date;
}

const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      const { data } = await axiosInstance.post("/api/transactions", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      router.push(`/transaction/${data.id}`);
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Terjadi kesalahan";
      toast.error(errorMessage);
    },
  });
};

export default useCreateTransaction;
