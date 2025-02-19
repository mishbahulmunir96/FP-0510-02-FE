"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useAxios from "../useAxios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CreateReviewPayload {
  paymentId: number;
  rating: number;
  review: string;
}

interface ReviewResponse {
  id: number;
  rating: number;
  review: string;
  user: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
  property: {
    id: number;
    title: string;
  };
}

const useCreateReview = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const { data } = await axiosInstance.post<ReviewResponse>("/reviews", {
        ...payload,
        userId: session?.user?.id,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Review succesfully added");
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useCreateReview;
