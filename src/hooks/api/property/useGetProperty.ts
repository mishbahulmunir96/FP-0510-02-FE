"use client";

import useAxios from "@/hooks/api/useAxios";
import { Property } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

const useGetProperty = (slug: string) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["property", slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Property>(`/property/${slug}`);

      return data;
    },
  });
};

export default useGetProperty;
