"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";

interface UpdateProfilePayload {
  name: string;
  imageFile: File | null;
}

interface UpdateProfileResponse {
  status: "success";
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    imageUrl: string;
    isVerified: boolean;
    role: "USER";
    provider: "CREDENTIAL";
    createdAt: string;
    updatedAt: string;
  };
}

interface ApiError {
  message: string;
}

const QUERY_KEY = ["account"] as const;

const useUpdateProfile = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProfileResponse,
    AxiosError<ApiError>,
    UpdateProfilePayload
  >({
    mutationFn: async ({ name, imageFile }) => {
      // Buat FormData untuk mengirim data multipart/form-data
      const formData = new FormData();
      formData.append("name", name);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      // Jangan set header "Content-Type" secara manual!
      // Axios akan otomatis menyetelnya bersama boundary yang diperlukan
      const { data } = await axiosInstance.patch("/account", formData);
      return data;
    },
    onSuccess: async () => {
      // Setelah berhasil update, invalidate query agar data terbaru di-fetch
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });
};

export default useUpdateProfile;
