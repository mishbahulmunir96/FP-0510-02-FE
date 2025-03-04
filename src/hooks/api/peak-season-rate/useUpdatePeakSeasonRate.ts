"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface UpdatePeakSeasonRatePayload {
  id: number;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  roomId?: number;
}

export const useUpdatePeakSeasonRate = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePeakSeasonRatePayload) => {
      const { id, ...data } = payload;
      const { data: response } = await axiosInstance.patch(
        `/peak-season-rates/${id}`,
        data,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peakSeasonRate"] });
      toast.success("Peak Season Rate updated successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to update Peak Season Rate",
      );
    },
  });
};
