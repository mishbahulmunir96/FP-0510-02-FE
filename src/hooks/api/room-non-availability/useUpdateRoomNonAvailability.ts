"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UpdateRoomNonAvailabilityPayload {
  id: number;
  reason: string;
}

const useUpdateRoomNonAvailability = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRoomNonAvailabilityPayload) => {
      const { data } = await axiosInstance.patch(
        `/room-non-availabilities/non-availability/${payload.id}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roomNonAvailabilities"] });
      toast.success("Update Room Non Availability Success");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useUpdateRoomNonAvailability;
