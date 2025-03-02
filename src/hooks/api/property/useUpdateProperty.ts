"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UpdatePropertyPayload {
  description: string;
  latitude: string;
  location: string;
  longitude: string;
  slug: string;
  title: string;
  imageUrl: File[] | null; // Changed from File | null to File[] | null
  propertyCategoryId: number;
}

const useUpdateProperty = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePropertyPayload) => {
      const editPropertyForm = new FormData();

      editPropertyForm.append("title", payload.title);
      editPropertyForm.append("slug", payload.slug);
      editPropertyForm.append("description", payload.description);
      editPropertyForm.append("location", payload.location);
      editPropertyForm.append("latitude", payload.latitude);
      editPropertyForm.append("longitude", payload.longitude);
      editPropertyForm.append(
        "propertyCategoryId",
        String(payload.propertyCategoryId),
      );

      // Add each image file with the same key "imageUrl"
      if (payload.imageUrl && payload.imageUrl.length > 0) {
        payload.imageUrl.forEach((image) => {
          editPropertyForm.append("imageUrl", image);
        });
      }

      const { data } = await axiosInstance.patch(
        `/properties/${id}`,
        editPropertyForm,
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("Update property success");
      router.push("/tenant/dashboard/property/management"); // Fixed the path - added leading slash
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useUpdateProperty;
