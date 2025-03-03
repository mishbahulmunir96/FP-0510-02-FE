import { TransactionDetail } from "@/types/transactionByTenant";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";

const useGetTransactionDetailByTenant = (id: number) => {
  const { axiosInstance } = useAxios();

  return useQuery<TransactionDetail>({
    queryKey: ["transactionDetailTenant", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/transactions/tenant/${id}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export default useGetTransactionDetailByTenant;
