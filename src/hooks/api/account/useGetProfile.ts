import useAxios from "@/hooks/api/useAxios";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const useGetProfile = () => {
  const { axiosInstance } = useAxios();
  return useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<User>("/account/profile");
      return data;
    },
  });
};

export default useGetProfile;
