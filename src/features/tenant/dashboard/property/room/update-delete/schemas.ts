import * as Yup from "yup";
const validationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["Standard", "Deluxe", "Suite"], "Invalid room type")
    .required("Room type is required"),
  name: Yup.string()
    .required("Room name is required")
    .min(3, "Name must be at least 3 characters"),
  stock: Yup.number()
    .required("Stock is required")
    .min(1, "Stock must be at least 1"),
  price: Yup.number()
    .required("Price is required")
    .min(1000, "Price must be at least 1000"),
  guest: Yup.number()
    .required("Guest capacity is required")
    .min(1, "Guest capacity must be at least 1"),
  facilities: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required("Facility name is required"),
        description: Yup.string().required("Facility description is required"),
      }),
    )
    .min(1, "At least one facility is required"),
});

export default validationSchema;
