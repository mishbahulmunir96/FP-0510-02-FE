import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface ReviewsByRoomParams {
  roomId: number;
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const useGetReviewsByRoom = ({
  roomId,
  page = 1,
  take = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
}: ReviewsByRoomParams) => {
  return useQuery({
    queryKey: ["reviews", "room", roomId, page, take, sortBy, sortOrder],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/reviews/room/${roomId}`, {
        params: {
          page,
          take,
          sortBy,
          sortOrder,
        },
      });
      return data;
    },
    retry: false,
  });
};

export default useGetReviewsByRoom;
