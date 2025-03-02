"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";

interface ReviewResponse {
  id: number;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    imageUrl: string | null;
  };
  property: {
    title: string;
    location: string;
  } | null;
  room: {
    type: string;
    price: number;
    images: { imageUrl: string | null }[];
    facilities: { title: string; description: string }[];
  } | null;
}

const useGetReviewByTransaction = (paymentId: number) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["review", paymentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ReviewResponse>(
        `/reviews/transactions/${paymentId}`,
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useGetReviewByTransaction;
