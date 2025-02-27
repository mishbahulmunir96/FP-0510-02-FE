import { UserReport } from "@/types/report";
import useAxios from "../useAxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UserReportParams {
  startDate: Date;
  endDate: Date;
  limit?: number;
}

interface ApiResponse {
  status: string;
  data: UserReport;
  metadata: {
    filterType: string;
    startDate: string;
    endDate: string;
    limit?: number;
  };
}

const useUserReport = (params: UserReportParams) => {
  const { axiosInstance } = useAxios();

  return useQuery<UserReport>({
    queryKey: ["userReport", params],
    queryFn: async () => {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(
        "/statistics/user",
        {
          params: {
            startDate: params.startDate.toISOString(),
            endDate: params.endDate.toISOString(),
            ...(params.limit && { limit: params.limit }),
          },
        },
      );
      return response.data.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });
};

export default useUserReport;
