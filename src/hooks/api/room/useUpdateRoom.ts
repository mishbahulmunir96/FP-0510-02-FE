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
}

const useUpdateRoom = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRoomPayload) => {
      const editRoomForm = new FormData();

      // Karena field room pada schema adalah "type" bukan "name"
      editRoomForm.append("type", payload.type);
      editRoomForm.append("stock", String(payload.stock));
      editRoomForm.append("price", String(payload.price));
      editRoomForm.append("guest", String(payload.guest));
      editRoomForm.append("propertyId", String(payload.propertyId));

      const { data } = await axiosInstance.patch(
        `/rooms/update-room/${id}`,
        editRoomForm,
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Update room success");
      router.push("/dashboard/property/room");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data || "Update room failed");
    },
  });
};

export default useUpdateRoom;
