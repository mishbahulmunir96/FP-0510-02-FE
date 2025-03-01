import * as Yup from 'yup';

export const RoomNonAvailabilitySchema = Yup.object().shape({
  reason: Yup.string().required('Reason is required'),
});