"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CreatePropertyPayload {
  description: string;
  latitude: string;
  longitude: string;
  slug: string;
  location: string;
  title: string;
  imageUrl: File | null;
  propertyCategoryId: number;
}

const useCreateProperty = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePropertyPayload) => {
      const createPropertyForm = new FormData();

      createPropertyForm.append("title", payload.title);
      createPropertyForm.append("slug", payload.slug);
      createPropertyForm.append("description", payload.description);
      createPropertyForm.append("location", payload.location);
      createPropertyForm.append("latitude", payload.latitude);
      createPropertyForm.append("longitude", payload.longitude);
      createPropertyForm.append(
        "propertyCategoryId",
        String(payload.propertyCategoryId),
      );
      createPropertyForm.append("imageUrl", payload.imageUrl!);

      const { data } = await axiosInstance.post(
        "/property/create-property",
        createPropertyForm,
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("Create property success");
      router.push("/tenant/dashboard/");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useCreateProperty;
