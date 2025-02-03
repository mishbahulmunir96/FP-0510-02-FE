import { Transaction } from "@/types/transactionByTenant";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";

const useGetTransactionDetailByTenant = (id: number) => {
  const { axiosInstance } = useAxios();

  return useQuery<Transaction>({
    queryKey: ["transactionDetailTenant", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/transactions/tenant/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export default useGetTransactionDetailByTenant;
