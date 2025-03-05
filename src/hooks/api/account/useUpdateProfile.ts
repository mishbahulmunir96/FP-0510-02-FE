"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UpdateProfilePayload {
  name: string;
  imageFile: File | null;
}

const useUpdateProfile = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const updateProfileForm = new FormData();

      updateProfileForm.append("name", payload.name);
      if (payload.imageFile) {
        updateProfileForm.append("imageFile", payload.imageFile);
      }

      const { data } = await axiosInstance.patch("/account", updateProfileForm);
      return data;
    },
    onSuccess: async () => {
      toast.success("Update profile success");
      await queryClient.invalidateQueries({ queryKey: ["account"] });
      router.push("/user/dashboard/account");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || error.response?.data);
    },
  });
};

export default useUpdateProfile;
