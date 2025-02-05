import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../useAxios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const useReplyReview = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      replyMessage,
    }: {
      reviewId: number;
      replyMessage: string;
    }) => {
      const { data } = await axiosInstance.post(`/reviews/reply/${reviewId}`, {
        replyMessage,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Reply successfully added");
      queryClient.invalidateQueries({ queryKey: ["review", "tenant"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useReplyReview;
