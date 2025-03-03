"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";
import { Tenant } from "@/types/property";

const useGetTenant = () => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["tenant"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Tenant>(`/account/tenant`);
      return data;
    },
  });
};

export default useGetTenant;
