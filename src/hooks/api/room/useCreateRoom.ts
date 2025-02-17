"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CreateRoomPayload {
  type: "Deluxe" | "Standard" | "Suite";
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
  imageUrl: File | null;
  facilityTitle: string;
  facilityDescription: string;
}

const useCreateRoom = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRoomPayload) => {
      const createRoomForm = new FormData();

      createRoomForm.append("type", payload.type);
      createRoomForm.append("name", payload.name);
      createRoomForm.append("stock", String(payload.stock));
      createRoomForm.append("price", String(payload.price));
      createRoomForm.append("guest", String(payload.guest));
      createRoomForm.append("propertyId", String(payload.propertyId));

      if (payload.imageUrl) {
        createRoomForm.append("imageUrl", payload.imageUrl);
      }

      // Field untuk fasilitas ruangan
      createRoomForm.append("facilityTitle", payload.facilityTitle);
      createRoomForm.append("facilityDescription", payload.facilityDescription);

      const { data } = await axiosInstance.post(
        "/rooms/create-room",
        createRoomForm,
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Create room success");
      router.push("/tenant/dashboard/property/room");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useCreateRoom;
