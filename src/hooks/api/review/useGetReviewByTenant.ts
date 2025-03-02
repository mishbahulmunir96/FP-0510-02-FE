import { useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";

const useGetReviewByTenant = (paymentId: number) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["review", "tenant", paymentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/reviews/tenant/transactions/${paymentId}`,
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useGetReviewByTenant;
