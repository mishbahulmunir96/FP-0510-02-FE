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
import { MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import * as Yup from "yup";
import { Badge } from "@/components/ui/badge";

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

  const getRatingLabel = (rating: number) => {
    if (rating >= 5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    return "Poor";
  };

  return (
    <>
      <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
        {/* Review Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-50">
              <AvatarImage
                src={review.user.imageUrl || "/images/profile_default.jpg"}
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
              <p className="font-medium text-gray-900">{review.user.name}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(review.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`${
                review.rating >= 4
                  ? "bg-green-100 text-green-700"
                  : review.rating >= 3
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {getRatingLabel(review.rating)}
            </Badge>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? "text-yellow-400" : "text-gray-200"
                  }`}
                  fill={i < review.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-700">{review.review}</p>
        </div>

        {/* Reply Section */}
        {review.replyMessage ? (
          <div className="space-y-2 rounded-lg border bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-gray-900">Your Response</p>
            </div>
            <p className="text-sm text-gray-700">{review.replyMessage}</p>
            {review.replyDate && (
              <p className="text-xs text-gray-500">
                Replied on {format(new Date(review.replyDate), "MMM dd, yyyy")}
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReplyModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Reply to Review
          </Button>
        )}
      </div>

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to Customer Review</DialogTitle>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                name="replyMessage"
                placeholder="Write your response to the customer's review..."
                value={formik.values.replyMessage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[120px] resize-none"
              />
              {formik.touched.replyMessage && formik.errors.replyMessage && (
                <p className="text-sm text-red-500">
                  {formik.errors.replyMessage}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsReplyModalOpen(false);
                  formik.resetForm();
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !formik.isValid}
                className="min-w-[100px]"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reply"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewCard;
