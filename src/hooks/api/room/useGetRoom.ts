"use client";

import useAxios from "@/hooks/api/useAxios";
import { Room } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

const useGetRoom = (id: number) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Room>(`/rooms/${id}`);
      return data;
    },
  });
};

export default useGetRoom;
