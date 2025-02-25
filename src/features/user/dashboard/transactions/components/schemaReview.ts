import * as Yup from "yup";

export const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .required("Rating is required")
    .min(1, "Please select a rating")
    .max(5, "Maximum rating is 5"),
  review: Yup.string()
    .required("Review is required")
    .min(2, "Review must be at least 2 characters")
    .max(500, "Review must not exceed 500 characters"),
});
