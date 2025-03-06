"use client";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: "USER" | "TENANT";
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

      // Menambahkan field umum
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("role", payload.role);

      if (payload.role === "TENANT") {
        if (!payload.bankName || !payload.bankNumber || !payload.phoneNumber) {
          throw new Error(
            "Bank Name, Bank Number, and Phone Number are required for TENANT role",
          );
        }
        formData.append("bankName", payload.bankName!);
        formData.append("bankNumber", payload.bankNumber!);
        formData.append("phoneNumber", payload.phoneNumber!);
      }

      if (payload.image) {
        formData.append("image", payload.image);
      }

      const { data } = await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("send email success. Please check your email.");
      router.push("/login");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export default useRegister;
