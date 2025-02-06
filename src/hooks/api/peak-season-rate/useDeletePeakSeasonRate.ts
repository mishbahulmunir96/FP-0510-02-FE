"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useDeletePeakSeasonRate = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(
        `/peak-season-rates/delete/${id}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peakSeasonRate"] });
      toast.success("Peak Season Rate deleted successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete Peak Season Rate",
      );
    },
  });
};
