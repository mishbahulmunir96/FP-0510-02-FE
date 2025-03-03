"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";
import { Tenant } from "@/types/property";

const useGetTenant = () => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/account/profile`);
      return data.data; // Access the user data from the response structure
    },
  });
};

export default useGetTenant;
