import * as Yup from "yup";
export const EditProfileSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  imageFile: Yup.mixed().nullable().notRequired(),
});
