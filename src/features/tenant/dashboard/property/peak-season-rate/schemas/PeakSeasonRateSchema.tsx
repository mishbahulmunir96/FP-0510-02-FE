import * as Yup from 'yup';

export const PeakSeasonRateSchema = Yup.object().shape({
  price: Yup.number().required('Price is required'),
});