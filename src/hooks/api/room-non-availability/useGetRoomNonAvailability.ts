import useAxios from "@/hooks/api/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { RoomNonAvailability } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

interface GetGetRoomNonAvailabilitiesListQueries extends PaginationQueries {
  search?: string;
  userId?: number;
}

const useRoomNonAvailabilities = (
  queries: GetGetRoomNonAvailabilitiesListQueries,
) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["roomNonAvailabilities", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<RoomNonAvailability>
      >("/room-non-availabilities", { params: queries });
      return data;
    },
  });
};

export default useRoomNonAvailabilities;
