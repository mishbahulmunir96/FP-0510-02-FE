"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface PeakSeasonRatePayload {
  price: number;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const useCreatePeakSeasonRate = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PeakSeasonRatePayload) => {
      const { data } = await axiosInstance.post("/peak-season-rates", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peakSeasonRate"] });
      toast.success("Peak Season Rate created successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to create Peak Season Rate",
      );
    },
  });
};
