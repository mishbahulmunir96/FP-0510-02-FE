"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UpdateRoomPayload {
  type: "Deluxe" | "Standard" | "Suite";
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
  imageUrl?: File;
  facilityTitle?: string;
  facilityDescription?: string;
}

const useUpdateRoom = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRoomPayload) => {
      const formData = new FormData();

      formData.append("type", payload.type);
      formData.append("stock", String(payload.stock));
      formData.append("price", String(payload.price));
      formData.append("guest", String(payload.guest));
      formData.append("propertyId", String(payload.propertyId));

      if (payload.imageUrl) {
        formData.append("imageUrl", payload.imageUrl);
      }

      if (payload.facilityTitle) {
        formData.append("facilityTitle", payload.facilityTitle);
      }

      if (payload.facilityDescription) {
        formData.append("facilityDescription", payload.facilityDescription);
      }

      const { data } = await axiosInstance.patch(
        `/rooms/update-room/${id}`,
        formData,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Update room success");
      router.push("/tenant/dashboard/property/room");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data || "Update room failed");
    },
  });
};

export default useUpdateRoom;
