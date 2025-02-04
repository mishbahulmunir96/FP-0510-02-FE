import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface VerifyChangeEmailPayload {
  token: string;
  password: string;
}

export const useVerifyChangeEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: VerifyChangeEmailPayload) => {
      const { data } = await axiosInstance.post(
        "/account/verify-change-email",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Email changed successfully");
      router.push("/login");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to verify email change",
      );
    },
  });
};
