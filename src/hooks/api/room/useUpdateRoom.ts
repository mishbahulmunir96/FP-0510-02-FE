"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


interface Facility {
  id?: number;
  title: string;
  description: string;
  isDeleted?: boolean;
}

interface UpdateRoomPayload {
  type: "Deluxe" | "Standard" | "Suite";
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
  imageUrl?: File;
  facilities: Facility[];
}

const useUpdateRoom = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRoomPayload) => {
      const formData = new FormData();

 
      formData.append("type", payload.type);
      formData.append("name", payload.name);
      formData.append("stock", String(payload.stock));
      formData.append("price", String(payload.price));
      formData.append("guest", String(payload.guest));
      formData.append("propertyId", String(payload.propertyId));

   
      if (payload.imageUrl) {
        formData.append("imageUrl", payload.imageUrl);
      }


      formData.append("facilities", JSON.stringify(payload.facilities));

      const { data } = await axiosInstance.patch(`/rooms/room/${id}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Update room success");
      router.push("/tenant/dashboard/property/room");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data || "Update room failed";
      toast.error(errorMessage);
      console.error("Update room error:", error);
    },
  });
};

export default useUpdateRoom;
