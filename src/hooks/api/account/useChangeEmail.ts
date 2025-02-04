import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ChangeEmailPayload {
  email: string;
}

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: async (payload: ChangeEmailPayload) => {
      const { data } = await axiosInstance.post(
        "/account/change-email",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Verification email sent. Please check your email.");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to change email");
    },
  });
};
