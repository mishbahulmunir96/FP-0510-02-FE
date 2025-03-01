import * as Yup from "yup";

export const PropertyCategorySchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(/^[A-Z0-9]+$/, "Must be uppercase letters and numbers only")
    .min(3, "Must be at least 3 characters")
    .max(10, "Must be at most 10 characters"),
});
