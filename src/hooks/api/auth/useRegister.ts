"use client";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "TENANT";
  bankName?: string;
  bankNumber?: string;
  phoneNumber?: string;
  image?: File;
}

const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const { data } = await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Registration successful");
      router.push("/login");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export default useRegister;
