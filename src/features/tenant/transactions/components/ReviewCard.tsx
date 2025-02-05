import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useReplyReview from "@/hooks/api/review/useReplyReview";
import { format } from "date-fns";
import { useFormik } from "formik";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import * as Yup from "yup";

interface ReviewCardProps {
  review: {
    id: number;
    rating: number;
    review: string;
    createdAt: string;
    replyMessage?: string;
    replyDate?: string;
    user: {
      name: string;
      imageUrl: string | null;
    };
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const { mutate: replyReview, isPending } = useReplyReview();
  const formik = useFormik({
    initialValues: {
      replyMessage: "",
    },
    validationSchema: Yup.object({
      replyMessage: Yup.string()
        .required("Reply message is required")
        .min(2, "Reply must be at least 2 characters"),
    }),
    onSubmit: (values) => {
      replyReview(
        {
          reviewId: review.id,
          replyMessage: values.replyMessage,
        },
        {
          onSuccess: () => {
            setIsReplyModalOpen(false);
            formik.resetForm();
          },
        },
      );
    },
  });

  return (
    <>
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={review.user.imageUrl || "/imaeges/profile_default.jpg"}
                alt={review.user.name}
              />
              <AvatarFallback>
                <Image
                  src="/images/profile_default.jpg"
                  alt={review.user.name}
                  fill
                  className="object-cover"
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{review.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(review.createdAt), "dd MMM yyyy")}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(review.rating)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 text-yellow-400"
                fill="currentColor"
              />
            ))}
          </div>
        </div>
        <p className="text-sm">{review.review}</p>

        {review.replyMessage ? (
          <div className="mt-4 space-y-2 rounded-lg bg-secondary p-4">
            <p className="text-sm font-medium">Your Response:</p>
            <p className="text-sm">{review.replyMessage}</p>
            {review.replyDate && (
              <p className="text-xs text-muted-foreground">
                {format(new Date(review.replyDate), "dd MMM yyyy")}
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReplyModalOpen(true)}
          >
            Reply to Review
          </Button>
        )}
      </div>

      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                name="replyMessage"
                placeholder="Write your reply..."
                value={formik.values.replyMessage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[100px]"
              />
              {formik.touched.replyMessage && formik.errors.replyMessage && (
                <p className="text-xs text-red-500">
                  {formik.errors.replyMessage}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReplyModalOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Reply"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewCard;
