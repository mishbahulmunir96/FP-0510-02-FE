import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Room name is required"),
  type: Yup.string()
    .oneOf(["Standard", "Deluxe", "Suite"], "Invalid room type")
    .required("Room type is required"),
  stock: Yup.number()
    .required("Stock is required")
    .min(1, "Stock must be at least 1"),
  price: Yup.number()
    .required("Price is required")
    .min(1000, "Price must be at least 1000"),
  guest: Yup.number()
    .required("Guest capacity is required")
    .min(1, "Guest capacity must be at least 1"),
  propertyId: Yup.number().required("Property is required"),
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
