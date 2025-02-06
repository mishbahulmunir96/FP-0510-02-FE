"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CreateCategoryPayload {
  name: string;
}

const useCreateCategory = (propertyCategoryId: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const { data } = await axiosInstance.post(
        `/categories/create-category${propertyCategoryId}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categorylist"] });
      toast.success("Create Category success");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useCreateCategory;
