import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LoginPayload {
  email: string;
  password: string;
}

const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        // First try to authenticate with your API
        const { data } = await axiosInstance.post("/auth/login", payload);

        // Then use NextAuth
        const result = await signIn("credentials", {
          email: payload.email,
          password: payload.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.message || "Failed to process login",
          );
        }
        throw error;
      }
    },
    onSuccess: async (data) => {
      toast.success("Login successful");

      // Store the token
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.role === "TENANT") {
        router.replace("/tenant/dashboard");
      } else {
        router.replace("/");
      }

      // Force a router refresh to update the UI
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process login");
    },
  });
};

export default useLogin;
