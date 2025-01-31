"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";

interface Transaction {
  id: number;
  uuid: string;
  userId: number;
  totalPrice: number;
  paymentMethode: "MANUAL" | "OTOMATIS";
  status:
    | "WAITING_FOR_PAYMENT"
    | "WAITING_FOR_PAYMENT_CONFIRMATION"
    | "CANCELLED"
    | "PROCESSED";
  paymentProof: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  duration: number;
  updatedAt: string | null;
  reservations: {
    roomType: "Deluxe" | "Standard" | "Suite";
    roomPrice: number;
    propertyTitle: string;
    propertyLocation: string;
    roomImages: string[];
    roomFacilities: string[];
  }[];
}

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
