import { UserReport } from "@/types/report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";

interface UserReportParams {
  startDate: Date;
  endDate: Date;
  limit?: number;
}

const useUserReport = (params: UserReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<UserReport>({
    queryKey: ["userReport", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/statistics/user", {
        params: {
          startDate: params.startDate.toISOString(),
          endDate: params.endDate.toISOString(),
          ...(params.limit && { limit: params.limit }),
        },
      });
      return data.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });
};

export default useUserReport;
