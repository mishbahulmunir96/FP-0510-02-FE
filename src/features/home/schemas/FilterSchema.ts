import * as Yup from "yup";

export const FilterSchema = Yup.object().shape({
  title: Yup.string().required("hotel is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().required("End date is required"),
  guest: Yup.number().min(1).required("Number of guest is required"),
});
