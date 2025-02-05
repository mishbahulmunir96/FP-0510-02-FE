"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useCreateReview from "@/hooks/api/review/useCreateReview";
import { useFormik } from "formik";
import { ReviewSchema } from "./schemaReview";
import { StarIcon } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: number;
}

const ReviewModal = ({ isOpen, onClose, paymentId }: ReviewModalProps) => {
  const { mutateAsync: createReview, isPending } = useCreateReview();

  const formik = useFormik({
    initialValues: {
      rating: 0,
      review: "",
    },
    validationSchema: ReviewSchema,
    onSubmit: async (values) => {
      await createReview(
        {
          paymentId,
          ...values,
        },
        {
          onSuccess: () => {
            onClose();
            formik.resetForm();
          },
        },
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => formik.setFieldValue("rating", star)}
                  className="text-2xl focus:outline-none"
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      star <= formik.values.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill={
                      star <= formik.values.rating ? "currentColor" : "none"
                    }
                  />
                </button>
              ))}
            </div>
            {!!formik.touched.rating && !!formik.errors.rating && (
              <p className="text-center text-xs text-red-500">
                {formik.errors.rating}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Textarea
              name="review"
              placeholder="Share your experience..."
              value={formik.values.review}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="min-h-[100px]"
            />
            {!!formik.touched.review && !!formik.errors.review && (
              <p className="text-xs text-red-500">{formik.errors.review}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                formik.resetForm();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formik.isValid}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
