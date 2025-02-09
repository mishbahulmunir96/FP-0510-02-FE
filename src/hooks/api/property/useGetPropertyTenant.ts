"use client";

import useAxios from "@/hooks/api/useAxios";
import { Property } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

const useGetPropertyTenant = (id: number) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Property>(
        `/property/tenant/${id}`,
      );
      return data;
    },
  });
};

export default useGetPropertyTenant;
