'use client';

import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { DatePickerWithRangeForPeakSeason } from './components/DateRangePickerPeakSeason';
import PeakSeasonsRateList from './components/PeakSeasonRateList';
import { RoomIdSelect } from './components/RoomIdSelect';
import { PeakSeasonRateSchema } from './schemas/PeakSeasonRateSchema';
import { useCreatePeakSeasonRate } from '@/hooks/api/peak-season-rate/useCreatePeakSeasonRate';

interface PeakSeasonsPageProps {
  roomId: number;
}

const PeakSeasonRatePage = ({ roomId }: PeakSeasonsPageProps) => {
  const session = useSession();
  const { mutateAsync: createPeakSeasonRate, isPending } =
    useCreatePeakSeasonRate();

  const formik = useFormik({
    initialValues: {
      price: 0,
      startDate: new Date(),
      endDate: new Date(),
      roomId: 0,
    },
    validationSchema: PeakSeasonRateSchema,
    onSubmit: async (values) => {
      const dataToSubmit = {
        ...values,
        price: Number(values.price),
        roomId: Number(values.roomId),
      };
      await createPeakSeasonRate(dataToSubmit);
    },
  });

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
        {/* Main Dashboard Content */}
        <section className="p-6 container max-w-7xl mx-auto space-y-10">
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div>
                {/* Contoh Konten Utama */}
                <h5 className="font-semibold mb-3 text-center md:text-left">
                  Add Peak Season Rate
                </h5>
                <div className="grid grid-cols-3 gap-3 items-end">
                  <FormInput
                    name="price"
                    label="Price"
                    type="number"
                    placeholder="Price of Peak Season Rate"
                    value={formik.values.price}
                    isError={!!formik.touched.price && !!formik.errors.price}
                    error={formik.errors.price}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <DatePickerWithRangeForPeakSeason
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
            <PeakSeasonsRateList roomId={roomId} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PeakSeasonRatePage;