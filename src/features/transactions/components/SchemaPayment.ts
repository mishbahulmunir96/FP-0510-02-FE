import * as Yup from "yup";

export const PaymentSchema = Yup.object().shape({
  paymentMethod: Yup.string().required("Please select a payment method"),
});
