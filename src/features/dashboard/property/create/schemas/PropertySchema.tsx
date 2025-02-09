import * as Yup from "yup";

export const PropertySchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Must be at least 3 characters")
    .max(100, "Must be at most 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Must be at least 10 characters"),
  propertyCategoryId: Yup.string().required("Category is required"),
  latitude: Yup.string().required("Latitude is required"),
  longitude: Yup.string().required("Longitude is required"),
  location: Yup.string().required("Location is required"),
});
