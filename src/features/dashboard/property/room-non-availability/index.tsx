'use client';

import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import useCreateRoomNonAvailability from '@/hooks/api/room-non-availability/useCreateRoomNonAvailability';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { RoomIdSelect } from '../peak-season-rate/components/RoomIdSelect';
import { DatePickerWithRangeForRoomNonAvailability } from './components/DateRoomNonAvailability';
import RoomNonAvailabilityList from './components/RoomNonAvailability';
import { RoomNonAvailabilitySchema } from './schemas/RoomNonAvailabilitySchema';

interface RoomNonAvailabilityPageProps {
  roomId: number;
}

const RoomNonAvailabilityPage = ({ roomId }: RoomNonAvailabilityPageProps) => {
  const session = useSession();
  const { mutateAsync: createRoomNonAvailability, isPending } =
    useCreateRoomNonAvailability();

  const formik = useFormik({
    initialValues: {
      reason: '',
      startDate: new Date(),
      endDate: new Date(),
      roomId: 0,
    },
    validationSchema: RoomNonAvailabilitySchema,
    onSubmit: async (values) => {
      const dataToSubmit = {
        ...values,
        roomId: Number(values.roomId),
      };
      await createRoomNonAvailability(dataToSubmit);
    },
  });

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
        <section className="p-6 container max-w-7xl mx-auto space-y-10">
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <h5 className="font-semibold mb-3 text-center md:text-left">
                  Add Room Non Availability
                </h5>
                <div className="grid grid-cols-3 gap-3 items-end">
                  <FormInput
                    name="reason"
                    label="Reason"
                    type="text"
                    placeholder="Reason of room non availability"
                    value={formik.values.reason}
                    isError={!!formik.touched.reason && !!formik.errors.reason}
                    error={formik.errors.reason}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <DatePickerWithRangeForRoomNonAvailability
                    setFieldValue={formik.setFieldValue}
                  />
                  <RoomIdSelect setFieldValue={formik.setFieldValue} />
                </div>
                <Button className="mt-3 w-full" disabled={isPending}>
                  {isPending ? 'Loading...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
          <div>
            <RoomNonAvailabilityList roomId={roomId} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoomNonAvailabilityPage;
