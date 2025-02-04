"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const useChangePassword = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationKey: ["changePassword"],
    mutationFn: async (payload: ChangePasswordPayload) => {
      if (payload.newPassword !== payload.confirmPassword) {
        throw new Error("New password and confirm password do not match");
      }

      const { confirmPassword, ...dataToSend } = payload;
      const { data } = await axiosInstance.patch(
        `/account/change-password`,
        dataToSend,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Change password success");
      router.push("/");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Change password failed");
    },
  });
};

export default useChangePassword;
