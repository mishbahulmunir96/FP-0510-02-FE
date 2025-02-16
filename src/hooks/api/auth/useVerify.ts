// hooks/auth/useVerify.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { axiosInstance } from "@/lib/axios";

interface VerifyPayload {
  token: string;
  password: string;
  name: string;
}

export const useVerify = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: VerifyPayload) => {
      const { data } = await axiosInstance.post("/auth/verify", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Verification failed");
    },
  });
};
