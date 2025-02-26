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
          <DialogTitle className="text-center text-xl">
            Share Your Experience
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => formik.setFieldValue("rating", star)}
                    className="group relative p-1 focus:outline-none"
                  >
                    <StarIcon
                      className={`h-8 w-8 transition-colors ${
                        star <= formik.values.rating
                          ? "text-yellow-400"
                          : "text-gray-200 hover:text-yellow-200"
                      }`}
                      fill={
                        star <= formik.values.rating ? "currentColor" : "none"
                      }
                    />
                    <span className="absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {star === 1
                        ? "Poor"
                        : star === 2
                          ? "Fair"
                          : star === 3
                            ? "Good"
                            : star === 4
                              ? "Very Good"
                              : "Excellent"}
                    </span>
                  </button>
                ))}
              </div>
              {formik.touched.rating && formik.errors.rating && (
                <p className="text-sm text-red-500">{formik.errors.rating}</p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                name="review"
                placeholder="Tell us about your stay..."
                value={formik.values.review}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[120px] resize-none"
              />
              {formik.touched.review && formik.errors.review && (
                <p className="text-sm text-red-500">{formik.errors.review}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
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
            <Button
              type="submit"
              disabled={isPending || !formik.isValid}
              className="min-w-[100px]"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
