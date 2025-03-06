import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/api/useAxios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CreateReservationPayload {
  roomId: number;
  startDate: Date;
  endDate: Date;
  paymentMethode: "MANUAL" | "OTOMATIS";
}

const useCreateReservation = () => {
  const { axiosInstance } = useAxios();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CreateReservationPayload) => {
      const { data } = await axiosInstance.post("/transactions", payload);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Reservation created successfully!");
      if (data.payment.paymentMethode === "OTOMATIS") {
        window.location.href = data.payment.invoiceUrl;
      } else {
        router.push(`/user/dashboard/transactions/${data.payment.id}`);
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create reservation",
      );
    },
  });
};

export default useCreateReservation;
